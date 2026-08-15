# Qualti

Enterprise inspection SaaS monorepo.

## Structure

```
apps/
  web/    Next.js frontend
  api/    NestJS API server (Prisma)
packages/
  config/ Shared ESLint & TS configs
```

## Prerequisites

- Node.js 20+
- pnpm 9+
- Docker (for local Postgres)

## Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start all apps in development |
| `pnpm build` | Build all packages and apps |
| `pnpm lint` | Lint across the monorepo |
| `pnpm typecheck` | Type-check across the monorepo |
| `pnpm format` | Format with Prettier |

## Getting started

```bash
docker compose up -d
pnpm install
pnpm --filter api db:migrate
pnpm dev
```

- Web: http://localhost:3000
- API: http://localhost:3001
