import { Injectable } from '@nestjs/common';
import { Model, ObjectId } from 'mongoose';
import { Song, SongDocument } from './songs.schema';
import { InjectModel } from '@nestjs/mongoose';
import { synthesizeSpeech } from '../../lib/tts';

@Injectable()
export class SongsService {
  constructor(@InjectModel(Song.name) private songModel: Model<SongDocument>) {}

  async create(object: any): Promise<SongDocument> {
    const createdSong = new this.songModel(object);
    await createdSong.save();
    return createdSong;
  }

  async findAll(limit = 15, offset: number): Promise<SongDocument[]> {
    return await this.songModel.find().limit(limit).sort({ _id: -1 }).exec();
  }

  async findOne(id: string): Promise<SongDocument> {
    return await this.songModel.findOne({ _id: id }).exec();
  }

  async exists(songId: string): Promise<boolean> {
    const obj = await this.songModel.findOne({ songId }).exec();
    return !!obj?._id;
  }

  async tts(text: string, songId: string) {
    if (songId) {
      const song = await this.findOne(songId);
      text = song.content;
    }
    return await synthesizeSpeech(text.replace(/<br>/g, ', '), {
      filename: `song_${songId}.mp3`,
    });
  }
}
