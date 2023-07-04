import {
  BadRequestException,
  Controller,
  Get,
  Post,
  Req,
} from '@nestjs/common';
import { SongViewsService } from './songViews.service';
import { IRequest } from '../../middlewares/context.middleware';
import { ObjectId } from 'mongodb';


@Controller('songViews')
export class SongViewsController {
  constructor(private readonly songViewsService: SongViewsService) {}

  @Get()
  public async getSongs(@Req() request: IRequest): Promise<any> {
    const { query } = request;

    const limit = Number(query?.limit) || 25;
    const page = Number(query?.page) - 1 || null;

    return this.songViewsService.findAll(limit, page, request?.query);
  }


  @Get(':id')
  public async getSong(@Req() request: IRequest): Promise<any> {
    const { params } = request;
    if (!params?.id) {
      throw new BadRequestException('Missing ID');
    }
    return this.songViewsService.findOne(new ObjectId(params?.id));
  }
}
