import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { INestApplicationContext } from '@nestjs/common';
import { SyncService } from '../modules/sync/sync.service';

let app: INestApplicationContext;
(async () => {
  app = await NestFactory.createApplicationContext(AppModule);
  const syncService = app.get<SyncService>(SyncService);

  await syncService.handleCron(true);

  await app.close();
  process.exit();
})().catch(async (err) => {
  console.log(err);
  await app.close();
});
