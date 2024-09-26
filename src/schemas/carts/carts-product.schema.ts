import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { Products } from '../products.schema';

@Schema()
export class CartsProduct {
  @Prop({ type: Types.ObjectId, ref: Products.name, required: true })
  productId: Types.ObjectId;

  @Prop({ required: false })
  quantity: number;
}

export const CartsProductSchema = SchemaFactory.createForClass(CartsProduct);
