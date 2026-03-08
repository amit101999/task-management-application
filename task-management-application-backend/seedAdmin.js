import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

async function main() {
  const email = 'admin@gmail.com';
  const password = 'root';
  
  // creating hashed password with salt rounds = 2 (as used in userController)
  const hashpassword = await bcrypt.hash(password, 2);

  const adminUser = await prisma.user.upsert({
    where: { email },
    update: {
      password: hashpassword,
      role: 'ADMIN', // Ensuring role is ADMIN
    },
    create: {
      name: 'Admin',
      email,
      password: hashpassword,
      role: 'ADMIN',
    },
  });

  console.log('Admin user created/updated successfully:', adminUser.email);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
