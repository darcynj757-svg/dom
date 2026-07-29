import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

const root = createRoot(document.getElementById("root")!);
root.render(<App />);

// ── Логика splash-экрана ────────────────────────────────────────────────────
//
// 1. Fill-анимация завершается через 2.8 s (delay 0.2 s + длительность 2.6 s).
// 2. После этого логотип начинает пульсировать — ждём сигнал о готовности видео.
// 3. Когда hero-видео может воспроизводиться (событие "hero-video-ready"),
//    или по таймауту MAX_WAIT_MS, скрываем splash и диспатчим "splash-done".

const FILL_MS    = 2800; // конец fill-анимации
const MAX_WAIT_MS = 4000; // жёсткий потолок — на случай если видео не грузится

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
