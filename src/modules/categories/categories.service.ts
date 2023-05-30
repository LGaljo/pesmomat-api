import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category, CategoryDocument } from './category.schema';
import { ObjectId } from 'mongodb';
import { Song, SongDocument } from '../songs/songs.schema';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel(Category.name) private categoryModel: Model<CategoryDocument>,
    @InjectModel(Song.name)
    private songModel: Model<SongDocument>,
  ) {}

  async create(object: any): Promise<CategoryDocument> {
    const item = new this.categoryModel(object);
    await item.save();
    return item;
  }

  async findAll(): Promise<CategoryDocument[]> {
    return this.categoryModel
      .find({ deletedAt: null })
      .sort({ name: 1 })
      .exec();
  }

  async findOneById(id: ObjectId): Promise<CategoryDocument> {
    return this.categoryModel
      .findOne({ _id: new ObjectId(id), deletedAt: null })
      .exec();
  }

  async findOneByName(name: string): Promise<CategoryDocument> {
    return this.categoryModel.findOne({ name, deletedAt: null }).exec();
  }

  async updateOne(body: any, id: string): Promise<any> {
    return this.categoryModel
      .updateOne({ _id: new ObjectId(id) }, { $set: body })
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

    const object = await this.categoryModel
      .findOne({ _id: new ObjectId(id) })
      .exec();

    object.deletedAt = new Date();

    await this.categoryModel
      .updateOne({ _id: new ObjectId(id) }, { $set: object })
      .exec();
  }

  async exists(id: string): Promise<boolean> {
    const obj = await this.categoryModel
      .findOne({ _id: new ObjectId(id) })
      .exec();
    return !!obj?._id;
  }
}
