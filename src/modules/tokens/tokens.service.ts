import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Token, TokenDocument } from './tokens.schema';

@Injectable()
export class TokensService {
  constructor(
    @InjectModel(Token.name) private tokensModel: Model<TokenDocument>,
  ) {}

  async setOne(): Promise<TokenDocument> {
    if (await this.exists()) {
      this.tokensModel.updateMany({}, { $inc: { amount: 1 } });
    }
    return await this.tokensModel.create({ amount: 1 });
  }

  async getValue(): Promise<any> {
    const obj = await this.tokensModel.findOne({ only: 1 }).exec();
    return obj ? { amount: obj?.amount } : { amount: 0 };
  }

  async exists(): Promise<boolean> {
    const obj = await this.tokensModel.findOne({ only: 1 }).exec();
    return !!obj?._id;
  }
}
