import { IsString } from "class-validator";

export class UpdateAlertNotificationDTO {
  @IsString()fcmToken: string
}