import { applyDecorators, SetMetadata, UseInterceptors } from '@nestjs/common';
import { TimeoutInterceptor } from '@src/common/interceptors/timeout.interceptor';

const SetTimeout = (timeout: number) => SetMetadata('request-timeout', timeout);

export function SetRequestTimeout(timeout = 10000000) {
  return applyDecorators(SetTimeout(timeout), UseInterceptors(TimeoutInterceptor));
}
