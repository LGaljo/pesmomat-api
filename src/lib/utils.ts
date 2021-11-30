import { env } from '../config/env';
import chalk from 'chalk';
import fs from 'fs';

export function getCurrentDateNow() {
  return new Date().toISOString();
}

export function writeToFile(string) {
  const destination = (env.ON_RPI ? '/home/pi/nodejs/' : './') + 'RelayLog.txt';

  try {
    fs.appendFile(destination, string + '\n', function (err) {
      if (err) console.log(chalk.red('Error while I/O operation'));
    });
  } catch (e) {
    console.log(chalk.red('Error writing to log file'));
  }
}
