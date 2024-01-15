import { MikroOrmModule } from '@mikro-orm/nestjs/mikro-orm.module';
import { Module } from '@nestjs/common';

import { PollenEntity } from 'src/entities/pollen.entity';
import { PollenNotificationEntity } from 'src/entities/pollenNotifications.entity';
import { FirebaseService } from '../firebase/firebase.service';
import { PollenNotificationController } from './pollenNotification.controller';
import { PollenNotificationConverterService } from './pollenNotification.converter';
import { PollenNotificationService } from './pollenNotification.service';

@Module({
  imports: [
    MikroOrmModule.forFeature([PollenEntity, PollenNotificationEntity]),
  ],
  controllers: [PollenNotificationController],
  providers: [
    PollenNotificationService,
    FirebaseService,
    PollenNotificationConverterService,
  ],
})
export class PollenNotificationModule {}
