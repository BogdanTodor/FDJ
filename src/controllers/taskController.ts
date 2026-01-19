import { Request, Response, NextFunction } from 'express';
import { ValidationError } from '../errors/AppErrors';
import { TaskService } from '../services/taskService';
import { Task, CreateTaskRequest, TaskQueryParams } from '../types/task';
import { validateCreateTask, validateTaskQuery } from '../validation/taskValidation';

// getAlltasks is the controller for the GET /tasks route and handles validation and fetching of tasks.
export const getAllTasks = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  // Validate request query params against Joi schema and handle bad request.
  const { error, value } = validateTaskQuery(req.query)
  if (error) {
    return next(new ValidationError(error.message));
  }

  try {
    // Cast validated query params to proper TaskQueryParams type.
    const queryParams: TaskQueryParams = value;
    const tasks: Task[] = await TaskService.getAllTasks(queryParams);

    res.status(200).json(tasks);
  } catch (err) {
    next(err);
  }
};

// createTask is the controller for the POST /tasks route and handles validation and creation of a new task.
export const createTask = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  // Validate request body against Joi schema and handle bad request.
  const { error, value } = validateCreateTask(req.body);
  if (error) {
    return next(new ValidationError(error.message));
  }

  try {
    // Assign validated request to proper CreateTaskRequest type.
    const taskData: CreateTaskRequest = value;
    const createdTask: Task = await TaskService.createTask(taskData);

    res.status(201).json(createdTask);
  } catch (err) {
    next(err);
  }
}; 
