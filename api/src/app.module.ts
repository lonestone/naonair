import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AppController } from './app.controller';
import appConfig from './configs/app.config';
import authConfig from './configs/auth.config';
import ormConfig from './configs/orm.config';
import sentryConfig from './configs/sentry.config';
import { AlertsModule } from './modules/alerts/alerts.module';
import { AlertNotificationsModule } from './modules/alertsNotification/alertsNotification.module';
import { AuthModule } from './modules/auth/auth.module';
import { FirebaseModule } from './modules/firebase/firebase.module';
import { NewsModule } from './modules/news/news.module';
import { OrmModule } from './modules/orm/orm.module';
import { PollenModule } from './modules/pollen/pollen.module';
import { PollenNotificationModule } from './modules/pollenNotification/pollenNotification.module';
import { QRCodesModule } from './modules/qrcodes/qrcodes.module';
import { RoutingModule } from './modules/routing/routing.module';
import { SentryModule } from './modules/sentry/sentry.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [ormConfig, appConfig, sentryConfig, authConfig],
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
      serveStaticOptions: { index: false },
    }),
    NewsModule,
    OrmModule,
    SentryModule,
    AuthModule,
    AlertsModule,
    PollenModule,
    RoutingModule,
    FirebaseModule,
    PollenNotificationModule,
    AlertNotificationsModule,
    QRCodesModule,
  ],
  controllers: [AppController],
})
export class AppModule { }
