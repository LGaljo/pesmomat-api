import { BadRequestException, Controller, Get, Post, Req } from "@nestjs/common";
import { SongsService } from './songs.service';
import { IRequest } from '../../middlewares/context.middleware';

@Controller('songs')
export class SongsController {
  constructor(private readonly songsService: SongsService) {}

  @Get()
  public async getSongs(@Req() request: IRequest): Promise<any> {
    const { params } = request;

    const limit = Number(params?.limit) || 15;
    const skip = Number(params?.skip) || 15;

    return this.songsService.findAll(limit, skip);
  }

  @Get(':id')
  public async getSong(@Req() request: IRequest): Promise<any> {
    const { params } = request;
    return this.songsService.findOne(params?.id);
  }

  @Post()
  public async createSong(@Req() request: IRequest): Promise<any> {
    const { body } = request;
    return this.songsService.create(body);
  }

  @Post('tts')
  public async createTTS(@Req() request: IRequest): Promise<any> {
    const { body } = request;

    if (!body?.text) {
      throw new BadRequestException('Missing text field in body');
    }

    return await this.songsService.tts(body.text);
  }
}
