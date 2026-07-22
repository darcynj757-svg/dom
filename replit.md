# Stroy-Doma (Kedr Tomsk)

A Russian-language marketing website for **Kedr Tomsk** — a wooden house construction company building cedar log homes since 2001.

## Stack

- **Frontend**: React 19 + Vite + TypeScript
- **Styling**: Tailwind CSS v4 + shadcn/ui components
- **3D**: Three.js / React Three Fiber (house model viewer)
- **Routing**: Wouter
- **Monorepo**: pnpm workspaces

## Project structure

```
artifacts/
  stroy-doma/   ← main website (React + Vite)
  api-server/   ← Express API server (contact requests, projects)
  mockup-sandbox/ ← design sandbox for UI prototyping
```

## Running the app

The `artifacts/stroy-doma: web` workflow starts the dev server on port 19912.

```
pnpm install                                    # install all workspace deps
pnpm --filter @workspace/stroy-doma run dev     # start frontend dev server
```

## User preferences

<!-- Add preferences here as they come up -->
