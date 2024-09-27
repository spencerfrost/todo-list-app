import jwt from 'jsonwebtoken';
import request from 'supertest';
import db from '../db';
import { app } from '../server';
import { Task, User } from '../types'; // Adjust this import as needed
import { createTestUser } from './utils/userTestUtils';

describe('Task API', () => {
  let testUser: User;
  let token: string;
  let testTask: Task;

  beforeEach(async () => {
    // Create a test user
    testUser = await createTestUser();
    
    // Generate a token for the test user
    const secretKey = process.env.JWT_SECRET ?? 'test_secret';
    token = jwt.sign({ userId: testUser.id }, secretKey, { expiresIn: '1h' });

    // Create a test task for the user
    [testTask] = await db('tasks').insert({
      title: 'Test Task',
      description: 'This is a test task',
      user_id: testUser.id,
      completed: false
    }).returning('*');
  });

  afterEach(async () => {
    // Clean up tasks and users after each test
    await db('tasks').delete();
    await db('users').delete();
  });

  describe('GET /api/tasks', () => {
    it('should return all tasks for an authorized user', async () => {
      const response = await request(app)
        .get('/api/tasks')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(1);
      expect(response.body[0].id).toBe(testTask.id);
    });
    
    it('should return 401 if unauthorized', async () => {
      const response = await request(app).get('/api/tasks');
      expect(response.status).toBe(401);
      expect(response.body).toEqual({ error: 'Unauthorized' });
    });
  });

  describe('POST /api/tasks', () => {
    it('should create a new task', async () => {
      const newTask = {
        title: 'New Test Task',
        description: 'This is a new test task',
      };

      const response = await request(app)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${token}`)
        .send(newTask);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.title).toBe(newTask.title);
      expect(response.body.user_id).toBe(testUser.id);
    });

    it('should return 400 if title is missing', async () => {
      const response = await request(app)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${token}`)
        .send({
          description: 'This is a test task without a title',
        });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ error: 'Title is required' });
    });
  });

  describe('GET /api/tasks/:id', () => {
    it('should return a task by ID', async () => {
      const response = await request(app)
        .get(`/api/tasks/${testTask.id}`)
        .set('Authorization', `Bearer ${token}`);
  
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id', testTask.id);
    });

    it('should return 404 if task not found', async () => {
      const nonExistentTaskId = 9999; // Non-existing task ID
      const response = await request(app)
        .get(`/api/tasks/${nonExistentTaskId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ error: 'Task not found' });
    });
  });

  describe('PUT /api/tasks/:id', () => {
    it('should update an existing task', async () => {
      const updatedTask = {
        title: 'Updated Task Title',
        description: 'Updated description',
      };

      const response = await request(app)
        .put(`/api/tasks/${testTask.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send(updatedTask);
  
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('title', updatedTask.title);
      expect(response.body).toHaveProperty('description', updatedTask.description);
    });

    it('should return 404 if task not found', async () => {
      const nonExistentTaskId = 9999; // Non-existing task ID
      const response = await request(app)
        .put(`/api/tasks/${nonExistentTaskId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'Updated Task Title',
        });

      expect(response.status).toBe(404);
      expect(response.body).toEqual({
        error: "Task not found or you don't have permission to update it",
      });
    });
  });

  describe('DELETE /api/tasks/:id', () => {
    it('should delete an existing task', async () => {
      const response = await request(app)
        .delete(`/api/tasks/${testTask.id}`)
        .set('Authorization', `Bearer ${token}`);
  
      expect(response.status).toBe(200);
      expect(response.body).toEqual({ message: 'Task deleted successfully' });

      // Verify the task is actually deleted
      const deletedTask = await db('tasks').where('id', testTask.id).first();
      expect(deletedTask).toBeUndefined();
    });

    it('should return 404 if task not found', async () => {
      const nonExistentTaskId = 9999; // Non-existing task ID
      const response = await request(app)
        .delete(`/api/tasks/${nonExistentTaskId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(404);
      expect(response.body).toEqual({
        error: "Task not found or you don't have permission to delete it",
      });
    });
  });

  describe('PATCH /api/tasks/:id/complete', () => {
    it('should mark a task as completed', async () => {
      const response = await request(app)
        .patch(`/api/tasks/${testTask.id}/complete`)
        .set('Authorization', `Bearer ${token}`);
  
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('completed', true);

      // Verify the task is actually marked as completed in the database
      const updatedTask = await db('tasks').where('id', testTask.id).first();
      expect(updatedTask.completed).toBe(true);
    });
  
    it('should return 404 if task not found', async () => {
      const nonExistentTaskId = 9999; // Non-existing task ID
      const response = await request(app)
        .patch(`/api/tasks/${nonExistentTaskId}/complete`)
        .set('Authorization', `Bearer ${token}`);
  
      expect(response.status).toBe(404);
      expect(response.body).toEqual({
        error: "Task not found or you don't have permission to complete it",
      });
    });
  });
});