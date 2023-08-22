import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Post,
  Req,
} from '@nestjs/common';
import { StatsService } from './stats.service';
import { IRequest } from '../../middlewares/context.middleware';
import { ObjectId } from 'mongodb';

@Controller('stats')
export class StatsController {
  constructor(private readonly statsService: StatsService) {}

  @Get()
  public async getStats(@Req() request: IRequest): Promise<any> {
    const { query } = request;

    const limit = Number(query?.limit) || 25;
    const page = Number(query?.page) - 1 || null;

    return this.statsService.getStats(limit, page, query);
  }

  @Post(':action/:id')
  public async saveToStats(
    @Param('action') action: string,
    @Param('id') id: string,
  ) {
    switch (action) {
      case 'poem_view': {
        await this.statsService.createOnPoemViewed(new ObjectId(id));
        break;
      }
      case 'category_view': {
        await this.statsService.createOnCategoryViewed(new ObjectId(id));
        break;
      }
      case 'author_view': {
        await this.statsService.createOnAuthorViewed(new ObjectId(id));
        break;
      }
      case 'qrcode': {
        await this.statsService.createOnQrcodeViewed(new ObjectId(id));
        break;
      }
      case 'listened': {
        await this.statsService.createOnListened(new ObjectId(id));
        break;
      }
      default: {
        throw new BadRequestException('Unknown action');
      }
    }
  }
}
