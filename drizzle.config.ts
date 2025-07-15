import { defineConfig } from 'drizzle-kit';

// For more info, please read official docs: https://orm.drizzle.team/docs/kit-overview
export default defineConfig({
  schema: './src/db/schemas',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: 'postgres://postgres:admin@127.0.0.1:5432/viettrace',
  },
  migrations: {
    schema: 'public',
  },
  verbose: true,
  strict: true,
});
