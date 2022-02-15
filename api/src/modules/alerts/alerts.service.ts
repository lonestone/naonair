import { HttpService } from '@nestjs/axios';
import {
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { log } from 'console';
import { catchError, map, throwError } from 'rxjs';
import appConfig from 'src/configs/app.config';
import { AlertsConverterService } from './alerts.converter';

@Injectable()
export class AlertsService {
  constructor(
    @Inject(appConfig.KEY)
    private readonly _appConfig: ConfigType<typeof appConfig>,
    private httpService: HttpService,
    private converter: AlertsConverterService,
  ) {}
  logger = new Logger('AlertsModule');

  async fetchAll() {
    if (!this._appConfig.alertsUrl) {
      this.logger.error('No url set for alerts url');
      throw new InternalServerErrorException();
    }
    return this.httpService
      .get(this._appConfig.alertsUrl)
      .pipe(
        map((axiosResponse) =>
          axiosResponse.data.results.map((alert) =>
            this.converter.toDTO(alert),
          ),
        ),
      ).pipe(catchError((err) => throwError(() => log(err))));
  }
}
