import { HttpErrors, PollenDTO } from '@aireal/dtos';
import { EntityManager } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';
import { HttpService } from '@nestjs/axios';
import {
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  OnApplicationBootstrap,
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { Cron } from '@nestjs/schedule';
import { catchError, lastValueFrom, map, throwError } from 'rxjs';
import appConfig from 'src/configs/app.config';
import { PollenEntity } from 'src/entities/pollen.entity';
import { PollenConverterService } from './pollen.converter';

@Injectable()
export class PollenService implements OnApplicationBootstrap {
  logger = new Logger('PollenModule');

  constructor(
    @Inject(appConfig.KEY)
    private readonly _appConfig: ConfigType<typeof appConfig>,
    private httpService: HttpService,
    @InjectRepository(PollenEntity)
    public readonly pollenRepo: EntityRepository<PollenEntity>,
    private converter: PollenConverterService,
    private readonly em: EntityManager,
  ) {}

  async onApplicationBootstrap() {
    await this.getPollenNotifications();
  }

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

  //@Cron('0 6 * * *')
  @Cron('10 * * * * *')
  async getPollenNotifications() {
    try {
      const data = await lastValueFrom(await this.fetchAll());

      const stateChanges: Array<{
        name: string;
        oldState: number;
        newState: number;
      }> = [];

      // TO REMOVE
      data.push({
        name: 'Test',
        group: 'Graminé',
        latinName: 'rosa rosa rose',
        state: 0,
      });

      for (const pollenData of data) {
        try {
          const existingPollen = await this.em.findOneOrFail(PollenEntity, {
            name: pollenData.name,
          });
          // Pollen exist in database
          if (existingPollen.state !== pollenData.state) {
            stateChanges.push({
              name: existingPollen.name,
              oldState: existingPollen.state,
              newState: pollenData.state,
            });

            existingPollen.state = pollenData.state;
            await this.em.flush();
          }
        } catch (error) {
          // Pollen do not exist in database. Create it
          const pollenEntity = this.em.create(PollenEntity, pollenData);
          await this.em.persistAndFlush(pollenEntity);
        }
      }

      console.log(stateChanges);
    } catch (error) {
      this.logger.error(`Error in getPollenNotifications: ${error.message}`);
    }
  }
}
