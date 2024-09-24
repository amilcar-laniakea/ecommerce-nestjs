import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { isValidObjectId } from 'mongoose';

@Injectable()
export class ParseObjectIdNumberPipe implements PipeTransform<string> {
  transform(value: string | number) {
    if (!isValidObjectId(value) && isNaN(Number(value))) {
      throw new BadRequestException(`Invalid ID format: ${value}`);
    }
    return value;
  }
}
