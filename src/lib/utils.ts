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

export function escapeChars(input: string) {
  input = input.replace(/[óòô]/g, 'o');
  input = input.replace(/[eèéêə]/g, 'e');
  input = input.replace(/[ìí]/g, 'i');
  input = input.replace(/[àá]/g, 'a');
  input = input.replace(/[úù]/g, 'u');

  input = input.replace(/[ÓÒÔ]/g, 'O');
  input = input.replace(/[EÈÉÊƏ]/g, 'E');
  input = input.replace(/[ÌÍ]/g, 'I');
  input = input.replace(/[ÀÁ]/g, 'A');
  input = input.replace(/[ÚÙ]/g, 'U');

  input = input.replace(/[ŕ]/g, 'r');
  input = input.replace(/[Ŕ]/g, 'R');

  input = input.replace(/[ž]/g, 'z');
  input = input.replace(/[Ž]/g, 'Z');
  input = input.replace(/[š]/g, 's');
  input = input.replace(/[Š]/g, 'S');
  input = input.replace(/[č]/g, 'c');
  input = input.replace(/[Č]/g, 'C');
  input = input.replace(/[ć]/g, 'c');
  input = input.replace(/[Ć]/g, 'C');
  input = input.replace(/[đ]/g, 'dz');
  input = input.replace(/[Đ]/g, 'DZ');

  return input;
}
