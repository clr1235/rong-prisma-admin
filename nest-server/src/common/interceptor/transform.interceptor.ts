import {
  CallHandler,
  ExecutionContext,
  HttpStatus,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import qs from 'qs';
import { Reflector } from '@nestjs/core';

import { ResOp } from '../model/response.model';
import { BYPASS_KEY } from '../decorators/bypass.decorator';

// 统一处理接口请求与响应结果，如果不需要则添加 @Bypass 装饰器
@Injectable()
export class TransformInterceptor implements NestInterceptor {
  constructor(private readonly reflector: Reflector) {}
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    const bypass = this.reflector.get<boolean>(
      BYPASS_KEY,
      context.getHandler(),
    );

    if (bypass) return next.handle();

    const http = context.switchToHttp();
    const request = http.getRequest();

    // 处理 query 参数，将数组参数转换为数组,如：?a[]=1&a[]=2 => { a: [1, 2] }
    const queryString = request.url.split('?').at(1);
    if (queryString) {
      const parsedQuery = qs.parse(queryString);
      // 合并到现有的 query 对象中，而不是直接替换
      // 如果 request.query 是只读的，创建一个新对象并替换
      try {
        Object.assign(request.query, parsedQuery);
      } catch (e) {
        // 如果无法直接赋值，则创建一个新对象
        request.query = { ...request.query, ...parsedQuery };
      }
    }

    return next.handle().pipe(
      map((data) => {
        // if (typeof data === 'undefined') {
        //   context.switchToHttp().getResponse().status(HttpStatus.NO_CONTENT);
        //   return data;
        // }

        return new ResOp(HttpStatus.OK, data ?? null);
      }),
    );
  }
}
