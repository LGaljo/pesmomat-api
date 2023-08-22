import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ObjectId } from "mongodb";

export type GeneratedPoemDocument = GeneratedPoem & Document;

@Schema()
export class GeneratedPoem {
  @Prop({ type: ObjectId, ref: 'Song' })
  A: ObjectId;

  @Prop({ type: ObjectId, ref: 'Song' })
  B: ObjectId;

  @Prop()
  rhyme: string;

  @Prop()
  stanza: number;

  @Prop()
  verse: number;

  @Prop()
  content: string;

  @Prop({ default: new Date() })
  createdAt: Date;
}

export const GeneratedPoemsSchema = SchemaFactory.createForClass(GeneratedPoem);
