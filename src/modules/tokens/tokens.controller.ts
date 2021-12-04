import {
  BadRequestException,
  Controller,
  Get,
  Post,
  Req,
} from '@nestjs/common';
import { TokensService } from './tokens.service';
import { IRequest } from '../../middlewares/context.middleware';

@Controller('tokens')
export class TokensController {
  constructor(private readonly tokensService: TokensService) {}

  @Get()
  public async getAmount(): Promise<any> {
    return this.tokensService.getValue();
  }

  @Post()
  public async setAmount(@Req() request: IRequest): Promise<any> {
    const { query } = request;

    if (!query?.value) {
      throw new BadRequestException('Missing value parameter');
    }
    return this.tokensService.set(Number(query?.value));
  }
}
