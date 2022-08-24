import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Token, TokenDocument } from './tokens.schema';
import { Gpio } from 'onoff';

@Injectable()
export class TokensService implements OnModuleInit {
  constructor(
    @InjectModel(Token.name) private tokensModel: Model<TokenDocument>,
  ) {}

  async set(value: number): Promise<any> {
    if (await this.exists()) {
      await this.tokensModel
        .updateMany({ only: 1 }, { $inc: { amount: value } })
        .exec();
    } else {
      await this.tokensModel.create({ amount: value });
    }

    return this.getValue();
  }

  async setOne(): Promise<TokenDocument> {
    return await this.set(1);
  }

  async getValue(): Promise<any> {
    const obj = await this.tokensModel.findOne({ only: 1 }).exec();
    return obj ? { amount: obj?.amount } : { amount: 0 };
  }

  async exists(): Promise<boolean> {
    const obj = await this.tokensModel.findOne({ only: 1 }).exec();
    return !!obj?._id;
  }

  async setWatch(): Promise<any> {
    if (!Gpio.accessible) {
      console.log('Gpio not available');
      return;
    }

    const button = new Gpio(23, 'in', 'rising', { debounceTimeout: 50 });

    button.watch(async (err, value) => {
      if (err) {
        console.error(err);
      }
      console.log(value);
      await this.setOne();
    });
  }

  async onModuleInit(): Promise<any> {
    await this.setWatch();
  }
}
