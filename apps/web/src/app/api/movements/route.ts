import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const assetId = searchParams.get('assetId')

    const whereClause = assetId ? { assetId } : {}

    const movements = await prisma.movement.findMany({
      where: whereClause,
      include: {
        asset: {
          select: {
            tag: true,
            hostname: true,
            category: { select: { name: true } }
          }
        }
      },
      orderBy: { date: 'desc' }
    });
    
    return NextResponse.json(movements);
  } catch (error) {
    console.error("Failed to fetch movements:", error);
    return NextResponse.json({ error: "Failed to fetch movements" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.assetId) {
      return NextResponse.json({ error: "Asset ID is required" }, { status: 400 });
    }

    const movement = await prisma.movement.create({
      data: {
        assetId: body.assetId,
        fromLoc: body.fromLoc || "Unknown",
        toLoc: body.toLoc || "Unknown",
        user: body.user || "System User",
        notes: body.notes || "",
      },
      include: {
        asset: {
          select: {
            tag: true,
            hostname: true,
            category: { select: { name: true } }
          }
        }
      }
    });
    
    // Also update the asset's location
    if (body.toLoc) {
      const location = await prisma.location.findFirst({
        where: { name: { contains: body.toLoc } }
      });
      if (location) {
        await prisma.asset.update({
          where: { id: body.assetId },
          data: { locationId: location.id }
        });
      }
    }
    
    return NextResponse.json(movement, { status: 201 });
  } catch (error) {
    console.error("Failed to create movement:", error);
    return NextResponse.json({ error: "Failed to create movement" }, { status: 500 });
  }
}
