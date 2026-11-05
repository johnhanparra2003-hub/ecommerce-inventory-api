import { AppError } from '../utils/AppError.js';

/** Role-based access control. Must run after `authenticate`. */
export const authorize =
  (...allowedRoles) =>
  (req, _res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return next(new AppError('You do not have permission to perform this action', 403));
    }
    next();
  };
