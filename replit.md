# КедрДом — сайт строительной компании

Сайт строительной компании «Кедр-Томск» (kedr-tomsk.ru) — строительство деревянных домов под ключ, Томск. Перенесён с оригинального сайта с сохранением структуры страниц и контента.

## Run & Operate

- `pnpm --filter @workspace/stroy-doma run dev` — запуск фронтенда (порт 19912, через workflow `artifacts/stroy-doma: web`)
- `pnpm --filter @workspace/api-server run dev` — запуск API-сервера (порт 5000, нужен `DATABASE_URL`)
- `pnpm run typecheck` — полная проверка типов
- `pnpm run build` — typecheck + сборка всех пакетов
- Required env: `DATABASE_URL` — строка подключения к PostgreSQL (только для API-сервера)

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React 19 + Vite 7 + Tailwind CSS 4 + Framer Motion + Three.js (3D-модель дома)
- API: Express 5 (не запущен — фронтенд работает на статических данных)
- DB: PostgreSQL + Drizzle ORM (не подключена)
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

_Populate as you build — short repo map plus pointers to the source-of-truth file for DB schema, API contracts, theme files, etc._

## Architecture decisions

_Populate as you build — non-obvious choices a reader couldn't infer from the code (3-5 bullets)._

## Product

_Describe the high-level user-facing capabilities of this app once they exist._

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

_Populate as you build — sharp edges, "always run X before Y" rules._

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
