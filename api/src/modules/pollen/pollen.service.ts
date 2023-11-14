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
import { PollenConverterService } from './pollen.converter';

@Injectable()
export class PollenService {
  constructor(
    @Inject(appConfig.KEY)
    private readonly _appConfig: ConfigType<typeof appConfig>,
    private httpService: HttpService,
    private converter: PollenConverterService,
  ) {}
  logger = new Logger('PollenModule');

  async fetchAll() {
    if (!this._appConfig.pollenUrl) {
      this.logger.error('No url set for pollen url');
      throw new InternalServerErrorException();
    }
    return this.httpService
      .get(this._appConfig.pollenUrl)
      .pipe(
        map((axiosResponse) =>
          axiosResponse.data.results.map((alert) =>
            this.converter.toDTO(alert),
          ),
        ),
      )
      .pipe(catchError((err) => throwError(() => log(err))));
  }
}
