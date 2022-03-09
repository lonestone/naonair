import { RoutingProfile } from '@aireal/dtos/dist';
import { PipeTransform, BadRequestException, Injectable } from '@nestjs/common';

@Injectable()
export class ParseProfilePipe implements PipeTransform {
  transform(value: any) {
    if (!Object.values(RoutingProfile).includes(value)) {
      throw new BadRequestException(
        'Validation failed : ' + value + ' is not valid',
      );
    }
    return value;
  }
}