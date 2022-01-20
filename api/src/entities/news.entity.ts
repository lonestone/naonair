import { Entity, PrimaryKey, Property } from '@mikro-orm/core';
import { Exclude, Expose } from 'class-transformer';
import { v4 } from 'uuid';

@Entity()
export class NewsEntity {
  @PrimaryKey({ type: 'uuid' })
  uuid: string = v4();

  @Property()
  content: string;

  @Exclude()
  @Property({ nullable: true })
  test?: string | undefined;

  @Expose()
  get calculatedValue(): string {
    return `It is a calculated value, not in BD yeeaah`;
  }

  @Expose()
  valueNotInBd?: string;

  constructor(partial: Partial<NewsEntity>) {
    Object.assign(this, partial);
  }
}
