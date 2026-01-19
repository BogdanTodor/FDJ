/**
 * Task Management Types
 * 
 */

export type TaskStatus = 'pending' | 'in-progress' | 'completed';
export type TaskPriority = 'low' | 'medium' | 'high';

export enum TaskStatuses {
  pending = 'pending',
  inProgress = 'in-progress',
  completed = 'completed',
};

export enum TaskPriorities {
  high = 'high',
  medium = 'medium',
  low = 'low',
};

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