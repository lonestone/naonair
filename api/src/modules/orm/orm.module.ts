import { MikroORM } from '@mikro-orm/core';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Inject, Logger, Module, OnApplicationBootstrap } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import mikroOrmConfig from '../../configs/mikro-orm.config';
import ormConfig from './orm.config';

@Module({
  imports: [
    MikroOrmModule.forRoot({
      ...mikroOrmConfig,
    }),
  ],
})
export class OrmModule implements OnApplicationBootstrap {
  logger = new Logger('OrmModule');

  constructor(
    private readonly orm: MikroORM,
    @Inject(ormConfig.KEY)
    private readonly _ormConfig: ConfigType<typeof ormConfig>,
  ) {}

  async checkDatabase() {
    const isConnect = await this.orm.isConnected();

    const connectionFail = () => {
      this.logger.error(
        `Unable to connect to the database ${this.orm.config.getClientUrl(
          true,
        )}`,
      );

      process.exit(1);
    };

    const connectionSuccess = () => {
      this.logger.log(
        `Connected to the database ${this.orm.config.getClientUrl(true)}`,
      );
    };

    !isConnect ? connectionFail() : connectionSuccess();
  }

  async checkSync() {
    if (!this._ormConfig.sync) {
      return;
    }

    this.logger.log('Update database schema...');
    await this.orm
      .getSchemaGenerator()
      .updateSchema(undefined, undefined, undefined, true);
  }

  async onApplicationBootstrap() {
    await this.checkDatabase();
    await this.checkSync();
  }

  async flush() {
    await this.orm.em.flush();
  }
}
