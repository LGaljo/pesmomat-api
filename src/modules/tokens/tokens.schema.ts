import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type TokenDocument = Token & Document;

@Schema()
export class Token {
  @Prop({ default: 1 })
  only: number;

  @Prop({ default: 0 })
  amount: number;
}

export const TokensSchema = SchemaFactory.createForClass(Token);
