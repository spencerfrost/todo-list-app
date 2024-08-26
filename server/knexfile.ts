import dotenv from 'dotenv';
import type { Knex } from "knex";
import path from 'path';
  
dotenv.config();
const migrationDirectory = path.join(__dirname, 'migrations');

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
    },
    migrations: {
      ...defaultConfig.migrations,
      extension: 'js',
      loadExtensions: ['.js']
    }
  }
};

export default config;