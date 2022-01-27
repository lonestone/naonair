import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { AlertsController } from './alerts.controller';
import { AlertsConverterService } from './alerts.converter';
import { AlertsService } from './alerts.service';

@Module({
  imports: [HttpModule],
  controllers: [AlertsController],
  providers: [AlertsService, AlertsConverterService],
})
export class AlertsModule {}
