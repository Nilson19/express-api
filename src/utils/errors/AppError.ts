import { HttpError } from './HttpError';

export class AppError extends HttpError {
  constructor(message: string, statusCode = 500, name = "AppError") {
    super(message, statusCode, name);
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ConflictError extends AppError {
  constructor(message: string, statusCode = 409, name = "ConflictError") {
    super(message, statusCode, name);
    Error.captureStackTrace(this, this.constructor);
  }
}

export class NotFoundError extends AppError {
  constructor(message: string, statusCode = 404, name = "NotFoundError") {
    super(message, statusCode, name);
    Error.captureStackTrace(this, this.constructor);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string, statusCode = 401, name = "UnauthorizedError") {
    super(message, statusCode, name);
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends AppError {
  constructor(message: string, statusCode = 422, name = "ValidationError") {
    super(message, statusCode, name);
    Error.captureStackTrace(this, this.constructor);
  }
}

export class InternalServerError extends HttpError {
  constructor(message = 'Internal server error') {
    super(message, 500, 'InternalServerError');
  }
}
