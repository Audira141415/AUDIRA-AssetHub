import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const assetsWithWarranty = await prisma.asset.findMany({
      where: {
        warranty: { not: null }
      },
      select: {
        id: true,
        tag: true,
        hostname: true,
        warranty: true,
        purchaseDate: true,
        vendor: { select: { name: true } },
        category: { select: { name: true } }
      },
      orderBy: { tag: 'asc' }
    });
    
    return NextResponse.json(assetsWithWarranty);
  } catch (error) {
    console.error("Failed to fetch warranties:", error);
    return NextResponse.json({ error: "Failed to fetch warranties" }, { status: 500 });
  }
}
