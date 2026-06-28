import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const assets = await prisma.asset.findMany({ include: { category: true } });
  const grouped: Record<string, string[]> = {};
  for(const a of assets) {
    if(!grouped[a.category.name]) grouped[a.category.name] = [];
    grouped[a.category.name].push(a.hostname || "");
  }
  for(const cat in grouped) {
    console.log('\n--- ' + cat + ' ---');
    console.log(Array.from(new Set(grouped[cat])).join(', '));
  }
}

main().finally(() => prisma.$disconnect());
