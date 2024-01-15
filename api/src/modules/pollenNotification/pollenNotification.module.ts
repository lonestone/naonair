import { MikroOrmModule } from '@mikro-orm/nestjs/mikro-orm.module';
import { Module } from '@nestjs/common';

import { PollenEntity } from 'src/entities/pollen.entity';
import { PollenNotificationEntity } from 'src/entities/pollenNotifications.entity';
import { FirebaseService } from '../firebase/firebase.service';
import { PollenNotificationService } from './pollenNotification.service';

@Module({
  imports: [
    MikroOrmModule.forFeature([PollenEntity, PollenNotificationEntity]),
  ],
  providers: [PollenNotificationService, FirebaseService],
})
export class PollenNotificationModule {}
