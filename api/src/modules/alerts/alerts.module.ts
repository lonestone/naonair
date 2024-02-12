import { MikroOrmModule } from '@mikro-orm/nestjs';
import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { AlertsEntity } from 'src/entities/alerts.entity';
import { AlertsNotificationService } from '../alertsNotification/alertsNotification.service';
import { FirebaseService } from '../firebase/firebase.service';
import { AlertsController } from './alerts.controller';
import { AlertsConverterService } from './alerts.converter';
import { AlertsService } from './alerts.service';

@Module({
  imports: [HttpModule, MikroOrmModule.forFeature([AlertsEntity])],
  controllers: [AlertsController],
  providers: [
    AlertsService,
    AlertsConverterService,
    FirebaseService,
    AlertsNotificationService,
  ],
})
export class AlertsModule {}
