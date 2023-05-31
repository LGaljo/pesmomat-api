import { ObjectId } from 'mongodb';
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { SongsService } from '../modules/songs/songs.service';
import { INestApplicationContext } from '@nestjs/common';
import {
  CharacterSet,
  printer as ThermalPrinter,
  types as PrinterTypes,
} from 'node-thermal-printer';
import * as prt from '@damonsmith/node-printer';

let app: INestApplicationContext;

(async () => {
  app = await NestFactory.createApplicationContext(AppModule);
  const songsService = app.get<SongsService>(SongsService);

  const printerName = 'CUSTOM TG2480-H';
  const printer = new ThermalPrinter({
    type: PrinterTypes.TGH,
    interface: 'printer:' + printerName,
    characterSet: CharacterSet.SLOVENIA,
    driver: require('@damonsmith/node-printer'),
  });

  console.log(prt.getPrinters());
  console.log(prt.getPrinter(printerName));

  console.log(await printer.isPrinterConnected());

  const song = await songsService
    .findOne(new ObjectId('63384cc0d44f34158212f28a'))
    .then((doc: any) => doc?._doc);

  // Set the pitch size
  // printer.add(Buffer.from([0x1b, 0xc1, 0]));
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

  try {
    printer.cut();
    await printer.execute();
    console.error('Print done!');
  } catch (error) {
    console.log('Print failed:', error);
  }

  // process.exit();
})().catch(async (err) => {
  console.log(err);
});
