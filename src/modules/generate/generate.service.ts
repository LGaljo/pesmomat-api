import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { GeneratedPoem, GeneratedPoemDocument } from './generate.schema';

@Injectable()
export class GenerateService {
  constructor(
    @InjectModel(GeneratedPoem.name)
    private model: Model<GeneratedPoemDocument>,
  ) {}

  public async generatePoem(options: {
    stanza: number;
    verse: number;
    ryhme: string;
    A: string;
    B: string;
  }) {


    await this.model.create({
      ...options,
      content: '',
    });
  }
}
