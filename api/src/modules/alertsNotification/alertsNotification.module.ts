import { MikroOrmModule } from '@mikro-orm/nestjs/mikro-orm.module';
import { Module } from '@nestjs/common';

import { FirebaseService } from '../firebase/firebase.service';

import { AlertNotificationsEntity } from 'src/entities/alertNotifications.entity';
import { AlertsEntity } from 'src/entities/alerts.entity';
import { AlertsNotificationController } from './alertsNotification.controller';
import { AlertsNotificationService } from './alertsNotification.service';

@Module({
  imports: [
    MikroOrmModule.forFeature([AlertsEntity, AlertNotificationsEntity]),
  ],
  controllers: [AlertsNotificationController],
  providers: [AlertsNotificationService, FirebaseService],
})
export class AlertNotificationsModule {}
