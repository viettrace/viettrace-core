import { DynamicModule } from '@nestjs/common';
import { WinstonInit } from '@src/common/modules/logger/logger-init.service';
import { createWinstonProviders } from '@src/common/modules/logger/logger.provider';
import { WinstonService } from '@src/common/modules/logger/logger.service';
import { randomUUID } from 'crypto';
import { ClsModule } from 'nestjs-cls';

export class WinstonModule {
  static forRoot(): DynamicModule {
    const prefixedLoggerProviders = createWinstonProviders();
    return {
      global: true,
      module: WinstonModule,
      imports: [
        ClsModule.forRoot({
          global: true,
          middleware: {
            mount: true,
            generateId: true,
            idGenerator: (req: Request) => {
              return (req.headers['X-Request-Id'] as string) ?? randomUUID();
            },
          },
        }),
      ],
      providers: [WinstonInit, WinstonService, ...prefixedLoggerProviders],
      exports: [WinstonInit, WinstonService, ...prefixedLoggerProviders],
    };
  }
}
