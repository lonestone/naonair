import { PollenDTO } from '@aireal/dtos';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PollenConverterService {
  public toDTO = (species: any): PollenDTO => ({
    name: species.name,
    latinName: species.latin_name,
    group: species.group,
    state: species.state,
  });
}
