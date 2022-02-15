import { MikroORM } from '@mikro-orm/core';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Inject, Logger, Module, OnApplicationBootstrap } from '@nestjs/common';
import { ConfigModule, ConfigService, ConfigType } from '@nestjs/config';
import mikroOrmConfig from 'src/mikro-orm.config';
import ormConfig from '../../configs/orm.config';

@Module({
  imports: [
    MikroOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        ...mikroOrmConfig,
        clientUrl: configService.get<string>('orm.clientUrl'),
      }),
      inject: [ConfigService],
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

  getOrm = () => this.orm;

  async checkSync() {
    if (!this._ormConfig.sync) {
      return;
    }

    this.logger.warn('Update database schema...');
    await this.orm
      .getSchemaGenerator()
      .updateSchema(undefined, undefined, undefined, true);
  }

  async onApplicationBootstrap() {
    await this.checkDatabase();
    await this.clearDB();
    await this.checkSync();
  }

  async flush() {
    await this.orm.em.flush();
  }

  async clearDB() {
    if (!this._ormConfig.dropDB) {
      return;
    }
    this.logger.warn('Drop database...');
    await this.orm.getSchemaGenerator().dropSchema();
  }
}
