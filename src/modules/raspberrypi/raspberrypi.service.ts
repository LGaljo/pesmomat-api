import { Injectable, Logger } from '@nestjs/common';
import { Context } from '../../context';
import { createPDF } from '../../lib/pdf';
import { Cron, CronExpression } from '@nestjs/schedule';
import { scrape } from '../../lib/scraper';
import { SongsService } from '../songs/songs.service';

@Injectable()
export class RaspberrypiService {
  private readonly logger = new Logger(RaspberrypiService.name);

  constructor(private songsService: SongsService) {}

  async printSong(context: Context, songId: string): Promise<void> {
    // Get songs
    const song = this.songsService.findOne(songId);

    // Create PDF
    const path = await createPDF(song);

    // Print PDF
    // await printPDF(path);
    console.log('Now printing!');
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
