import { Injectable } from '@nestjs/common';
import { AlertDTO } from '@aireal/dtos';

@Injectable()
export class AlertsConverterService {
  public toDTO = (alert: any): AlertDTO => ({
    id: alert.id,
    startDate: new Date(alert.date_heure_debut),
    endDate: new Date(alert.date_heure_fin),
    pollutant: alert.polluant,
    seuil: alert.seuil,
    color: alert.couleur,
  });
}
