import { NestFactory } from '@nestjs/core';
import { SongsService } from '../modules/songs/songs.service';
import { AppModule } from '../app.module';
import * as fs from 'fs';
import { INestApplicationContext } from '@nestjs/common';
import * as path from 'path';

let app: INestApplicationContext;
(async () => {
  app = await NestFactory.createApplicationContext(AppModule);
  const songsService = app.get<SongsService>(SongsService);
  const errors = [];

  const songs = await songsService.findAll();
  const checked = songs.items.filter((song) => {
    const fp = path.join(process.cwd(), `assets/song_${(song as any)._id}.mp3`);

    if (fs.existsSync(fp)) {
      const stats = fs.statSync(fp);
      if (stats.size === 0) {
        fs.unlinkSync(fp);
        return true;
      }
      return false;
    }

    return true;
  });

  for (const song of checked) {
    try {
      console.log('Create tts sample for ' + song.title);
      await songsService.tts((song as any)._id, null);
    } catch (err) {
      console.error(err);
      errors.push({ name: song.title, id: (song as any)._id });
    }
  }

  console.log(errors);
  await app.close();
  process.exit();
})().catch(async (err) => {
  console.log(err);
  await app.close();
});
