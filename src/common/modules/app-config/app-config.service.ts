import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Configuration } from '@src/config/interfaces';
import { AppConfig } from '@src/config/interfaces/app-config.interface';
import { DbConfig } from '@src/config/interfaces/db-config.interface';

@Injectable()
export class AppConfigService {
  constructor(private readonly configService: ConfigService<Configuration, true>) {}

  get appConfig(): AppConfig {
    return this.get<AppConfig>('app');
  }

  get dbConfig(): DbConfig {
    return this.get<DbConfig>('db');
  }

  get dbUrl(): string {
    return `postgres://${this.dbConfig.username}:${this.dbConfig.password}@${this.dbConfig.host}:${this.dbConfig.port}/${this.dbConfig.database}`;
  }

  private get<T>(key: keyof Configuration): T {
    return this.configService.get<T>(key);
  }
}
