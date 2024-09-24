import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
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

  @Prop({ required: true })
  category: string;

  @Prop({ trim: true })
  thumbnail: string;
}

export const ProductsSchema = SchemaFactory.createForClass(Products);
