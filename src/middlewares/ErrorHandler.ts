import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/errors/AppError';

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction
) {

  const isCustomError = err instanceof AppError;

  const statusCode = isCustomError ? err.statusCode : 500;
  const errorName = isCustomError ? err.name : 'InternalServerError';
  const message = isCustomError ? err.message : 'Error interno del servidor';

  res.status(statusCode).json({
    status: 'error',
    name: errorName,
    message,
  });
}
