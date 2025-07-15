import { NestFactory } from '@nestjs/core';
import { AppConfigModule } from '@src/common/modules/app-config/app-config.module';
import { AppConfigService } from '@src/common/modules/app-config/app-config.service';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.select(AppConfigModule).get(AppConfigService);

  await app.listen(configService.appConfig.port ?? 3000);
}

void bootstrap();
