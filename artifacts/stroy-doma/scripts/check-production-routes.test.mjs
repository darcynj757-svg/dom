import assert from "node:assert/strict";
import { createServer } from "node:http";
import { execFile } from "node:child_process";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { promisify } from "node:util";
import test from "node:test";

const execFileAsync = promisify(execFile);
const scriptPath = new URL("./check-production-routes.mjs", import.meta.url);

function sitemapFor(paths) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${paths.map((pathname) => `  <url><loc>https://kedr-tomsk.ru${pathname}</loc></url>`).join("\n")}
</urlset>
`;
}

async function startTestServer(handler) {
  const server = createServer(handler);
  await new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(0, "127.0.0.1", resolve);
  });
  const address = server.address();
  assert(address && typeof address === "object");
  return {
    server,
    baseUrl: `http://127.0.0.1:${address.port}`,
  };
}

async function runCheck(baseUrl, sitemapPath) {
  try {
    const result = await execFileAsync(process.execPath, [
      scriptPath.pathname,
      `--base-url=${baseUrl}`,
      `--sitemap=${sitemapPath}`,
    ]);
    return { ...result, exitCode: 0 };
  } catch (error) {
    return {
      stdout: error.stdout ?? "",
      stderr: error.stderr ?? "",
      exitCode: error.code ?? 1,
    };
  }
}

async function withFixture(paths, handler, callback) {
  const outputRoot = await mkdtemp(join(tmpdir(), "stroy-doma-published-routes-"));
  await writeFile(join(outputRoot, "sitemap.xml"), sitemapFor(paths));
  const { server, baseUrl } = await startTestServer(handler);

  try {
    return await callback({ baseUrl, sitemapPath: join(outputRoot, "sitemap.xml") });
  } finally {
    await new Promise((resolve) => server.close(resolve));
    await rm(outputRoot, { recursive: true, force: true });
  }
}

test("published route checker resolves sitemap paths against the supplied live origin", async () => {
  const result = await withFixture(
    ["/", "/projects/1", "/articles/example"],
    (request, response) => {
      response.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
      response.end(`<!doctype html><html><body>${request.url}</body></html>`);
    },
    ({ baseUrl, sitemapPath }) => runCheck(baseUrl, sitemapPath),
  );

  assert.equal(result.exitCode, 0);
  assert.equal(result.stderr, "");
  assert.match(result.stdout, /3 sitemap URL\(s\) returned HTTP 200 HTML/);
});

test("published route checker reports every failed direct URL and rejects redirects/non-HTML", async () => {
  const result = await withFixture(
    ["/projects/missing", "/articles/non-html", "/projects/redirect"],
    (request, response) => {
      if (request.url === "/articles/non-html") {
        response.writeHead(200, { "Content-Type": "application/json" });
        response.end("{}");
        return;
      }
      if (request.url === "/projects/redirect") {
        response.writeHead(301, { Location: "/" });
        response.end();
        return;
      }
      response.writeHead(404, { "Content-Type": "text/html; charset=utf-8" });
      response.end("<!doctype html><html><body>missing</body></html>");
    },
    ({ baseUrl, sitemapPath }) => runCheck(baseUrl, sitemapPath),
  );

  assert.notEqual(result.exitCode, 0);
  assert.match(result.stderr, /3\/3 URL\(s\)/);
  assert.match(result.stderr, /projects\/missing: expected HTTP 200, received 404/);
  assert.match(result.stderr, /articles\/non-html: expected Content-Type text\/html/);
  assert.match(result.stderr, /projects\/redirect: expected HTTP 200, received 301/);
});