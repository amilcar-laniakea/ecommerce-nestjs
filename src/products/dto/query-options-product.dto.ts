import { BadRequestException } from '@nestjs/common';
import { Transform, Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString, IsIn, IsBoolean } from 'class-validator';

export class QueryOptionsProductDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  limit?: number;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  page?: number;

  @IsIn(['asc', 'desc'], { message: 'Sort order must be either "asc" or "desc"' })
  @IsOptional()
  sort?: 'asc' | 'desc';

  @IsString()
  @IsOptional()
  category?: string;

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
    throw new BadRequestException('Invalid value for stock. Must be "true" or "false".');
  })
  stock?: boolean;

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
