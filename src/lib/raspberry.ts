import { Gpio } from 'onoff';

export function raspberry() {
  if (Gpio.accessible) {
    const button = new Gpio(23, 'in', 'rising', { debounceTimeout: 100 });

    button.watch((err, value) => {
      if (err) {
        console.error(err);
      }
      console.log(value);
    });
  } else {
    console.log('Gpio not available');

    setTimeout(() => {
      console.log('test');
    }, 100000);
  }
}
