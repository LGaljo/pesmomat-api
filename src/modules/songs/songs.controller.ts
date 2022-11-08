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
} from '@nestjs/common';
import { SongsService } from './songs.service';
import { IRequest } from '../../middlewares/context.middleware';
import { createReadStream } from 'fs';
import * as path from 'path';
import * as fs from 'fs';
import { ObjectId } from "mongodb";

@Controller('songs')
export class SongsController {
  constructor(private readonly songsService: SongsService) {}

  @Get()
  public async getSongs(@Req() request: IRequest): Promise<any> {
    const { params } = request;

    const limit = Number(params?.limit) || 15;
    const skip = Number(params?.skip) || null;

    return this.songsService.findAll(limit, skip, request?.query);
  }

  @Get(':id')
  public async getSong(@Req() request: IRequest): Promise<any> {
    const { params } = request;
    return this.songsService.findOne(new ObjectId(params?.id));
  }

  @Put(':id')
  public async updateSong(@Req() request: IRequest): Promise<any> {
    const { body, params } = request;
    return this.songsService.updateOne(params?.id, body);
  }

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
        await this.songsService.tts(null, params.id);
      }
    }

    const file = createReadStream(fp);

    res.set({
      'Content-Type': 'audio/mpeg',
      'Content-Disposition': 'attachment; filename="audio.mp3"',
    });

    return new StreamableFile(file);
  }

  @Post()
  public async createSong(@Req() request: IRequest): Promise<any> {
    const { body } = request;
    return this.songsService.create(body);
  }

  @Post(['tts', 'tts/:id'])
  public async createTTS(@Req() request: IRequest): Promise<any> {
    const { body, params } = request;

    if (!body?.text) {
      throw new BadRequestException('Missing text field in body');
    }

    return await this.songsService.tts(body.text, params?.id);
  }

  @Delete(':id')
  public async deleteOne(@Param('id') id: string) {
    return this.songsService.deleteOne(id);
  }
}
