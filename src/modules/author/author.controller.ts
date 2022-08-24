import { Controller, Delete, Get, Post, Req } from '@nestjs/common';
import { IRequest } from '../../middlewares/context.middleware';
import { AuthorService } from './author.service';
import { ObjectId } from 'mongodb';

@Controller('author')
export class AuthorController {
  constructor(private readonly service: AuthorService) {}

  @Get()
  public async getAll(@Req() request: IRequest): Promise<any> {
    return await this.service.findAll(request?.query);
  }

  @Get(':id')
  public async getOne(@Req() request: IRequest): Promise<any> {
    return await this.service.findOneById(new ObjectId(request.params.id));
  }

  @Post()
  public async create(@Req() request: IRequest): Promise<any> {
    return await this.service.create(request.body);
  }

  @Post(':id')
  public async updateOne(@Req() request: IRequest): Promise<any> {
    return await this.service.updateOne(request.body, request.params.id);
  }

  @Delete(':id')
  public async delete(@Req() request: IRequest): Promise<any> {
    return await this.service.deleteOne(request.params.id);
  }
}
