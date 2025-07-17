import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { WinstonService } from '@src/common/modules/logger/logger.service';

@Catch()
export class CatchAllExceptionsFilter implements ExceptionFilter {
  constructor(
    private readonly httpAdapterHost: HttpAdapterHost,
    private readonly logger: WinstonService,
  ) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();

    const httpStatus =
      exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

    const response = exception instanceof HttpException ? exception.getResponse() : exception;

    const message =
      response && typeof response === 'object'
        ? (response as any).message || JSON.stringify(response)
        : String(response);

    this.logger.error('Exception Filter', {
      method: request.method || null,
      url: request.url || null,
      statusCode: httpStatus,
      message,
      stack: exception instanceof Error ? exception.stack : null,
    });

    const responseBody = {
      statusCode: httpStatus,
      message,
      success: false,
      timestamp: new Date().toISOString(),
      path: request.url || null,
    };

    httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
  }
}
