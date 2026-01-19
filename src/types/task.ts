/**
 * Task Management Types
 * 
 */

export const TASK_STATUSES = ['pending', 'in-progress', 'completed'] as const;
export const TASK_PRIORITIES = ['low', 'medium', 'high'] as const;

export type TaskStatus = typeof TASK_STATUSES[number];
export type TaskPriority = typeof TASK_PRIORITIES[number];

export interface Task {
  id: string;              // UUID
  title: string;           // Required, max 100 chars
  description?: string;    // Optional, max 500 chars
  priority: TaskPriority;
  status: TaskStatus;
  createdAt: Date;
  updatedAt: Date;
  dueDate?: Date;         // Optional
}

export interface CreateTaskRequest {
  title: string;
  description?: string;
  priority: TaskPriority;
  dueDate?: Date;
}

export interface TaskQueryParams {
  status?: TaskStatus;
  priority?: TaskPriority;
} 