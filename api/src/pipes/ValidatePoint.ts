import { PipeTransform, BadRequestException, Injectable } from '@nestjs/common';

@Injectable()
export class ValidatePoint implements PipeTransform {
  transform(value: any) {
    const regex = new RegExp(/[0-9]*\.[0-9]*,-{0,1}[0-9]*\.[0-9]*/g);

    if (value.match(regex)[0] !== value) {
      throw new BadRequestException(
        'Validation failed : ' + value + ' is not a point',
      );
    }

    return value;
  }
}
