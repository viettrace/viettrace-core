import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppConfigModule } from '@src/common/modules/app-config/app-config.module';
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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
