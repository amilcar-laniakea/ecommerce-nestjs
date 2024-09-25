import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Categories } from './categories.schema';
import { Types } from 'mongoose';
// import { HydratedDocument } from 'mongoose';

// export type TaskDocument = HydratedDocument<Task>;

@Schema({
  timestamps: true,
  versionKey: false,
})
export class Products {
  @Prop({ trim: true, required: true })
  name: string;

  @Prop({ trim: true })
  description: string;

  @Prop({ required: true })
  price: number;

  @Prop({ required: true, unique: true, index: true })
  code: number;

  @Prop({ default: true, required: true })
  status: boolean;

  @Prop({ default: 0, required: true })
  stock: number;

  @Prop({ type: [Types.ObjectId], ref: Categories.name, required: true })
  categories: Types.ObjectId[];

  @Prop({ trim: true, default: null })
  thumbnail: string | null;
}

export const ProductsSchema = SchemaFactory.createForClass(Products);
