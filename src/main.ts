import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as helmet from 'helmet';
import { env } from './config/env';
import * as fs from 'fs';
import * as path from 'path';
import { Logger } from '@nestjs/common';

const logger = new Logger('Main');

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: {
      origin: '*',
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
      preflightContinue: false,
      optionsSuccessStatus: 204,
    },
  });
  app.enableCors();
  app.use(helmet());

  if (!fs.existsSync(path.join(process.cwd(), `assets`))) {
    logger.log('Create assets folder');
    fs.mkdirSync('assets');
  }

  await app.listen(env.API_PORT, env.API_HOST);
  console.log(`API server listening on ${env.API_HOST}:${env.API_PORT}`);
  return app;
}

bootstrap().catch((err) => console.error(err));
