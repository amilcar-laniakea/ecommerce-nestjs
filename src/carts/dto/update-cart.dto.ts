import { BadRequestException } from '@nestjs/common';
import { Transform } from 'class-transformer';
import { IsInt, IsOptional, Min } from 'class-validator';

export class UpdateCartDto {
  @IsOptional()
  @IsInt()
  @Min(0)
  @Transform(({ value }) => {
    if (value === undefined || value === null) {
      throw new BadRequestException('quantity must be a number.');
    }

    return value;
  })
  quantity?: number;
}
