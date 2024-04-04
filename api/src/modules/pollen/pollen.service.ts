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
import {
  PollenNotificationService,
  UpdatePollenType,
} from '../pollenNotification/pollenNotification.service';
import { PollenConverterService, PollenSpecie } from './pollen.converter';

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
    private readonly pollenNotificationService: PollenNotificationService,
  ) {}

  async onApplicationBootstrap() {
    this.getPollenNotifications();
  }

  async findByName(name: string): Promise<PollenDTO> {
    const pollen = await this.pollenRepo.findOne({ name });
    if (!pollen) {
      throw new NotFoundException(HttpErrors.POLLEN_NOT_FOUND);
    }
    return this.converter.fromEntityToDTO(pollen);
  }

  public async fetchAll() {
    const pollens = await this.em.find(PollenEntity, {});
    return pollens.map((pollen) => {
      return this.converter.fromEntityToDTO(pollen);
    });
  }

  public async getStatesFromApi() {
    if (!this._appConfig.pollenUrl) {
      this.logger.error('No url set for pollen url');
      throw new InternalServerErrorException();
    }

    return this.httpService
      .get(`${this._appConfig.pollenUrl}states`, {
        headers: { Authorization: `Token ${this._appConfig.pollenToken}` },
      })
      .pipe(
        map((response) => {
          return response.data as Record<number, string>;
        }), // Utilise le pipe map pour extraire les données de la réponse
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

  async fetchAllFromAPI() {
    if (!this._appConfig.pollenUrl) {
      this.logger.error('No url set for pollen url');
      throw new InternalServerErrorException();
    }

    return this.httpService
      .get(`${this._appConfig.pollenUrl}gardens/NA44`, {
        headers: { Authorization: `Token ${this._appConfig.pollenToken}` },
      })
      .pipe(
        map((axiosResponse) => {
          if (axiosResponse) {
            return axiosResponse.data.species.map((species: PollenSpecie) => {
              return this.converter.toDTO(species);
            });
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

  @Cron('0 16 * * *')
  async getPollenNotifications() {
    try {
      // lastValueFrom get Observable data and not all the observable.
      const data = await lastValueFrom(await this.fetchAllFromAPI());

      const stateChanges: UpdatePollenType = [];

      // Check all pollen from the api
      for (const pollenData of data) {
        try {
          const existingPollen = await this.em
            .fork()
            .findOneOrFail(PollenEntity, {
              name: pollenData.name,
            });
          // Pollen exist in database : update only if needed
          if (existingPollen.state !== pollenData.state) {
            stateChanges.push({
              name: existingPollen.name,
              newState: pollenData.state,
            });

            existingPollen.state = pollenData.state;
            await this.em.persistAndFlush(existingPollen);
          }
        } catch (error) {
          // Pollen do not exist in database. Create it
          const pollenEntity = this.em.create(PollenEntity, pollenData);
          await this.em.persistAndFlush(pollenEntity);
        }
      }

      this.logger.debug(
        `Pollen state changes: ${JSON.stringify(stateChanges)}`,
      ); // Log the state changes

      //Send notifications only for needed pollen
      if (stateChanges.length > 0)
        this.pollenNotificationService.sendNotificationsFor(stateChanges);
    } catch (error) {
      if (!error)
        this.logger.error(
          `Error in getPollenNotifications: please check if airpollen is down`,
        );
      else {
        this.logger.error(`Error in getPollenNotifications:  ${error.message}`);
      }
    }
  }
}
