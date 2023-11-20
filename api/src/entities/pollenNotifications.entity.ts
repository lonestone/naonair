import {
  Entity,
  IdentifiedReference,
  ManyToOne,
  PrimaryKey,
  Property,
  Unique,
} from '@mikro-orm/core';
import { v4 } from 'uuid';
import { Pollen } from './pollen.entity';

@Entity()
export class PollenNotifications {
  @PrimaryKey({ type: 'uuid' })
  @Unique()
  uuid: string = v4();

  @Property()
  fcmToken: string;

  @ManyToOne(() => Pollen, { onDelete: 'CASCADE', primary: true })
  polen: IdentifiedReference<Pollen>;

  constructor(partial: Partial<PollenNotifications>) {
    Object.assign(this, partial);
  }
}
