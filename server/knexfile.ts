import dotenv from 'dotenv';
import type { Knex } from "knex";
import path from 'path';
  
// const rootDir = path.resolve(__dirname, '.');
// const nodeEnv = process.env.NODE_ENV || 'development';
// const envFile = `.env.${nodeEnv}`;
// const envPath = path.join(rootDir, envFile);

// if (fs.existsSync(envPath)) {
//   console.log(`Using ${envFile} for environment variables`);
//   dotenv.config({ path: envPath });
// } else {
  //   console.warn(`${envFile} not found. Falling back to .env`);
  //   dotenv.config({ path: path.join(rootDir, '.env') });
  // }
  
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

console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_USER:', process.env.DB_USER);
console.log('DB_NAME:', process.env.DB_NAME);

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