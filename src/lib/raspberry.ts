import { env } from '../config/env';

import piblaster from 'pi-blaster.js';
import chalk from 'chalk';
import { Gpio } from 'onoff';

const LOW = Gpio.LOW;
const HIGH = Gpio.HIGH;

let doors;
let other;

