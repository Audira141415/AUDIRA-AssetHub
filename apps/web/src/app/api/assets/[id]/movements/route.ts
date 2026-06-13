import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const movements = await prisma.movement.findMany({
      where: { assetId: params.id },
      orderBy: { date: 'desc' }
    });

    return NextResponse.json(movements);
  } catch (error) {
    console.error("Failed to fetch movements:", error);
    return NextResponse.json({ error: "Failed to fetch movements" }, { status: 500 });
  }
}
