import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  try {
    // 1. Ensure the root Site exists
    let site = await prisma.location.findFirst({ where: { name: "neuCentrIX Batam", type: "Site" } });
    if (!site) {
      // Maybe it was created as a Room previously during import
      let existingLoc = await prisma.location.findFirst({ where: { name: "neuCentrIX Batam" } });
      if (existingLoc) {
        site = await prisma.location.update({ where: { id: existingLoc.id }, data: { type: "Site" } });
      } else {
        site = await prisma.location.create({ data: { name: "neuCentrIX Batam", type: "Site" } });
      }
    }

    // 2. Ensure Building exists
    let building = await prisma.location.findFirst({ where: { name: "Batam Core Data Center", type: "Building", parentLoc: site.id } });
    if (!building) {
      building = await prisma.location.create({ data: { name: "Batam Core Data Center", type: "Building", parentLoc: site.id } });
    }

    // Cache floors
    const floors: Record<string, any> = {};
    async function getFloor(name: string) {
      if (floors[name]) return floors[name];
      let f = await prisma.location.findFirst({ where: { name, type: "Floor", parentLoc: building!.id } });
      if (!f) f = await prisma.location.create({ data: { name, type: "Floor", parentLoc: building!.id } });
      floors[name] = f;
      return f;
    }

    const floor1 = await getFloor("Floor 1");
    const floor2 = await getFloor("Floor 2");
    const floor3 = await getFloor("Floor 3");
    const floor4 = await getFloor("Floor 4");
    const defaultFloor = await getFloor("General Area");

    // Cache rooms
    const rooms: Record<string, any> = {};
    async function getRoom(name: string, floorId: string) {
      const key = `${name}-${floorId}`;
      if (rooms[key]) return rooms[key];
      let r = await prisma.location.findFirst({ where: { name, type: "Room", parentLoc: floorId } });
      if (!r) r = await prisma.location.create({ data: { name, type: "Room", parentLoc: floorId } });
      rooms[key] = r;
      return r;
    }

    const assets = await prisma.asset.findMany();
    let fixCount = 0;

    for (const asset of assets) {
      const rawRack = asset.rack || "Unknown";
      let roomName = rawRack;
      let floor = defaultFloor;

      // Extract Floor Info
      const rawUpper = rawRack.toUpperCase();
      if (rawUpper.includes("LT.3") || rawUpper.includes("LT 3") || rawUpper.includes("LANTAI 3")) {
        floor = floor3;
        roomName = rawRack.replace(/Lt\.3/i, "").replace(/Lt 3/i, "").replace(/Lantai 3/i, "").trim();
      } else if (rawUpper.includes("LT.4") || rawUpper.includes("LT 4") || rawUpper.includes("LANTAI 4") || rawUpper.includes("LT4")) {
        floor = floor4;
        roomName = rawRack.replace(/Lt\.4/i, "").replace(/Lt 4/i, "").replace(/Lantai 4/i, "").replace(/lt4/i, "").trim();
      } else if (rawUpper.includes("LT.2") || rawUpper.includes("LT 2") || rawUpper.includes("LANTAI 2")) {
        floor = floor2;
        roomName = rawRack.replace(/Lt\.2/i, "").replace(/Lt 2/i, "").replace(/Lantai 2/i, "").trim();
      } else if (rawUpper.includes("LT.1") || rawUpper.includes("LT 1") || rawUpper.includes("LANTAI 1")) {
        floor = floor1;
        roomName = rawRack.replace(/Lt\.1/i, "").replace(/Lt 1/i, "").replace(/Lantai 1/i, "").trim();
      }
      
      // Clean up room name
      if (roomName.endsWith(",")) roomName = roomName.slice(0, -1).trim();
      if (roomName === "") roomName = "General Room";
      
      // Simplify weird names
      if (roomName.toUpperCase().includes("AC SPLIT")) {
        roomName = roomName.replace(/AC Split/i, "").trim();
      }
      if (roomName === "R. UPS 1" || roomName === "R. UPS 2" || roomName === "R. UPS 3" || roomName === "R. UPS 4" || roomName === "R. UPS 5") {
        roomName = "UPS Room";
      }
      if (roomName === "R. Battrey 1" || roomName === "R. Battrey 2" || roomName === "Batrrey 2") {
        roomName = "Battery Room";
      }
      if (roomName.toUpperCase() === "NOC ROOM" || roomName.toUpperCase() === "R. NOC") {
        roomName = "NOC";
      }
      
      if (roomName === "") roomName = "General Room";

      const room = await getRoom(roomName, floor.id);

      if (asset.locationId !== room.id) {
        await prisma.asset.update({
          where: { id: asset.id },
          data: { locationId: room.id }
        });
        fixCount++;
      }
    }

    console.log(`Successfully integrated location hierarchy for ${fixCount} assets!`);

  } catch (e) {
    console.error("Hierarchy integration failed:", e);
  }
}

main().finally(() => prisma.$disconnect());
