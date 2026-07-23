# Stroy-Doma (Кедр Томск)

A Russian-language construction company website for **Kedr Tomsk** — a log/timber home builder based in Tomsk, Russia.

## Stack

- **Frontend:** React 19 + Vite 7, TypeScript, Tailwind CSS v4, shadcn/ui components
- **Routing:** Wouter
- **3D:** Three.js + React Three Fiber (interactive 3D house model on the homepage)
- **Animations:** Framer Motion
- **Package manager:** pnpm (workspace monorepo)

## Project structure

```
artifacts/stroy-doma/   ← main website app
artifacts/api-server/   ← backend API server (Express/TypeScript)
artifacts/mockup-sandbox/ ← UI component sandbox
lib/                    ← shared libraries / API client
```

## Running the app

The website runs on port 19912 via the `artifacts/stroy-doma: web` workflow:

```bash
PORT=19912 BASE_PATH=/ pnpm --filter @workspace/stroy-doma run dev
```

To install dependencies after cloning:

```bash
pnpm install
```

## Pages

- `/` — Homepage with interactive 3D house model
- `/services` — Services
- `/projects` — Project catalog
- `/projects/:id` — Project detail
- `/gallery` — Photo gallery
- `/production` — Production/manufacturing info
- `/articles` — Articles/blog
- `/articles/:slug` — Article detail
- `/about` — About the company
- `/contacts` — Contact page
- `/terms` — Terms & conditions

## User preferences

- Keep the existing project structure and stack — do not restructure or migrate.
