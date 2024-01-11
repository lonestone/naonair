import { MikroOrmModule } from '@mikro-orm/nestjs/mikro-orm.module';
import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { PollenEntity } from 'src/entities/pollen.entity';
import { PollenController } from './pollen.controller';
import { PollenConverterService } from './pollen.converter';
import { PollenService } from './pollen.service';

@Module({
  imports: [MikroOrmModule.forFeature([PollenEntity]), HttpModule],
  controllers: [PollenController],
  providers: [PollenService, PollenConverterService],
})
export class PollenModule {}
