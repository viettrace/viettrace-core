import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppConfigService } from '@src/common/modules/app-config/app-config.service';
import { WinstonService } from '@src/common/modules/logger/logger.service';

export function setupSwagger(app: NestExpressApplication, logger: WinstonService) {
  const appConfigService = app.get(AppConfigService);

  if (appConfigService.appConfig.swaggerEnabled) {
    logger.info('Init Swagger');
    const server = app.getHttpAdapter();
    const config = new DocumentBuilder()
      .setTitle('VietTrace API')
      .setDescription(
        'RESTful API Documentation for VietTrace Map Service.\n\n' +
          '**Tips:** Use your JWT access token by clicking **Authorize**.\n\n' +
          'Some endpoints require authentication.\n\n' +
          'Download Swagger specifications | [swagger-spec.json](/api/docs/swagger.json)',
      )
      .setVersion('1.0.0')
      .addBearerAuth()
      .build();

    const document = SwaggerModule.createDocument(app, config);

    server.get(`/api/docs/swagger.json`, (_req, res: any) => {
      res.json(document);
    });

    SwaggerModule.setup('api/docs', app, document, {
      swaggerOptions: {
        persistAuthorization: true,
        syntaxHighlight: {
          activated: false, // boost performance by negating json formatting
          theme: 'agate',
        },
      },
      customSiteTitle: 'VietTrace API Docs',
      customCss: '.swagger-ui .topbar { display: none }', // remove Swagger topbar branding
    });
  }
}
