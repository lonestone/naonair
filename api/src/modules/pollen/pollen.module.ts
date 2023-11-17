import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { PollenController } from './pollen.controller';
import { PollenConverterService } from './pollen.converter';
import { PollenService } from './pollen.service';

@Module({
  imports: [HttpModule],
  controllers: [PollenController],
  providers: [PollenService, PollenConverterService],
})
export class PollenModule {}
