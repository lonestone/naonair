import { Migration } from '@mikro-orm/migrations';

export class Migration20240212125959 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "alerts_entity" ("id" serial primary key, "start_date" timestamptz(0) not null, "end_date" timestamptz(0) not null, "notification_sent" bool not null);');

    this.addSql('create table "alert_notifications_entity" ("uuid" uuid not null, "fcm_token" varchar(255) not null);');
    this.addSql('alter table "alert_notifications_entity" add constraint "alert_notifications_entity_pkey" primary key ("uuid");');
  }

}
