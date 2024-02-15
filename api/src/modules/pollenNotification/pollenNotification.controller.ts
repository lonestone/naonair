import {
  PollenNotificationDTO,
  UpdatePollenNotificationDTO,
} from '@aireal/dtos';
import { Body, Controller, Get, Param, Patch } from '@nestjs/common';
import { ParseAlphaNumTokenPipe } from 'src/pipes/ParseAlphaNumToken.pipe';
import { PollenNotificationService } from './pollenNotification.service';

@Controller('pollenNotification')
export class PollenNotificationController {
  constructor(private readonly pollenService: PollenNotificationService) {}

  @Get(':fcmToken')
  async findByToken(
    @Param('fcmToken', ParseAlphaNumTokenPipe) token: string,
  ): Promise<Array<PollenNotificationDTO>> {
    return this.pollenService.findByToken(token);
  }

  @Patch()
  async updateNotification(
    @Body() notificationDTO: UpdatePollenNotificationDTO,
  ): Promise<void> {
    return this.pollenService.updateNotification(notificationDTO);
  }
}
