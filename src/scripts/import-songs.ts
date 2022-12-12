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

  const errors = [];

  const songs = readFile();
  for (const song of songs) {
    try {
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
      const exists = await songsService.findOneByTitle(song.title);
      if (exists) {
        console.log(`Song exists: ${exists.title} [${(exists as any)._id}]`);
        // continue;
      }
      song.author = (author as any)._id;

      song.category = (category as any)._id;
      let res;
      if (exists && (exists as any)?._id) {
        res = await songsService.updateOne((exists as any)._id, song);
      } else {
        res = await songsService.create(song);
      }
      await songsService.tts(null, (res as any)._id);

      console.log(song.title);
    } catch (err) {
      console.log(err);
      console.log(`Error: ${song?.title} [${(song as any)?._id}]`);
      errors.push({ name: song?.title, id: (song as any)?._id });
    }
  }

  console.log(errors);
  console.log((await songsService.findAll()).length);

  await app.close();
  process.exit();
})().catch(async (err) => {
  console.log(err);
  await app.close();
});

function readFile() {
  const errors = [];
  const file = fs.readFileSync('./tmp/import-franci.txt', {
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
          firstName: author[0]?.trim(),
          lastName: author[1]?.trim(),
          category: null,
        },
        category: line[2]?.trim(),
        language: line[3]?.trim(),
        content: line?.slice(4)?.join('<br>'),
      };
    } catch (err) {
      errors.push(s);
      console.log(err);
      console.log(s);
    }
  });

  if (errors.length > 0) {
    console.error('First fix errors');
    return [];
  }
  return songs;
}
