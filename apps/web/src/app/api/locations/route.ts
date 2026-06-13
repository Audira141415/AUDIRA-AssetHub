import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const locations = await prisma.location.findMany({
      orderBy: { name: 'asc' },
      include: {
        _count: {
          select: { assets: true }
        }
      }
    });
    return NextResponse.json(locations);
  } catch (error) {
    console.error("Failed to fetch locations:", error);
    return NextResponse.json({ error: "Failed to fetch locations" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.name || !body.type) {
      return NextResponse.json({ error: "Name and type are required" }, { status: 400 });
    }

    const location = await prisma.location.create({
      data: {
        name: body.name,
        type: body.type,
        parentLoc: body.parentLoc || null,
      }
    });
    
    return NextResponse.json(location, { status: 201 });
  } catch (error) {
    console.error("Failed to create location:", error);
    return NextResponse.json({ error: "Failed to create location" }, { status: 500 });
  }
}
