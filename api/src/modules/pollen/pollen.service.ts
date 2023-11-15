import { HttpService } from '@nestjs/axios';
import {
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
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
      .get(this._appConfig.pollenUrl, {
        headers: { Authorization: `Token ${this._appConfig.pollenToken}` },
      })
      .pipe(
        map((axiosResponse) => {
          if (axiosResponse) {
            return axiosResponse.data.species.map((species) =>
              this.converter.toDTO(species),
            );
          } else return axiosResponse.data.results.species;
        }),
        catchError((err) =>
          throwError(() =>
            this.logger.error(
              !!err?.response?.status
                ? `${err.response.status} - ${err.response.data.detail}`
                : '==> Undefined Error',
            ),
          ),
        ),
      );
  }
}
