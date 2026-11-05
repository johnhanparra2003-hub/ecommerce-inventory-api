import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { userRepository } from '../repositories/user.repository.js';
import { AppError } from '../utils/AppError.js';

const generateToken = (user) =>
  jwt.sign({ sub: user.id, role: user.role }, env.jwtSecret, { expiresIn: env.jwtExpiresIn });

const register = async ({ name, email, password }) => {
  const existingUser = await userRepository.findByEmail(email);
  if (existingUser) {
    throw new AppError('Email is already registered', 409);
  }

  const hashedPassword = await bcrypt.hash(password, env.bcryptSaltRounds);
  const user = await userRepository.create({ name, email, password: hashedPassword });

  return { user, token: generateToken(user) };
};

const login = async ({ email, password }) => {
  const user = await userRepository.findByEmail(email, { withPassword: true });

  // Same message for "user not found" and "wrong password" to avoid user enumeration
  const invalidCredentials = new AppError('Invalid email or password', 401);
  if (!user || !user.isActive) throw invalidCredentials;

  const passwordMatches = await bcrypt.compare(password, user.password);
  if (!passwordMatches) throw invalidCredentials;

  return { user, token: generateToken(user) };
};

export const authService = { register, login };
