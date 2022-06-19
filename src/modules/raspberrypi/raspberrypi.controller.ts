import { BadRequestException, Controller, Post, Req } from '@nestjs/common';
import { IRequest } from '../../middlewares/context.middleware';
import { RaspberrypiService } from './raspberrypi.service';

@Controller('raspberrypi')
export class RaspberrypiController {
  constructor(private raspberryService: RaspberrypiService) {}

  @Post('print')
  async printSong(@Req() req: IRequest) {
    const { context, query } = req;

    if (!query.songId) {
      throw new BadRequestException('Missing songs ID');
    }

    return await this.raspberryService.printSong(context, query.songId);
  }
}
