import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { SentryModule } from '@sentry/nestjs/setup';
import { ApiResponseInterceptor } from '@src/common/interceptors/api-response.interceptor';
import { RequestLogInterceptor } from '@src/common/interceptors/request-log.interceptor';
import { TimeoutInterceptor } from '@src/common/interceptors/timeout.interceptor';
import { AppConfigModule } from '@src/common/modules/app-config/app-config.module';
import { WinstonModule } from '@src/common/modules/logger/logger.module';
import configuration from '@src/config/configuration';
import { DbModule } from '@src/db/db.module';
import { AppController } from './modules/app/app.controller';
import { AppService } from './modules/app/app.service';

@Module({
  imports: [
    SentryModule.forRoot(),
    ConfigModule.forRoot({
      cache: true,
      load: [configuration],
      isGlobal: true,
    }),
    AppConfigModule,
    DbModule,
    WinstonModule.forRoot(),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: RequestLogInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: TimeoutInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ApiResponseInterceptor,
    },
  ],
})
export class AppModule {}
