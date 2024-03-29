import {
  CharacterSet,
  printer as ThermalPrinter,
  types as PrinterTypes,
} from 'node-thermal-printer';
import * as prt from '@damonsmith/node-printer';

(async () => {
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

  printer.alignCenter();
  printer.println(`
  ABCČĆDĐEFGHIJKLMNOPQRSŠTUVWXYZŽ
  ABCČĆDĐEFGHIJKLMNOPQRSŠTUVWXYZŽ
  `);
  // await printer.printImage('./static/images/Vrabec-logo-2.png');
  printer.printLogo(0, 0);
  printer.cut();
  // printer.printQR('www.vrabecanarhist.eu');
  // printer.cut();

  try {
    await printer.execute();
    console.log('Print done!');
  } catch (error) {
    console.log('Print failed:', error);
  }

  process.exit();
})().catch(async (err) => {
  console.log(err);
});
