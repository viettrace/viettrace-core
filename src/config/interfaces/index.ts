import { configurationSchema } from '@src/config/schemas';
import z from 'zod';

export type Configuration = z.infer<typeof configurationSchema>;
