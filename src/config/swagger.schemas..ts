import { TITLE_MAX, DESCRIPTION_MAX } from '../constants/taskConstants';

export const schemas = {
    Task: {
      type: 'object',
      required: ['id', 'title', 'priority', 'status', 'createdAt', 'updatedAt'],
      properties: {
        id: { type: 'string', format: 'uuid' },
        title: { type: 'string', maxLength: TITLE_MAX },
        description: { type: 'string', maxLength: DESCRIPTION_MAX },
        priority: {
          type: 'string',
          enum: ['low', 'medium', 'high'],
        },
        status: {
          type: 'string',
          enum: ['pending', 'in-progress', 'completed'],
        },
        dueDate: {
          type: 'string',
          format: 'date-time',
          nullable: true,
        },
        createdAt: {
          type: 'string',
          format: 'date-time',
        },
        updatedAt: {
          type: 'string',
          format: 'date-time',
        },
      },
    },
  
    CreateTaskRequest: {
      type: 'object',
      required: ['title', 'priority'],
      properties: {
        title: { type: 'string', maxLength: TITLE_MAX },
        description: { type: 'string', maxLength: DESCRIPTION_MAX },
        priority: {
          type: 'string',
          enum: ['low', 'medium', 'high'],
        },
        dueDate: {
          type: 'string',
          format: 'date-time',
        },
      },
    },
  
    ErrorResponse: {
      type: 'object',
      properties: {
        message: { type: 'string' },
        status: {
          type: 'number',
          example: 400,
        },
        timestamp: {
          type: 'string',
          format: 'date-time',
        }
      },
    },
  } as const;