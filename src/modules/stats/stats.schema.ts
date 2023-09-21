import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Category } from '../categories/category.schema';
import { Author } from '../author/author.schema';
import { ObjectId } from 'mongodb';

export type StatsDocument = Stats & Document;

export enum Actions {
  VIEW_POEM = 'VIEW_POEM',
  VIEW_CATEGORY = 'VIEW_CATEGORY',
  VIEW_AUTHOR = 'VIEW_AUTHOR',
  TOKEN_MODIFIED = 'TOKEN_MODIFIED',
  POEM_PRINTED = 'POEM_PRINTED',
  QRCODE = 'QRCODE',
  LISTENED = 'LISTENED',
}

@Schema()
export class Stats {
  @Prop({ type: ObjectId, ref: 'Author' })
  author: Author;

  @Prop({ type: ObjectId, ref: 'Category' })
  category: Category;

  @Prop({ type: ObjectId, ref: 'Song' })
  poem: Category;

  @Prop()
  action: string;

  @Prop({ default: new Date() })
  createdAt: Date;

  @Prop()
  amount: number;

  @Prop()
  tokens: number;

  @Prop()
  machine: string;
}

export const StatsSchema = SchemaFactory.createForClass(Stats);
