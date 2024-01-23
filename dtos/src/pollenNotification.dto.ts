import { IsBoolean, IsString } from "class-validator";

export class PollenNotificationDTO {
  pollen: string;
  isEnabled: boolean;
  fcmToken: string
}

export class UpdatePollenNotificationDTO {
  @IsString() pollen: string;
  @IsBoolean()isEnabled: boolean;
  @IsString()fcmToken: string
}

