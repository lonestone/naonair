import { HttpErrors, PollenDTO } from '@aireal/dtos';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';
import { HttpService } from '@nestjs/axios';
import {
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { catchError, map, throwError } from 'rxjs';
import appConfig from 'src/configs/app.config';
import { PollenEntity } from 'src/entities/pollen.entity';
import { PollenConverterService } from './pollen.converter';

@Injectable()
export class PollenService {
  logger = new Logger('PollenModule');

  constructor(
    @Inject(appConfig.KEY)
    private readonly _appConfig: ConfigType<typeof appConfig>,
    private httpService: HttpService,
    @InjectRepository(PollenEntity)
    public readonly pollenRepo: EntityRepository<PollenEntity>,
    private converter: PollenConverterService,
  ) {}

  async findByName(name: string): Promise<PollenDTO> {
    const pollen = await this.pollenRepo.findOne({ name });
    if (!pollen) {
      throw new NotFoundException(HttpErrors.NEWS_NOT_FOUND);
    }
    return this.converter.fromEntityToDTO(pollen);
  }

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
