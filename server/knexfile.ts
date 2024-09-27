import dotenv from 'dotenv';
import fs from 'fs';
import type { Knex } from "knex";
import path from 'path';

// Dynamically select the appropriate .env file
const getEnvPath = () => {
  const nodeEnv = process.env.NODE_ENV ?? 'development';
  const envFile = `.env.${nodeEnv}`;
  
  return fs.existsSync(envFile) ? envFile : '.env';
};

// Load the dynamically selected .env file
dotenv.config({ path: getEnvPath() });

const migrationDirectory = path.join(__dirname, 'migrations');

interface ConnectionConfig {
  host: string;
  database: string;
  user: string;
  password: string;
  port: number;
}

const createConnection = (): ConnectionConfig => ({
  host: process.env.DB_HOST ?? 'localhost',
  database: process.env.DB_NAME ?? 'todoapp',
  user: process.env.DB_USER ?? 'postgres',
  password: process.env.DB_PASSWORD ?? '',
  port: parseInt(process.env.DB_PORT ?? '5432', 10)
});

const createConfig = (env: string): Knex.Config => ({
  client: "postgresql",
  connection: createConnection(),
  migrations: {
    directory: migrationDirectory,
    extension: env === 'production' ? 'js' : 'ts',
    loadExtensions: env === 'production' ? ['.js'] : ['.ts']
  },
  pool: {
    min: parseInt(process.env.DB_POOL_MIN ?? '2', 10),
    max: parseInt(process.env.DB_POOL_MAX ?? '10', 10)
  },
  debug: false
});

const config: Record<string, Knex.Config> = {
  development: createConfig('development'),
  test: {
    ...createConfig('test'),
    client: "postgresql",
    connection: {
      host: process.env.TEST_DB_HOST ?? 'localhost',
      database: process.env.TEST_DB_NAME ?? 'test_db',
      user: process.env.TEST_DB_USER ?? 'test_user',
      password: process.env.TEST_DB_PASSWORD ?? 'test_password',
      port: parseInt(process.env.TEST_DB_PORT ?? '5432', 10),
    },
    migrations: {
      directory: './migrations',
    },
    seeds: {
      directory: './seeds',
    },
  },
  production: createConfig('production')
};

export default config;