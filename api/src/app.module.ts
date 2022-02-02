import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import appConfig from './configs/app.config';
import sentryConfig from './configs/sentry.config';
import { NewsModule } from './modules/news/news.module';
import ormConfig from './configs/orm.config';
import { OrmModule } from './modules/orm/orm.module';
import { SentryModule } from './modules/sentry/sentry.module';
import { AuthModule } from './modules/auth/auth.module';
import { AlertsModule } from './modules/alerts/alerts.module';
import authConfig from './configs/auth.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [ormConfig, appConfig, sentryConfig, authConfig],
    }),
    NewsModule,
    OrmModule,
    SentryModule,
    AuthModule,
    AlertsModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
