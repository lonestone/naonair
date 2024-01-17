import { Migration } from '@mikro-orm/migrations';

export class Migration20240117134216 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "pollen_notification_entity" rename column "polen_name" to "pollen_name";');


    this.addSql('alter table "pollen_entity" add constraint "pollen_entity_name_unique" unique ("name");');
  }

}
