import 'dotenv/config';
import { defineConfig } from 'prisma/config';

// prisma generate does not connect to the DB, but Prisma still resolves this URL
// at config load time. Allow a placeholder so workspace installs (e.g. Vercel
// deploying apps/web) succeed without DATABASE_URL.
const databaseUrl =
  process.env.DATABASE_URL ??
  'postgresql://postgres:postgres@127.0.0.1:5432/postgres';

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
    seed: 'tsx prisma/seed.ts',
  },
  datasource: {
    url: databaseUrl,
  },
});
