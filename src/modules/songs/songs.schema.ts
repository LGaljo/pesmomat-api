import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type SongDocument = Song & Document;

@Schema()
export class Song {
  @Prop({ unique: true })
  songId: string;

  @Prop()
  title: string;

  @Prop()
  author: string;

  @Prop()
  content: string;

  @Prop()
  url: string;

  @Prop()
  createdAt: Date;

  @Prop()
  published: Date;
}

export const SongsSchema = SchemaFactory.createForClass(Song);
