import { User } from '../models/user.model.js';

const findByEmail = (email, { withPassword = false } = {}) => {
  const query = User.findOne({ email: email.toLowerCase() });
  return withPassword ? query.select('+password') : query;
};

const findById = (id) => User.findById(id);

const create = (userData) => User.create(userData);

export const userRepository = { findByEmail, findById, create };
