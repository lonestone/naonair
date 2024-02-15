import { Entity, PrimaryKey, Property, Unique } from '@mikro-orm/core';

@Entity()
export class AlertsEntity {
  @PrimaryKey({ type: 'number' })
  @Unique()
  id: number;

  @Property({ type: 'Date' })
  startDate: Date;

  @Property({ type: 'Date' })
  endDate: Date;

  @Property()
  notificationSent: boolean;

  constructor(partial: Partial<AlertsEntity>) {
    Object.assign(this, partial);
  }
}
