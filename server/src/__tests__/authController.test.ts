import request from 'supertest';
import { app } from '../server';
import { createTestUser } from './setupTests';

describe('Auth Controller', () => {
  describe('POST /api/register', () => {
    it('should register a new user', async () => {
      const userData = {
        username: 'newuser',
        email: 'newuser@example.com',
        password: 'password123'
      };

      const response = await request(app)
        .post('/api/register')
        .send(userData);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('user');
      expect(response.body.user).toHaveProperty('id');
      expect(response.body.user.email).toBe(userData.email);
      expect(response.body.user.username).toBe(userData.username);
    });

    it('should not register a user with an existing email', async () => {
      const existingUser = await createTestUser();

      const response = await request(app)
        .post('/api/register')
        .send({
          username: 'newusername',
          email: existingUser.email,
          password: 'password123'
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error', 'Email already in use');
    });

    it('should not register a user with an existing username', async () => {
      const existingUser = await createTestUser();

      const response = await request(app)
        .post('/api/register')
        .send({
          username: existingUser.username,
          email: 'newemail@example.com',
          password: 'password123'
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error', 'Username already in use');
    });
  });

  describe('POST /api/login', () => {
    it('should login an existing user', async () => {
      const testUser = await createTestUser({
        password: 'password123'
      });

      const loginResponse = await request(app)
        .post('/api/login')
        .send({
          usernameOrEmail: testUser.email,
          password: 'password123'
        });

      expect(loginResponse.status).toBe(200);
      expect(loginResponse.body).toHaveProperty('token');
    });

    it('should not login with incorrect password', async () => {
      const testUser = await createTestUser({
        password: 'correctpassword'
      });

      const loginResponse = await request(app)
        .post('/api/login')
        .send({
          usernameOrEmail: testUser.email,
          password: 'wrongpassword'
        });

      expect(loginResponse.status).toBe(401);
      expect(loginResponse.body).toHaveProperty('error', 'Invalid credentials');
    });

    it('should login with username instead of email', async () => {
      const testUser = await createTestUser({
        password: 'password123'
      });

      const loginResponse = await request(app)
        .post('/api/login')
        .send({
          usernameOrEmail: testUser.username,
          password: 'password123'
        });

      expect(loginResponse.status).toBe(200);
      expect(loginResponse.body).toHaveProperty('token');
    });
  });
});