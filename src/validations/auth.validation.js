import Joi from 'joi';

const password = Joi.string()
  .min(8)
  .max(72)
  .pattern(/^(?=.*[A-Za-z])(?=.*\d).+$/)
  .messages({ 'string.pattern.base': 'password must contain at least one letter and one number' });

export const registerSchema = {
  body: Joi.object({
    name: Joi.string().trim().min(2).max(50).required(),
    email: Joi.string().trim().lowercase().email().required(),
    password: password.required()
  })
};

export const loginSchema = {
  body: Joi.object({
    email: Joi.string().trim().lowercase().email().required(),
    password: Joi.string().required()
  })
};
