import { NestFactory } from '@nestjs/core';
import { SongsService } from '../modules/songs/songs.service';
import { AppModule } from '../app.module';
import { INestApplicationContext } from '@nestjs/common';
import { createObjectCsvWriter as createCsvWriter } from 'csv-writer';

let app: INestApplicationContext;
(async () => {
  app = await NestFactory.createApplicationContext(AppModule);
  const songsService = app.get<SongsService>(SongsService);

  const songs = await songsService.findAll();

  const csvWriter = createCsvWriter({
    path: 'tmp/export-songs.csv',
    encoding: 'utf8',
    // alwaysQuote: true,
    fieldDelimiter: ';',
    header: [
      { id: 'id', title: 'ID' },
      { id: 'author', title: 'Avtor' },
      { id: 'title', title: 'Naslov' },
      { id: 'period', title: 'Obdobje' },
    ],
  });

  const records = songs.map((s) => {
    return {
      id: (s as any)._id,
      author: `${s.author.firstName} ${s.author.lastName}`,
      title: s.title,
      period: s.category.name,
    };
  });

  csvWriter.writeRecords(records).then(() => {
    console.log('...Done');
  });

  await app.close();
  process.exit();
})().catch(async (err) => {
  console.log(err);
  await app.close();
});
