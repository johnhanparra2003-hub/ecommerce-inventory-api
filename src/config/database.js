import mongoose from 'mongoose';
import { env } from './env.js';

mongoose.set('strictQuery', true);

export const connectDatabase = async () => {
  await mongoose.connect(env.mongoUri, { serverSelectionTimeoutMS: 10000 });
  console.log(`[database] Connected to MongoDB (${mongoose.connection.name})`);
};

export const disconnectDatabase = async () => {
  await mongoose.disconnect();
  console.log('[database] Connection closed');
};
