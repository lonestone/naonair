import { Migration } from '@mikro-orm/migrations';

export class Migration20240112102857 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "pollen_entity" add constraint "pollen_entity_name_unique" unique ("name");');

    this.addSql('alter table "news_entity" add constraint "news_entity_uuid_unique" unique ("uuid");');
  }

}
