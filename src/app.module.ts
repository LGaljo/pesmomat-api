import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { ContextMiddleware } from './middlewares/context.middleware';
import { MongooseModule } from '@nestjs/mongoose';
import { RaspberrypiModule } from './modules/raspberrypi/raspberrypi.module';
import { env } from './config/env';
import { ScheduleModule } from '@nestjs/schedule';
import { SongsModule } from './modules/songs/songs.module';
import { TokensModule } from './modules/tokens/tokens.module';
import { AuthorModule } from './modules/author/author.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { StatsModule } from './modules/stats/stats.module';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { GenerateModule } from './modules/generate/generate.module';

@Module({
  imports: [
    MongooseModule.forRoot(env.MONGO_URI),
    UserModule,
    AuthModule,
    JwtModule.register({
      secret: env.JWT_SECRET,
      signOptions: { expiresIn: '48h' },
    }),
    SongsModule,
    RaspberrypiModule,
    ScheduleModule.forRoot(),
    TokensModule,
    AuthorModule,
    CategoriesModule,
    StatsModule,
    GenerateModule,
  ],
  controllers: [AppController],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(ContextMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
