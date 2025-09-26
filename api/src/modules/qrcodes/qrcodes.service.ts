import { Injectable } from '@nestjs/common';
import * as QRCode from 'qrcode';

export interface QRCodeOptions {
  format: 'png' | 'svg';
  size?: number;
}

@Injectable()
export class QRCodesService {
  private readonly baseUrl = 'https://naonair.app/poi/';

  async generateQRCode(poiId: number, options: QRCodeOptions): Promise<Buffer | string> {
    const url = `${this.baseUrl}${poiId}`;

    if (options.format === 'png') {
      return await this.generatePNG(url, options.size || 256);
    } else {
      return await this.generateSVG(url);
    }
  }

  private async generatePNG(url: string, size: number): Promise<Buffer> {
    return await QRCode.toBuffer(url, {
      type: 'png',
      width: size,
      margin: 1,
      color: {
        dark: '#000000',
        light: '#FFFFFF00', // Transparent background
      },
    });
  }

  private async generateSVG(url: string): Promise<string> {
    return await QRCode.toString(url, {
      type: 'svg',
      width: 256,
      margin: 1,
      color: {
        dark: '#000000',
        light: '#FFFFFF00', // Transparent background
      },
    });
  }
}