# Строй Дома — Kedr Tomsk

A Russian-language marketing website for **Kedr Tomsk**, a wood-house construction company building cedar log homes and profiled timber houses turnkey across Russia since 2001.

## Stack

- **Frontend:** React 19 + Vite + TypeScript
- **Styling:** Tailwind CSS v4 + shadcn/ui components
- **Routing:** Wouter
- **3D:** React Three Fiber / Three.js (used on some pages)
- **Monorepo:** pnpm workspace

## Structure

- `artifacts/stroy-doma/` — main website (web artifact)
- `artifacts/api-server/` — API server artifact
- `artifacts/mockup-sandbox/` — design canvas/mockup server

## Running

The website runs on port 19912 via the `artifacts/stroy-doma: web` workflow:

```
pnpm --filter @workspace/stroy-doma run dev
```

Install dependencies first if node_modules is missing:

```
pnpm install
```

## Pages

- `/` — Home (hero, stats, services, projects preview, CTA)
- `/services` — Construction services
- `/projects` — Project catalog (houses & baths)
- `/projects/:id` — Individual project detail
- `/gallery` — Photo gallery
- `/production` — Production/manufacturing info
- `/articles` — Articles/blog
- `/about` — About the company
- `/contacts` — Contact information
- `/terms` — Terms & conditions

## User preferences

<!-- Add user preferences here as they are expressed -->
