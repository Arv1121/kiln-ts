import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Add seed data here, e.g.:
  // await prisma.user.create({ data: { name: "Ada", email: "ada@example.com" } });
  console.log("Seed complete (no seed data defined yet).");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
