import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { INestApplicationContext } from '@nestjs/common';
import { UserService } from '../modules/user/user.service';

let app: INestApplicationContext;
(async () => {
  app = await NestFactory.createApplicationContext(AppModule);
  const userService = app.get<UserService>(UserService);

  await userService.create(
    {
      email: '',
      username: '',
      password: '',
    },
    true,
  );

  await app.close();
  process.exit();
})().catch(async (err) => {
  console.log(err);
  await app.close();
});
