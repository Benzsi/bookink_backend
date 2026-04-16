
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function updateProgress() {
  console.log('Holadó értékek frissítése...');

  const projects = await prisma.devproject.findMany();

  for (const project of projects) {
    let progress = Math.floor(Math.random() * 85) + 5; // 5% - 90% random
    
    // Kukabúvár special case
    if (project.name.toLowerCase().includes('kukabuvár') || project.name.toLowerCase().includes('kukabúvár')) {
      progress = 100;
      console.log(`✓ ${project.name} Haladás: 100%`);
    } else {
      console.log(`- ${project.name} Haladás: ${progress}%`);
    }

    await prisma.devproject.update({
      where: { id: project.id },
      data: { progress }
    });
  }

  console.log('✓ Minden projekt frissítve!');
}

updateProgress()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
