import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { ApiResponse } from '@src/shared/interfaces/api-response.interface';
import { map, Observable } from 'rxjs';

@Injectable()
export class ApiResponseInterceptor<T> implements NestInterceptor<T, ApiResponse<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<ApiResponse<T>> {
    const ctx = context.switchToHttp();
    const response = ctx.getResponse();
    const statusCode = response.statusCode;

    return next.handle().pipe(
      map(data => {
        return {
          statusCode: statusCode || 200,
          message: 'Success',
          data: data === null ? undefined : data,
          success: true,
          requestDate: new Date().toISOString(),
        };
      }),
    );
  }
}
