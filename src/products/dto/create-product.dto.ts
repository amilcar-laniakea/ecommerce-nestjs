import { IsArray, IsBoolean, IsMongoId, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { Types } from 'mongoose';
import { IsUnique } from '../utils/is-unique-array';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @IsNotEmpty()
  price: number;

  @IsNumber()
  @IsNotEmpty()
  code: number;

  @IsBoolean()
  @IsOptional()
  status?: boolean;

  @IsNumber()
  @IsNotEmpty()
  stock: number;

  @IsArray()
  @IsNotEmpty({ each: true })
  @IsMongoId({ each: true })
  @IsUnique({ message: 'Categories must be unique' })
  categories: Types.ObjectId[];

  @IsString()
  @IsOptional()
  thumbnail?: string | null;
}
