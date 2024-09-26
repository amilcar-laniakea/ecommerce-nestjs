import { IsArray, IsEnum, IsMongoId, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { Types } from 'mongoose';
import { CartStatus } from 'src/schemas/carts/carts.schema';

export class CreateCartProductDto {
  @IsMongoId()
  @IsNotEmpty()
  productId: Types.ObjectId;

  @IsNumber()
  @IsNotEmpty()
  quantity: number;
}

export class CreateCartDto {
  @IsEnum(CartStatus)
  @IsOptional()
  status: CartStatus;

  @IsArray()
  @IsOptional()
  products: CreateCartProductDto[];
}
