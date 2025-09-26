import { Module } from '@nestjs/common';
import { QRCodesController } from './qrcodes.controller';
import { QRCodesService } from './qrcodes.service';

@Module({
  controllers: [QRCodesController],
  providers: [QRCodesService],
  exports: [QRCodesService],
})
export class QRCodesModule {}