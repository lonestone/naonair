import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityManager, EntityRepository } from '@mikro-orm/postgresql';
import { Injectable, Logger } from '@nestjs/common';

import { AlertNotificationsEntity } from 'src/entities/alertNotifications.entity';
import { AlertsEntity } from 'src/entities/alerts.entity';
import { FirebaseService } from '../firebase/firebase.service';

@Injectable()
export class AlertsNotificationService {
  logger = new Logger('AlertsNotificationModule');

  constructor(
    private readonly firebaseService: FirebaseService,
    @InjectRepository(AlertsEntity)
    public readonly alertsRepo: EntityRepository<AlertsEntity>,
    private readonly em: EntityManager,
  ) {}

  public async findByToken(token: string) {
    const subsciption = await this.em.findOne(AlertNotificationsEntity, {
      fcmToken: token,
    });
    return subsciption !== null;
  }

  public async add(token: string) {
    let sub = await this.em.findOne(AlertNotificationsEntity, {
      fcmToken: token,
    });

    if (sub === null) {
      sub = await this.em.create(AlertNotificationsEntity, {
        fcmToken: token,
      });
      await this.em.persistAndFlush(sub);
    }
  }

  public async delete(token: string) {
    const sub = await this.em.findOne(AlertNotificationsEntity, {
      fcmToken: token,
    });

    if (sub !== null) {
      this.em.remove(sub);
      await this.em.flush();
    }
  }

  public async sendNotification(alert: AlertsEntity) {
    const subs = await this.em.find(AlertNotificationsEntity, {});
    const tokens = subs.map((sub) => sub.fcmToken);
    for (const token of tokens) {
      await this.firebaseService.sendPushNotification(
        token,
        'Un épisode de pollution par les particules et ozone est actuellement en cours',
        '',
      );
    }
  }
}
