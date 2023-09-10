import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Category } from '../categories/category.schema';
import { Author } from '../author/author.schema';
import { ObjectId } from 'mongodb';

// db.getCollection('songs').createIndex({ngrams: "text"})
export type SongDocument = Song & Document;

@Schema()
export class Song {
  @Prop()
  title: string;

  @Prop()
  ngrams: string;

  @Prop({ type: ObjectId, ref: 'Author' })
  author: Author;

  @Prop()
  content: string;

  @Prop()
  contents: any[];

  @Prop()
  url: string;

  @Prop()
  language: string;

  @Prop({ default: false })
  favourite: boolean;

  @Prop({ type: ObjectId, ref: 'Category' })
  category: Category;

  @Prop({ default: new Date() })
  createdAt: Date;

  @Prop({ default: new Date() })
  updatedAt: Date;

  @Prop()
  deletedAt: Date;
}

export const SongsSchema = SchemaFactory.createForClass(Song);
