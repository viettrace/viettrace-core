import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  RequestTimeoutException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AppConfigService } from '@src/common/modules/app-config/app-config.service';
import { Observable, throwError } from 'rxjs';
import { catchError, timeout } from 'rxjs/operators';

@Injectable()
export class TimeoutInterceptor implements NestInterceptor {
  constructor(
    private readonly reflector: Reflector,
    private readonly appConfigService: AppConfigService,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const specificTimeout = this.reflector.get('request-timeout', context.getHandler());
    return next.handle().pipe(
      timeout(specificTimeout ? specificTimeout : this.appConfigService.appConfig.apiTimeoutMs),
      catchError((err: unknown) => {
        if (
          err &&
          typeof err === 'object' &&
          'name' in err &&
          (err as any).name === 'TimeoutError'
        ) {
          return throwError(() => new RequestTimeoutException('API request timed out'));
        }
        return throwError(() => err);
      }),
    );
  }
}
