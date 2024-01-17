import { PollenNotificationDTO } from '@aireal/dtos';
import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { PollenNotificationService } from './pollenNotification.service';

@Controller('pollenNotification')
export class PollenNotificationController {
  constructor(private readonly pollenService: PollenNotificationService) {}

  @Get(':fcmToken')
  async findByToken(
    @Param('fcmToken') token: string,
  ): Promise<Array<PollenNotificationDTO>> {
    return await this.pollenService.findByToken(token);
  }

  @Post('update')
  async updateNotification(
    @Body() notificationDTO: PollenNotificationDTO,
  ): Promise<PollenNotificationDTO | void> {
    return await this.pollenService.updateNotification(notificationDTO);
  }
}
