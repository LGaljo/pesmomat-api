import { Module } from '@nestjs/common';
import { SongViewsService } from './songViews.service';
import { SongViewsController } from './songViews.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { SongViews, SongViewsSchema } from './songViews.schema';
import { CategoriesSchema, Category} from '../categories/category.schema';
import { Author, AuthorSchema } from '../author/author.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: SongViews.name, schema: SongViewsSchema },
      { name: Category.name, schema: CategoriesSchema },
      { name: Author.name, schema: AuthorSchema },]),
  ],
  providers: [SongViewsService],
  controllers: [SongViewsController],
  exports: [SongViewsService],
})
export class SongViewsModule {}
