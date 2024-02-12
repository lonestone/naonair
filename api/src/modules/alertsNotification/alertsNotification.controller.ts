import { UpdateAlertNotificationDTO } from '@aireal/dtos';
import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { AlertsNotificationService } from './alertsNotification.service';

@Controller('alertsNotification')
export class AlertsNotificationController {
  constructor(
    private readonly alertsNotificationsService: AlertsNotificationService,
  ) {}

  @Get(':fcmToken')
  async findByToken(@Param('fcmToken') token: string): Promise<boolean> {
    return this.alertsNotificationsService.findByToken(token);
  }

  @Post()
  async subscribe(@Body() addToken: UpdateAlertNotificationDTO): Promise<void> {
    return this.alertsNotificationsService.add(addToken.fcmToken);
  }

  @Delete()
  async unsubscribe(
    @Body() deleteToken: UpdateAlertNotificationDTO,
  ): Promise<void> {
    return this.alertsNotificationsService.delete(deleteToken.fcmToken);
  }
}
