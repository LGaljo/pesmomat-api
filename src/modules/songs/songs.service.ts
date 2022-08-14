import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { Song, SongDocument } from './songs.schema';
import { InjectModel } from '@nestjs/mongoose';
import { synthesizeSpeech } from '../../lib/tts';
import { ObjectId } from 'mongodb';
import {
  Category,
  CategoryDocument,
} from '../categories/schemas/category.schema';
import { Author, AuthorDocument } from '../author/author.schema';

@Injectable()
export class SongsService {
  constructor(
    @InjectModel(Song.name) private songModel: Model<SongDocument>,
    @InjectModel(Category.name) private categoryModel: Model<CategoryDocument>,
    @InjectModel(Author.name) private authorModel: Model<AuthorDocument>,
  ) {}

  async create(object: any): Promise<SongDocument> {
    const createdSong = new this.songModel(object);
    if (object?.author) {
      createdSong.author = await this.authorModel.findOne({
        _id: new ObjectId(object?.author),
      });
    }
    if (object?.category) {
      createdSong.category = await this.categoryModel.findOne({
        _id: new ObjectId(object?.category),
      });
    }
    await createdSong.save();
    return createdSong;
  }

  async findAll(
    limit = 15,
    skip: number = null,
    filter: any,
  ): Promise<SongDocument[]> {
    const params = { deletedAt: null };
    if (filter?.author) {
      params['author'] = new ObjectId(filter.author);
    }
    if (filter?.category) {
      params['category'] = new ObjectId(filter.category);
    }
    if (filter?.lang) {
      params['language'] = filter.lang;
    }
    if (filter?.favourite) {
      params['favourite'] = true;
    }

    return await this.songModel
      .find(params)
      .skip(skip)
      .limit(limit)
      .sort({ _id: -1 })
      .populate('author')
      .populate('category')
      .exec();
  }

  async findOne(id: string): Promise<SongDocument> {
    return this.songModel
      .findOne({ _id: id, deletedAt: null })
      .populate('author')
      .populate('category')
      .exec();
  }

  async exists(songId: string): Promise<boolean> {
    const obj = await this.songModel
      .findOne({ songId, deletedAt: null })
      .exec();
    return !!obj?._id;
  }

  async deleteOne(id: string): Promise<void> {
    const object = await this.songModel
      .findOne({ _id: new ObjectId(id) })
      .exec();

    object.deletedAt = new Date();

    await this.songModel
      .updateOne({ _id: new ObjectId(id) }, { $set: object })
      .exec();
  }

  async updateOne(id: string, data: any) {
    const object = await this.songModel
      .findOne({ _id: new ObjectId(id) })
      .exec();

    object.title = data?.title;
    object.content = data?.content;
    object.url = data?.url;
    if ((object?.author as any)?._id !== data.authorId) {
      object.author = await this.authorModel.findOne({
        _id: new ObjectId(data?.authorId),
      });
    }
    if ((object?.category as any)?._id !== data.categoryId) {
      object.category = await this.categoryModel.findOne({
        _id: new ObjectId(data?.categoryId),
      });
    }

    await this.songModel
      .updateOne({ _id: new ObjectId(id) }, { $set: object })
      .exec();

    return await this.findOne(id);
  }

  async manageFavourites(id: string) {
    const object = await this.songModel
      .findOne({ _id: new ObjectId(id) })
      .exec();

    object.favourite = !object?.favourite;

    await object.save();

    return await this.findOne(id);
  }

  async tts(text: string, songId: string) {
    if (songId) {
      const song = await this.findOne(songId);
      text = song.content;
    }
    text = text.replace(/<br>/g, ', ');
    text = text.replace(/[óòô]/g, 'o');
    text = text.replace(/[eèéêə]/g, 'e');
    text = text.replace(/[ìí]/g, 'i');
    text = text.replace(/[àá]/g, 'a');
    text = text.replace(/[úù]/g, 'u');

    return await synthesizeSpeech(text, {
      filename: `song_${songId}.mp3`,
    });
  }
}
