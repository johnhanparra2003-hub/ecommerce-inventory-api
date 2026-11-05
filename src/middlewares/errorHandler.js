import { env } from '../config/env.js';
import { AppError } from '../utils/AppError.js';

/** Translates known library errors into AppError instances. */
const normalizeError = (err) => {
  if (err instanceof AppError) return err;

  if (err.type === 'entity.parse.failed') {
    return new AppError('Malformed JSON in request body', 400);
  }
  if (err.name === 'CastError') {
    return new AppError(`Invalid value for "${err.path}"`, 400);
  }
  if (err.name === 'ValidationError' && err.errors) {
    const details = Object.values(err.errors).map((e) => ({ field: e.path, message: e.message }));
    return new AppError('Validation failed', 400, details);
  }
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    return new AppError(`Duplicate value for "${field}"`, 409);
  }
  if (err.name === 'TokenExpiredError') {
    return new AppError('Token has expired. Please log in again', 401);
  }
  if (err.name === 'JsonWebTokenError') {
    return new AppError('Invalid token', 401);
  }
  return err;
};

// eslint-disable-next-line no-unused-vars
export const errorHandler = (err, req, res, _next) => {
  const error = normalizeError(err);
  const isOperational = error instanceof AppError;
  const statusCode = isOperational ? error.statusCode : 500;

  if (!isOperational || statusCode >= 500) {
    console.error(`[error] ${req.method} ${req.originalUrl}`, err);
  }

  const response = {
    success: false,
    status: statusCode,
    message: isOperational || !env.isProduction ? error.message : 'Internal server error'
  };

  if (isOperational && error.details) response.errors = error.details;
  if (!env.isProduction && statusCode >= 500) response.stack = err.stack;

  res.status(statusCode).json(response);
};
