import { BadRequestException, Injectable } from '@nestjs/common';
import { ObjectId } from 'mongodb';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Author, AuthorDocument } from './author.schema';
import { Song, SongDocument } from '../songs/songs.schema';
import {
  Category,
  CategoryDocument,
} from '../categories/schemas/category.schema';

@Injectable()
export class AuthorService {
  constructor(
    @InjectModel(Author.name) private authorModel: Model<AuthorDocument>,
    @InjectModel(Song.name) private songModel: Model<SongDocument>,
    @InjectModel(Category.name) private categoryModel: Model<CategoryDocument>,
  ) {}

  async create(object: any): Promise<AuthorDocument> {
    const createdAuthor = new this.authorModel(object);
    if (object?.category) {
      createdAuthor.category = await this.categoryModel.findOne({
        _id: new ObjectId(object?.category),
      });
    }

    await createdAuthor.save();
    return createdAuthor;
  }

  async updateOne(data: any, id: string): Promise<any> {
    const object = await this.authorModel
      .findOne({ _id: new ObjectId(id) })
      .exec();

    object.firstName = data?.firstName;
    object.lastName = data?.lastName;

    if ((object?.category as any)?._id !== data.categoryId) {
      object.category = await this.categoryModel.findOne({
        _id: new ObjectId(data?.categoryId),
      });
    }

    return this.authorModel
      .updateOne({ _id: new ObjectId(id) }, { $set: object })
      .exec();
  }

  async findAll(filter: any): Promise<AuthorDocument[]> {
    const params = { deletedAt: null };
    if (filter?.period) {
      params['category'] = new ObjectId(filter.period);
    }
    if (filter?.lang) {
      params['language'] = filter.lang;
    }

    return this.authorModel
      .find(params)
      .sort({ name: 1 })
      .populate('category')
      .exec();
  }

  async findOneById(id: ObjectId): Promise<AuthorDocument> {
    return this.authorModel
      .findOne({ _id: new ObjectId(id), deletedAt: null })
      .exec();
  }

  async deleteOne(id: string): Promise<void> {
    const countItems = await this.songModel
      .findOne({ category: new ObjectId(id) as any })
      .count()
      .exec();
    if (countItems > 0) {
      throw new BadRequestException('There are still objects in this category');
    }

    const object = await this.authorModel
      .findOne({ _id: new ObjectId(id) })
      .exec();

    object.deletedAt = new Date();

    await this.authorModel
      .updateOne({ _id: new ObjectId(id) }, { $set: object })
      .exec();
  }
}
