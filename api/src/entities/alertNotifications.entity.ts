import { Entity, PrimaryKey, Property, Unique } from '@mikro-orm/core';
import { v4 } from 'uuid';

@Entity()
export class AlertNotificationsEntity {
  @PrimaryKey({ type: 'uuid' })
  @Unique()
  uuid: string = v4();

  @Property()
  fcmToken: string;

  constructor(partial: Partial<AlertNotificationsEntity>) {
    Object.assign(this, partial);
  }
}
