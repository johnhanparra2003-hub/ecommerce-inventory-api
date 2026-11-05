import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { userRepository } from '../repositories/user.repository.js';
import { AppError } from '../utils/AppError.js';
import { asyncHandler } from '../utils/asyncHandler.js';

/**
 * Protects a route: requires "Authorization: Bearer <token>" with a valid JWT
 * that belongs to an existing, active user. Attaches the user to req.user.
 */
export const authenticate = asyncHandler(async (req, _res, next) => {
  const authorizationHeader = req.headers.authorization;

  if (!authorizationHeader?.startsWith('Bearer ')) {
    throw new AppError('Authentication required. Provide a Bearer token', 401);
  }

  const token = authorizationHeader.slice(7);
  const payload = jwt.verify(token, env.jwtSecret); // JWT errors are mapped in errorHandler

  const user = await userRepository.findById(payload.sub);
  if (!user || !user.isActive) {
    throw new AppError('The user belonging to this token no longer exists', 401);
  }

  req.user = user;
  next();
});
