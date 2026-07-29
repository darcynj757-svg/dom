# Оптимизация сайта Kedr Tomsk — что осталось сделать

Репозиторий: https://github.com/darcynj757-svg/dom  
Стек: React 18 + Vite + Tailwind CSS v4 + TypeScript  
Пакетный менеджер: pnpm (workspace monorepo)

---

## ✅ Уже сделано

- Убран сплэш-экран (`index.html` → удалён `#splash`, `main.tsx` → удалён dismissal код)
- Убран спиннер при смене страниц (`App.tsx` → `<Suspense fallback={null}>`)
- Все видео: добавлен `preload="auto"` + `poster="/posters/<name>.jpg"`
- CTA-видео на главной: убрана ленивая загрузка через `data-src` / IntersectionObserver
- Все видео сжаты через ffmpeg (CRF 28-32, faststart, без звука):
  - `profiled-timber-flythrough-v3.mp4`: 32 MB → 2 MB
  - `siberian-logs-construction_2.mp4`: 15 MB → 2 MB
  - `cedar_log_mansion_flythrough_16s_compressed.mp4`: 11 MB → 3.9 MB
  - `siberian-logs-construction.mp4`: 7.3 MB → 1.1 MB
  - `kedr-house-hero.mp4`: 6.7 MB → 3.4 MB
  - Все `public/videos/*.mp4` — пережаты

---

## 🔴 Приоритет 1 — Отключить видео на мобилках

**Эффект:** мобильные пользователи не скачивают ни байта видео, страница грузится мгновенно.

### Что делать

1. Создать хук `artifacts/stroy-doma/src/hooks/useIsMobile.ts`:
```ts
import { useEffect, useState } from "react";

export function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== "undefined" && window.innerWidth < breakpoint
  );
  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${breakpoint}px)`);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [breakpoint]);
  return isMobile;
}
```

2. В каждом компоненте с фоновым видео — рендерить `<video>` только на десктопе, на мобилке — `<div>` с `backgroundImage` из постера:

```tsx
import { useIsMobile } from "@/hooks/useIsMobile";

const isMobile = useIsMobile();

{isMobile ? (
  <div
    className="absolute inset-0 w-full h-full bg-cover bg-center"
    style={{ backgroundImage: "url(/posters/rublenye-doma-hero.jpg)" }}
  />
) : (
  <video autoPlay muted loop playsInline preload="auto"
         poster="/posters/rublenye-doma-hero.jpg"
         className="absolute inset-0 w-full h-full object-cover"
         src={`${import.meta.env.BASE_URL}videos/rublenye-doma-hero.mp4`}
  />
)}
```

### Файлы для правки

| Файл | Видео | Постер |
|---|---|---|
| `src/components/RublenyeHeroVideo.tsx` | `rublenye-doma-hero.mp4` | `/posters/rublenye-doma-hero.jpg` |
| `src/components/ProfbrusHeroVideo.tsx` | `hero-profbrus-gen.mp4` | `/posters/hero-profbrus-gen.jpg` |
| `src/pages/home.tsx` (hero, ~L216) | `cedar_log_mansion_flythrough_16s_compressed.mp4` | `/posters/cedar_log_mansion_flythrough_16s_compressed.jpg` |
| `src/pages/home.tsx` (CTA, ~L709) | `profiled-timber-flythrough-v3.mp4` | `/posters/profiled-timber-flythrough-v3.jpg` |
| `src/pages/about.tsx` (hero, ~L74) | `/videos/kedr-house-hero.mp4` | `/posters/kedr-house-hero.jpg` |
| `src/pages/about.tsx` (CTA, ~L400) | `profiled-timber-flythrough-v3.mp4` | `/posters/profiled-timber-flythrough-v3.jpg` |
| `src/pages/uslugi.tsx` (hero, ~L147) | `siberian-logs-construction_2.mp4` | `/posters/siberian-logs-construction_2.jpg` |
| `src/pages/projects.tsx` (hero, ~L78) | `/videos/projects-hero.mp4` | `/posters/projects-hero.jpg` |
| `src/components/MarketingVideo.tsx` (~L257) | `siberian-logs-construction.mp4` | `/posters/siberian-logs-construction.jpg` |

Постеры уже сгенерированы и лежат в `public/posters/`.

---

## 🟡 Приоритет 2 — `preload="metadata"` для видео ниже первого экрана

**Эффект:** браузер не буферизирует все видео сразу, а только скачивает первый кадр (~50 KB вместо полного файла). Полная загрузка запускается через IntersectionObserver когда секция приближается к экрану.

### Видео ниже первого экрана (изменить с `preload="auto"` на `preload="metadata"`)

- `home.tsx` — CTA-видео (секция Block 9, очень низко на странице)
- `about.tsx` — CTA-видео (последняя секция)
- `src/components/MarketingVideo.tsx` — компонент может быть в середине страницы

### Видео оставить с `preload="auto"` (герои — сразу видны)

- `home.tsx` hero
- `about.tsx` hero
- `uslugi.tsx` hero
- `projects.tsx` hero
- `RublenyeHeroVideo.tsx`
- `ProfbrusHeroVideo.tsx`

### Паттерн для ленивой загрузки CTA-видео

```tsx
const videoRef = useRef<HTMLVideoElement>(null);

useEffect(() => {
  const el = videoRef.current;
  if (!el) return;
  const observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        el.preload = "auto";
        el.load();
        el.play().catch(() => {});
        observer.disconnect();
      }
    },
    { rootMargin: "400px" }
  );
  observer.observe(el);
  return () => observer.disconnect();
}, []);

<video ref={videoRef} preload="metadata" autoPlay muted loop playsInline poster="..." src={...} />
```

---

## 🟡 Приоритет 3 — Cache-Control заголовки для видео

**Эффект:** при переходе между страницами видео не скачивается повторно.

В `artifacts/stroy-doma/vite.config.ts` добавить:

```ts
server: {
  headers: {
    "Cache-Control": "public, max-age=31536000, immutable",
  },
},
```

---

## 🟢 Приоритет 4 — Убрать неиспользуемые видео из публичной папки

В `public/videos/` есть файлы которые не используются нигде в коде:
- `hero-profbrus.mp4` — не встречается в компонентах (используется `hero-profbrus-gen.mp4`)
- `profbrus-hero.mp4` — не встречается в компонентах
- `house-orbit.mp4` — проверить, используется ли
- `kedr-house-1.mp4`, `kedr-house-2.mp4` — проверить, используются ли

Команда для проверки:
```bash
grep -r "house-orbit\|kedr-house-1\|kedr-house-2\|profbrus-hero\|hero-profbrus[^-]" artifacts/stroy-doma/src/
```

---

## Структура проекта (справка)

```
artifacts/stroy-doma/          ← основной сайт
  src/
    pages/                     ← home.tsx, about.tsx, uslugi.tsx, projects.tsx, ...
    components/                ← RublenyeHeroVideo.tsx, ProfbrusHeroVideo.tsx, MarketingVideo.tsx, Layout/
    hooks/                     ← сюда добавить useIsMobile.ts
    assets/
      cedar_log_mansion_flythrough_16s_compressed.mp4
      generated_videos/
        profiled-timber-flythrough-v3.mp4
        siberian-logs-construction.mp4
        siberian-logs-construction_2.mp4
  public/
    videos/                    ← hero-profbrus-gen.mp4, kedr-house-hero.mp4, projects-hero.mp4, ...
    posters/                   ← *.jpg постеры (уже готовы для всех видео)
artifacts/api-server/          ← Express API
```

---

## Команды для запуска

```bash
# Установить зависимости
pnpm install

# Запустить сайт (dev)
PORT=5000 BASE_PATH=/ pnpm --filter @workspace/stroy-doma run dev
```
