import { Injectable, Logger } from '@nestjs/common';
import { Context } from '../../context';
import { createPDF } from '../../lib/pdf';
import { Cron, CronExpression } from '@nestjs/schedule';
import { scrape } from '../../lib/scraper';
import { SongsService } from '../songs/songs.service';
import { printPDF } from '../../lib/print';
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

    // Create PDF
    const path = await createPDF(song);

    // Decrease available prints
    await this.tokensService.set(-1);

    // Print PDF
    // await printPDF(path);
    console.log('Now printing!');
    return { message: 'Printing' };
  }

  @Cron(CronExpression.EVERY_10_MINUTES)
  async scrapeSongs(): Promise<void> {
    this.scrapePage();
  }

  async scrapePage(page = 1): Promise<void> {
    await scrape(
      `http://vrabecanarhist.eu/kategorija/poezija/page/${page}`,
    ).then((res: any) => {
      console.log(res);
      res.forEach(async (song) => {
        if (!(await this.songsService.exists(song.songId))) {
          song['createdAt'] = new Date();
          await this.songsService.create(song);
        }
      });
    });
  }
}
