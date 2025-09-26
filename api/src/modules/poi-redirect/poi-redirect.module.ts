import { Module } from '@nestjs/common';
import { PoiRedirectController } from './poi-redirect.controller';

@Module({
  controllers: [PoiRedirectController],
})
export class PoiRedirectModule {}