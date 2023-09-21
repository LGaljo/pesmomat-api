import { forwardRef, Module } from '@nestjs/common';
import { SyncService } from './sync.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Song, SongsSchema } from '../songs/songs.schema';
import { CategoriesSchema, Category } from '../categories/category.schema';
import { Author, AuthorSchema } from '../author/author.schema';
import { SongsModule } from '../songs/songs.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Song.name, schema: SongsSchema },
      { name: Category.name, schema: CategoriesSchema },
      { name: Author.name, schema: AuthorSchema },
    ]),
    forwardRef(() => SongsModule),
  ],
  providers: [SyncService],
  exports: [SyncService],
})
export class SyncModule {}
