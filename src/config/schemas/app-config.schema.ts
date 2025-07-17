import z from 'zod';

const logLevel = ['error', 'warn', 'info', 'http', 'verbose', 'debug', 'silly'] as const;

export const appConfigSchema = z.strictObject({
  port: z.coerce.number().default(3000),
  logLevel: z.enum(logLevel).default('info'),
  logDir: z.string().default(''),
  swaggerEnabled: z.stringbool().default(true),
});
