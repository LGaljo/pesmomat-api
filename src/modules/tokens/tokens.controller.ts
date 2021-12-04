import { Controller, Get, Post, Req } from '@nestjs/common';
import { TokensService } from './tokens.service';

@Controller('tokens')
export class TokensController {
  constructor(private readonly tokensService: TokensService) {}

  @Get()
  public async getAmount(): Promise<any> {
    return this.tokensService.getValue();
  }

  @Post()
  public async setAmount(): Promise<any> {
    return this.tokensService.setOne();
  }
}
