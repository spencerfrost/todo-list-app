import dotenv from 'dotenv';
import type { Knex } from "knex";
import path from 'path';

// Load the appropriate .env file based on the NODE_ENV
const envFile = process.env.NODE_ENV ? `.env.${process.env.NODE_ENV}` : '.env';
dotenv.config({ path: path.resolve(process.cwd(), envFile) });

const migrationDirectory = path.join(__dirname, 'migrations');
console.log('Migration directory:', migrationDirectory);
console.log('Current working directory:', process.cwd());
console.log('Environment variables:', {
  DB_HOST: process.env.DB_HOST,
  DB_NAME: process.env.DB_NAME,
  DB_USER: process.env.DB_USER,
});

interface ConnectionConfig {
  host: string | undefined;
  database: string | undefined;
  user: string | undefined;
  password: string | undefined;
}

const defaultConnection: ConnectionConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
};

const defaultConfig: Knex.Config = {
  client: "postgresql",
  connection: defaultConnection,
  migrations: {
    directory: migrationDirectory
   }
};

const config: { [key: string]: Knex.Config } = {
  development: {
    ...defaultConfig,
    connection: {
      ...defaultConnection,
      database: process.env.DB_NAME || 'todoapp_dev'
    }
  },
  production: {
    ...defaultConfig,
    connection: {
      ...defaultConnection,
      database: process.env.DB_NAME || 'todoapp_prod'
    }
  }
};

export default config;