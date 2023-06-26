import { NestFactory } from '@nestjs/core';
import { SongsService } from '../modules/songs/songs.service';
import { AppModule } from '../app.module';
import { INestApplicationContext } from '@nestjs/common';
import { toNgrams } from '../lib/utils';
import { AuthorService } from '../modules/author/author.service';

// db.getCollection('songs').createIndex({ngrams: "text"}, { "language_override": "none", "default_language": "none" })
// db.getCollection('authors').createIndex({ngrams: "text"}, { "language_override": "none", "default_language": "none" })

let app: INestApplicationContext;
(async () => {
  app = await NestFactory.createApplicationContext(AppModule);
  const songsService = app.get<SongsService>(SongsService);
  const authorsService = app.get<AuthorService>(AuthorService);

  const songs = await songsService.findAll();
  let i = 1;
  for (const song of songs?.items) {
    song.ngrams = toNgrams(song.title);
    await song.save();

    console.log(`Done s${i}/${songs?.total}`);
    i += 1;
  }

  const authors = await authorsService.findAll();
  i = 1;
  for (const author of authors) {
    author.ngrams = toNgrams([author.firstName, author.lastName].join(' '));
    await author.save();

    console.log(`Done a${i}`);
    i += 1;
  }

  await app.close();
  process.exit();
})().catch(async (err) => {
  console.log(err);
  await app.close();
});
