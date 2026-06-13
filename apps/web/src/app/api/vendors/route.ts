import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const vendors = await prisma.vendor.findMany({
      orderBy: { name: 'asc' },
      include: {
        _count: {
          select: { assets: true }
        }
      }
    });
    return NextResponse.json(vendors);
  } catch (error) {
    console.error("Failed to fetch vendors:", error);
    return NextResponse.json({ error: "Failed to fetch vendors" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.name || !body.type) {
      return NextResponse.json({ error: "Name and type are required" }, { status: 400 });
    }

    const vendor = await prisma.vendor.create({
      data: {
        name: body.name,
        type: body.type,
        email: body.email || null,
        phone: body.phone || null,
        status: body.status || "Active",
      }
    });
    
    return NextResponse.json(vendor, { status: 201 });
  } catch (error) {
    console.error("Failed to create vendor:", error);
    return NextResponse.json({ error: "Failed to create vendor" }, { status: 500 });
  }
}
