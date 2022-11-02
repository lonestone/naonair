import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { RoutingController } from './routing.controller';
import { RoutingService } from './routing.service';

@Module({
  imports: [HttpModule],
  controllers: [RoutingController],
  providers: [RoutingService],
})
export class RoutingModule {}
