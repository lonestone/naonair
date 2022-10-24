import { RoutingProfile } from '@aireal/dtos/dist';
import { Controller, Get, Query } from '@nestjs/common';
import { ParseProfilePipe } from 'src/pipes/ParseProfile.pipe';
import { ValidatePoint } from 'src/pipes/ValidatePoint';
import { ValidatePoints } from 'src/pipes/ValidatePoints';
import { RoutingService } from './routing.service';

@Controller('routing')
export class RoutingController {
  constructor(private readonly routingService: RoutingService) {}

  @Get('/v2')
  async routeV2(
    @Query('points', ValidatePoints) points: string[],
    @Query('profile', ParseProfilePipe)
    profile: RoutingProfile,
  ) {
    return this.routingService.route(points, profile);
  }

  @Get('/v1')
  async routeV1(
    @Query('startPoint', ValidatePoint) startPoint: string,
    @Query('endPoint', ValidatePoint) endPoint: string,
    @Query('profile', ParseProfilePipe)
    profile: RoutingProfile,
  ) {
    return this.routingService.route([startPoint, endPoint], profile);
  }
}
