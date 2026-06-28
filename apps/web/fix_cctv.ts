import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  try {
    // Ensure NVR category exists
    let nvrCat = await prisma.category.findFirst({ where: { name: "NVR" } });
    if (!nvrCat) nvrCat = await prisma.category.create({ data: { name: "NVR", code: "NVR" } });

    // Ensure Switch category exists
    let switchCat = await prisma.category.findFirst({ where: { name: "Network Switch" } });
    if (!switchCat) switchCat = await prisma.category.create({ data: { name: "Network Switch", code: "SWT" } });

    // Ensure Monitor category exists
    let monitorCat = await prisma.category.findFirst({ where: { name: "Monitor PC" } });
    if (!monitorCat) monitorCat = await prisma.category.create({ data: { name: "Monitor PC", code: "MNT" } });

    const assets = await prisma.asset.findMany({
      where: {
        category: { name: "CCTV Camera" }
      }
    });

    for (const asset of assets) {
      const hn = asset.hostname?.toUpperCase() || "";
      let newCat = null;
      let newTag = asset.tag;

      if (hn.includes("NVR")) {
        newCat = nvrCat;
        newTag = asset.tag.replace("-CCTV-", "-NVR-");
      } else if (hn.includes("SWITCH")) {
        newCat = switchCat;
        newTag = asset.tag.replace("-CCTV-", "-SWT-");
      } else if (hn.includes("MONITOR")) {
        newCat = monitorCat;
        newTag = asset.tag.replace("-CCTV-", "-MNT-");
      }

      if (newCat) {
        await prisma.asset.update({
          where: { id: asset.id },
          data: {
            categoryId: newCat.id,
            tag: newTag
          }
        });
        console.log(`Fixed ${asset.hostname}: Category -> ${newCat.name}, Tag -> ${newTag}`);
      }
    }
  } catch (e) {
    console.error("Failed to fix CCTV assets:", e);
  }
}

main().finally(() => prisma.$disconnect());
