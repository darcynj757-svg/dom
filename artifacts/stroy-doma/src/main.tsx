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
