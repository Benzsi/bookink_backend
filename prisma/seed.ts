import { PrismaClient, user_role } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { seedBooks } from './seed-books';
import { seedRatings } from './seed-ratings';
import { seedComments } from './seed-comments';
import { seedCommentVotes } from './seed-comment-votes';
import { seedDevLogs } from './seed-devlogs';
import { seedDevUpvotes } from './seed-dev-upvotes';

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
      update: { passwordHash, role: user_role.ADMIN, email, updatedAt: new Date() },
      create: { username, email, passwordHash, role: user_role.ADMIN, updatedAt: new Date() },
    });
    console.log('✓ Admin user létrehozva!');

    // 1.5. Developer user létrehozása
    console.log('\nDeveloper user létrehozása...');
    const devUsername = 'developer';
    const devEmail = 'developer@bookink.hu';
    const devPassword = 'developer';
    const devPasswordHash = await bcrypt.hash(devPassword, 10);

    await prisma.user.upsert({
      where: { username: devUsername },
      update: { passwordHash: devPasswordHash, role: user_role.DEVELOPER, email: devEmail, updatedAt: new Date() },
      create: { username: devUsername, email: devEmail, passwordHash: devPasswordHash, role: user_role.DEVELOPER, updatedAt: new Date() },
    });
    console.log('✓ Developer user létrehozva!');

    // 2. Könyvek feltöltése
    console.log('\n2. Könyvek feltöltése...');
    await seedBooks();

    // 3. Értékelések generálása
    console.log('\n3. Értékelések generálása...');
    await seedRatings();

    // 4. Kommentek generálása
    await seedComments();

    // 6. Dev Logok generálása
    console.log('\n6. Dev Logok generálása...');
    await seedDevLogs();

    // 7. Véletlenszerű felpontozások
    await seedDevUpvotes();

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
