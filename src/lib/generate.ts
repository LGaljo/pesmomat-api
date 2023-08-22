import { Logger } from '@nestjs/common';

const axios = require('axios').default;

class Generator {
  private readonly logger = new Logger('generate lib');

  async generatePoem(options: {
    stanza: number;
    verse: number;
    ryhme: string;
    A: string;
    B: string;
  }) {
    logger = new Logger('generate lib');

    try {
      await axios.post('http://pesmomat-generate/generate_poem', {
        poem1_title: '',
        poem2_title: '',
        how_many_similar_poems: 100,
        how_many_similar_verses: 20,
        number_of_stanzas: options.stanza,
        number_of_verses_per_stanza: options.verse,
        rhyme_scheme: options.ryhme.split('-'),
      });
    } catch (err) {
      this.logger.error('Sth went wrong, check pesmomix container');
      this.logger.error(err);
    }
  }
}
