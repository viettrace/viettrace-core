import { Provider } from '@nestjs/common';
import { prefixesForLoggers } from '@src/common/modules/logger/logger.decorator';
import { WinstonService } from '@src/common/modules/logger/logger.service';

function winstonFactory(logger: WinstonService, prefix: string) {
  if (prefix) {
    logger.setPrefix(prefix);
  }
  return logger;
}

function createWinstonProvider(prefix: string): Provider<WinstonService> {
  return {
    provide: `${prefix}Logger`,
    useFactory: (logger: WinstonService) => winstonFactory(logger, prefix),
    inject: [WinstonService],
  };
}

export function createWinstonProviders(): Array<Provider<WinstonService>> {
  return prefixesForLoggers.map(prefix => createWinstonProvider(prefix));
}
