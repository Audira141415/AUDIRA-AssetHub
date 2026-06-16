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

import { assetSchema } from '@/lib/validations/asset';
import { rateLimit } from '@/lib/rate-limit';

export async function POST(request: Request) {
  try {
    // Rate Limiting (Layer 5) - Max 30 requests per minute per IP for this route
    const rl = rateLimit(request, 30, 60000);
    if (!rl.success) return rl.response;

    const rawBody = await request.json();
    
    // Zod validation (Layer 4)
    const validationResult = assetSchema.safeParse(rawBody);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: "Invalid data format", details: validationResult.error.format() },
        { status: 400 }
      );
    }
    
    const body = validationResult.data;
    const { tag, hostname, status, categoryId, vendorId, locationId, rack, uPosition, parentAssetId } = body;
    
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
        parentAssetId,
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
