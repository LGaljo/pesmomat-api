import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { Song, SongDocument } from './songs.schema';
import { InjectModel } from '@nestjs/mongoose';
import { synthesizeSpeech, synthesizeSpeechSlo } from '../../lib/tts';
import { ObjectId } from 'mongodb';
import {
  Category,
  CategoryDocument,
} from '../categories/category.schema';
import { Author, AuthorDocument } from '../author/author.schema';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class SongsService {
  constructor(
    @InjectModel(Song.name) private songModel: Model<SongDocument>,
    @InjectModel(Category.name) private categoryModel: Model<CategoryDocument>,
    @InjectModel(Author.name) private authorModel: Model<AuthorDocument>,
  ) {}

  async create(object: any): Promise<SongDocument> {
    const createdSong = new this.songModel(object);
    if (object?.author && !object?.author.hasOwnProperty('firstName')) {
      createdSong.author = await this.authorModel.findOne({
        _id: new ObjectId(object?.author),
      });
    }
    if (object?.category && !object?.category.hasOwnProperty('name')) {
      createdSong.category = await this.categoryModel.findOne({
        _id: new ObjectId(object?.category),
      });
    }
    const res = await createdSong.save();
    return createdSong;
  }

  async findAll(
    limit = 15,
    skip: number = null,
    filter?: any,
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
      // .limit(limit)
      .sort({ title: 1 })
      .populate('author')
      .populate('category')
      .exec();
  }

  async findOne(id: ObjectId): Promise<SongDocument> {
    return this.songModel
      .findOne({ _id: id, deletedAt: null })
      .populate('author')
      .populate('category')
      .exec();
  }

  async findOneByTitle(
    title: string,
    includeDeleted = false,
  ): Promise<SongDocument> {
    const query = {
      title,
    };
    if (includeDeleted) {
      query['deletedAt'] = null;
    }
    return this.songModel
      .findOne(query)
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

  async deleteOne(id: string): Promise<any> {
    const object = await this.songModel
      .findOne({ _id: new ObjectId(id) })
      .exec();

    object.deletedAt = new Date();

    return await this.songModel
      .updateOne({ _id: new ObjectId(id) }, { $set: object })
      .exec();
  }

  async updateOne(id: string, data: any) {
    const object = await this.songModel
      .findOne({ _id: new ObjectId(id) })
      .populate('author')
      .populate('category')
      .exec();

    object.title = data?.title;
    object.content = data?.content;
    object.contents = data?.contents;
    object.url = data?.url;
    if (data?.favourite) object.favourite = data?.favourite;
    if (data.authorId && (object?.author as any)?._id !== data.authorId) {
      object.author = await this.authorModel.findOne({
        _id: new ObjectId(data?.authorId),
      });
    }
    if (data.categoryId && (object?.category as any)?._id !== data.categoryId) {
      object.category = await this.categoryModel.findOne({
        _id: new ObjectId(data?.categoryId),
      });
    }
    object.updatedAt = new Date();

    await object.save();

    return object;
  }

  async manageFavourites(id: string) {
    const object = await this.songModel
      .findOne({ _id: new ObjectId(id) })
      .exec();

    object.favourite = !object?.favourite;

    await object.save();

    return object;
  }

  async tts(songId?: any, options?: any) {
    let text;
    let filename;
    let filenameSlo;
    const song = await this.findOne(new ObjectId(songId));
    if (options?.language && !!song?.contents[options?.language]) {
      text = song.contents[options?.language];
      filename = `song_${songId}_${options.language}.mp3`;
      filenameSlo = `song_${songId}_${options.language}.wav`;
    } else {
      text = song?.content;
      filename = `song_${songId}.mp3`;
      filenameSlo = `song_${songId}.wav`;
    }

    text = text.replace(/<br>/g, '!');
    //text = text.replace(/[óòôö]/g, 'o');
    //text = text.replace(/[eèéêə]/g, 'e');
    //text = text.replace(/[ìí]/g, 'i');
    //text = text.replace(/[àá]/g, 'a');
    //text = text.replace(/[úù]/g, 'u');
    let texti = text.replace(/[.!?]/g, '.!');
    let textArray = texti.split("!");


    synthesizeSpeechSlo(textArray, {
      options,
      filenameSlo,
    });

    return;
    return synthesizeSpeech(text, {
      options,
      filename,
    });
    
  }

  ttsExists(songId?: any, options?: any) {
    let filename;
    if (options?.language) {
      filename = `assets/song_${songId}_${options.language}.wav`;
    } else {
      filename = `assets/slo/ziga/song_${songId}.wav`;
    }

    const fp = path.join(process.cwd(), filename);

    return fs.existsSync(fp) && fs.statSync(fp)?.size > 0;
  }


  async createTtsForAll(){
    let songs = await this.findAll();
    for (let song of songs){
      if(!this.ttsExists((song as any)._id)){
        await this.tts((song as any)._id);
        await new Promise(resolve => setTimeout(resolve, 3000));
      }
    }
  }

}
