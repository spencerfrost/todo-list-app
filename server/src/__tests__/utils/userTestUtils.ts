import bcrypt from 'bcrypt';
import db from '../../db';
import { User } from '../../types'; // Adjust the import path as needed

export async function createTestUser(userData: Partial<User> = {}): Promise<User> {
  const defaultUserData = {
    username: `test_user_${Date.now()}`,
    email: `test_user_${Date.now()}@example.com`,
    password: 'test_password',
  };
  const mergedUserData = { ...defaultUserData, ...userData };
  const hashedPassword = await bcrypt.hash(mergedUserData.password, 10);
  const [user] = await db('users').insert({
    ...mergedUserData,
    password: hashedPassword,
  }).returning('*');
  return user;
}