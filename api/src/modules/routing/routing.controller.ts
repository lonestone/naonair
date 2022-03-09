import {
  Controller,
  Get,
  Param,
  ParseEnumPipe,
  ParseFloatPipe,
  Query,
} from '@nestjs/common';
import { RoutingService } from './routing.service';
import { RoutingProfile } from '@aireal/dtos/dist';
import { ParseProfilePipe } from 'src/pipes/ParseProfile.pipe';
import { ValidatePoint } from 'src/pipes/ValidatePoint';

@Controller('routing')
export class RoutingController {
  constructor(private readonly routingService: RoutingService) {}

  @Get()
  async route(
    @Query('startPoint', ValidatePoint) startPoint: string,
    @Query('endPoint', ValidatePoint) endPoint: string,
    @Query('profile', ParseProfilePipe)
    profile: RoutingProfile,
  ) {
    return this.routingService.route(startPoint, endPoint, profile);
  }
}
