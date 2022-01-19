import { Entity, PrimaryKey, Property } from '@mikro-orm/core';
import { v4 } from 'uuid';

@Entity()
export class NewsEntity {
  @PrimaryKey()
  uuid: string = v4();

  @Property()
  content: string;
}
