#!/usr/bin/env node
/**
 * Browser-level mobile budget for the first screen.
 *
 * This intentionally runs separately from the build-time asset budget:
 * browser metrics need a real Chromium page and a throttled mobile network.
 * By default the script starts Vite preview against the current dist/public
 * output. Set FIRST_SCREEN_BUDGET_URL to reuse an already running server.
 */
import { spawn } from "node:child_process";
import { readFile } from "node:fs/promises";
import { request } from "node:http";
import { resolve } from "node:path";
import { chromium } from "playwright";

const appRoot = resolve(import.meta.dirname, "..");
const defaultPort = Number(process.env.FIRST_SCREEN_BUDGET_PORT ?? 4173);
const baseUrl = process.env.FIRST_SCREEN_BUDGET_URL?.replace(/\/$/, "") ??
  `http://127.0.0.1:${defaultPort}`;
const chromiumPath = process.env.CHROMIUM_PATH ?? "/repl/tools/bin/chromium";

const budget = {
  // The current first-screen baseline is measured with the same Slow 4G
  // profile used below. Keep this explicit so a slower baseline is visible
  // in the failure output instead of being silently accepted.
  lcpMs: 12_000,
  cls: 0.1,
  h1Ms: 2_500,
};

const routes = [
  { path: "/", label: "home", checks3d: true },
  { path: "/projects", label: "projects", checks3d: false },
];

const slow4g = {
  // Lighthouse/Chrome "Slow 4G" mobile preset: 150 ms RTT,
  // 1.6 Mbit/s down and 750 Kbit/s up.
  latency: 150,
  downloadThroughput: (1_600 * 1024) / 8,
  uploadThroughput: (750 * 1024) / 8,
};

let previewProcess;

function fail(message) {
  throw new Error(message);
}

function assert(condition, message) {
  if (!condition) fail(message);
}

function formatMs(value) {
  return value == null ? "unavailable" : `${Math.round(value)} ms`;
}

function formatCls(value) {
  return value == null ? "unavailable" : value.toFixed(3);
}

function assetKind(url) {
  const pathname = new URL(url).pathname;
  if (pathname.endsWith("/house-mobile.glb")) return "house-mobile.glb";
  if (pathname.endsWith("/house-draco.glb")) return "house-draco.glb";
  if (pathname.includes("/draco/")) return "draco decoder";
  return null;
}

async function waitForServer(url, timeoutMs = 30_000) {
  const deadline = Date.now() + timeoutMs;
  let lastError = "not attempted";

  while (Date.now() < deadline) {
    try {
      await new Promise((resolveRequest, rejectRequest) => {
        const probe = request(url, { method: "HEAD" }, (response) => {
          response.resume();
          response.statusCode && response.statusCode < 500
            ? resolveRequest()
            : rejectRequest(new Error(`HTTP ${response.statusCode}`));
        });
        probe.once("error", rejectRequest);
        probe.setTimeout(2_000, () => {
          probe.destroy(new Error("request timed out"));
        });
        probe.end();
      });
      return;
    } catch (error) {
      lastError = error.message;
      await new Promise((resolveDelay) => setTimeout(resolveDelay, 250));
    }
  }

  fail(`preview server did not start at ${url}: ${lastError}`);
}

async function waitForCondition(condition, timeoutMs, message) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    if (condition()) return;
    await new Promise((resolveDelay) => setTimeout(resolveDelay, 100));
  }
  fail(message);
}

async function startPreviewIfNeeded() {
  if (process.env.FIRST_SCREEN_BUDGET_URL) return;

  try {
    await readFile(resolve(appRoot, "dist/public/index.html"));
  } catch {
    fail(
      "dist/public/index.html is missing; run `pnpm run build` first or set FIRST_SCREEN_BUDGET_URL",
    );
  }

  previewProcess = spawn(
    "pnpm",
    [
      "exec",
      "vite",
      "preview",
      "--config",
      "vite.config.ts",
      "--host",
      "127.0.0.1",
      "--port",
      String(defaultPort),
    ],
    {
      cwd: appRoot,
      env: process.env,
      stdio: ["ignore", "pipe", "pipe"],
    },
  );

  const previewOutput = [];
  previewProcess.stdout.on("data", (chunk) => previewOutput.push(chunk.toString()));
  previewProcess.stderr.on("data", (chunk) => previewOutput.push(chunk.toString()));
  previewProcess.once("error", (error) => previewOutput.push(`${error.message}\n`));

  try {
    await waitForServer(baseUrl);
  } catch (error) {
    const details = previewOutput.join("").trim();
    fail(`${error.message}${details ? `\nPreview output:\n${details}` : ""}`);
  }
}

async function collectMetrics(page) {
  return page.evaluate(() => {
    const entries = performance.getEntriesByType("largest-contentful-paint");
    const state = window.__firstScreenBudget;
    return {
      lcpMs: entries.at(-1)?.startTime ?? state?.lcpMs ?? null,
      cls: state?.cls ?? 0,
      h1Ms: state?.h1Ms ?? null,
    };
  });
}

function assertMetrics(route, metrics) {
  const failures = [];
  if (metrics.lcpMs == null) {
    failures.push("LCP was not reported");
  } else if (metrics.lcpMs > budget.lcpMs) {
    failures.push(`LCP ${formatMs(metrics.lcpMs)} > ${budget.lcpMs} ms`);
  }
  if (metrics.cls > budget.cls) {
    failures.push(`CLS ${formatCls(metrics.cls)} > ${budget.cls.toFixed(3)}`);
  }
  if (metrics.h1Ms == null) {
    failures.push("visible H1 was not detected");
  } else if (metrics.h1Ms > budget.h1Ms) {
    failures.push(`H1 ${formatMs(metrics.h1Ms)} > ${budget.h1Ms} ms`);
  }

  if (failures.length) {
    fail(
      `${route.label} mobile first-screen budget failed:\n` +
        failures.map((failure) => `  - ${failure}`).join("\n") +
        `\n  observed: LCP=${formatMs(metrics.lcpMs)}, CLS=${formatCls(metrics.cls)}, H1=${formatMs(metrics.h1Ms)}`,
    );
  }
}

async function runRoute(browser, route) {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 1,
    isMobile: true,
    hasTouch: true,
  });
  const page = await context.newPage();
  const cdp = await context.newCDPSession(page);
  await cdp.send("Network.enable");
  await cdp.send("Network.emulateNetworkConditions", {
    offline: false,
    ...slow4g,
    connectionType: "cellular4g",
  });

  const assetRequests = [];
  const browserErrors = [];
  page.on("request", (requestEvent) => {
    const kind = assetKind(requestEvent.url());
    if (kind) assetRequests.push({ kind, url: requestEvent.url() });
  });
  page.on("pageerror", (error) => browserErrors.push(error.message));

  await page.addInitScript(() => {
    window.__firstScreenBudget = { lcpMs: null, cls: 0, h1Ms: null };

    const markH1 = () => {
      if (window.__firstScreenBudget.h1Ms != null) return;
      const h1 = document.querySelector("h1");
      if (!h1) return;
      const rect = h1.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        window.__firstScreenBudget.h1Ms = performance.now();
      }
    };

    new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const latest = entries.at(-1);
      if (latest) window.__firstScreenBudget.lcpMs = latest.startTime;
    }).observe({ type: "largest-contentful-paint", buffered: true });

    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (!entry.hadRecentInput) window.__firstScreenBudget.cls += entry.value;
      }
    }).observe({ type: "layout-shift", buffered: true });

    const observeH1 = () => {
      markH1();
      if (window.__firstScreenBudget.h1Ms == null) {
        requestAnimationFrame(observeH1);
      }
    };
    observeH1();
    const mutationObserver = new MutationObserver(markH1);
    const observeMutations = () => {
      if (!document.documentElement) {
        requestAnimationFrame(observeMutations);
        return;
      }
      mutationObserver.observe(document.documentElement, {
        childList: true,
        subtree: true,
        attributes: true,
      });
    };
    observeMutations();
  });

  try {
    await page.goto(`${baseUrl}${route.path}`, {
      waitUntil: "domcontentloaded",
      timeout: 45_000,
    });
    await page.waitForFunction(
      () => {
        const h1 = document.querySelector("h1");
        if (!h1) return false;
        const rect = h1.getBoundingClientRect();
        return rect.width > 0 && rect.height > 0;
      },
      { timeout: 20_000 },
    );
    // Give LCP and layout-shift observers a stable post-hydration window.
    await page.waitForTimeout(2_000);

    const initialAssetRequests = [...assetRequests];
    assert(
      initialAssetRequests.length === 0,
      `${route.label} requested below-the-fold 3D assets before scroll:\n` +
        initialAssetRequests
          .map((requestEvent) => `  - ${requestEvent.kind}: ${requestEvent.url}`)
          .join("\n"),
    );

    const metrics = await collectMetrics(page);
    assertMetrics(route, metrics);
    console.log(
      `${route.label}: LCP=${formatMs(metrics.lcpMs)} CLS=${formatCls(metrics.cls)} H1=${formatMs(metrics.h1Ms)}`,
    );

    if (route.checks3d) {
      await page.waitForSelector("[data-first-screen-3d]", {
        state: "attached",
        timeout: 20_000,
      });
      await page.evaluate(() => {
        document
          .querySelector("[data-first-screen-3d]")
          ?.scrollIntoView({ block: "center", inline: "nearest" });
      });
      await page.waitForFunction(() => window.scrollY > 0, { timeout: 5_000 });

      await waitForCondition(
        () =>
          assetRequests.some(
            (requestEvent) =>
              requestEvent.kind === "house-mobile.glb" ||
              requestEvent.kind === "house-draco.glb",
          ),
        10_000,
        "home did not request a 3D house model within 10 seconds after entering the 3D block",
      );
      await waitForCondition(
        () => assetRequests.some((requestEvent) => requestEvent.kind === "draco decoder"),
        10_000,
        "home did not request /draco/* within 10 seconds after entering the 3D block",
      );

      const postScrollKinds = new Set(assetRequests.map((requestEvent) => requestEvent.kind));
      assert(
        postScrollKinds.has("house-mobile.glb") || postScrollKinds.has("house-draco.glb"),
        "home did not request a 3D house model after entering the 3D block",
      );
      assert(
        postScrollKinds.has("draco decoder"),
        "home did not request /draco/* after entering the 3D block",
      );
      console.log("home: 3D assets absent before scroll and requested after entering 3D block");
    }

    if (browserErrors.length) {
      console.warn(`${route.label} browser errors:\n${browserErrors.map((error) => `  - ${error}`).join("\n")}`);
    }
  } finally {
    await context.close();
  }
}

async function main() {
  await startPreviewIfNeeded();
  let browser;
  try {
    browser = await chromium.launch({
      headless: true,
      executablePath: chromiumPath,
      args: ["--no-sandbox", "--disable-dev-shm-usage"],
    });
    for (const route of routes) await runRoute(browser, route);
    console.log(
      `First-screen mobile e2e budget passed (390x844, Slow 4G): ` +
        `LCP<=${budget.lcpMs}ms CLS<=${budget.cls} H1<=${budget.h1Ms}ms`,
    );
  } finally {
    await browser?.close();
    previewProcess?.kill("SIGTERM");
  }
}

main().catch((error) => {
  console.error(`First-screen mobile e2e budget failed: ${error.message}`);
  process.exitCode = 1;
});