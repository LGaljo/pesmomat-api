import { Controller, Delete, Get, Post, Req, UseGuards } from "@nestjs/common";
import { IRequest } from '../../middlewares/context.middleware';
import { AuthorService } from './author.service';
import { ObjectId } from 'mongodb';
import { LocalAuthGuard } from "../../guards/local-auth.guard";
import { JwtAuthGuard } from "../../guards/jwt-auth.guard";
import { RolesGuard } from "../../guards/roles.guard";
import { Roles } from "../../guards/roles.decorator";
import { Role } from "../user/schemas/roles.enum";

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
