import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityManager, EntityRepository } from '@mikro-orm/postgresql';
import { Injectable, Logger, NotFoundException } from '@nestjs/common';

import { HttpErrors, UpdatePollenNotificationDTO } from '@aireal/dtos';
import { PollenEntity } from 'src/entities/pollen.entity';
import { PollenNotificationEntity } from 'src/entities/pollenNotifications.entity';
import { BadTokenError } from 'src/errors/bad-token.error';
import { FirebaseService } from '../firebase/firebase.service';
import { PollenNotificationConverterService } from './pollenNotification.converter';

export type UpdatePollenType = Array<{
  name: string;
  newState: number;
}>;

@Injectable()
export class PollenNotificationService {
  logger = new Logger('PollenNotificationModule');

  constructor(
    private readonly firebaseService: FirebaseService,
    @InjectRepository(PollenEntity)
    public readonly pollenRepo: EntityRepository<PollenEntity>,
    private converter: PollenNotificationConverterService,
    private readonly em: EntityManager,
  ) {}

  public async findByToken(token: string) {
    const notificationsSubscription = await this.em.find(
      PollenNotificationEntity,
      {
        fcmToken: token,
      },
    );
    return notificationsSubscription.map((sub) =>
      this.converter.fromEntityToDTO(sub),
    );
  }

  async updateNotification(
    notificationDTO: UpdatePollenNotificationDTO,
  ): Promise<void> {
    const { pollen, isEnabled, fcmToken } = notificationDTO;

    const existingPollen = await this.em.findOne(PollenEntity, {
      name: pollen,
    });
    if (!existingPollen) {
      throw new NotFoundException(HttpErrors.POLLEN_NOT_FOUND);
    }

    const existingNotification = await this.em.findOne(
      PollenNotificationEntity,
      {
        fcmToken,
        pollen: existingPollen,
      },
    );

    if (isEnabled) {
      if (existingNotification) {
        return;
      }
      //else
      const newPollenNotification = this.em.create(PollenNotificationEntity, {
        fcmToken,
        pollen: existingPollen,
      });
      this.em.persist(newPollenNotification);
      await this.em.flush();
      return;
    } else {
      if (existingNotification) {
        this.em.remove(existingNotification);
        await this.em.flush();
      }
      //else the notification doesn't existe and this is fine
    }
    return;
  }

  public async sendNotificationsFor(updatedPollen: UpdatePollenType) {
    // Only take care of pollen wher the new state is 1
    const pollenAlerts = updatedPollen.filter((p) => p.newState === 1);
    // Find all token for this pollen kind
    for (const pollenAlert of pollenAlerts) {
      const pollenEntity = await this.em.findOne(PollenEntity, {
        name: pollenAlert.name,
      });
      if (pollenEntity) {
        const pollenNotifications = await this.em.find(
          PollenNotificationEntity,
          {
            pollen: pollenEntity,
          },
        );
        await this.sendNotifications(pollenNotifications);
      }
    }
  }

  private async sendNotifications(
    pollenNotifications: PollenNotificationEntity[],
  ) {
    for (const pollenNotification of pollenNotifications) {
      const { name, group } = pollenNotification.pollen.unwrap();
      try {
        await this.firebaseService.sendPushNotification(
          pollenNotification.fcmToken,
          'Alerte Pollen',
          `Une émission du pollen ${name} vient de démarrer`,
        );
      } catch (error) {
        if (error instanceof BadTokenError) {
          await this.deletePollenNotificationsWithToken(error.token);
        }
      }
    }
  }

  private async deletePollenNotificationsWithToken(token: string) {
    const toDeleteNotifications = await this.em.find(PollenNotificationEntity, {
      fcmToken: token,
    });

    for (const toDeleteNotification of toDeleteNotifications) {
      this.em.remove(toDeleteNotification);
    }
    await this.em.flush();
  }
}
