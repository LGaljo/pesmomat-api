import * as cheerio from 'cheerio';
import axios from 'axios';

export async function scrape(url: string) {
  const { data } = await axios.get(url);
  const $ = cheerio.load(data);

  const list = [];
  $('#main-content')
    .find('.post')
    .each(function (index, element) {
      const entry = {
        songId: $(element)
          .attr('class')
          .split(' ')
          .filter((cls) => cls.startsWith('post-'))[0]
          .trim(),
        title: $(element).find('.mh-loop-title > a').html().trim(),
        author: $(element).find('.mh-meta-author > a').html().trim(),
        content: $(element).find('.mh-excerpt > p').html().trim(),
        date: $(element).find('.mh-meta-date').html().trim(),
        url: $(element).find('.mh-loop-title > a').attr('href').trim(),
      };
      list.push(entry);
    });

  return list;
}
