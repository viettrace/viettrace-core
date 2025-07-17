import { NestFactory } from '@nestjs/core';
import { ExpressAdapter, NestExpressApplication } from '@nestjs/platform-express';
import { setupSwagger } from '@src/bootstrap/swagger';
import { AppConfigModule } from '@src/common/modules/app-config/app-config.module';
import { AppConfigService } from '@src/common/modules/app-config/app-config.service';
import { WinstonService } from '@src/common/modules/logger/logger.service';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, new ExpressAdapter(), {
    cors: true,
  });

  const logger = await app.resolve(WinstonService);
  const configService = app.select(AppConfigModule).get(AppConfigService);
  try {
    setupSwagger(app, logger);
  } catch (err) {
    logger.error(`Error while init application: ${err as any}`);
    process.exit(1);
  }
  await app.listen(configService.appConfig.port ?? 3000);
}

void bootstrap();
