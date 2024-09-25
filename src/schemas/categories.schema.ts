import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
@Schema({
  timestamps: true,
  versionKey: false,
})
export class Categories {
  @Prop({ trim: true, required: true, set: (name: string) => name.toLowerCase() })
  name: string;

  @Prop({ required: true, unique: true, index: true })
  code: number;

  @Prop({ default: true, required: true })
  status: boolean;

  @Prop({ trim: true, default: null })
  thumbnail: string | null;
}

export const CategoriesSchema = SchemaFactory.createForClass(Categories);
