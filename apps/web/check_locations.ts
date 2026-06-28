import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const assets = await prisma.asset.findMany();
  const racks = new Set(assets.map(a => a.rack));
  console.log("Racks (Rooms/Floors):", Array.from(racks));
}

main().finally(() => prisma.$disconnect());
