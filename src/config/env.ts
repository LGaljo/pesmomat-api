import * as dotenv from 'dotenv';

export interface Env {
  API_PORT: number;
  API_HOST: string;
  MONGO_URI: string;
  ON_RPI: boolean;
  AZURE_API_KEY: string;
}

dotenv.config();

export const env: Env = {
  API_PORT: Number(process.env['API_PORT']),
  API_HOST: process.env['API_HOST'],
  ON_RPI: Boolean(process.env['ON_RPI']),
  MONGO_URI: process.env['MONGO_URI'],
  AZURE_API_KEY: process.env['AZURE_API_KEY'],
};
