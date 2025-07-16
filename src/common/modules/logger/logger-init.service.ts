import { Injectable } from '@nestjs/common';
import { AppConfigService } from '@src/common/modules/app-config/app-config.service';
import { Logger } from 'winston';
import createWinstonInstance from './logger.config';

@Injectable()
export class WinstonInit {
  private winstonInstance: Logger;

  constructor(private readonly appConfigService: AppConfigService) {
    this.winstonInstance = createWinstonInstance(this.appConfigService.appConfig.logLevel);
  }

  getInstance(): Logger {
    return this.winstonInstance;
  }
}
