import express from 'express';
import * as authController from './controllers/authController';
import * as taskController from './controllers/taskController';

const router = express.Router();

// Task routes
router.get('/tasks', taskController.getAllTasks);
router.post('/tasks', taskController.createTask);
router.get('/tasks/:id', taskController.getTask);
router.put('/tasks/:id', taskController.updateTask);
router.delete('/tasks/:id', taskController.deleteTask);

// Auth Routes
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post("/check-email", authController.checkEmail);

export default router;