import { Injectable, OnApplicationShutdown, OnModuleInit } from '@nestjs/common';
import { AppConfigService } from '@src/common/modules/app-config/app-config.service';
import { Logger } from '@src/common/modules/logger/logger.decorator';
import { WinstonService } from '@src/common/modules/logger/logger.service';
import { drizzle } from 'drizzle-orm/node-postgres';
import { PgDatabase } from 'drizzle-orm/pg-core';
import { Pool } from 'pg';

@Injectable()
export class DbService implements OnModuleInit, OnApplicationShutdown {
  private pool: Pool;
  private db: PgDatabase<any>;
  private isConnected = false;

  constructor(
    private readonly appConfigService: AppConfigService,
    @Logger('Database') private readonly logger: WinstonService,
  ) {}

  async onModuleInit() {
    await this.connect();
  }

  async onApplicationShutdown() {
    await this.disconnect();
  }

  private async connect(): Promise<void> {
    try {
      this.logger.info(`Connecting to database...`);

      await this.connectPostgres();

      this.isConnected = true;
      this.logger.info(`Successfully connected to database`, DbService.name);
    } catch (error) {
      this.logger.error(`Failed to connect to database: ${error.message}`);
      throw error;
    }
  }

  private async connectPostgres(): Promise<void> {
    this.pool = new Pool({
      connectionString: this.appConfigService.dbUrl,
    });

    // Test the connection
    const client = await this.pool.connect();
    client.release();

    this.db = drizzle(this.pool);

    // Handle pool errors
    this.pool.on('error', err => {
      this.logger.error('PostgreSQL pool error:', err);
    });

    this.pool.on('connect', () => {
      this.logger.debug('New PostgreSQL connection established');
    });

    this.pool.on('remove', () => {
      this.logger.debug('PostgreSQL connection removed from pool');
    });
  }

  private async disconnect(): Promise<void> {
    if (this.pool && this.isConnected) {
      try {
        this.logger.info('Disconnecting from database...');

        await this.pool.end();

        this.isConnected = false;
        this.logger.info('Successfully disconnected from database');
      } catch (error) {
        this.logger.error(`Error disconnecting from database: ${error.message}`);
      }
    }
  }

  getDb() {
    if (!this.isConnected) {
      throw new Error('Database is not connected');
    }

    return this.db;
  }

  getPool() {
    return this.pool;
  }

  isHealthy(): boolean {
    return this.isConnected;
  }

  async healthCheck(): Promise<{ status: string; message: string }> {
    try {
      if (!this.isConnected) {
        return { status: 'error', message: 'Database not connected' };
      }

      // Test query
      await this.db.execute('SELECT 1');
      return { status: 'ok', message: 'Database connection is healthy' };
    } catch (error) {
      return { status: 'error', message: error.message };
    }
  }
}
