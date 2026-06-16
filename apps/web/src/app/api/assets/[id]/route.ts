import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/rbac'

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const idOrTag = id;
    let whereClause = {};

    if (!isNaN(parseInt(idOrTag, 10)) && idOrTag.match(/^[0-9]+$/)) {
      whereClause = { id: parseInt(idOrTag, 10) };
    } else {
      whereClause = { tag: idOrTag };
    }

    const asset = await prisma.asset.findFirst({
      where: whereClause,
      include: {
        category: true,
        vendor: true,
        location: true,
        childAssets: true,
        parentAsset: true,
      }
    });

    if (!asset) {
      return NextResponse.json({ error: "Asset not found" }, { status: 404 });
    }

    return NextResponse.json(asset);
  } catch (error) {
    console.error("Failed to fetch asset:", error);
    return NextResponse.json({ error: "Failed to fetch asset" }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const idOrTag = id;
    let whereClause = {};

    if (!isNaN(parseInt(idOrTag, 10)) && idOrTag.match(/^[0-9]+$/)) {
      whereClause = { id: parseInt(idOrTag, 10) };
    } else {
      whereClause = { tag: idOrTag };
    }

    const body = await request.json();
    const { 
      tag, hostname, status, categoryId, vendorId, locationId, rack, uPosition, parentAssetId, warranty,
      lifecycleState, eolDate, eosDate, slaLevel, contractNumber,
      businessApp, businessOwner, techOwner, upstreamPowerId, upstreamNetId,
      costCenter, ownershipType, powerWatts, weightKg, coolingBTU 
    } = body;

    const updatedAsset = await prisma.asset.update({
      where: whereClause as any,
      data: {
        tag, hostname, status, categoryId, vendorId, locationId, rack, uPosition, parentAssetId, warranty,
        lifecycleState, eolDate, eosDate, slaLevel, contractNumber,
        businessApp, businessOwner, techOwner, upstreamPowerId, upstreamNetId,
        costCenter, ownershipType, powerWatts, weightKg, coolingBTU
      },
      include: {
        category: true,
        vendor: true,
        location: true,
      }
    });

    return NextResponse.json(updatedAsset);
  } catch (error) {
    console.error("Failed to update asset:", error);
    return NextResponse.json({ error: "Failed to update asset" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const rbac = await requireAdmin();
    if (!rbac.authorized) return rbac.response;

    const { id } = await params;
    const idOrTag = id;
    let whereClause = {};

    if (!isNaN(parseInt(idOrTag, 10)) && idOrTag.match(/^[0-9]+$/)) {
      whereClause = { id: parseInt(idOrTag, 10) };
    } else {
      whereClause = { tag: idOrTag };
    }

    await prisma.asset.delete({
      where: whereClause as any
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Failed to delete asset:", error);
    return NextResponse.json({ error: "Failed to delete asset" }, { status: 500 });
  }
}
