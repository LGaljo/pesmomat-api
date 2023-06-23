import { Controller, Delete, Get, Post, Req, UseGuards } from "@nestjs/common";
import { IRequest } from '../../middlewares/context.middleware';
import { CategoriesService } from './categories.service';
import { ObjectId } from 'mongodb';
import { JwtAuthGuard } from "../../guards/jwt-auth.guard";
import { RolesGuard } from "../../guards/roles.guard";
import { Roles } from "../../guards/roles.decorator";
import { Role } from "../user/schemas/roles.enum";

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

  @UseGuards(JwtAuthGuard)
  @UseGuards(RolesGuard)
  @Roles(Role.USER)
  @Post()
  public async create(@Req() request: IRequest): Promise<any> {
    return await this.service.create(request.body);
  }

  @UseGuards(JwtAuthGuard)
  @UseGuards(RolesGuard)
  @Roles(Role.USER)
  @Post(':id')
  public async updateOne(@Req() request: IRequest): Promise<any> {
    return await this.service.updateOne(request.body, request.params.id);
  }

  @UseGuards(JwtAuthGuard)
  @UseGuards(RolesGuard)
  @Roles(Role.USER)
  @Delete(':id')
  public async delete(@Req() request: IRequest): Promise<any> {
    return await this.service.deleteOne(request.params.id);
  }
}
