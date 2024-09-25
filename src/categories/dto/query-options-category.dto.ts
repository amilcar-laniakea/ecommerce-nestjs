import { BadRequestException } from '@nestjs/common';
import { Transform, Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString, IsBoolean } from 'class-validator';

export class QueryOptionsCategoryDto {
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  limit?: number;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  page?: number;

  @IsString()
  @IsOptional()
  name?: string;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  code?: number;

  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => {
    if (value === 'true' || value === 'false') {
      return value === 'true' ? true : false;
    }
    throw new BadRequestException('Invalid value for status. Must be "true" or "false".');
  })
  status?: boolean;
}
