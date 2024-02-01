import { MikroOrmModule } from '@mikro-orm/nestjs/mikro-orm.module';
import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { PollenEntity } from 'src/entities/pollen.entity';
import { FirebaseService } from '../firebase/firebase.service';
import { PollenNotificationConverterService } from '../pollenNotification/pollenNotification.converter';
import { PollenNotificationModule } from '../pollenNotification/pollenNotification.module';
import { PollenNotificationService } from '../pollenNotification/pollenNotification.service';
import { PollenController } from './pollen.controller';
import { PollenConverterService } from './pollen.converter';
import { PollenService } from './pollen.service';

@Module({
  imports: [
    MikroOrmModule.forFeature([PollenEntity]),
    HttpModule,
    PollenNotificationModule,
  ],
  controllers: [PollenController],
  providers: [
    PollenService,
    PollenConverterService,
    PollenNotificationConverterService,
    PollenNotificationService,
    FirebaseService,
  ],
})
export class PollenModule {}
