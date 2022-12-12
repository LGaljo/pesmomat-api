import { NestFactory } from '@nestjs/core';
import { SongsService } from '../modules/songs/songs.service';
import { AppModule } from '../app.module';
import * as fs from 'fs';
import { INestApplicationContext } from '@nestjs/common';
import { ObjectId } from 'mongodb';

let app: INestApplicationContext;
(async () => {
  app = await NestFactory.createApplicationContext(AppModule);
  const songsService = app.get<SongsService>(SongsService);

  const file = fs.readFileSync('./tmp/izvoz-pesmi-s-povezavami.csv', {
    encoding: 'utf-8',
    flag: 'r',
  });
  const raws = file.split('\r\n');
  raws.shift();

  for (const line of raws) {
    const props = line.split('\t');

    if (props.length >= 5) {
      const song = await songsService
        .findOne(new ObjectId(props[0]))
        .then((doc: any) => doc?._doc);
      if (song) {
        song.url = props[4].length > 0 ? props[4] : null;
        song.favourite = props[5] === 'TRUE';
        song.category = (song.category as any)._id;
        song.author = (song.author as any)._id;
        await songsService.updateOne(props[0], song);
      }
    }
    console.log(props);
  }

  await app.close();
  process.exit();
})().catch(async (err) => {
  console.log(err);
  await app.close();
});
