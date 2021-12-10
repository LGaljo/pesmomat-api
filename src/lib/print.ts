import * as print_win from 'pdf-to-printer';
import * as print_unix from 'unix-print';

export async function printPDF(path: string) {
  if (process.platform === 'win32') {
    print_win.print(path).then(console.log);
  } else if (process.platform === 'linux') {
    print_unix.print(path).then(console.log);
  }
}
