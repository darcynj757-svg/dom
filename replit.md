# Кедр-Томск — Строительство домов и бань

Marketing website for **Kedr-Tomsk** (Кедр-Томск), a wooden house construction company based in Tomsk, Russia (operating since 2001).

## Stack

- **Monorepo:** pnpm workspaces (`artifacts/`, `lib/`)
- **Frontend (`artifacts/stroy-doma`):** React 19, Vite, Tailwind CSS 4, Framer Motion, Wouter, Radix UI, Three.js/React Three Fiber
- **Backend (`artifacts/api-server`):** Node.js, Express 5, Drizzle ORM, PostgreSQL, Pino logging
- **Shared libs:** `lib/db` (schema + Drizzle client), `lib/api-zod` (Zod schemas), `lib/api-client-react` (generated React Query hooks)
- **Design sandbox (`artifacts/mockup-sandbox`):** Vite component preview server

## How to run

| Service | Workflow | Port |
|---|---|---|
| Web app | `artifacts/stroy-doma: web` | 19912 (→ 80) |
| API server | `artifacts/api-server: API Server` | 8080 |
| Mockup sandbox | `artifacts/mockup-sandbox: Component Preview Server` | auto |

Install dependencies: `pnpm install` (run from workspace root)

## Environment variables

- `DATABASE_URL` — PostgreSQL connection string (required for API server and DB migrations)

## Notes

- Contact forms in the frontend currently simulate success (no real API call). The backend `/contact-requests` endpoint exists but the frontend isn't wired to it yet.
- DB migrations: `pnpm --filter @workspace/db run push` (requires `DATABASE_URL`)

## User preferences
