import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T> {
  data: T;
}

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, Response<T>> {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    return next.handle().pipe(
      map((value: any) => {
        return {
          succeeded: true,
          totalRecords: value ? value.totalRecords : 0,
          statusCode: value?.status
            ? value.status
            : context.switchToHttp().getRequest().method === 'POST'
            ? 201
            : 200,
          message: value?.message ? value.message : 'Operation successful',
          data: value?.data ? value.data : value,
          meta: value?.meta ? value?.meta : null,
        };
      }),
    );
  }
}
