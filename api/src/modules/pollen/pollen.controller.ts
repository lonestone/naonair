import { PollenDTO } from '@aireal/dtos';
import { Controller, Get, Param } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';
import { PollenService } from './pollen.service';

@Controller('pollen')
export class PollenController {
  constructor(private readonly pollenService: PollenService) {}

  @Get()
  async findAll(): Promise<PollenDTO[]> {
    return this.pollenService.fetchAll();
  }

  @Get('states')
  async getStates(): Promise<Record<number, string>> {
    return await lastValueFrom(await this.pollenService.getStatesFromApi());
  }

  @Get(':name')
  async findByName(@Param('name') name: string): Promise<PollenDTO> {
    return this.pollenService.findByName(name);
  }
}
