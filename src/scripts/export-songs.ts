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
