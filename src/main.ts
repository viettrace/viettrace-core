import './monitoring/sentry'; // sentry file must be imported at the top of this file

import { ValidationPipe } from '@nestjs/common';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { ExpressAdapter, NestExpressApplication } from '@nestjs/platform-express';
import { corsConfig } from '@src/bootstrap/cors';
import { helmetConfig } from '@src/bootstrap/helmet';
import { setupSwagger } from '@src/bootstrap/swagger';
import { CatchAllExceptionsFilter } from '@src/common/exception-filters/catch-all.exception';
import { AppConfigModule } from '@src/common/modules/app-config/app-config.module';
import { AppConfigService } from '@src/common/modules/app-config/app-config.service';
import { WinstonService } from '@src/common/modules/logger/logger.service';
import compression from 'compression';
import helmet from 'helmet';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, new ExpressAdapter());

  const logger = await app.resolve(WinstonService);

  const appConfigService = app.select(AppConfigModule).get(AppConfigService);

  try {
    app.setGlobalPrefix(appConfigService.appConfig.baseUrl);

    setupSwagger(app, logger);

    const httpAdapter = app.get(HttpAdapterHost);

    app.useGlobalFilters(new CatchAllExceptionsFilter(httpAdapter, logger));

    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        validationError: {
          target: false,
          value: false,
        },
        stopAtFirstError: true,
      }),
    );

    app.enable('trust proxy'); // only if you're behind a reverse proxy (Heroku, Bluemix, AWS ELB, Nginx, etc)
    app.use(helmet(helmetConfig));

    app.enableCors(corsConfig());

    app.use(compression());
  } catch (err) {
    logger.error(`Error while init application: ${err as any}`);
    process.exit(1);
  }
  await app.listen(appConfigService.appConfig.port ?? 3000);
}

void bootstrap();
