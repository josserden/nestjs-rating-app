import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

import { ReviewModel } from '../../review/review.model/review.model';

export type ProductDocument = HydratedDocument<ReviewModel>;

class ProductCharacteristic {
  @Prop()
  name: string;

  @Prop()
  value: string;
}

@Schema({
  timestamps: true,
  _id: true,
})
export class ProductModel {
  @Prop()
  image: string;

  @Prop()
  title: string;

  @Prop()
  price: number;

  @Prop()
  oldPrice?: number;

  @Prop()
  credit: number;

  @Prop()
  description: string;

  @Prop()
  advantages: string;

  @Prop()
  disAdvantages: string;

  @Prop([String])
  categories: string[];

  @Prop([String])
  tags: string[];

  @Prop({
    type: () => [ProductCharacteristic],
    _id: false,
  })
  characteristics: ProductCharacteristic[];
}

export const ProductSchema = SchemaFactory.createForClass(ProductModel);
