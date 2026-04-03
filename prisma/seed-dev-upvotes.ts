
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function seedDevUpvotes() {
  console.log('Dev Log felpontozások generálása...');

  // Az összes felhasználó és projekt lekérése
  const users = await prisma.user.findMany();
  const projects = await prisma.devproject.findMany();

  if (users.length === 0 || projects.length === 0) {
    console.log('Nincs elég felhasználó vagy projekt a felpontozáshoz.');
    return;
  }

  let voteCount = 0;

  for (const project of projects) {
    // Minden projekthez egyedi népszerűségi szint (0.1 és 0.9 között)
    const popularity = Math.random() * 0.8 + 0.1;
    
    for (const user of users) {
      if (Math.random() < popularity) {
        await prisma.devprojectwishlist.upsert({
          where: {
            userId_projectId: {
              userId: user.id,
              projectId: project.id
            }
          },
          update: {},
          create: {
            userId: user.id,
            projectId: project.id
          }
        });
        voteCount++;
      } else {
        // Ha nem kapott upvotot, de korábban véletlenül volt, töröljük a változatosság kedvéért
        try {
          await prisma.devprojectwishlist.delete({
            where: {
              userId_projectId: {
                userId: user.id,
                projectId: project.id
              }
            }
          });
        } catch (e) {
          // Nem létezett, semmi baj
        }
      }
    }
  }

  console.log(`✓ ${voteCount} darab véletlenszerű felpontozás sikeresen generálva!`);
}

if (require.main === module) {
  seedDevUpvotes()
    .catch((e) => {
      console.error(e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
