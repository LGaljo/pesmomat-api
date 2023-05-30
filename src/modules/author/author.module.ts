import { Module } from '@nestjs/common';
import { AuthorController } from './author.controller';
import { AuthorService } from './author.service';
import { MongooseModule } from '@nestjs/mongoose';
import { CategoriesSchema, Category } from "../categories/category.schema";
import { Song, SongsSchema } from '../songs/songs.schema';
import { Author, AuthorSchema } from './author.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Category.name, schema: CategoriesSchema },
      { name: Author.name, schema: AuthorSchema },
      { name: Song.name, schema: SongsSchema },
    ]),
  ],
  controllers: [AuthorController],
  providers: [AuthorService],
})
export class AuthorModule {}
