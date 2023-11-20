import { Song } from '../modules/songs/songs.schema';
import {
  CharacterSet,
  printer as ThermalPrinter,
  types as PrinterTypes,
} from 'node-thermal-printer';
import * as prt from '@damonsmith/node-printer';
import { env } from '../config/env';

export async function printThermalPrinter(song: Song) {
  const printer = new ThermalPrinter({
    type: PrinterTypes.TGH,
    interface: 'printer:' + env.PRINTER_NAME,
    characterSet: CharacterSet.SLOVENIA,
    driver: require('printer'),
  });

  console.log(prt.getPrinters());
  console.log(prt.getPrinter(env.PRINTER_NAME));

  if (!(await printer.isPrinterConnected())) {
    throw new Error('Printer is not connected');
  }

  printer.add(Buffer.from([0x1d, 0x7c, 0x06]));
  printer.setTypeFontB();
  printer.bold(true);
  printer.println(song.title);
  printer.bold(false);
  printer.println(`${song.author.firstName} ${song.author.lastName}`);
  printer.println('');
  song.content.split('<br>').map((line: string) => {
    printer.println(line);
  });
  printer.println('');
  printer.alignCenter();
  printer.printLogo(0, 0);
  printer.println('');
  printer.printQR(song.url || 'www.vrabecanarhist.eu');
  printer.println('www.vrabecanarhist.eu');
  printer.cut();

  try {
    await printer.execute();
    console.error('Print done!');
  } catch (error) {
    console.log('Print failed:', error);
  }
}
