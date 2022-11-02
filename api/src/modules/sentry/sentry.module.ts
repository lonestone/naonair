import { Inject, Logger, Module, OnApplicationBootstrap } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import * as Sentry from '@sentry/node';
import sentryConfig from 'src/configs/sentry.config';

@Module({})
export class SentryModule implements OnApplicationBootstrap {
  constructor(
    @Inject(sentryConfig.KEY)
    private readonly _sentryConfig: ConfigType<typeof sentryConfig>,
  ) {}

  private logger = new Logger('SentryModule');

  onApplicationBootstrap() {
    if (this._sentryConfig.env) {
      const param = {
        environment: this._sentryConfig.env,
        dsn: this._sentryConfig.dsn,
      };

      try {
        Sentry.init(param);
        this.logger.log(`Sentry initialized`);
      } catch (e) {
        this.logger.error(
          `Sentry has crashed during initialisation, please check below `,
          e,
        );
      }
    } else {
      this.logger.warn(`Sentry is not initialized, please check .env / logs`);
    }
  }
}
