import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    
    // Optional filtering
    const category = searchParams.get('category')
    const status = searchParams.get('status')
    
    let whereClause = {}
    if (category) {
      whereClause = { ...whereClause, category: { name: category } }
    }
    if (status) {
      whereClause = { ...whereClause, status }
    }

    const assets = await prisma.asset.findMany({
      where: whereClause,
      include: {
        category: true,
        vendor: true,
        location: true,
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(assets)
  } catch (error) {
    console.error("Failed to fetch assets:", error)
    return NextResponse.json({ error: "Failed to fetch assets" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { tag, hostname, status, categoryId, vendorId, locationId, rack, uPosition } = body
    
    let finalTag = tag;
    
    // Automatically prepend Location Code
    if (locationId) {
      const location = await prisma.location.findUnique({ where: { id: locationId } });
      if (location) {
        let locCode = location.name.substring(0, 3).toUpperCase();
        if (location.name.toLowerCase().includes('batam')) locCode = 'BTM';
        if (location.name.toLowerCase().includes('cikarang')) locCode = 'CKR';
        if (location.name.toLowerCase().includes('jakarta')) locCode = 'JKT';
        
        if (!finalTag.startsWith(locCode)) {
          finalTag = `${locCode}-${finalTag}`;
        }
      }
    }

    const newAsset = await prisma.asset.create({
      data: {
        tag: finalTag,
        hostname,
        status: status || "Active",
        categoryId,
        vendorId,
        locationId,
        rack,
        uPosition,
      },
      include: {
        category: true,
        vendor: true,
      }
    })

    return NextResponse.json(newAsset, { status: 201 })
  } catch (error) {
    console.error("Failed to create asset:", error)
    return NextResponse.json({ error: "Failed to create asset" }, { status: 500 })
  }
}
