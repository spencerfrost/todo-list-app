import express from 'express';
import * as taskController from './controllers/taskController';

const router = express.Router();

router.get('/tasks', taskController.getAllTasks);
router.post('/tasks', taskController.createTask);
router.get('/tasks/:id', taskController.getTask);
router.put('/tasks/:id', taskController.updateTask);
router.delete('/tasks/:id', taskController.deleteTask);
// completeTask
router.put('/tasks/:id/complete', taskController.completeTask);

// Add other routes here

export default router;