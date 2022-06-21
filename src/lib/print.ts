import { SerialPort } from 'serialport';
import * as Printer from 'thermalprinter';
import { Song } from '../modules/songs/songs.schema';
import { escapeChars } from './utils';

export async function printOnThermalPaper(song: Song) {
  const serialport = new SerialPort({ path: '/dev/ttyS0', baudRate: 9600 });

  serialport.on('open', function () {
    const printer = new Printer(serialport, {
      charset: 6,
      chineseFirmware: true,
      heatingTime: 100,
    });
    printer.on('ready', function () {
      printer.bold(true);
      printer.printLine(escapeChars(song.title));
      printer.bold(false);
      printer.printLine(escapeChars(song.author));
      printer.printLine('');
      song.content.split('<br>').map((line: string) => {
        printer.printLine(escapeChars(line));
      });
      printer.printLine('');
      printer.printLine('');
      printer.printLine('');
      printer.print(function () {
        console.log('done');
        serialport.close();
      });
    });
  });
}
