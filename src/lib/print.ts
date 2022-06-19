import { SerialPort } from 'serialport';
import { Printer } from 'thermalprinter';
import { Song } from '../modules/songs/songs.schema';

export async function printOnThermalPaper(song: Song) {
  const serialport = new SerialPort({ path: '/dev/ttyUSB0', baudRate: 9600 });

  serialport.on('open', function () {
    const printer = new Printer(serialport);
    printer.on('ready', function () {
      song.content.split('\n').map((line: string) => {
        printer.printLine(line);
      });
      printer.print(function () {
        console.log('done');
        process.exit();
      });
    });
  });
}
