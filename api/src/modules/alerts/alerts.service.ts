import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityManager, EntityRepository } from '@mikro-orm/postgresql';
import { HttpService } from '@nestjs/axios';
import {
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  OnApplicationBootstrap,
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { Cron } from '@nestjs/schedule';
import { log } from 'console';
import { catchError, lastValueFrom, map, throwError } from 'rxjs';
import appConfig from 'src/configs/app.config';
import { AlertsEntity } from 'src/entities/alerts.entity';
import { AlertsNotificationService } from '../alertsNotification/alertsNotification.service';
import { AlertsConverterService } from './alerts.converter';

@Injectable()
export class AlertsService implements OnApplicationBootstrap {
  constructor(
    @Inject(appConfig.KEY)
    private readonly _appConfig: ConfigType<typeof appConfig>,
    private httpService: HttpService,
    private converter: AlertsConverterService,
    private readonly em: EntityManager,
    @InjectRepository(AlertsEntity)
    public readonly pollenRepo: EntityRepository<AlertsEntity>,
    private readonly alertNotificationService: AlertsNotificationService,
  ) {}
  logger = new Logger('AlertsModule');

  async onApplicationBootstrap() {
    this.getAlertsNotifications();
  }

  public async fetchAll() {
    const alerts = await this.em.find(AlertsEntity, {});
    return alerts.map((alert) => {
      return this.converter.toDTO(alert);
    });
  }

  async fetchAllFromAPI() {
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
      )
      .pipe(catchError((err) => throwError(() => log(err))));
  }

  @Cron('0 4 * * *')
  async getAlertsNotifications() {
    Logger.log('Fetching alerts from API');
    const now = new Date();
    try {
      // lastValueFrom get Observable data and not all the observable.
      const data = await lastValueFrom(await this.fetchAllFromAPI());
      const firstAlert = data[0];

      // Get alert in database
      let alert = await this.em.fork().findOne(AlertsEntity, {
        id: firstAlert.id,
      });

      // And save the alert if not existing
      if (alert === null) {
        alert = this.em.create(AlertsEntity, {
          ...firstAlert,
          notificationSent: false,
        });
        await this.em.persistAndFlush(alert);
      }

      // Send notification and update alert if it is time
      if (
        alert.startDate <= now &&
        alert.endDate >= now &&
        !alert.notificationSent
      ) {
        alert.notificationSent = true;
        await this.em.persistAndFlush(alert);

        // Send notification to all subscribed users
        this.alertNotificationService.sendNotification(alert);
      }

      // Alert do not exist in database. Create it
    } catch (error) {
      this.logger.error('Error fetching alerts from API');
    }
  }
}
