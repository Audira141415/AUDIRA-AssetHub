import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params;
    const { id } = resolvedParams;
    const idOrTag = id;
    let whereClause = {};

    if (!isNaN(parseInt(idOrTag, 10)) && idOrTag.match(/^[0-9]+$/)) {
      whereClause = { id: parseInt(idOrTag, 10) }; // Wait, Prisma SQLite uses cuid strings for ID
      // Actually, all IDs in this Prisma schema are CUID (Strings)
    } 
    
    // For safety, let's just use string findFirst
    const asset = await prisma.asset.findFirst({
      where: {
        OR: [
          { id: idOrTag },
          { tag: idOrTag }
        ]
      }
    });

    if (!asset) {
      return NextResponse.json({ error: "Asset not found" }, { status: 404 });
    }

    // Generate a new Tag (suffix with -CLONE-random)
    const newTag = `${asset.tag}-CLONE-${Math.floor(Math.random() * 1000)}`;

    const newAsset = await prisma.asset.create({
      data: {
        tag: newTag,
        hostname: asset.hostname ? `${asset.hostname}-clone` : null,
        status: "In-Storage", // Set default status for cloned assets
        categoryId: asset.categoryId,
        vendorId: asset.vendorId,
        locationId: asset.locationId,
        rack: asset.rack,
        uPosition: asset.uPosition,
        parentAssetId: asset.parentAssetId,
        warranty: asset.warranty,
        purchaseCost: asset.purchaseCost,
        usefulLifeYears: asset.usefulLifeYears,
        powerWatts: asset.powerWatts,
        weightKg: asset.weightKg,
        coolingBTU: asset.coolingBTU
      }
    });

    return NextResponse.json(newAsset, { status: 201 });
  } catch (error) {
    console.error("Failed to clone asset:", error);
    return NextResponse.json({ error: "Failed to clone asset" }, { status: 500 });
  }
}
