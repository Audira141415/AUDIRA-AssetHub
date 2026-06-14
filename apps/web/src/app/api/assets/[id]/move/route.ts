import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    // Optional role check example:
    // const userRole = (session.user as any).role;
    // if (userRole !== "Admin" && userRole !== "Super Admin") {
    //   return NextResponse.json({ error: "Forbidden: Admins only" }, { status: 403 });
    // }

    const { id } = await params;
    const body = await request.json();
    const { toLocationId, notes } = body;
    const user = session.user.name || "System User";

    // First get the asset's current location
    const asset = await prisma.asset.findUnique({
      where: { id }
    });

    if (!asset) {
      return NextResponse.json({ error: "Asset not found" }, { status: 404 });
    }

    const fromLoc = asset.locationId;

    // Update asset location
    const updatedAsset = await prisma.asset.update({
      where: { id },
      data: {
        locationId: toLocationId
      }
    });

    // Determine location names for the log
    let fromLocName = "Unknown";
    if (fromLoc) {
      const fromL = await prisma.location.findUnique({ where: { id: fromLoc } });
      if (fromL) fromLocName = fromL.name;
    }

    let toLocName = "Unknown";
    if (toLocationId) {
      const toL = await prisma.location.findUnique({ where: { id: toLocationId } });
      if (toL) toLocName = toL.name;
    }

    // Create Movement Log
    const movement = await prisma.movement.create({
      data: {
        assetId: id,
        fromLoc: fromLocName,
        toLoc: toLocName,
        notes: notes || `Moved to ${toLocName}`,
        user: user || "System User"
      }
    });

    return NextResponse.json({ asset: updatedAsset, movement }, { status: 201 });
  } catch (error) {
    console.error("Failed to move asset:", error);
    return NextResponse.json({ error: "Failed to move asset" }, { status: 500 });
  }
}
