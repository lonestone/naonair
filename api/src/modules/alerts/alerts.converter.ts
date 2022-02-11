import { Injectable } from '@nestjs/common';
import { AlertDTO } from '@aireal/dtos';

@Injectable()
export class AlertsConverterService {
  public toDTO = (alert: any): AlertDTO => ({
    id: alert.id,
    startDate: alert.date_heure_debut,
    endDate: alert.date_heure_fin,
    pollutant: alert.polluant,
    seuil: alert.seuil,
    color: alert.couleur,
  });
}
