import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const books = await prisma.book.findMany();
  let users = await prisma.user.findMany();

  // Ha nincs legalább 20 user, generáljunk
  if (users.length < 20) {
    const toCreate = 20 - users.length;
    for (let i = 0; i < toCreate; i++) {
      const user = await prisma.user.create({
        data: {
          username: `user${users.length + i + 1}`,
          email: `user${users.length + i + 1}@bookink.hu`,
          passwordHash: 'dummy',
        },
      });
      users.push(user);
    }
  }

  for (const book of books) {
    // 10-20 random értékelés könyvenként
    const ratingsCount = Math.floor(Math.random() * 11) + 10;
    // Véletlen userId-k (ismétlődés nélkül)
    const shuffledUsers = users.sort(() => 0.5 - Math.random());
    for (let i = 0; i < ratingsCount; i++) {
      const user = shuffledUsers[i];
      const rating = Math.floor(Math.random() * 5) + 1;
      await prisma.rating.create({
        data: {
          rating,
          userId: user.id,
          bookId: book.id,
        },
      });
    }
  }

  await prisma.$disconnect();
  console.log('✓ Rating adatok sikeresen feltöltve!');
}

void main().catch(async (err) => {
  console.error(err);
  await prisma.$disconnect();
  process.exit(1);
});
