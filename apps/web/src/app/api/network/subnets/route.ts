import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const subnets = await prisma.subnet.findMany({
      include: {
        ips: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(subnets);
  } catch (error) {
    console.error("Failed to fetch subnets:", error);
    return NextResponse.json({ error: "Failed to fetch subnets" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, cidr, vlan, description } = body;

    const newSubnet = await prisma.subnet.create({
      data: {
        name,
        cidr,
        vlan: vlan ? parseInt(vlan) : null,
        description
      }
    });

    return NextResponse.json(newSubnet, { status: 201 });
  } catch (error) {
    console.error("Failed to create subnet:", error);
    return NextResponse.json({ error: "Failed to create subnet" }, { status: 500 });
  }
}
