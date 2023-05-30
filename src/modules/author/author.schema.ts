import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ObjectId } from 'mongodb';
import { Category } from '../categories/category.schema';

export type AuthorDocument = Author & Document;

@Schema()
export class Author {
  @Prop()
  firstName: string;

  @Prop()
  lastName: string;

  @Prop({ type: ObjectId, ref: 'Category' })
  category: Category;

  @Prop({ default: new Date() })
  createdAt: Date;

  @Prop({ default: new Date() })
  updatedAt: Date;

  @Prop()
  deletedAt: Date;
}

export const AuthorSchema = SchemaFactory.createForClass(Author);
