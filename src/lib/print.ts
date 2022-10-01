import { SerialPort } from 'serialport';
import * as Printer from 'thermalprinter';
import { Song } from '../modules/songs/songs.schema';
import { escapeChars } from './utils';

import {
  printer as ThermalPrinter,
  types as PrinterTypes,
} from 'node-thermal-printer';
import * as prt from 'printer';

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
      printer.printLine(
        escapeChars(`${song.author.firstName} ${song.author.lastName}`),
      );
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

export async function printThermalPrinter(song: Song) {
  const printer = new ThermalPrinter({
    type: PrinterTypes.EPSON,
    interface: 'printer:POS-80',
    characterSet: 'SLOVENIA',
    driver: require('printer'),
  });

  console.log(prt.getPrinter('POS-80'));

  if (!(await printer.isPrinterConnected())) {
    throw new Error('Printer is not connected');
  }

  printer.println('');
  printer.bold(true);
  printer.println(escapeChars(song.title));
  printer.bold(false);
  printer.println(
    escapeChars(`${song.author.firstName} ${song.author.lastName}`),
  );
  printer.println('');
  song.content.split('<br>').map((line: string) => {
    printer.println(escapeChars(line));
  });
  printer.println('');
  printer.alignCenter();
  await printer.printImage('./assets__/Vrabec-logo.png');
  printer.println('');
  printer.println('www.vrabecanarhist.eu');
  printer.println('');

  try {
    const execute = printer.execute();
    console.error('Print done!');
  } catch (error) {
    console.log('Print failed:', error);
  }
}
