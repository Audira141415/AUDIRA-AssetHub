import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const ips = await prisma.iPAddress.findMany({
      include: {
        subnet: true,
        asset: true
      },
      orderBy: {
        address: 'asc'
      }
    });

    return NextResponse.json(ips);
  } catch (error) {
    console.error("Failed to fetch IPs:", error);
    return NextResponse.json({ error: "Failed to fetch IPs" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { address, subnetId, assetId, notes, status } = body;

    const newIP = await prisma.iPAddress.create({
      data: {
        address,
        subnetId,
        assetId: assetId || null,
        status: status || 'Reserved'
      },
      include: {
        subnet: true,
        asset: true
      }
    });

    return NextResponse.json(newIP, { status: 201 });
  } catch (error) {
    console.error("Failed to allocate IP:", error);
    return NextResponse.json({ error: "Failed to allocate IP" }, { status: 500 });
  }
}
