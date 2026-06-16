import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import Papa from 'papaparse'

export async function GET() {
  try {
    const movements = await prisma.movement.findMany({
      include: {
        asset: true
      },
      orderBy: { date: 'desc' }
    });

    const data = movements.map(m => ({
      MovementID: m.id,
      Date: new Date(m.date).toISOString().replace('T', ' ').slice(0, 19),
      AssetTag: m.asset.tag,
      FromLocation: m.fromLoc,
      ToLocation: m.toLoc,
      User: m.user,
      Notes: m.notes || ''
    }));

    const csv = Papa.unparse(data);

    return new NextResponse(csv, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': 'attachment; filename="asset_movements.csv"',
      },
    });
  } catch (error) {
    console.error("Failed to generate movements CSV:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
