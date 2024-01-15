import { Migration } from '@mikro-orm/migrations';

export class Migration20240115133409 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "pollen_notification_entity" ("uuid" uuid not null, "polen_name" varchar(255) not null, "fcm_token" varchar(255) not null);');
    this.addSql('alter table "pollen_notification_entity" add constraint "pollen_notification_entity_uuid_unique" unique ("uuid");');
    this.addSql('alter table "pollen_notification_entity" add constraint "pollen_notification_entity_pkey" primary key ("uuid", "polen_name");');

    this.addSql('alter table "pollen_notification_entity" add constraint "pollen_notification_entity_polen_name_foreign" foreign key ("polen_name") references "pollen_entity" ("name") on update cascade on delete CASCADE;');

    this.addSql('alter table "pollen_entity" add constraint "pollen_entity_name_unique" unique ("name");');

    this.addSql('alter table "news_entity" add constraint "news_entity_uuid_unique" unique ("uuid");');

    this.addSql('drop table if exists "pollen_notifications" cascade;');
  }

}
