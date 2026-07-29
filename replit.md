# Строй Дома — Construction Company Website

A React + Vite single-page application for a Russian wooden house and sauna construction company ("Stroy Doma"). Dark-themed, content-rich marketing site with multiple pages covering services, production, projects, gallery, articles, and contacts.

## Stack

- **React 18** + **TypeScript** — UI
- **Vite** — bundler and dev server
- **Tailwind CSS v4** — styling
- **Wouter** — client-side routing
- **Framer Motion** — animations
- **Three.js / React Three Fiber** — 3D house model viewer
- **Radix UI** — accessible component primitives
- **TanStack Query** — data fetching
- **pnpm workspaces** — monorepo

## Project structure

```
artifacts/stroy-doma/   ← main app (React/Vite)
  src/
    pages/              ← one file per route
    components/         ← layout, UI, section components
    data/               ← static content (projects, articles, etc.)
    hooks/              ← shared React hooks
  public/               ← static assets (images, videos, 3D model)
artifacts/api-server/   ← Express API server (currently minimal)
attached_assets/        ← source images (PNG + WebP variants)
```

## How to run

The dev server starts automatically via the configured workflow.  
It runs on **port 19912** with:

```
PORT=19912 BASE_PATH=/ pnpm --filter @workspace/stroy-doma run dev
```

To install dependencies after a fresh clone:

```
pnpm install
```

## User preferences

_No preferences recorded yet._
