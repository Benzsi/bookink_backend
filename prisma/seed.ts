import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { seedBooks } from './seed-books';
import { seedRatings } from './seed-ratings';

async function main() {
  const prisma = new PrismaClient();
  
  try {
    console.log('Seeding megkezdődött...');
    
    // 1. Admin user létrehozása
    console.log('\n1. Admin user létrehozása...');
    const username = 'admin';
    const email = 'admin@bookink.hu';
    const password = 'admin';
    const passwordHash = await bcrypt.hash(password, 10);

    await prisma.user.upsert({
      where: { username },
      update: { passwordHash, role: Role.ADMIN, email },
      create: { username, email, passwordHash, role: Role.ADMIN },
    });
    console.log('✓ Admin user létrehozva!');

    // 2. Könyvek feltöltése
    console.log('\n2. Könyvek feltöltése...');
    await seedBooks();

    // 3. Értékelések generálása
    console.log('\n3. Értékelések generálása...');
    await seedRatings();

    console.log('\nSeeding sikeresen befejezve!');
  } catch (error) {
    console.error('Hiba a seeding során:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

void main().catch(async (err) => {
  console.error(err);
  process.exit(1);
});
