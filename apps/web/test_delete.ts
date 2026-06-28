import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  try {
    console.log("Attempting to delete all assets...");
    await prisma.asset.deleteMany();
    console.log("Successfully deleted all assets");
  } catch (e) {
    console.error("Failed to delete assets:", e);
  }
}

main().finally(() => prisma.$disconnect());
