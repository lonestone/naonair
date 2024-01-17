import { PollenNotificationDTO } from '@aireal/dtos';
import { Injectable } from '@nestjs/common';
import { PollenNotificationEntity } from 'src/entities/pollenNotifications.entity';

@Injectable()
export class PollenNotificationConverterService {
  public fromEntityToDTO = (
    pollenNotification: PollenNotificationEntity,
  ): PollenNotificationDTO => ({
    pollen: pollenNotification.pollen.unwrap().name,
  });
}
