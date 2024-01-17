export enum PollenNotificationStatus { 
  active = 'active',
  disabled = 'disabled'
}

export class PollenNotificationDTO {
  pollen: string;
  status?: 'active' | 'disabled';
  fcmToken?: string
}
