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

  const songs = fs.readFileSync('./tmp/export-songs.txt', {
    encoding: 'utf-8',
    flag: 'r',
  });
  const authors = fs.readFileSync('./tmp/export-authors.txt', {
    encoding: 'utf-8',
    flag: 'r',
  });
  const categories = fs.readFileSync('./tmp/export-categories.txt', {
    encoding: 'utf-8',
    flag: 'r',
  });

  for (const category of JSON.parse(categories)) {
    await categoryService.create(category);
  }

  for (const author of JSON.parse(authors)) {
    author.category = author.category._id;
    await authorService.create(author);
  }

  for (const song of JSON.parse(songs)) {
    song.category = song.category._id;
    song.author = song.author._id;
    await songsService.create(song);
  }

  console.log((await songsService.findAll()).length);
  console.log((await authorService.findAll()).length);
  console.log((await categoryService.findAll()).length);

  await app.close();
  process.exit();
})().catch(async (err) => {
  console.log(err);
  await app.close();
});
