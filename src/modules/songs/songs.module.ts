import { Module } from '@nestjs/common';
import { SongsService } from './songs.service';
import { SongsController } from './songs.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Song, SongsSchema } from './songs.schema';
import {
  CategoriesSchema,
  Category,
} from '../categories/category.schema';
import { Author, AuthorSchema } from '../author/author.schema';
import { SyncService } from './sync.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Song.name, schema: SongsSchema },
      { name: Category.name, schema: CategoriesSchema },
      { name: Author.name, schema: AuthorSchema },
    ]),
  ],
  providers: [SongsService, SyncService],
  controllers: [SongsController],
  exports: [SongsService, SyncService],
})
export class SongsModule {}
