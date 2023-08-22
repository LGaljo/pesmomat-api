import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { ObjectId } from 'mongodb';
import { Category, CategoryDocument } from '../categories/category.schema';
import { Author, AuthorDocument } from '../author/author.schema';
import { Actions, Stats, StatsDocument } from './stats.schema';
import { TokensService } from '../tokens/tokens.service';

@Injectable()
export class StatsService {
  constructor(
    @InjectModel(Stats.name) private statsModel: Model<StatsDocument>,
    @InjectModel(Category.name) private categoryModel: Model<CategoryDocument>,
    @InjectModel(Author.name) private authorModel: Model<AuthorDocument>,
    @Inject(forwardRef(() => TokensService))
    private tokensService: TokensService,
  ) {}

  async getStats(limit = null, page = 0, filter?: any): Promise<any> {
    const params = {
      deletedAt: null,
      action: Actions[filter?.action],
    };

    // TODO: Aggregate by type, by date (last day, last week, last month)
    return {
      items: await this.statsModel.aggregate([
        { $match: params },
        { $skip: limit * page },
        { $limit: limit },
        {
          $group: {
            _id: [
              { poem_id: '$poem' },
              { author_id: '$author' },
              { category_id: '$category' },
            ],
            poem: { $first: '$poem' },
            category: { $first: '$category' },
            author: { $first: '$author' },
            views: { $sum: 1 },
          },
        },
        {
          $lookup: {
            from: 'songs',
            localField: 'poem',
            foreignField: '_id',
            as: 'poem',
          },
        },
        {
          $lookup: {
            from: 'authors',
            localField: 'poem.author',
            foreignField: '_id',
            as: 'author',
          },
        },
        { $unwind: { path: '$poem' } },
        { $unwind: { path: '$author' } },
        {
          $project: {
            'poem.content': 0,
            'poem.contents': 0,
          },
        },
        {
          $sort: { views: -1 },
        },
      ]),
      total: 0,
    };

    // return {
    //   items: await this.statsModel
    //     .find(params)
    //     .skip(limit * page)
    //     .limit(limit)
    //     .populate('poem', { contents: 0, content: 0 })
    //     .populate('author')
    //     .populate('category')
    //     .exec(),
    //   total: await this.statsModel.find(params).count().exec(),
    // };
  }

  async getTokensState(): Promise<number> {
    return (await this.tokensService.getValue())?.amount;
  }

  async createOnTokenChange(value: number): Promise<void> {
    await this.statsModel.create({
      action: Actions.TOKEN_MODIFIED,
      tokens: await this.getTokensState(),
      amount: value,
    });
  }

  async createOnQrcodeViewed(id: ObjectId): Promise<void> {
    await this.statsModel.create({
      action: Actions.QRCODE,
      poem: id,
      tokens: await this.getTokensState(),
    });
  }

  async createOnPrinted(id: ObjectId): Promise<void> {
    await this.statsModel.create({
      action: Actions.POEM_PRINTED,
      poem: id,
      tokens: await this.getTokensState(),
    });
  }

  async createOnListened(id: ObjectId): Promise<void> {
    await this.statsModel.create({
      action: Actions.LISTENED,
      poem: id,
      tokens: await this.getTokensState(),
    });
  }

  async createOnPoemViewed(id: ObjectId): Promise<void> {
    await this.statsModel.create({
      action: Actions.VIEW_POEM,
      poem: id,
      tokens: await this.getTokensState(),
    });
  }

  async createOnAuthorViewed(id: ObjectId): Promise<void> {
    await this.statsModel.create({
      action: Actions.VIEW_AUTHOR,
      author: id,
      tokens: await this.getTokensState(),
    });
  }

  async createOnCategoryViewed(id: ObjectId): Promise<void> {
    await this.statsModel.create({
      action: Actions.VIEW_CATEGORY,
      category: id,
      tokens: await this.getTokensState(),
    });
  }
}
