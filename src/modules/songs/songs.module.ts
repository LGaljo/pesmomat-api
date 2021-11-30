import { Module } from '@nestjs/common';
import { SongsService } from './songs.service';
import { SongsController } from './songs.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Song, SongsSchema } from './songs.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Song.name, schema: SongsSchema }]),
  ],
  providers: [SongsService],
  controllers: [SongsController],
  exports: [SongsService],
})
export class SongsModule {}
