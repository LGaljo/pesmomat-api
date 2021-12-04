import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type SongDocument = Song & Document;

@Schema()
export class Song {
  @Prop()
  title: string;

  @Prop()
  author: string;

  @Prop()
  content: string;

  @Prop()
  url: string;

  @Prop({ default: new Date() })
  createdAt: Date;

  @Prop({ default: new Date() })
  published: Date;
}

export const SongsSchema = SchemaFactory.createForClass(Song);
