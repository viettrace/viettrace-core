import { defineConfig } from 'drizzle-kit';

// For more info, please read official docs: https://orm.drizzle.team/docs/kit-overview
export default defineConfig({
  schema: './src/db/schemas',
  out: './db/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: 'postgres://username:password@host:port/database',
  },
  migrations: {
    schema: 'public',
  },
  verbose: true,
  strict: true,
});
