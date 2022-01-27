import { Injectable } from '@nestjs/common';
import { AlertDTO } from 'src/dtos/alert.dto';
import { NewsEntity } from 'src/entities/news.entity';

@Injectable()
export class AlertsConverterService {
  public toDTO = (alert: any): AlertDTO => ({
    id: alert.id,
    startDate: alert.date_heure_debut,
    endDate: alert.date_heure_fin,
    pollutant: alert.polluant,
    color: alert.couleur,
  });
}
