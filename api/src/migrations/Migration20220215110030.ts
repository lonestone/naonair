import { Migration } from '@mikro-orm/migrations';

export class Migration20220215110030 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "news_entity" ("uuid" uuid not null, "type" text check ("type" in (\'none\', \'goodPractice\', \'announcement\', \'info\', \'event\', \'warning\')) not null, "message" varchar(200) not null, "start_date" date not null, "end_date" date not null, "link" varchar(255) null, "link_title" varchar(255) null, "display_period" bool not null);');
    this.addSql('alter table "news_entity" add constraint "news_entity_pkey" primary key ("uuid");');
  }

}
