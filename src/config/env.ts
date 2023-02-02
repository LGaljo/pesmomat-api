import * as dotenv from 'dotenv';

export interface Env {
  API_PORT: number;
  API_HOST: string;
  MONGO_URI: string;
  MONGO2_URI: string;
  ON_RPI: boolean;
  AZURE_API_KEY: string;
  PRINTER_NAME: string;
  SYNC_ENABLED: boolean;
}

dotenv.config();

export const env: Env = {
  API_PORT: Number(process.env['API_PORT']),
  API_HOST: process.env['API_HOST'],
  ON_RPI: Boolean(process.env['ON_RPI']),
  MONGO_URI: process.env['MONGO_URI'],
  MONGO2_URI: process.env['MONGO2_URI'],
  AZURE_API_KEY: process.env['AZURE_API_KEY'],
  PRINTER_NAME: process.env['PRINTER_NAME'],
  SYNC_ENABLED: process.env['SYNC_ENABLED'] === 'true' || false,
};
