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

  const songs = await songsService.findAll();
  const authors = await authorService.findAll();
  const categories = await categoryService.findAll();

  console.log(songs.length, authors.length, categories.length);
  fs.writeFileSync('./tmp/export-songs.txt', JSON.stringify(songs), {
    encoding: 'utf-8',
  });
  fs.writeFileSync('./tmp/export-authors.txt', JSON.stringify(authors), {
    encoding: 'utf-8',
  });
  fs.writeFileSync('./tmp/export-categories.txt', JSON.stringify(categories), {
    encoding: 'utf-8',
  });

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
