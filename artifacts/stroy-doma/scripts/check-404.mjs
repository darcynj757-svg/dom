#!/usr/bin/env node
import { access, readFile } from "node:fs/promises";
import { join, resolve } from "node:path";

const appRoot = resolve(import.meta.dirname, "..");
const sourcePath = join(appRoot, "public", "404.html");
const outputPath = join(appRoot, "dist", "public", "404.html");

async function main() {
  await access(sourcePath);
  await access(outputPath);
  const html = await readFile(outputPath, "utf8");
  for (const requiredText of ["Страница не найдена", "Кедр Томск", 'href="/"', 'href="/projects"']) {
    if (!html.includes(requiredText)) {
      throw new Error(`404.html is missing required content: ${requiredText}`);
    }
  }
  if (!/<meta\s+name="robots"\s+content="noindex,\s*nofollow"/i.test(html)) {
    throw new Error("404.html must be noindex, nofollow");
  }
  console.log(`Custom 404 validation passed: ${outputPath}`);
}

main().catch((error) => {
  console.error(`Custom 404 validation failed: ${error.message}`);
  process.exitCode = 1;
});