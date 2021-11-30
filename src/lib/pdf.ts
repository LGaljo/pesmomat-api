// eslint-disable-next-line @typescript-eslint/no-var-requires
const pdf = require('pdf-creator-node');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const fs = require('fs');

const options = {
  format: 'A4',
  orientation: 'portrait',
  border: '25mm',
  // header: {
  //   height: '45mm',
  //   contents: '<div style="text-align: center;">Author: Shyam Hajare</div>',
  // },
  // footer: {
  //   height: '28mm',
  //   contents: {
  //     first: 'Cover page',
  //     2: 'Second page', // Any page number is working. 1-based index
  //     default:
  //       '<span style="color: #444;">{{page}}</span>/<span>{{pages}}</span>', // fallback value
  //     last: 'Last Page',
  //   },
  // },
};

export async function createPDF(song: any): Promise<string> {
  // Read HTML Template
  console.log(path.resolve('dist', 'templates', 'song.html'));
  const html = fs.readFileSync(
    path.resolve('dist', 'templates', 'songs.html'),
    'utf8',
  );

  const filename = `./songs/song_${song._id}.pdf`;
  const document = {
    html,
    data: {
      title: song?.title || 'Štiri pesmi',
      author: song?.author || 'Maja Miloševič Čustić',
      content:
        song?.content ||
        'Oče je palični mešalnik.<br>' +
          'Šit, spet so se naredile grudice,<br>' +
          'nisem bila pozorna.<br>' +
          'Velike so, mastne in debele.<br>' +
          'Moj jezik je govorica grudic.',
    },
    path: filename,
    type: '', // By default a file is created but you could switch between Buffer and Streams by using "buffer" or "stream" respectively.
  };

  const response = await pdf.create(document, options);

  console.log(response);

  return filename;
}
