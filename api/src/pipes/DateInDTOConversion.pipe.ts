import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';
import { isValid, parse, parseISO } from 'date-fns';

/**
 * This pipe is required since date conversion from class-transform is broked from built DTOs
 */
@Injectable()
export class DateInDTOConversionPipe implements PipeTransform {
  transform(value: any) {
    if (typeof value === 'object') {
      Object.entries(value).forEach((item) => {
        // console.log(item[1] )
        if (
          typeof item[1] === 'string' &&
          (isValid(parseISO(item[1])) ||
            isValid(parse(item[1], 'yyyy-MM-dd', new Date())))
        ) {
          value[item[0]] = new Date(item[1] as string);
        }
      });
    }
    return value;
  }
}
