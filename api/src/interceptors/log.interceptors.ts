import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor() {}
  logger = new Logger('IncomingRequest');

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url } = request;

    const now = Date.now();

    const log = (err?) => {
      const status = err
        ? err.status
        : context.switchToHttp().getResponse().statusCode;

      const msg = `${status} ${method.toUpperCase()} ${url} +${
        Date.now() - now
      }ms ${err.message}`;

      err ? this.logger.error(msg) : this.logger.log(msg);
      return err;
    };

    return next
      .handle()
      .pipe(tap(() => log()))
      .pipe(catchError((err) => throwError(() => log(err))));
  }
}
