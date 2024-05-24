import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpStatus,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T> {
  data: T;
}

@Injectable()
export class ApiPaginationResponseInterceptor<T>
  implements NestInterceptor<T, Response<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    return next.handle().pipe(
      map((value: any) => {
        return {
          succeeded: true,
          totalRecords: value ? value?.length : 0,
          statusCode: value?.statusCode ? value?.statusCode : HttpStatus.OK,
          message: value?.message ? value.message : 'Operation successful',
          data: value?.data ? value.data : value,
          meta: value?.metaInfo ? value?.metaInfo : '',
        };
      }),
    );
  }
}
