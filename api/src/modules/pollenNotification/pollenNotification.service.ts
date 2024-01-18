import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityManager, EntityRepository } from '@mikro-orm/postgresql';
import {
  Injectable,
  Logger,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';

import {
  HttpErrors,
  PollenNotificationDTO,
  PollenNotificationStatus,
} from '@aireal/dtos';
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
    notificationDTO: PollenNotificationDTO,
  ): Promise<void | PollenNotificationDTO> {
    const { pollen, status, fcmToken } = notificationDTO;

    if (!fcmToken || !status) {
      throw new NotAcceptableException(
        HttpErrors.POLLEN_NOTIFICATION_DTO_FAILED,
      );
    }

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

    switch (status) {
      case PollenNotificationStatus.active:
        if (existingNotification) {
          return this.converter.fromEntityToDTO(existingNotification);
        }
        //else
        const newPollenNotification = this.em.create(PollenNotificationEntity, {
          fcmToken,
          pollen: existingPollen,
        });
        this.em.persist(newPollenNotification);
        await this.em.flush();

        //remove this
        await this.sendNotificationsFor([{ name: 'Aulne', newState: 1 }]);

        return this.converter.fromEntityToDTO(newPollenNotification);
      case PollenNotificationStatus.disabled:
      default:
        if (existingNotification) {
          this.em.remove(existingNotification);
          await this.em.flush();
          return null;
        }
        //else the notification doesn't existe and this is fine
        return null;
    }
  }

  public async sendNotificationsFor(updatedPollen: UpdatePollenType) {
    console.log(updatedPollen);
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
          {
            title: 'Alerte Pollen',
            body: `Une alerte de pollen a été déclanchée pou le polle ${name} du groupe ${group}`,
          },
        );
      } catch (error) {
        if (error instanceof BadTokenError) {
          const toDeleteNotifications = await this.em.find(
            PollenNotificationEntity,
            {
              fcmToken: error.token,
            },
          );

          for (const toDeleteNotification of toDeleteNotifications) {
            this.em.remove(toDeleteNotification);
          }
          await this.em.flush();
        }
      }
    }
  }
}
