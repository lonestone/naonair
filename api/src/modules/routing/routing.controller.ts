import { GetCustomRouteQualityInput, RoutingProfile } from '@aireal/dtos/dist';
import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ParseProfilePipe } from 'src/pipes/ParseProfile.pipe';
import { ValidatePoint } from 'src/pipes/ValidatePoint';
import { ValidatePoints } from 'src/pipes/ValidatePoints';
import { RoutingService } from './routing.service';

@Controller('routing')
export class RoutingController {
  constructor(private readonly routingService: RoutingService) { }

  @Get('/v2')
  async routeV2(
    @Query('points', ValidatePoints) points: string[],
    @Query('profile', ParseProfilePipe)
    profile: RoutingProfile,
  ) {
    return this.routingService.route(points, profile);
  }

  @Get()
  async routeV1(
    @Query('startPoint', ValidatePoint) startPoint: string,
    @Query('endPoint', ValidatePoint) endPoint: string,
    @Query('profile', ParseProfilePipe)
    profile: RoutingProfile,
  ) {
    return this.routingService.route([startPoint, endPoint], profile);
  }

  @Post('/custom/quality')
  async customRouteQuality(@Body() input: GetCustomRouteQualityInput) {
    const res = await this.routingService.customRouteQuality(input);

    return { value: res };
  }

  @Post('/custom/forecast')
  async customRouteForecast(@Body() input: GetCustomRouteQualityInput) {
    const res = await this.routingService.customRouteForecast(input);

    return res;
  }
}
