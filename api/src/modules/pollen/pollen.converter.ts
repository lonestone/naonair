import { PollenDTO } from '@aireal/dtos';
import { Injectable } from '@nestjs/common';
import { PollenEntity } from 'src/entities/pollen.entity';

// This is the type return by the api
export type PollenSpecie = {
  name: string;
  latin_name: string;
  group: string;
  state: number;
};

@Injectable()
export class PollenConverterService {
  public toDTO = (pollen: PollenSpecie): PollenDTO => ({
    name: pollen.name,
    latinName: pollen.latin_name,
    group: pollen.group,
    state: pollen.state,
  });

  public fromEntityToDTO = (pollen: PollenEntity): PollenDTO => pollen;
}
