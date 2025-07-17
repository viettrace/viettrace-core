import { appConfigSchema } from '@src/config/schemas/app-config.schema';
import { dbConfigSchema } from '@src/config/schemas/db-config.schema';
import z from 'zod';

export const configurationSchema = z.strictObject({
  app: appConfigSchema,
  db: dbConfigSchema,
});
