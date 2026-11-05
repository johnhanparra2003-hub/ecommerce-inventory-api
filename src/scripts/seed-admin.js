import bcrypt from 'bcryptjs';
import { connectDatabase, disconnectDatabase } from '../config/database.js';
import { env } from '../config/env.js';
import { USER_ROLES } from '../models/user.model.js';
import { userRepository } from '../repositories/user.repository.js';

const seedAdmin = async () => {
  await connectDatabase();

  const { name, email, password } = env.admin;
  const existingAdmin = await userRepository.findByEmail(email);

  if (existingAdmin) {
    console.log(`[seed] Admin "${email}" already exists. Nothing to do.`);
  } else {
    const hashedPassword = await bcrypt.hash(password, env.bcryptSaltRounds);
    await userRepository.create({ name, email, password: hashedPassword, role: USER_ROLES.ADMIN });
    console.log(`[seed] Admin created: ${email}`);
  }

  await disconnectDatabase();
};

seedAdmin().catch((error) => {
  console.error('[seed] Failed:', error);
  process.exit(1);
});
