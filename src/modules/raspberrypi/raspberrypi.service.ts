import { Injectable, Logger } from '@nestjs/common';
import { Context } from '../../context';
import { SongsService } from '../songs/songs.service';
import { printOnThermalPaper } from '../../lib/print';
import { TokensService } from '../tokens/tokens.service';

@Injectable()
export class RaspberrypiService {
  private readonly logger = new Logger(RaspberrypiService.name);

  constructor(
    private songsService: SongsService,
    private tokensService: TokensService,
  ) {}

  async printSong(context: Context, songId: string): Promise<any> {
    // Check for credits
    const availablePrints = await this.tokensService.getValue();

    if (availablePrints.amount <= 0) {
      return { message: 'Insufficient funds' };
      // throw new BadRequestException('Insufficient funds');
    }

    // Get songs
    const song = await this.songsService.findOne(songId);

    if (!song) {
      return { message: 'Song does not exist' };
    }

    // Decrease available prints
    await this.tokensService.set(-1);

    // Print PDF
    await printOnThermalPaper(song);
    console.log('Now printing!');
    return { message: 'Printing' };
  }
}
