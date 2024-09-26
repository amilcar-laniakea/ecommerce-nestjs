import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { CartsProduct, CartsProductSchema } from './carts-product.schema';
import { Document } from 'mongoose';

export enum CartStatus {
  ACTIVE = 'active',
  PURCHASED = 'purchased',
  FORGOT = 'forgot',
  FILED = 'filed',
}

export type CartsDocument = Carts & Document;

@Schema()
export class Carts {
  @Prop({ type: String, enum: CartStatus, required: true, default: CartStatus.ACTIVE })
  status: CartStatus;

  @Prop({ type: [CartsProductSchema], required: true, default: [] })
  products: CartsProduct[];
}

export const CartsSchema = SchemaFactory.createForClass(Carts);
