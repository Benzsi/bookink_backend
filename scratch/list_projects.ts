
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  const projects = await prisma.devproject.findMany();
  console.log(JSON.stringify(projects, null, 2));
}
main().catch(console.error).finally(() => prisma.$disconnect());
