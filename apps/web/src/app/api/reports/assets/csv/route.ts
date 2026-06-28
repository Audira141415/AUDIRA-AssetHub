import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import Papa from 'papaparse'

export async function GET() {
  try {
    const assets = await prisma.asset.findMany({
      include: {
        category: true,
        location: true,
        vendor: true
      }
    });

    const data = assets.map(a => ({
      AssetTag: a.tag,
      Hostname: a.hostname || '',
      Category: a.category?.name || '',
      Location: a.location?.name || '',
      Status: a.status,
      Manufacturer: a.vendor?.name || '',
      Model: a.hostname || '',
      SerialNumber: a.tag || '',
      PurchaseDate: a.purchaseDate ? new Date(a.purchaseDate).toISOString().split('T')[0] : '',
      PurchaseCost: a.purchaseCost || 0,
      Vendor: a.vendor?.name || '',
      LifecycleState: a.lifecycleState || '',
      Rack: a.rack || '',
      UPosition: a.uPosition || ''
    }));

    const csv = Papa.unparse(data);

    return new NextResponse(csv, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': 'attachment; filename="assets_inventory.csv"',
      },
    });
  } catch (error) {
    console.error("Failed to generate CSV:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
