import { Controller, Get, Param, Query, Res, ParseIntPipe } from '@nestjs/common';
import { Response } from 'express';
import { QRCodesService, QRCodeOptions } from './qrcodes.service';

@Controller('qrcodes')
export class QRCodesController {
  constructor(private readonly qrCodesService: QRCodesService) {}

  @Get('poi/:id')
  async generatePOIQRCode(
    @Param('id', ParseIntPipe) poiId: number,
    @Query('format') format: 'png' | 'svg' = 'png',
    @Query('size') size: string = '256',
    @Res() res: Response,
  ) {
    const options: QRCodeOptions = {
      format,
      size: parseInt(size, 10),
    };

    try {
      const qrCode = await this.qrCodesService.generateQRCode(poiId, options);

      if (format === 'png') {
        res.setHeader('Content-Type', 'image/png');
        res.setHeader('Content-Disposition', `attachment; filename="poi-${poiId}.png"`);
        res.send(qrCode);
      } else {
        res.setHeader('Content-Type', 'image/svg+xml');
        res.setHeader('Content-Disposition', `attachment; filename="poi-${poiId}.svg"`);
        res.send(qrCode);
      }
    } catch (error) {
      res.status(500).json({
        message: 'Error generating QR code',
        error: error.message,
      });
    }
  }
}