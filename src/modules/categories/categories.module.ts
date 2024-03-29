import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { MongooseModule } from '@nestjs/mongoose';
import { CategoriesSchema, Category } from './category.schema';
import { CategoriesController } from './categories.controller';
import { Song, SongsSchema } from '../songs/songs.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Category.name, schema: CategoriesSchema }]),
    MongooseModule.forFeature([{ name: Song.name, schema: SongsSchema }]),
  ],
  providers: [CategoriesService],
  controllers: [CategoriesController],
  exports: [CategoriesService],
})
export class CategoriesModule {}
