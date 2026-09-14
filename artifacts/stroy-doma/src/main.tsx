import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

const root = createRoot(document.getElementById("root")!);
root.render(<App />);

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
