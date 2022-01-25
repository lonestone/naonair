import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import appConfig from './configs/app.config';
import sentryConfig from './configs/sentry.config';
import { NewsModule } from './modules/news/news.module';
import ormConfig from './configs/orm.config';
import { OrmModule } from './modules/orm/orm.module';
import { SentryModule } from './modules/sentry/sentry.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [ormConfig, appConfig, sentryConfig],
    }),
    NewsModule,
    OrmModule,
    SentryModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
