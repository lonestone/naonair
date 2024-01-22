import { IsBoolean, IsString } from "class-validator";

export class PollenNotificationDTO {
  pollen: string;
  status: boolean;
  fcmToken: string
}

export class UpdatePollenNotificationDTO {
  @IsString() pollen: string;
  @IsBoolean()status: boolean;
  @IsString()fcmToken: string
}

