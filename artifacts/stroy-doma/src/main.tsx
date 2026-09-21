import "./lib/houseDiag";
import { createRoot, hydrateRoot } from "react-dom/client";
import App, { preloadRoute } from "./App";
import "./index.css";

const rootElement = document.getElementById("root")!;
const hasPrerenderedApp = import.meta.env.PROD && !rootElement.querySelector("#seo-prerender");

async function startApp() {
  if (hasPrerenderedApp) {
    await preloadRoute(window.location.pathname);
    hydrateRoot(rootElement, <App />);
    return;
  }

  createRoot(rootElement).render(<App />);
}

// Start the 3D house downloads right away on the home page, before hydration.
// crossOrigin must match the fetch() used by GLTFLoader/DRACOLoader, otherwise
// the browser ignores the preload and downloads the files a second time.
{
  const base = import.meta.env.BASE_URL.replace(/\/?$/, "/");
  const currentPath = window.location.pathname.replace(/\/?$/, "/");
  if (currentPath === base) {
    const earlyFiles: Array<[string, string | null]> = [
      ["house-v3-base.glb", "optimized"],
      ["draco/draco_wasm_wrapper.js", null],
      ["draco/draco_decoder.wasm", null],
    ];
    for (const [file, variant] of earlyFiles) {
      const link = document.createElement("link");
      link.rel = "preload";
      link.as = "fetch";
      link.crossOrigin = "anonymous";
      link.href = base + file;
      if (variant) link.dataset.houseModelPreload = variant;
      document.head.appendChild(link);
    }
    // Start fetching + decoding the 3D house immediately, in parallel with
    // hydration, instead of waiting for the home page to mount first.
    void import("./components/3d/ScrollHouse")
      .then(({ preloadHouseModel }) => preloadHouseModel(window.innerWidth < 768))
      .catch(() => {});
  }
}

void startApp();

// ── Логика splash-экрана ────────────────────────────────────────────────────
//
// The splash is only a short transition while the first React frame mounts.
// It must never wait for a video or any other below-the-fold resource.
const SPLASH_MS = 220;

const splash  = document.getElementById("splash");

if (splash) {
  // Одноразовый скрыватель (guard от двойного вызова)
  let hidden = false;
  const hideSplash = () => {
    if (hidden) return;
    hidden = true;
    splash.classList.add("hidden");
    window.dispatchEvent(new CustomEvent("splash-done"));
    splash.addEventListener(
      "transitionend",
      () => splash.remove(),
      { once: true },
    );
    // Keep the cleanup reliable when transitions are disabled by the browser.
    setTimeout(() => splash.remove(), 400);
  };

  setTimeout(hideSplash, SPLASH_MS);
}
