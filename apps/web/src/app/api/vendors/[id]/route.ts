import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json();

    const vendor = await prisma.vendor.update({
      where: { id: params.id },
      data: {
        name: body.name,
        type: body.type,
        email: body.email || null,
        phone: body.phone || null,
        status: body.status || "Active",
      }
    });
    
    return NextResponse.json(vendor);
  } catch (error) {
    console.error("Failed to update vendor:", error);
    return NextResponse.json({ error: "Failed to update vendor" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const vendor = await prisma.vendor.findUnique({
      where: { id: params.id },
      include: { _count: { select: { assets: true } } }
    });

    if (!vendor) {
      return NextResponse.json({ error: "Vendor not found" }, { status: 404 });
    }

    if (vendor._count.assets > 0) {
      return NextResponse.json({ error: "Cannot delete vendor with associated assets" }, { status: 400 });
    }

    await prisma.vendor.delete({
      where: { id: params.id }
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete vendor:", error);
    return NextResponse.json({ error: "Failed to delete vendor" }, { status: 500 });
  }
}
