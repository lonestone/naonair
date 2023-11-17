import { Controller, Get } from '@nestjs/common';
import { PollenService } from './pollen.service';

@Controller('pollen')
export class PollenController {
  constructor(private readonly pollenService: PollenService) {}

  @Get()
  async findAll() /*: Promise<PollenDTO[]>*/ {
    return this.pollenService.fetchAll();
  }
}
