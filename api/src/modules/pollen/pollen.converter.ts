import { PollenDTO } from '@aireal/dtos';
import { Injectable } from '@nestjs/common';
import { PollenEntity } from 'src/entities/pollen.entity';

@Injectable()
export class PollenConverterService {
  public toDTO = (pollen: any): PollenDTO => ({
    name: pollen.name,
    latinName: pollen.latin_name,
    group: pollen.group,
    state: pollen.state,
  });

  public fromEntityToDTO = (pollen: PollenEntity): PollenDTO => pollen;
}
