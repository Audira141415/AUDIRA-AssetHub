import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  try {
    // Ensure Battery category exists
    let batteryCat = await prisma.category.findFirst({
      where: { name: "Battery" }
    });
    
    if (!batteryCat) {
      batteryCat = await prisma.category.create({
        data: { name: "Battery", code: "BAT", description: "Battery Banks and Modules" }
      });
      console.log("Created Battery category.");
    }
    
    const assets = await prisma.asset.findMany({
      where: {
        hostname: { contains: "Battery" }
      }
    });
    
    console.log(`Found ${assets.length} battery assets to fix.`);
    
    for (const asset of assets) {
      // Fix category
      let newTag = asset.tag;
      if (asset.tag.includes('-UPS-')) {
        newTag = asset.tag.replace('-UPS-', '-BAT-');
      }
      
      await prisma.asset.update({
        where: { id: asset.id },
        data: {
          categoryId: batteryCat.id,
          tag: newTag
        }
      });
      console.log(`Fixed asset ${asset.hostname}: Category -> Battery, Tag -> ${newTag}`);
    }
    
    console.log("All battery assets have been successfully fixed!");
  } catch (e) {
    console.error("Failed to fix assets:", e);
  }
}

main().finally(() => prisma.$disconnect());
