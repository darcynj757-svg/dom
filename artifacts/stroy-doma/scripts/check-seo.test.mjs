import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { cp, mkdtemp, readFile, readdir, rm, writeFile } from "node:fs/promises";
import { promisify } from "node:util";
import { dirname, join } from "node:path";
import { tmpdir } from "node:os";
import { fileURLToPath } from "node:url";
import test from "node:test";

const execFileAsync = promisify(execFile);
const scriptsDir = dirname(fileURLToPath(import.meta.url));
const fixturesDir = join(scriptsDir, "fixtures", "check-seo");
const validatorPath = join(scriptsDir, "check-seo.mjs");

async function runValidator(fixtureNameOrPath) {
  const fixturePath = fixtureNameOrPath.includes("/")
    ? fixtureNameOrPath
    : join(fixturesDir, fixtureNameOrPath);

  try {
    const result = await execFileAsync(process.execPath, [validatorPath, fixturePath], {
      encoding: "utf8",
    });
    return { code: 0, stdout: result.stdout, stderr: result.stderr };
  } catch (error) {
    return {
      code: error.code,
      stdout: error.stdout ?? "",
      stderr: error.stderr ?? "",
    };
  }
}

test("valid fixture passes all SEO and Schema.org checks", async () => {
  const result = await runValidator("valid");

  assert.equal(result.code, 0, result.stderr || result.stdout);
  assert.match(result.stdout, /SEO validation passed for 1 generated route/);
});

test("missing top-level Schema.org field fails with a useful location", async () => {
  const result = await runValidator("missing-local-business-field");
  const output = `${result.stdout}\n${result.stderr}`;

  assert.notEqual(result.code, 0);
  assert.match(output, /LocalBusiness\) is missing required field "address"/);
});

test("missing nested BreadcrumbList field fails with the nested path", async () => {
  const result = await runValidator("missing-breadcrumb-item");
  const output = `${result.stdout}\n${result.stderr}`;

  assert.notEqual(result.code, 0);
  assert.match(output, /itemListElement\[0\].*ListItem\) is missing required field "item"/);
});

test("malformed JSON-LD fails before schema validation", async () => {
  const result = await runValidator("malformed-json");
  const output = `${result.stdout}\n${result.stderr}`;

  assert.notEqual(result.code, 0);
  assert.match(output, /JSON-LD block 1 is not valid JSON/);
});

test("canonical alias without noindex fails as a duplicate", async () => {
  const result = await runValidator("alias-indexed");
  const output = `${result.stdout}\n${result.stderr}`;

  assert.notEqual(result.code, 0);
  assert.match(output, /canonical points to \/services, so robots must contain noindex/);
});

test("repeated H1 headings fail before the page ships", async () => {
  const result = await runValidator("repeated-h1");
  const output = `${result.stdout}\n${result.stderr}`;

  assert.notEqual(result.code, 0);
  assert.match(output, /expected exactly one non-empty <h1>, found 2/);
});

test("invalid Schema.org field values fail validation", async () => {
  const result = await runValidator("invalid-schema-value");
  const output = `${result.stdout}\n${result.stderr}`;

  assert.notEqual(result.code, 0);
  assert.match(output, /WebPage\) field "url" must be an absolute http\(s\) URL/);
});

test("missing title fails with a useful route and message", async () => {
  const result = await runValidator("missing-title");
  const output = `${result.stdout}\n${result.stderr}`;

  assert.notEqual(result.code, 0);
  assert.match(output, /\/: expected exactly one non-empty <title>, found 0/);
});

test("missing description fails with a useful route and message", async () => {
  const result = await runValidator("missing-description");
  const output = `${result.stdout}\n${result.stderr}`;

  assert.notEqual(result.code, 0);
  assert.match(
    output,
    /\/: expected exactly one non-empty meta description, found 0/,
  );
});

test("missing H1 fails with a useful route and message", async () => {
  const result = await runValidator("missing-h1");
  const output = `${result.stdout}\n${result.stderr}`;

  assert.notEqual(result.code, 0);
  assert.match(output, /\/: expected exactly one non-empty <h1>, found 0/);
});

test("missing canonical fails with a useful route and message", async () => {
  const result = await runValidator("missing-canonical");
  const output = `${result.stdout}\n${result.stderr}`;

  assert.notEqual(result.code, 0);
  assert.match(output, /\/: expected exactly one non-empty canonical link, found 0/);
});

test("missing JSON-LD fails with a useful route and message", async () => {
  const result = await runValidator("missing-json-ld");
  const output = `${result.stdout}\n${result.stderr}`;

  assert.notEqual(result.code, 0);
  assert.match(output, /\/: expected at least one JSON-LD script/);
});

test("duplicate titles are reported separately from page metadata errors", async () => {
  const result = await runValidator("duplicate-title");
  const output = `${result.stdout}\n${result.stderr}`;

  assert.notEqual(result.code, 0);
  assert.match(
    output,
    /duplicate metadata: title appears on \/, \/second/,
  );
});

test("duplicate descriptions are reported separately from page metadata errors", async () => {
  const result = await runValidator("duplicate-description");
  const output = `${result.stdout}\n${result.stderr}`;

  assert.notEqual(result.code, 0);
  assert.match(
    output,
    /duplicate metadata: description appears on \/, \/second/,
  );
});

test("missing local image references fail with the route and source", async () => {
  const fixturePath = await mkdtemp(join(tmpdir(), "check-seo-image-"));
  await cp(join(fixturesDir, "valid"), fixturePath, { recursive: true });

  const indexPath = join(fixturePath, "index.html");
  const html = await readFile(indexPath, "utf8");
  await writeFile(
    indexPath,
    html.replace(
      "</body>",
      '<img src="/images/missing-project.webp" alt="missing"></body>',
    ),
  );

  try {
    const result = await runValidator(fixturePath);
    const output = `${result.stdout}\n${result.stderr}`;

    assert.notEqual(result.code, 0);
    assert.match(
      output,
      /\/: <img src> references missing local image "\/images\/missing-project\.webp"/,
    );
  } finally {
    await rm(fixturePath, { recursive: true, force: true });
  }
});

test("sitemap URLs must match the canonical links in generated pages", async () => {
  const fixturePath = await mkdtemp(join(tmpdir(), "check-seo-sitemap-"));
  await cp(join(fixturesDir, "valid"), fixturePath, { recursive: true });

  const indexPath = join(fixturePath, "index.html");
  const html = await readFile(indexPath, "utf8");
  await writeFile(
    indexPath,
    html.replace(
      'href="https://kedr-tomsk.ru/"',
      'href="https://kedr-tomsk.ru/services"',
    ),
  );
  await writeFile(
    join(fixturePath, "sitemap.xml"),
    `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://kedr-tomsk.ru/</loc></url>
</urlset>`,
  );

  try {
    const result = await runValidator(fixturePath);
    const output = `${result.stdout}\n${result.stderr}`;

    assert.notEqual(result.code, 0);
    assert.match(
      output,
      /sitemap URL https:\/\/kedr-tomsk\.ru\/ does not match canonical link https:\/\/kedr-tomsk\.ru\/services/,
    );
  } finally {
    await rm(fixturePath, { recursive: true, force: true });
  }
});

test("all expected fixture directories are present", async () => {
  const fixtures = (await readdir(fixturesDir, { withFileTypes: true }))
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();

  assert.deepEqual(fixtures, [
    "alias-indexed",
    "duplicate-description",
    "duplicate-title",
    "invalid-schema-value",
    "malformed-json",
    "missing-breadcrumb-item",
    "missing-canonical",
    "missing-description",
    "missing-h1",
    "missing-json-ld",
    "missing-local-business-field",
    "missing-title",
    "repeated-h1",
    "valid",
  ]);
});