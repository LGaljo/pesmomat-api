import { NestFactory } from '@nestjs/core';
import { SongsService } from '../modules/songs/songs.service';
import { AppModule } from '../app.module';
import * as fs from 'fs';
import { INestApplicationContext } from '@nestjs/common';
import { AuthorService } from '../modules/author/author.service';
import { CategoriesService } from '../modules/categories/categories.service';

let app: INestApplicationContext;
(async () => {
  app = await NestFactory.createApplicationContext(AppModule);
  const songsService = app.get<SongsService>(SongsService);
  const authorService = app.get<AuthorService>(AuthorService);
  const categoryService = app.get<CategoriesService>(CategoriesService);

  const songs = readFile();
  for (const song of songs) {
    let category = await categoryService.findOneByName(song.category);
    if (!category) {
      category = await categoryService.create({ name: song.category });
    }

    let author = await authorService.findOneByName(
      song.author.firstName,
      song.author.lastName,
    );
    if (!author) {
      song.author.category = (category as any)._id;
      author = await authorService.create(song.author);
    }
    song.author = (author as any)._id;

    song.category = (category as any)._id;
    const res = await songsService.create(song);

    await songsService.tts(null, (res as any)._id);
    console.log(song.title);
  }

  console.log((await songsService.findAll()).length);

  await app.close();
  process.exit();
})().catch(async (err) => {
  console.log(err);
  await app.close();
});

function readFile() {
  const file = fs.readFileSync('./tmp/import-3.txt', {
    encoding: 'utf-8',
    flag: 'r',
  });

  const raw = file.split('%%%%');
  const songs = raw.map((s: any) => {
    try {
      const line = s.trim().split('\r\n');
      const author = line[1].trim().split(',');
      return {
        title: line[0].trim(),
        author: {
          firstName: author[0].trim(),
          lastName: author[1].trim(),
          category: null,
        },
        category: line[2].trim(),
        language: line[3].trim(),
        content: line.slice(4).join('<br>'),
      };
    } catch (err) {
      console.log(err);
      console.log(s);
    }
  });

  return songs;
}
