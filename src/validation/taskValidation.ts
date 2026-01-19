import Joi from 'joi';
import { TITLE_MAX, DESCRIPTION_MAX } from '../constants/taskConstants';
import { TaskPriorities, TaskStatus, TaskStatuses } from '../types/task';

/**
 * Task Validation Schemas
 * 
 */

export const createTaskSchema = Joi.object({
  title: Joi.string().trim().min(1).max(TITLE_MAX).required().messages({
    'string.base': 'title must be string',
    'string.empty': 'title must not be empty',
    'string.min': 'title must not be empty',
    'string.max': `title length must not exceed ${TITLE_MAX} characters`,
    'any.required': 'title is required',
  }),
  description: Joi.string().max(DESCRIPTION_MAX).optional().messages({
    'string.base': 'description must be string',
    'string.max': `description length must not exceed ${DESCRIPTION_MAX} characters`,
  }),
  priority: Joi.string().valid(...Object.values(TaskPriorities)).required().messages({
    'any.required': 'priority is required',
    'any.only': 'priority must be one of: low, medium or high',
  }),
  // README says to treat tests as spec and the test casts dueDate to isostring hence below logic.
  dueDate: Joi.date().iso().raw().greater('now').optional().messages({
    'date.base': 'dueDate must be a valid date',
    'date.format': 'dueDate must be a valid ISO 8601 date string',
    'date.greater': 'dueDate must be in the future',
  }),

}).unknown(false); // Reject unknown fields

export const taskQuerySchema = Joi.object({
  status: Joi.string().valid(...Object.values(TaskStatuses)).optional().messages({
    'any.only': 'status must be one of: pending, in-progress or completed',
  }),
  priority: Joi.string().valid(...Object.values(TaskPriorities)).optional().messages({
    'any.only': 'priority must be one of: low, medium or high',
  }),

}).unknown(false); // Reject unknown query params

// Validation helper functions
export const validateCreateTask = (data: unknown) => {
  return createTaskSchema.validate(data);
};

export const validateTaskQuery = (data: unknown) => {
  return taskQuerySchema.validate(data);
}; 