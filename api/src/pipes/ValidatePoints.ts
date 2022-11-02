import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class ValidatePoints implements PipeTransform {
  separator = ';';
  transform(values: string) {
    const regex = new RegExp(/[0-9]*\.[0-9]*,-{0,1}[0-9]*\.[0-9]*/g);

    // check param is valid
    if (values.split(this.separator).length < 2) {
      throw new BadRequestException(
        'Validation failed : ' +
          values +
          ` is not a list of points. Please use ${this.separator} to separate points `,
      );
    }

    for (const p of values.split(this.separator)) {
      if (!p.match(regex) || p.match(regex)[0] !== p) {
        throw new BadRequestException(
          'Validation failed : ' + p + ' is not a point',
        );
      }
    }

    // console.log(values, typeof values, JSON.parse(values));

    return values.split(this.separator);
  }
}
