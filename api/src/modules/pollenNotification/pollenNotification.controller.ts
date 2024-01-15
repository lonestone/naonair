import { PollenNotificationDTO } from '@aireal/dtos';
import { Controller, Get, Param } from '@nestjs/common';
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
}
