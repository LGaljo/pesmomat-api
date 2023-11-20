import { NestFactory } from '@nestjs/core';
import { SongsService } from '../modules/songs/songs.service';
import { AppModule } from '../app.module';
import { INestApplicationContext } from '@nestjs/common';
import * as path from 'path';
import * as fs from 'fs';

let app: INestApplicationContext;
(async () => {
  app = await NestFactory.createApplicationContext(AppModule);
  const songsService = app.get<SongsService>(SongsService);

  const songs = await songsService.findAll();

  let i = 1;
  for (const song of songs?.items) {
    song.contents = [];
    if (song?.content && song?.contents?.length === 0) {
      song.contents.push({
        content: song?.content,
        title: song?.title,
        lang: ['sl', 'slovenščina', 'Slovenščina'].includes(song?.language)
          ? 'sl'
          : 'other',
      });
    }
    song.language = ['sl', 'slovenščina', 'Slovenščina'].includes(
      song?.language,
    )
      ? 'sl'
      : 'other';
    await song.save();

    // Rename song tts sample
    const fpo = path.join(
      process.cwd(),
      `assets/song_${(song as any)._id}.mp3`,
    );
    const fpn = path.join(
      process.cwd(),
      `assets/song_${(song as any)._id}_${song.language}.mp3`,
    );

    if (fs.existsSync(fpo)) {
      fs.renameSync(fpo, fpn);
    } else {
      console.log(`File ${fpo} does not exit`);
    }

    console.log(`Done ${i}/${songs?.total}`);
    i += 1;
  }

  await app.close();
  process.exit();
})().catch(async (err) => {
  console.log(err);
  await app.close();
});
