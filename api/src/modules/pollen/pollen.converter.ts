import { PollenDTO } from '@aireal/dtos';
import { Injectable } from '@nestjs/common';
import { PollenEntity } from 'src/entities/pollen.entity';

@Injectable()
export class PollenConverterService {
  public toDTO = (specie: any): PollenDTO => ({
    name: specie.name,
    latinName: specie.latin_name,
    group: specie.group,
    state: specie.state,
  });

  public fromEntityToDTO = (specie: PollenEntity): PollenDTO => specie;
}
