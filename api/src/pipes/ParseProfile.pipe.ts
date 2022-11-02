import { RoutingProfile } from '@aireal/dtos/dist';
import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class ParseProfilePipe implements PipeTransform {
  transform(value: any) {
    if (!Object.values(RoutingProfile).includes(value)) {
      throw new BadRequestException(
        'Validation failed : profile ' + value + ' is not valid',
      );
    }
    return value;
  }
}
