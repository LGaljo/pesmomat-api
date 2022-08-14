import { Controller, Delete, Get, Post, Req } from '@nestjs/common';
import { IRequest } from '../../middlewares/context.middleware';
import { CategoriesService } from './categories.service';
import { ObjectId } from 'mongodb';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly service: CategoriesService) {}

  @Get()
  public async getAll(): Promise<any> {
    return await this.service.findAll();
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
