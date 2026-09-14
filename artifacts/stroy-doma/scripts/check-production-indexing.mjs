#!/usr/bin/env node
/**
 * Pre-publication guard for robots.txt and sitemap.xml.
 *
 * This validates the generated public artifact over HTTP, so a build cannot
 * publish stale robots rules, malformed XML, or sitemap URLs without a
 * successful response.
 */
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { join, relative, resolve } from "node:path";

const appRoot = resolve(import.meta.dirname, "..");
const outputRoot = resolve(
  process.argv.slice(2).find((argument) => argument !== "--") ??
    join(appRoot, "dist", "public"),
);
const siteUrl = "https://kedr-tomsk.ru";
const sitemapUrl = `${siteUrl}/sitemap.xml`;

function fail(message) {
  throw new Error(message);
}

function assert(condition, message) {
  if (!condition) fail(message);
}

function decodeXmlText(value, context) {
  assert(
    !/&(?!(?:amp|lt|gt|quot|apos);|#\d+;|#x[0-9a-f]+;)/i.test(value),
    `${context} contains an invalid XML entity`,
  );
  return value
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .replaceAll("&quot;", '"')
    .replaceAll("&apos;", "'")
    .replaceAll("&amp;", "&")
    .replace(/&#(\d+);/g, (_, codePoint) => String.fromCodePoint(Number(codePoint)))
    .replace(/&#x([0-9a-f]+);/gi, (_, codePoint) =>
      String.fromCodePoint(Number.parseInt(codePoint, 16)),
    );
}

function parseSitemap(xml) {
  const normalizedXml = xml.replace(/^\uFEFF/, "").replace(/\r\n?/g, "\n");
  const rootMatch = normalizedXml.match(
    /^\s*(?:<\?xml\s+version=["']1\.0["'](?:\s+encoding=["'][^"']+["'])?\s*\?>\s*)?<urlset\s+xmlns=["']http:\/\/www\.sitemaps\.org\/schemas\/sitemap\/0\.9["']>([\s\S]*)<\/urlset>\s*$/,
  );
  assert(
    rootMatch,
    "sitemap.xml is not well-formed XML: expected a single sitemap urlset root",
  );

  const body = rootMatch[1];
  const urlBlocks = [...body.matchAll(/<url>([\s\S]*?)<\/url>/g)];
  assert(
    urlBlocks.length > 0,
    body.includes("<url")
      ? "sitemap.xml is not well-formed XML: an <url> entry is not closed"
      : "sitemap.xml must contain at least one <url> entry",
  );
  const bodyWithoutEntries = body.replace(/<url>[\s\S]*?<\/url>/g, "").trim();
  assert(
    !bodyWithoutEntries,
    "sitemap.xml is not well-formed XML: unexpected content outside <url> entries",
  );

  return urlBlocks.map((match, index) => {
    const entryNumber = index + 1;
    const fields = [];
    const fieldPattern = /<(loc|lastmod|changefreq|priority)>([\s\S]*?)<\/\1>/g;
    let cursor = 0;

    for (const fieldMatch of match[1].matchAll(fieldPattern)) {
      assert(
        !match[1].slice(cursor, fieldMatch.index).trim(),
        `sitemap entry ${entryNumber} is not well-formed XML`,
      );
      assert(
        !fieldMatch[2].includes("<"),
        `sitemap entry ${entryNumber} contains a nested XML element`,
      );
      fields.push({
        name: fieldMatch[1],
        value: decodeXmlText(fieldMatch[2].trim(), `sitemap entry ${entryNumber}`),
      });
      cursor = fieldMatch.index + fieldMatch[0].length;
    }

    assert(
      !match[1].slice(cursor).trim(),
      `sitemap entry ${entryNumber} is not well-formed XML`,
    );
    assert(
      fields[0]?.name === "loc",
      `sitemap entry ${entryNumber} must start with <loc>`,
    );
    const fieldNames = fields.map(({ name }) => name);
    assert(
      new Set(fieldNames).size === fieldNames.length,
      `sitemap entry ${entryNumber} contains duplicate fields`,
    );

    const loc = fields.find(({ name }) => name === "loc")?.value;
    const changefreq = fields.find(({ name }) => name === "changefreq")?.value;
    const priority = fields.find(({ name }) => name === "priority")?.value;
    assert(loc, `sitemap entry ${entryNumber} is missing <loc>`);
    assert(changefreq, `sitemap entry ${entryNumber} is missing <changefreq>`);
    assert(priority, `sitemap entry ${entryNumber} is missing <priority>`);
    assert(
      /^(?:always|hourly|daily|weekly|monthly|yearly|never)$/.test(changefreq),
      `sitemap entry ${entryNumber} has an invalid <changefreq>: ${changefreq}`,
    );
    assert(
      /^(?:0(?:\.\d+)?|1(?:\.0+)?)$/.test(priority),
      `sitemap entry ${entryNumber} has an invalid <priority>: ${priority}`,
    );

    return loc;
  });
}

async function startArtifactServer(outputRoot) {
  const server = createServer(async (request, response) => {
    if (request.method !== "GET" && request.method !== "HEAD") {
      response.writeHead(405, { Allow: "GET, HEAD" });
      response.end();
      return;
    }

    let pathname;
    try {
      pathname = decodeURIComponent(new URL(request.url ?? "/", "http://127.0.0.1").pathname);
    } catch {
      response.writeHead(400);
      response.end();
      return;
    }

    const relativeCandidates =
      pathname === "/"
        ? ["index.html"]
        : [
            pathname.replace(/^\/+/, ""),
            `${pathname.replace(/^\/+/, "")}/index.html`,
          ];

    for (const relativePath of relativeCandidates) {
      const filePath = resolve(outputRoot, relativePath);
      if (relative(outputRoot, filePath).startsWith("..")) continue;

      try {
        const content = await readFile(filePath);
        const contentType =
          relativePath === "robots.txt"
            ? "text/plain; charset=utf-8"
            : relativePath === "sitemap.xml"
              ? "application/xml; charset=utf-8"
              : undefined;
        response.writeHead(200, contentType ? { "Content-Type": contentType } : undefined);
        if (request.method === "HEAD") {
          response.end();
        } else {
          response.end(content);
        }
        return;
      } catch {
        // Try the next static-file candidate, then return a useful 404.
      }
    }

    response.writeHead(404);
    response.end();
  });

  await new Promise((resolveServer, rejectServer) => {
    server.once("error", rejectServer);
    server.listen(0, "127.0.0.1", resolveServer);
  });

  const address = server.address();
  assert(address && typeof address === "object", "could not determine artifact server address");
  return {
    server,
    baseUrl: `http://127.0.0.1:${address.port}`,
  };
}

async function assertHttp200(baseUrl, productionUrl, expectedContentType) {
  const productionPath = new URL(productionUrl).pathname;
  const checkUrl = `${baseUrl}${productionPath}`;
  let response;
  try {
    response = await fetch(checkUrl);
  } catch (error) {
    fail(
      `HTTP check failed for ${productionUrl}: ${
        error instanceof Error ? error.message : String(error)
      }`,
    );
  }

  if (response.status !== 200) {
    fail(
      `HTTP check failed for ${productionUrl}: expected 200, received ${response.status}`,
    );
  }
  if (expectedContentType) {
    const actualContentType = response.headers.get("content-type") ?? "";
    assert(
      actualContentType.toLowerCase().startsWith(expectedContentType),
      `HTTP check failed for ${productionUrl}: expected Content-Type ${expectedContentType}, received ${
        actualContentType || "<missing>"
      }`,
    );
  }
  await response.arrayBuffer();
}

async function main() {
  const robotsPath = join(outputRoot, "robots.txt");
  const sitemapPath = join(outputRoot, "sitemap.xml");
  const [robots, sitemap] = await Promise.all([
    readFile(robotsPath, "utf8"),
    readFile(sitemapPath, "utf8"),
  ]);

  const robotsLines = robots
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
  assert(
    robotsLines.includes("User-agent: *"),
    "robots.txt must define a wildcard User-agent",
  );
  assert(
    robotsLines.includes("Allow: /"),
    "robots.txt must allow the public site root",
  );
  assert(
    robotsLines.includes("Disallow: /terms"),
    "robots.txt must disallow /terms",
  );
  assert(
    !robotsLines.includes("Disallow: /"),
    "robots.txt must not disallow the entire site",
  );
  const sitemapDirectives = robotsLines.filter((line) => /^sitemap\s*:/i.test(line));
  assert(
    sitemapDirectives.length === 1,
    `robots.txt must contain exactly one Sitemap directive, found ${sitemapDirectives.length}`,
  );
  assert(
    sitemapDirectives[0] === `Sitemap: ${sitemapUrl}`,
    `robots.txt must contain exactly Sitemap: ${sitemapUrl}`,
  );

  const locs = parseSitemap(sitemap);
  assert(
    new Set(locs).size === locs.length,
    "sitemap.xml must not contain duplicate URLs",
  );
  for (const loc of locs) {
    let url;
    try {
      url = new URL(loc);
    } catch {
      fail(`sitemap.xml contains an invalid URL: ${loc}`);
    }
    assert(url.origin === siteUrl, `sitemap.xml contains an unexpected origin: ${loc}`);
    assert(!url.search && !url.hash, `sitemap.xml URL must not contain query or hash: ${loc}`);
    assert(
      url.pathname === "/" || !url.pathname.endsWith("/"),
      `sitemap.xml URL must not have a trailing slash: ${loc}`,
    );
    assert(url.pathname !== "/terms", "sitemap.xml must not include the disallowed /terms page");
  }

  const { server, baseUrl } = await startArtifactServer(outputRoot);
  const httpFailures = [];
  async function collectHttpCheck(productionUrl, expectedContentType) {
    try {
      await assertHttp200(baseUrl, productionUrl, expectedContentType);
    } catch (error) {
      httpFailures.push(error instanceof Error ? error.message : String(error));
    }
  }

  try {
    await collectHttpCheck(`${siteUrl}/robots.txt`, "text/plain");
    await collectHttpCheck(sitemapUrl, "application/xml");
    for (const loc of locs) {
      await collectHttpCheck(loc);
    }
  } finally {
    await new Promise((resolveServer) => server.close(resolveServer));
  }
  assert(
    httpFailures.length === 0,
    `HTTP checks failed for ${httpFailures.length} URL(s):\n${httpFailures
      .map((failure) => `- ${failure}`)
      .join("\n")}`,
  );

  const projectCount = locs.filter((loc) => new URL(loc).pathname.startsWith("/projects/")).length;
  const articleCount = locs.filter((loc) => new URL(loc).pathname.startsWith("/articles/")).length;
  console.log(
    `Production indexing preflight passed for ${outputRoot}: HTTP 200 for robots.txt, sitemap.xml, and ${locs.length} sitemap URL(s) (${projectCount} project, ${articleCount} article).`,
  );
}

main().catch((error) => {
  console.error(`Production indexing preflight failed: ${error.message}`);
  process.exitCode = 1;
});