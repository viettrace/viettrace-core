import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Logger } from '@src/common/modules/logger/logger.decorator';
import { WinstonService } from '@src/common/modules/logger/logger.service';
import { Request, Response } from 'express';
import requestIp from 'request-ip';
import { Observable, tap } from 'rxjs';

@Injectable()
export class RequestLogInterceptor implements NestInterceptor {
  constructor(@Logger('Request') private readonly logger: WinstonService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest<Request>();
    const res = context.switchToHttp().getResponse<Response>();

    const { method, originalUrl, headers, body, params, query } = req;

    this.logger.info(``, {
      method,
      url: originalUrl,
      headers,
      ip: requestIp.getClientIp(req),
      body: body ? JSON.stringify(body) : null,
      params: params ? JSON.stringify(params) : null,
      query: query ? JSON.stringify(query) : null,
    });

    const startTime = Date.now();

    return next.handle().pipe(
      tap(() => {
        this.logger.info(``, {
          statusCode: res.statusCode,
          durationMs: `${Date.now() - startTime}ms`,
        });
      }),
    );
  }
}
