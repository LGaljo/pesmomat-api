import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Category } from '../categories/category.schema';
import { Author } from '../author/author.schema';
import { ObjectId } from 'mongodb';

export type SongViewsDocument = SongViews & Document;

@Schema()
export class SongViews {
  @Prop({ type: ObjectId, ref: 'Author' })
  author: Author;

  @Prop({ type: ObjectId, ref: 'Category' })
  category: Category;

  @Prop({ default: 0 })
  views: number;

  @Prop({ default: [] })
  whenViewed: Array<Date>;

  @Prop({ default: null})
  deletedAt: Date;
}

export const SongViewsSchema = SchemaFactory.createForClass(SongViews);
