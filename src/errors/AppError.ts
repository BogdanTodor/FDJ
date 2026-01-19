// Define parent error class
export class AppError extends Error {
    public statusCode: number;
    public isOperational?: boolean;

    constructor(
        message: string,
        statusCode: number,
        isOperational = true
    ) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = isOperational;
        this.name = this.constructor.name;
    }
}

export class ValidationError extends AppError {
    constructor(message: string) {
      super(message, 400);
    }
}

export class NotFoundError extends AppError {
    constructor(message: string) {
      super(message, 400);
    }
}

export class ConflictError extends AppError {
    constructor(message: string) {
        super(message, 409);
    }
}


