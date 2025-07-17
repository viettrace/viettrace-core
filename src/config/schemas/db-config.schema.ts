import z from 'zod';

export const dbConfigSchema = z.strictObject({
  host: z.string().default('localhost'),
  port: z.coerce.number().default(5432),
  username: z.string().default('postgres'),
  password: z.string().default('postgres'),
  database: z.string().default('viettrace'),
});
