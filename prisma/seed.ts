import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

async function main() {
  const prisma = new PrismaClient();
  const username = 'admin';
  const email = 'admin@bookink.hu';
  const password = 'admin';
  const passwordHash = await bcrypt.hash(password, 10);

  await prisma.user.upsert({
    where: { username },
    update: { passwordHash, role: Role.ADMIN, email },
    create: { username, email, passwordHash, role: Role.ADMIN },
  });

  await prisma.$disconnect();
}

void main().catch(async (err) => {
  console.error(err);
  process.exit(1);
});
