import { Router } from 'express';
import * as taskController from '../controllers/taskController';

const router = Router();

/**
 * @swagger
 * /api/tasks:
 *   get:
 *     summary: Get all tasks.
 *     description: Returns a list of tasks (with query params for filtering by `status` and `priority`).
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, in-progress, completed]
 *         description: The status to filter tasks by
 *       - in: query
 *         name: priority
 *         schema:
 *           type: string
 *           enum: [low, medium, high]
 *         description: The priority to filter tasks by 
 *     responses:
 *       '200':
 *         description: Ok
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Task'
 *       '400':
 *         description: Bad request
 *       '500':
 *         description: Internal server error
 */
router.get('/tasks', taskController.getAllTasks);

/**
 * @swagger
 * /api/tasks:
 *   post:
 *     summary: Create new task.
 *     description: Create a new task with a title and priority, and optionally dueDate and description.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateTaskRequest'
 *     responses:
 *       '201':
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       '400':
 *         description: Bad request
 *       '409':
 *         description: Conflict
 *       '500':
 *         description: Internal server error
 */
router.post('/tasks', taskController.createTask);

// Test helper endpoint - only for clearing test data
if (process.env.NODE_ENV === 'test') {
  router.delete('/tasks/test-clear-all', async (req, res) => {
    const { TaskService } = await import('../services/taskService');
    await TaskService.clearAllTasks();
    res.status(204).send();
  });
}

export { router as taskRoutes }; 