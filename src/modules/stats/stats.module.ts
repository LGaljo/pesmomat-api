import { forwardRef, Module } from '@nestjs/common';
import { StatsService } from './stats.service';
import { StatsController } from './stats.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Stats, StatsSchema } from './stats.schema';
import { CategoriesSchema, Category } from '../categories/category.schema';
import { Author, AuthorSchema } from '../author/author.schema';
import { TokensModule } from '../tokens/tokens.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Stats.name, schema: StatsSchema },
      { name: Category.name, schema: CategoriesSchema },
      { name: Author.name, schema: AuthorSchema },
    ]),
    forwardRef(() => TokensModule),
  ],
  providers: [StatsService],
  controllers: [StatsController],
  exports: [StatsService],
})
export class StatsModule {}
