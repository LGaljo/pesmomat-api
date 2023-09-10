import * as dotenv from 'dotenv';

export interface Env {
  API_PORT: number;
  API_HOST: string;
  API_URL: string;
  APP_URL: string;
  GENERATOR_API: string;
  MONGO_URI: string;
  MONGO2_URI: string;
  JWT_SECRET: string;
  SALT_ROUNDS: number;
  ON_RPI: boolean;
  AZURE_API_KEY: string;
  PRINTER_NAME: string;
  SYNC_ENABLED: boolean;
  MAIL_SENDER_NAME: string;
  MAIL_PASSWORD: string;
  MAIL_ADDRESS: string;
  MAIL_PORT: number;
  MAIL_HOST: string;
  MAIL_TEMPLATE_PATH: string;
}

dotenv.config();

export const env: Env = {
  API_PORT: Number(process.env['API_PORT']),
  API_HOST: process.env['API_HOST'],
  API_URL: process.env['API_URL'],
  APP_URL: process.env['APP_URL'],
  GENERATOR_API: process.env['GENERATOR_API'],
  ON_RPI: Boolean(process.env['ON_RPI']),
  MONGO_URI: process.env['MONGO_URI'],
  MONGO2_URI: process.env['MONGO2_URI'],
  JWT_SECRET: process.env['JWT_SECRET'],
  SALT_ROUNDS: Number(process.env['SALT_ROUNDS']),
  AZURE_API_KEY: process.env['AZURE_API_KEY'],
  PRINTER_NAME: process.env['PRINTER_NAME'],
  SYNC_ENABLED: process.env['SYNC_ENABLED'] === 'true' || false,
  MAIL_SENDER_NAME: process.env['MAIL_SENDER_NAME'],
  MAIL_PASSWORD: process.env['MAIL_PASSWORD'],
  MAIL_ADDRESS: process.env['MAIL_ADDRESS'],
  MAIL_PORT: Number(process.env['MAIL_PORT']),
  MAIL_HOST: process.env['MAIL_HOST'],
  MAIL_TEMPLATE_PATH: process.env['MAIL_TEMPLATE_PATH'],
};
