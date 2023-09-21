import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type SyncDocument = Sync & Document;

@Schema()
export class Sync {
  @Prop({ default: new Date() })
  createdAt: Date;

  @Prop()
  amount: number;
}

export const SyncSchema = SchemaFactory.createForClass(Sync);
