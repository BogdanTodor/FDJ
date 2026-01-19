import { Request, Response, NextFunction } from 'express';
import { AppError } from '../errors/AppError';

export const errorHandler = (
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // Custom errors have been created in `kps-node\src\errors\AppErrors.ts`. These defined error types have the status code
  // defined on creation so no additional handling needs to happen - err message is set where the error is thrown in the custom 
  // error constructor and status code is pre-set in the custom error to reflect the type of HTTP error it is.
  // err has been changed from AppError to Unknown to handle edge cases where non AppError are thrown - below logic handles this safely.
  let error: AppError;

  if (err instanceof AppError) {
    error = err;
  } else {
    // Log unexpected errors and return generic Internal Server Error.
    console.error('unexpected error:', err);
    error = new AppError('Internal Server Error', 500, false);
  }

  res.status(error.statusCode).json({
    error: {
      message: error.message,
      status: error.statusCode,
      timestamp: new Date().toISOString(),
    },
  });
}; 