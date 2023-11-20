import { Entity, PrimaryKey, Property, Unique } from '@mikro-orm/core';
import { v4 } from 'uuid';

@Entity()
export class Pollen {
  @PrimaryKey({ type: 'uuid' })
  @Unique()
  uuid: string = v4();

  @Property()
  name: string;

  @Property()
  latinName: string;

  @Property()
  group: string;

  @Property()
  state: number;

  constructor(partial: Partial<Pollen>) {
    Object.assign(this, partial);
  }
}
