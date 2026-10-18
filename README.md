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
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env.local   # optional; defaults work locally
pnpm install
pnpm --filter api db:migrate
pnpm --filter api db:seed                      # optional demo user: demo@qualti.io / password123
pnpm dev
```

- Web: http://localhost:3000
- API: http://localhost:3001

See [`docs/development.md`](./docs/development.md) for the full local setup.

## License

Qualti.io is licensed under the [GNU Affero General Public License v3.0](./LICENSE) (AGPL-3.0-only).
You can use, modify, and self-host it. If you run a modified version as a network service,
you must make your modified source available to its users.
