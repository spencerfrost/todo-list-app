import bcrypt from 'bcrypt';
import db from '../db';
import { app } from '../server';

let testServer: any;

beforeAll(async () => {
  await setupDatabase();
  testServer = await setupServer();
});

beforeEach(async () => {
  await db.raw('START TRANSACTION');
});

afterEach(async () => {
  await db.raw('ROLLBACK');
});

afterAll(async () => {
  await closeServer();
  await db('users').delete(); // Clean up any leftover users
  await db.destroy();
});

async function setupDatabase() {
  try {
    await db.raw('SELECT 1+1 AS result');
    const [lastMigration] = await db.migrate.list();
    if (!(lastMigration?.file)) {
      await db.migrate.latest();
    }
  } catch (error) {
    console.error('Database setup failed:', error);
    throw error;
  }
}

// We'll export this function instead of running it in beforeAll
export async function createTestUser(overrides = {}) {
  const defaultUser = {
    username: `test_user_${Date.now()}`,
    email: `test_user_${Date.now()}@example.com`,
    password: 'test_password',
  };

  const userData = { ...defaultUser, ...overrides };
  const hashedPassword = await bcrypt.hash(userData.password, 10);

  const [user] = await db('users').insert({
    ...userData,
    password: hashedPassword,
  }).returning('*');

  return user;
}

async function setupServer() {
  return new Promise<any>((resolve) => {
    const serverInstance = app.listen(0, () => {
      resolve(serverInstance);
    });
  });
}

async function closeServer() {
  return new Promise<void>((resolve) => {
    if (testServer) {
      testServer.close(() => {
        resolve();
      });
    } else {
      resolve();
    }
  });
}