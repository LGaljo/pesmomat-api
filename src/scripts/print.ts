import {
  printer as ThermalPrinter,
  types as PrinterTypes,
} from 'node-thermal-printer';
import * as prt from 'printer';

(async () => {
  const printer = new ThermalPrinter({
    type: PrinterTypes.EPSON,
    interface: 'printer:POS-80',
    characterSet: 'SLOVENIA',
    driver: require('printer'),
  });

  console.log(prt.getPrinter('POS-80'));

  console.log(await printer.isPrinterConnected());

  printer.alignCenter();
  printer.println('ABCČĆDĐEFGHIJKLMNOPQRSŠTUVWXYZŽ');
  printer.println('ABCČĆDĐEFGHIJKLMNOPQRSŠTUVWXYZŽ');
  printer.println('ABCČĆDĐEFGHIJKLMNOPQRSŠTUVWXYZŽ');
  printer.println('ABCČĆDĐEFGHIJKLMNOPQRSŠTUVWXYZŽ');
  // await printer.printImage('./assets__/Vrabec-logo.png');
  printer.cut();

  try {
    const execute = printer.execute();
    console.error('Print done!');
  } catch (error) {
    console.log('Print failed:', error);
  }

  process.exit();
})().catch(async (err) => {
  console.log(err);
});
