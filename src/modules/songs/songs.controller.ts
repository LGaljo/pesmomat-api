import {
  BadRequestException,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  Res,
  StreamableFile,
  UseGuards,
} from '@nestjs/common';
import { SongsService } from './songs.service';
import { IRequest } from '../../middlewares/context.middleware';
import { createReadStream } from 'fs';
import * as path from 'path';
import * as fs from 'fs';
import { ObjectId } from 'mongodb';
import { languages } from '../../lib/tts';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { RolesGuard } from '../../guards/roles.guard';
import { Roles } from '../../guards/roles.decorator';
import { Role } from '../user/schemas/roles.enum';

@Controller('songs')
export class SongsController {
  constructor(private readonly songsService: SongsService) {}

  @Get()
  public async getSongs(@Req() request: IRequest): Promise<any> {
    const { query } = request;

    const limit = Number(query?.limit) || 25;
    const page = Number(query?.page) - 1 || null;

    return this.songsService.findAll(limit, page, request?.query);
  }

  @Get('languages')
  public async getLanguages(): Promise<any> {
    return languages;
  }

  @Get(':id')
  public async getSong(@Req() request: IRequest): Promise<any> {
    const { params } = request;
    if (!params?.id) {
      throw new BadRequestException('Missing ID');
    }
    return this.songsService.findOne(new ObjectId(params?.id));
  }

  @UseGuards(JwtAuthGuard)
  @UseGuards(RolesGuard)
  @Roles(Role.USER)
  @Put(':id')
  public async updateSong(@Req() request: IRequest): Promise<any> {
    const { body, params } = request;
    return this.songsService.updateOne(params?.id, body);
  }

  @UseGuards(JwtAuthGuard)
  @UseGuards(RolesGuard)
  @Roles(Role.USER)
  @Post('favourite/:id')
  public async manageFavourites(@Req() request: IRequest): Promise<any> {
    const { params } = request;
    return this.songsService.manageFavourites(params?.id);
  }

  @Get('play/:id')
  public async getSongFile(
    @Req() request: IRequest,
    @Res({ passthrough: true }) res,
  ): Promise<StreamableFile> {
    const { params } = request;

    if (!fs.existsSync(path.join(process.cwd(), `assets`))) {
      fs.mkdirSync('assets');
    }

    const fp = path.join(process.cwd(), `assets/song_${params.id}.mp3`);
    if (!fs.existsSync(fp)) {
      console.log('Create tts sample');
      if (await this.songsService.exists(params.id)) {
        await this.songsService.tts(params.id, null);
      }
    }

    const file = createReadStream(fp);

    res.set({
      'Content-Type': 'audio/mpeg',
      'Content-Disposition': `attachment; filename="audio.mp3"`,
    });

    return new StreamableFile(file);
  }

  @UseGuards(JwtAuthGuard)
  @UseGuards(RolesGuard)
  @Roles(Role.USER)
  @Post()
  public async createSong(@Req() request: IRequest): Promise<any> {
    const { body } = request;
    return this.songsService.create(body);
  }

  @UseGuards(JwtAuthGuard)
  @UseGuards(RolesGuard)
  @Roles(Role.USER)
  @Post('tts/:id')
  public async createTTS(@Req() request: IRequest): Promise<any> {
    const { body, params } = request;

    return await this.songsService.tts(params?.id, body?.options);
  }

  @UseGuards(JwtAuthGuard)
  @UseGuards(RolesGuard)
  @Roles(Role.USER)
  @Delete(':id')
  public async deleteOne(@Param('id') id: string) {
    return this.songsService.deleteOne(id);
  }
}
