import { Injectable, Logger } from "@nestjs/common";
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { GeneratedPoem, GeneratedPoemDocument } from './generate.schema';
import axios from 'axios';
import { env } from '../../config/env';

@Injectable()
export class GenerateService {
  constructor(
    @InjectModel(GeneratedPoem.name)
    private model: Model<GeneratedPoemDocument>,
  ) {}
  private readonly logger = new Logger(GenerateService.name);

  public async generatePoem(options: {
    poem1_title: string;
    poem2_title: string;
    number_of_stanzas?: number;
    number_of_verses_per_stanza?: number;
    rhyme_scheme?: string;
    first_line?: string;
    repetition?: string;
    how_many_similar_poems?: string;
    how_many_similar_verses?: string;
  }) {
    let response: any;
    try {
      response = await axios.post(`${env.GENERATOR_API}/generate_poem`, {
        poem1_title: options.poem1_title,
        poem2_title: options.poem2_title,
        number_of_stanzas: options.number_of_stanzas,
        rhyme_scheme: options.rhyme_scheme.split('-'),
        number_of_verses_per_stanza: options.number_of_verses_per_stanza,
        first_line: options.first_line,
        how_many_similar_poems: options.how_many_similar_poems ?? 100,
        how_many_similar_verses: options.how_many_similar_verses ?? 20,
        repetition: options.repetition ?? false,
      });
    } catch (err) {
      this.logger.error('Sth went wrong, check pesmomix container');
      this.logger.error(err);
    }

    // await this.model.create({
    //   ...options,
    //   content: '',
    // });

    return response?.data;
  }
}
