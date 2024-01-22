import {
  PollenNotificationDTO,
  UpdatePollenNotificationDTO,
} from '@aireal/dtos';
import { Body, Controller, Get, Param, Patch } from '@nestjs/common';
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

  @Patch()
  async updateNotification(
    @Body() notificationDTO: UpdatePollenNotificationDTO,
  ): Promise<void> {
    return await this.pollenService.updateNotification(notificationDTO);
  }
}
