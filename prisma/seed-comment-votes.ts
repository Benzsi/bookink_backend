import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export async function seedCommentVotes() {
  console.log('5. Komment értékelések generálása (meglévő userek)...');

  const users = await prisma.user.findMany({ select: { id: true } });
  const comments = await prisma.comment.findMany({ select: { id: true } });

  if (comments.length === 0 || users.length === 0) {
    console.warn('Nincsenek kommentek vagy userek, seed kihagyva.');
    return;
  }

  await prisma.commentvote.deleteMany();
  await prisma.comment.updateMany({ data: { likes: 0, dislikes: 0 } });

  for (const comment of comments) {
    // Pick a random subset of users (max 15, min 1)
    const maxVoters = Math.min(15, users.length);
    const voterCount = randInt(1, maxVoters);
    const shuffled = [...users].sort(() => Math.random() - 0.5);
    const voters = shuffled.slice(0, voterCount);

    // Random like bias for this comment (0.0 = all dislike, 1.0 = all like)
    const likeBias = Math.random();

    let likes = 0;
    let dislikes = 0;

    for (const user of voters) {
      const isLike = Math.random() < likeBias;
      await prisma.commentvote.create({
        data: { userId: user.id, commentId: comment.id, isLike },
      });
      if (isLike) likes++; else dislikes++;
    }

    await prisma.comment.update({
      where: { id: comment.id },
      data: { likes, dislikes },
    });
  }

  console.log('Komment értékelések sikeresen feltöltve!');
}

const isDirectExecution = (process.argv[1] || '').includes('seed-comment-votes.ts');

if (isDirectExecution) {
  void seedCommentVotes()
    .catch((error) => {
      console.error('Hiba:', error);
      process.exitCode = 1;
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
