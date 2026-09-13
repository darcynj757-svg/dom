import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

const root = createRoot(document.getElementById("root")!);
root.render(<App />);

// ── Логика splash-экрана ────────────────────────────────────────────────────
//
// 1. Короткая fill-анимация завершается примерно через 0.65 s.
// 2. После неё даём hero-видео небольшой шанс начать воспроизведение.
// 3. В любом случае заставка скрывается не позднее MAX_WAIT_MS.

const FILL_MS = 650;
const MAX_WAIT_MS = 1200;

const splash  = document.getElementById("splash");
const logoWrap = splash?.querySelector<HTMLElement>(".splash-logo-wrap");

if (splash) {
  // Одноразовый скрыватель (guard от двойного вызова)
  let hidden = false;
  const hideSplash = () => {
    if (hidden) return;
    hidden = true;
    splash.classList.add("hidden");
    splash.addEventListener(
      "transitionend",
      () => {
        splash.remove();
        window.dispatchEvent(new CustomEvent("splash-done"));
      },
      { once: true },
    );
  };

  // После fill-анимации — запускаем пульсацию и ждём видео
  setTimeout(() => {
    logoWrap?.classList.add("pulsing");
    window.addEventListener("hero-video-ready", hideSplash, { once: true });
    setTimeout(hideSplash, MAX_WAIT_MS - FILL_MS);
  }, FILL_MS);
}
