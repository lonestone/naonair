import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityManager, EntityRepository } from '@mikro-orm/postgresql';
import { Injectable, Logger } from '@nestjs/common';

import { PollenEntity } from 'src/entities/pollen.entity';
import { PollenNotificationEntity } from 'src/entities/pollenNotifications.entity';
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

  public async sendNotificationsFor(updatedPollen: UpdatePollenType) {
    console.log('Ya des changements pour ');
    console.log(updatedPollen);
    // Only take care of pollen wher the new state is 1
    const pollenAlerts = updatedPollen.filter((p) => p.newState === 1);
    console.log('On garde');
    console.log(pollenAlerts);

    // Find all token for this pollen kind
    for (const pollenAlert of pollenAlerts) {
      const pollenEntity = await this.em.findOne(PollenEntity, {
        name: pollenAlert.name,
      });

      if (pollenEntity) {
        const pollenNotifications = await this.em.find(
          PollenNotificationEntity,
          {
            polen: pollenEntity,
          },
        );

        this.sendNotifications(pollenNotifications);
      }
    }
  }

  private sendNotifications(pollenNotifications: PollenNotificationEntity[]) {
    console.log('=====>');
    for (const pollenNotification of pollenNotifications) {
      console.log(pollenNotification);
    }
  }
}
