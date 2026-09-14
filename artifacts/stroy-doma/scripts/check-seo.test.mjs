import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { readdir } from "node:fs/promises";
import { promisify } from "node:util";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

const execFileAsync = promisify(execFile);
const scriptsDir = dirname(fileURLToPath(import.meta.url));
const fixturesDir = join(scriptsDir, "fixtures", "check-seo");
const validatorPath = join(scriptsDir, "check-seo.mjs");

async function runValidator(fixtureName) {
  const fixturePath = join(fixturesDir, fixtureName);

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

test("all expected fixture directories are present", async () => {
  const fixtures = (await readdir(fixturesDir, { withFileTypes: true }))
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();

  assert.deepEqual(fixtures, [
    "malformed-json",
    "missing-breadcrumb-item",
    "missing-local-business-field",
    "valid",
  ]);
});