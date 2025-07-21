import { integer, pgTable, varchar } from 'drizzle-orm/pg-core';

export const administrativeRegions = pgTable('administrative_regions', {
  id: integer('id').primaryKey().notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  nameEn: varchar('name_en', { length: 255 }).notNull(),
  codeName: varchar('code_name', { length: 255 }),
  codeNameEn: varchar('code_name_en', { length: 255 }),
});
