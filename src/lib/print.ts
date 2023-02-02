import { Song } from '../modules/songs/songs.schema';
import {
  CharacterSet,
  printer as ThermalPrinter,
  types as PrinterTypes,
} from 'node-thermal-printer';
import * as prt from 'printer';
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

  printer.alignLeft();
  printer.println('');
  printer.println('');
  printer.println('');
  printer.bold(true);
  printer.println(song.title);
  printer.bold(false);
  printer.println(`${song.author.firstName} ${song.author.lastName}`);
  printer.println('');
  song.content.split('<br>').map((line: string) => {
    printer.println(line);
  });
  printer.println('');
  // printer.alignCenter();
  // await printer.printImage(
  //   path.join(process.cwd(), `static/images/Vrabec-logo.png`),
  // );
  printer.printLogo(0, 0);
  printer.println('');
  printer.println('www.vrabecanarhist.eu');
  printer.println('');
  printer.println('');

  try {
    const execute = printer.execute();
    console.error('Print done!');
  } catch (error) {
    console.log('Print failed:', error);
  }
}
