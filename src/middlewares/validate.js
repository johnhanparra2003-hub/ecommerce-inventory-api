import { AppError } from '../utils/AppError.js';

/**
 * Validates req.params, req.query and req.body against Joi schemas.
 * Replaces each with the sanitized value (unknown keys stripped, defaults applied).
 */
export const validate = (schemas) => (req, _res, next) => {
  const details = [];

  for (const location of ['params', 'query', 'body']) {
    if (!schemas[location]) continue;

    const { value, error } = schemas[location].validate(req[location], {
      abortEarly: false,
      stripUnknown: true,
      convert: true
    });

    if (error) {
      details.push(
        ...error.details.map((detail) => ({
          location,
          field: detail.path.join('.'),
          message: detail.message.replace(/"/g, '')
        }))
      );
    } else {
      req[location] = value;
    }
  }

  if (details.length > 0) {
    return next(new AppError('Validation failed', 400, details));
  }
  next();
};
