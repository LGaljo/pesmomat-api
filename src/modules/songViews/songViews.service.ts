import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { ObjectId } from 'mongodb';
import { Category, CategoryDocument } from '../categories/category.schema';
import { Author, AuthorDocument } from '../author/author.schema';
import { SongViews, SongViewsDocument } from './songViews.schema';

@Injectable()
export class SongViewsService {
  constructor(
    @InjectModel(SongViews.name) private songViewsModel: Model<SongViewsDocument>,
    @InjectModel(Category.name) private categoryModel: Model<CategoryDocument>,
    @InjectModel(Author.name) private authorModel: Model<AuthorDocument>,
  ) {}

  async findAll(limit = null, page = 0, filter?: any): Promise<any> {
    const params = { deletedAt: null };

    return {
      items: await this.songViewsModel
        .find(params)
        .skip(limit * page)
        .limit(limit)
        .populate('author')
        .populate('category')
        .exec(),
      total: await this.songViewsModel.find(params).count().exec(),
    };
  }

  async findOne(id: ObjectId): Promise<SongViewsDocument> {
    return this.songViewsModel
      .findOne({ _id: id })
      .populate('author')
      .populate('category')
      .exec();
  }


}
