# Kedr Tomsk — Строительство домов и бань

A Russian-language marketing website for **Kedr Tomsk**, a construction company specialising in timber homes and saunas (bani). The project is a full-stack pnpm monorepo.

## Stack

| Layer | Technology |
|---|---|
| Frontend | React 19 + Vite 7, Tailwind CSS 4, Radix UI, Framer Motion, Three.js / React Three Fiber |
| API server | Express 5 (TypeScript, esbuild bundle) |
| Database | PostgreSQL via Replit's managed DB, Drizzle ORM |
| Router | Wouter |

## Workspace layout

```
artifacts/
  stroy-doma/   — React/Vite frontend (the public-facing website)
  api-server/   — Express REST API

lib/
  db/           — Drizzle schema & connection
  api-spec/     — Shared API spec types
  api-zod/      — Zod validators for the API
  api-client-react/ — TanStack Query wrappers

scripts/        — Build / maintenance scripts
attached_assets/ — Project images, video, and a 3-D model (.glb)
```

## How to run

All workflows are pre-configured in Replit. Just click **Run**. Individual commands:

```bash
# Install all dependencies (root)
pnpm install

# Frontend dev server (port assigned by Vite)
pnpm --filter @workspace/stroy-doma run dev

# API server (reads PORT env var — defaults to 8080 on Replit)
pnpm --filter @workspace/api-server run dev

# Push DB schema to development database
pnpm --filter @workspace/db run push
```

## Environment variables

| Key | Notes |
|---|---|
| `DATABASE_URL` | Managed automatically by Replit. Do not set manually. |
| `PORT` | Set to `3000` in shared env; Replit may override at runtime. |
| `SESSION_SECRET` | Secret stored in Replit Secrets. |

## User preferences

<!-- Add user preferences here as you learn them -->
