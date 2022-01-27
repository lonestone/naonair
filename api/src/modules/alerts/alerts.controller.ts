import { Controller, Get } from '@nestjs/common';
import { AlertDTO } from 'src/dtos/alert.dto';
import { AlertsService } from './alerts.service';

@Controller('alerts')
export class AlertsController {
  constructor(private readonly alertsService: AlertsService) {}

  @Get()
  async findAll() /*: Promise<AlertDTO[]>*/ {
    return this.alertsService.fetchAll();
  }
}
