import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { INestApplicationContext } from '@nestjs/common';
import { TokensService } from '../modules/tokens/tokens.service';

let app: INestApplicationContext;
(async () => {
  app = await NestFactory.createApplicationContext(AppModule);
  const service = app.get<TokensService>(TokensService);
  await service.set(1000);

  await app.close();
  process.exit();
})().catch(async (err) => {
  console.log(err);
  await app.close();
});
