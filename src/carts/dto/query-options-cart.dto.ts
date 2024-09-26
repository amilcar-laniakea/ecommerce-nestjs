import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsEnum } from 'class-validator';
import { CartStatus } from 'src/schemas/carts/carts.schema';

export class QueryOptionsCartDto {
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  limit?: number;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  page?: number;

  @IsEnum(CartStatus)
  @IsOptional()
  status?: CartStatus;
}
