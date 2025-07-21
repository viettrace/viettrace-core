import { DbService } from '@src/db/db.service';
import { eq, InferInsertModel, InferSelectModel, sql, SQL } from 'drizzle-orm';
import { PgColumn, PgDatabase, PgTable, PgUpdateSetSource, TableConfig } from 'drizzle-orm/pg-core';

export class DbRepository<T extends TableConfig, TTable extends PgTable<T>> {
  private db: PgDatabase<any>;

  constructor(
    private readonly dbService: DbService,
    private readonly table: TTable,
    private readonly primaryKey: PgColumn<any>, // The primary key column
  ) {
    this.db = this.dbService.getDb();
  }

  async findAll() {
    return await this.db.select().from(this.table as PgTable<T>);
  }

  async findById(id: string | number) {
    const result = await this.db
      .select()
      .from(this.table as PgTable<T>)
      .where(eq(this.primaryKey, id))
      .limit(1);

    return result[0] || null;
  }

  async create(data: InferInsertModel<TTable>): Promise<InferSelectModel<TTable>> {
    const result = await this.db.insert(this.table).values(data).returning();

    return result[0];
  }

  async update(id: string | number, data: PgUpdateSetSource<TTable>) {
    const result = await this.db
      .update(this.table)
      .set(data)
      .where(eq(this.primaryKey, id))
      .returning();

    return result[0] || null;
  }

  async delete(id: string | number): Promise<boolean> {
    const result = await this.db.delete(this.table).where(eq(this.primaryKey, id)).returning();

    return result.length > 0;
  }

  async findWhere(where: SQL) {
    return await this.db
      .select()
      .from(this.table as PgTable<T>)
      .where(where);
  }

  // Additional utility methods
  async findOne(where: SQL) {
    const result = await this.db
      .select()
      .from(this.table as PgTable<T>)
      .where(where)
      .limit(1);

    return result[0] || null;
  }

  async count(where?: SQL): Promise<number> {
    const result = await this.db
      .select({ count: sql<number>`count(*)` })
      .from(this.table as PgTable<T>)
      .where(where);

    return result[0].count;
  }

  async exists(where: SQL): Promise<boolean> {
    const result = await this.db
      .select({
        exists: sql<boolean>`exists(${this.db
          .select()
          .from(this.table as PgTable<T>)
          .where(where)})`,
      })
      .from(this.table as PgTable<T>)
      .execute();

    return result[0].exists;
  }
}
