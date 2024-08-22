import express from 'express';
import * as authController from './controllers/authController';
import * as settingsController from './controllers/settingsController';
import * as taskController from './controllers/taskController';
import { authenticateToken } from './middleware/authMiddleware';

const router = express.Router();

// Task Routes
router.get('/tasks', authenticateToken, taskController.getAllTasks);
router.post('/tasks', authenticateToken, taskController.createTask);
router.get('/tasks/:id', authenticateToken, taskController.getTask);
router.put('/tasks/:id', authenticateToken, taskController.updateTask);
router.delete('/tasks/:id', authenticateToken, taskController.deleteTask);
router.patch('/tasks/:id/complete', authenticateToken, taskController.completeTask);

// Auth Routes
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post("/check-email", authController.checkEmail);

// Settings Routes
router.get('/settings', authenticateToken, settingsController.getSettings);
router.put('/settings', authenticateToken, settingsController.updateSettings);

export default router;