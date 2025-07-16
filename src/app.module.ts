import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppConfigModule } from '@src/common/modules/app-config/app-config.module';
import { WinstonModule } from '@src/common/modules/logger/logger.module';
import configuration from '@src/config/configuration';
import { DbModule } from '@src/db/db.module';
import { AppController } from './modules/app/app.controller';
import { AppService } from './modules/app/app.service';

@Module({
  imports: [
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
  providers: [AppService],
})
export class AppModule {}
