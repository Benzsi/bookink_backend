
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany({ select: { id: true } });
  const comments = await prisma.comment.findMany({ select: { id: true } });

  if (users.length === 0 || comments.length === 0) {
    console.log('Nincs felhasználó vagy komment a rendszerben.');
    return;
  }

  console.log(`Létező szavazatok törlése...`);
  await prisma.commentVote.deleteMany({});

  console.log(`Random szavazatok generálása ${comments.length} kommentre...`);

  for (const comment of comments) {
    // Minden kommentnél véletlenszerűen kiválasztjuk a felhasználók egy részét (pl. 20-80%)
    const voteCount = Math.floor(Math.random() * (users.length + 1));
    const shuffledUsers = [...users].sort(() => 0.5 - Math.random()).slice(0, voteCount);

    for (const user of shuffledUsers) {
      await prisma.commentVote.create({
        data: {
          userId: user.id,
          commentId: comment.id,
          isLike: Math.random() > 0.3 // 70% eséllyel like
        }
      });
    }

    // Újraszámoljuk a komment értékeit
    const likes = await prisma.commentVote.count({ where: { commentId: comment.id, isLike: true } });
    const dislikes = await prisma.commentVote.count({ where: { commentId: comment.id, isLike: false } });

    await prisma.comment.update({
      where: { id: comment.id },
      data: { likes, dislikes }
    });
  }

  console.log('Sikeresen legeneráltuk a szavazatokat és frissítettük a számlálókat!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
