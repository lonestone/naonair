import { Entity, PrimaryKey, Property, Unique } from '@mikro-orm/core';

@Entity()
export class PollenEntity {
  @PrimaryKey({ type: 'string' })
  @Unique()
  name: string;

  @Property()
  latinName: string;

  @Property()
  group: string;

  @Property()
  state: number;

  constructor(partial: Partial<PollenEntity>) {
    Object.assign(this, partial);
  }
}
