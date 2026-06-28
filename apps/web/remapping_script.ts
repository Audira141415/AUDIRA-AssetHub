import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const cats: Record<string, any> = {};

  async function getCat(name: string, code: string) {
    if (cats[name]) return cats[name];
    let c = await prisma.category.findFirst({ where: { name } });
    if (!c) {
      c = await prisma.category.create({ data: { name, code } });
    }
    cats[name] = c;
    return c;
  }

  const webcamCat = await getCat("Webcam", "WBC");
  const keyboxCat = await getCat("Key Box", "KEY");
  const detectorCat = await getCat("Smoke Detector", "DET");
  const cylinderCat = await getCat("Agent Cylinder", "CYL");
  const alarmCat = await getCat("Fire Alarm", "ALM");
  const signCat = await getCat("Evacuate Sign", "SGN");
  const nozzleCat = await getCat("Fire Nozzle", "NZL");
  const fssPanelCat = await getCat("FSS Panel", "FPN");

  const assets = await prisma.asset.findMany();
  let fixCount = 0;

  for (const asset of assets) {
    const hn = asset.hostname?.toUpperCase() || "";
    let newCat = null;

    if (hn.includes("WEBCAM")) {
      newCat = webcamCat;
    } else if (hn.includes("KUNCI") || hn.includes("KEY")) {
      newCat = keyboxCat;
    } else if (hn.includes("DETECTOR") || hn.includes("VESDA") || hn.includes("PHOTOELECTRIC")) {
      newCat = detectorCat;
    } else if (hn.includes("CYLINDER") || hn.includes("AGENT")) {
      newCat = cylinderCat;
    } else if (hn.includes("ALARM") || hn.includes("PUSH STATION") || hn.includes("HORN") || hn.includes("STROBE") || hn.includes("ABORT")) {
      newCat = alarmCat;
    } else if (hn.includes("EVACUATE") || hn.includes("SIGN")) {
      newCat = signCat;
    } else if (hn.includes("NOZZLE")) {
      newCat = nozzleCat;
    } else if (hn.includes("PANEL") && (hn.includes("FSS") || hn.includes("FIRE") || asset.category?.name.includes("Fire Suppression"))) {
      // If it's a panel and was previously in Fire Suppression
      newCat = fssPanelCat;
    }

    if (newCat && asset.categoryId !== newCat.id) {
      await prisma.asset.update({
        where: { id: asset.id },
        data: { categoryId: newCat.id }
      });
      fixCount++;
    }
  }

  console.log(`Successfully remapped ${fixCount} granular assets!`);
}

main().finally(() => prisma.$disconnect());
