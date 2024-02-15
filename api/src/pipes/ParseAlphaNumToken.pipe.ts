import { Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class ParseAlphaNumTokenPipe implements PipeTransform {
  transform(value: string): string {
    if (!/^[A-Za-z0-9_:-]+(\.[A-Za-z0-9_:-]+)*$/.test(value)) {
      throw new Error('Validation failed : token ' + value + ' is not valid');
    }
    return value;
  }
}
