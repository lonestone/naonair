import { NewsType } from '@aireal/dtos/dist/news.dto';
import {
  DateType,
  Entity,
  PrimaryKey,
  Property,
  Unique,
} from '@mikro-orm/core';
import { v4 } from 'uuid';

@Entity()
export class NewsEntity {
  @PrimaryKey({ type: 'uuid' })
  @Unique()
  uuid: string = v4();

  @Property({type: String})
  type: NewsType;

  @Property({ length: 200 })
  message: string;

  @Property({ type: DateType })
  startDate: Date;

  @Property({ type: DateType, nullable: true })
  endDate?: Date;

  @Property({ nullable: true })
  link?: string;

  @Property({ nullable: true })
  linkTitle?: string;

  @Property()
  displayPeriod: boolean;

  constructor(partial: Partial<NewsEntity>) {
    Object.assign(this, partial);
  }
}
