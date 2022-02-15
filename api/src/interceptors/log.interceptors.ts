import {
    CallHandler,
    ExecutionContext,
    Injectable,
    Logger,
    NestInterceptor
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
      .pipe(catchError((err) => throwError(() =>log(err))));
  }

  // return call$
  //   .pipe(
  //     map(response => {
  //       const msg =
  //         response && response.data && Array.isArray(response.data) ? `OK - ${response.data.length} items` : `OK`;

  //       // Save programs info asked by users at INFO level in order to keep logs. DEBUG messages will be purged.
  //       if (method === 'GET' && (url as string).includes('/program')) {
  //         this.logService.log(LogLevels.INFO, method, url, msg, user, body);
  //       } else {
  //         this.logService.log(LogLevels.DEBUG, method, url, msg, user, body);
  //       }

  //       return response;
  //     }),
  //   )
  //   .pipe(
  //     catchError(err => {
  //       const logLevel = err.status && err.status < 500 ? LogLevels.WARN : LogLevels.ERROR;
  //       this.logService.log(logLevel, method, url, err, user, body);
  //       throw err;
  //     }),
  //   );
}
