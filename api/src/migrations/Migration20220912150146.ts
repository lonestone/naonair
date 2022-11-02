import { Migration } from '@mikro-orm/migrations';

export class Migration20220912150146 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "news_entity" add column "title" varchar(255) null;');

    this.addSql('alter table "news_entity" add constraint "news_entity_uuid_unique" unique ("uuid");');
  }

}
