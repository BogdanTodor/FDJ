import { v4 as uuidv4 } from 'uuid';
import { ConflictError } from '../errors/AppErrors';
import { Task, CreateTaskRequest, TaskQueryParams, TaskPriority } from '../types/task';

/**
 * Task Service - Business Logic Layer
 * 
 * This service manages the in-memory task storage and business logic.
 * In a real application, this would interface with a database.
 */

const tasks: Task[] = [];
const uniqueTaskTitles = new Set<string>();

// Defines numerical order for task priorities.
const PRIORITY_ORDER: Record<TaskPriority, number> = {
  'high': 3,
  'medium': 2,
  'low': 1,
}

export class TaskService {
  
  static async getAllTasks(queryParams?: TaskQueryParams): Promise<Task[]> {
    let queriedTasks = [...tasks];

    // Filter tasks by query params if provided.
    if (queryParams) {
      queriedTasks = this.filterTasks(queriedTasks, queryParams);
    }

    // Sort tasks by priority first then created time and return result.
    return this.sortTasks(queriedTasks);
  }

  static async createTask(taskData: CreateTaskRequest): Promise<Task> {
    // Normalise task title to allow for easier duplicate checks and handle duplicate errors.
    const normalisedTitle = this.normaliseTitle(taskData.title);
    if (uniqueTaskTitles.has(normalisedTitle)) {
      throw new ConflictError('A task with the same title already exists');
    }

    const now = new Date();
    
    const createdTask: Task = {
      id: uuidv4(),
      title: taskData.title,
      description: taskData.description,
      priority: taskData.priority,
      status: 'pending',
      createdAt: now,
      updatedAt: now,
      dueDate: taskData.dueDate,
    };

    tasks.push(createdTask);
    uniqueTaskTitles.add(normalisedTitle);

    return createdTask;
  }

  // Test helper method - clears all tasks for testing
  static async clearAllTasks(): Promise<void> {
    tasks.length = 0;
    uniqueTaskTitles.clear();
  }

  // Normalises the title of a task to make duplication checks simpler.
  private static normaliseTitle(title: string): string {
    // Future TODO: Add regex to strip out double whitespace or internal whitespacing.
    return title.trim().toLowerCase();
  }

  // filterTasks filters the tasks by the provided query params.
  private static filterTasks(tasks: Task[], filterParams: TaskQueryParams): Task[] {
    const { status, priority } = filterParams;

    return tasks.filter(task => {
      const hasStatus = status ? task.status === status : true;
      const hasPriority = priority ? task.priority === priority : true;
      return hasStatus && hasPriority;
    });
  }

  // sortTasks will sort the input Task array by the defined priority order then by created time.
  private static sortTasks(tasks: Task[]): Task[]{
    return [...tasks].sort((a, b) => {
      const priorityComparison =
        PRIORITY_ORDER[b.priority] - PRIORITY_ORDER[a.priority];

      return priorityComparison !== 0 ? priorityComparison : b.createdAt.getTime() - a.createdAt.getTime();
    });
  }
} 