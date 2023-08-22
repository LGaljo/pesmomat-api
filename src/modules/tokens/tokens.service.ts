import { forwardRef, Inject, Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Token, TokenDocument } from './tokens.schema';
import { Gpio } from 'onoff';
import { StatsService } from '../stats/stats.service';

@Injectable()
export class TokensService implements OnModuleInit {
  private readonly logger = new Logger(TokensService.name);

  constructor(
    @InjectModel(Token.name) private tokensModel: Model<TokenDocument>,
    @Inject(forwardRef(() => StatsService))
    private readonly statsService: StatsService,
  ) {}

  async set(value: number): Promise<any> {
    if (await this.exists()) {
      await this.tokensModel
        .updateMany({ only: 1 }, { $inc: { amount: value } })
        .exec();
    } else {
      await this.tokensModel.create({ amount: value });
    }
    await this.statsService.createOnTokenChange(value);

    return this.getValue();
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
      this.logger.debug('GPIO not available');
      return;
    }

    const button = new Gpio(23, 'in', 'rising', { debounceTimeout: 50 });

    button.watch(async (err, value) => {
      if (err) {
        console.error(err);
      }
      console.log(value);
      await this.set(1);
    });
  }

  async onModuleInit(): Promise<any> {
    await this.setWatch();
  }
}
