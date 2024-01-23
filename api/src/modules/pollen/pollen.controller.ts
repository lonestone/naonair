import { PollenDTO } from '@aireal/dtos';
import { Controller, Get, Param } from '@nestjs/common';
import { PollenService } from './pollen.service';

@Controller('pollen')
export class PollenController {
  constructor(private readonly pollenService: PollenService) {}

  @Get()
  async findAll(): Promise<PollenDTO[]> {
    return this.pollenService.fetchAll();
  }

  @Get(':name')
  async findByName(@Param('name') name: string): Promise<PollenDTO> {
    return this.pollenService.findByName(name);
  }
}
