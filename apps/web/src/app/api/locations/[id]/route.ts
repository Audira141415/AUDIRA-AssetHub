import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json();

    const location = await prisma.location.update({
      where: { id: params.id },
      data: {
        name: body.name,
        type: body.type,
        parentLoc: body.parentLoc || null,
      }
    });
    
    return NextResponse.json(location);
  } catch (error) {
    console.error("Failed to update location:", error);
    return NextResponse.json({ error: "Failed to update location" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const location = await prisma.location.findUnique({
      where: { id: params.id },
      include: { _count: { select: { assets: true } } }
    });

    if (!location) {
      return NextResponse.json({ error: "Location not found" }, { status: 404 });
    }

    if (location._count.assets > 0) {
      return NextResponse.json({ error: "Cannot delete location with associated assets" }, { status: 400 });
    }

    await prisma.location.delete({
      where: { id: params.id }
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete location:", error);
    return NextResponse.json({ error: "Failed to delete location" }, { status: 500 });
  }
}
