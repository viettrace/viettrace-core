import { dbConfigSchema } from '@src/config/schemas/db-config.schema';
import z from 'zod';

export type DbConfig = z.infer<typeof dbConfigSchema>;
