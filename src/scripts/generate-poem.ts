import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { INestApplicationContext } from '@nestjs/common';
import { GenerateService } from '../modules/generate/generate.service';

let app: INestApplicationContext;
(async () => {
  app = await NestFactory.createApplicationContext(AppModule);
  const genService = app.get<GenerateService>(GenerateService);

  const song = await genService.generatePoem({
    poem1_title: 'Adrijansko morje',
    poem2_title: 'Akordi viharjev',
    number_of_stanzas: 4, // kitica
    rhyme_scheme: 'a-b-a',
    number_of_verses_per_stanza: 3, // vrstic na kitico
    first_line: 'Ona je strla srce',
    // repetition: 'False',
    // how_many_similar_poems: '',
    // how_many_similar_verses: '',
  });

  console.log(song.data);

  await app.close();
  process.exit();
})().catch(async (err) => {
  console.log(err);
  await app.close();
});
