import { print } from 'pdf-to-printer';

export async function printPDF(path: string) {
  print(path).then(console.log);
}
