import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const vendor = await prisma.vendor.findUnique({
      where: { id: id },
      include: {
        assets: {
          include: {
            category: true,
            location: true,
          }
        }
      }
    });

    if (!vendor) {
      return NextResponse.json({ error: "Vendor not found" }, { status: 404 });
    }

    return NextResponse.json(vendor);
  } catch (error) {
    console.error("Failed to fetch vendor:", error);
    return NextResponse.json({ error: "Failed to fetch vendor" }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { 
      name, type, email, phone, status,
      rating, contractExpiry, accountManagerName, accountManagerEmail, techSupportL1Phone, techSupportL2Phone 
    } = body;

    const vendor = await prisma.vendor.update({
      where: { id: id },
      data: {
        name,
        type,
        email: email || null,
        phone: phone || null,
        status: status || "Active",
        rating, 
        contractExpiry, 
        accountManagerName, 
        accountManagerEmail, 
        techSupportL1Phone, 
        techSupportL2Phone
      }
    });
    
    return NextResponse.json(vendor);
  } catch (error) {
    console.error("Failed to update vendor:", error);
    return NextResponse.json({ error: "Failed to update vendor" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    // Check if vendor has assets before deleting
    const vendor = await prisma.vendor.findUnique({
      where: { id: id },
      include: { _count: { select: { assets: true } } }
    });

    if (!vendor) {
      return NextResponse.json({ error: "Vendor not found" }, { status: 404 });
    }

    if (vendor._count.assets > 0) {
      return NextResponse.json({ error: "Cannot delete vendor with associated assets" }, { status: 400 });
    }

    await prisma.vendor.delete({
      where: { id: id }
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete vendor:", error);
    return NextResponse.json({ error: "Failed to delete vendor" }, { status: 500 });
  }
}
