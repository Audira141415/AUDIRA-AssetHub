import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const idOrTag = params.id;
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

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const idOrTag = params.id;
    let whereClause = {};

    if (!isNaN(parseInt(idOrTag, 10)) && idOrTag.match(/^[0-9]+$/)) {
      whereClause = { id: parseInt(idOrTag, 10) };
    } else {
      whereClause = { tag: idOrTag };
    }

    const body = await request.json();
    const { tag, hostname, status, categoryId, vendorId, rack, uPosition, warranty } = body;

    const updatedAsset = await prisma.asset.update({
      where: whereClause as any,
      data: {
        tag,
        hostname,
        status,
        categoryId,
        vendorId,
        rack,
        uPosition,
        warranty
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

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const idOrTag = params.id;
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
