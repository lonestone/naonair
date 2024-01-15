import { Migration } from '@mikro-orm/migrations';

export class Migration20240112102028 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "pollen_entity" ("name" varchar(255) not null, "latin_name" varchar(255) not null, "group" varchar(255) not null, "state" int4 not null);');
    this.addSql('alter table "pollen_entity" add constraint "pollen_entity_pkey" primary key ("name");');

    this.addSql('create table "pollen_notifications" ("uuid" uuid not null, "polen_name" varchar(255) not null, "fcm_token" varchar(255) not null);');
    this.addSql('alter table "pollen_notifications" add constraint "pollen_notifications_uuid_unique" unique ("uuid");');
    this.addSql('alter table "pollen_notifications" add constraint "pollen_notifications_pkey" primary key ("uuid", "polen_name");');

    this.addSql('alter table "pollen_notifications" add constraint "pollen_notifications_polen_name_foreign" foreign key ("polen_name") references "pollen_entity" ("name") on update cascade on delete CASCADE;');
  }

}
