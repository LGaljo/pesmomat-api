import { NestFactory } from '@nestjs/core';
import { SongsService } from '../modules/songs/songs.service';
import { AppModule } from '../app.module';
import * as fs from 'fs';
import { INestApplicationContext } from '@nestjs/common';
import * as path from 'path';
import { ObjectId } from 'mongodb';

let app: INestApplicationContext;
(async () => {
  app = await NestFactory.createApplicationContext(AppModule);
  const songsService = app.get<SongsService>(SongsService);

  const song = await songsService.findOne(new ObjectId('63384cc5d44f34158212f347'));
  const fp = path.join(process.cwd(), `assets/song_${(song as any)._id}.mp3`);

  if (fs.existsSync(fp)) {
    console.log('song exists');
    const stats = fs.statSync(fp);
    if (stats.size === 0) {
      console.log('remove song');
      fs.unlinkSync(fp);
    }
  }

  try {
    console.log('Create tts sample for ' + song.title);
    await songsService.tts(null, (song as any)._id);
  } catch (err) {
    console.error(err);
  }

  await app.close();
  process.exit();
})().catch(async (err) => {
  console.log(err);
  await app.close();
});
