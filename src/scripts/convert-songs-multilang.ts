import { NestFactory } from '@nestjs/core';
import { SongsService } from '../modules/songs/songs.service';
import { AppModule } from '../app.module';
import { INestApplicationContext } from '@nestjs/common';

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
        lang: ['slovenščina', 'Slovenščina'].includes(song?.language)
          ? 'sl'
          : 'other',
      });
    }
    song.language = song.language.toLowerCase();
    await song.save();

    console.log(`Done ${i}/${songs?.total}`);
    i += 1;
  }

  await app.close();
  process.exit();
})().catch(async (err) => {
  console.log(err);
  await app.close();
});
