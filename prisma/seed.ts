import prisma from "../utils/Prisma";
import { hash } from "bcryptjs";




async function main() {
  const password = await hash('password123', 12);
  const passwordHash = await hash('password456', 12);
  const users = await Promise.all([
    // Authors
    prisma.user.create({
      data: {
        name: 'Kalvium Author One',
        email: 'kalviumauthor1@example.com',
        passwordHash: password,
        role: 'author'
      }
    }),
    prisma.user.create({
      data: {
        name: 'Kalvium Author Two',
        email: 'kalviumauthor2@example.com',
        passwordHash: password,
        role: 'author'
      }
    }),
    // Consumers
    prisma.user.create({
      data: {
        name: 'Consumer One',
        email: 'consumer1@example.com',
        passwordHash: passwordHash,
        role: 'consumer'
      }
    }),
    prisma.user.create({
      data: {
        name: 'Consumer Two',
        email: 'consumer2@example.com',
        passwordHash: passwordHash,
        role: 'consumer'
      }
    })
  ]);

  console.log('Seeded users:', users);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });