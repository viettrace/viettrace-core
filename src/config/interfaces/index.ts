import { AppConfig } from './app-config.interface';
import { DbConfig } from './db-config.interface';

export interface Configuration {
  app: AppConfig;
  db: DbConfig;
}
