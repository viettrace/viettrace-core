import { appConfigSchema } from '@src/config/schemas/app-config.schema';
import z from 'zod';

export type AppConfig = z.infer<typeof appConfigSchema>;
