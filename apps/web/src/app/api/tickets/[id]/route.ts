import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const body = await request.json();
    const { title, description, priority, status, type, assetId, assignedTo } = body;

    const updatedTicket = await prisma.ticket.update({
      where: { id },
      data: {
        title,
        description,
        priority,
        status,
        type,
        assetId,
        assignedTo
      },
      include: {
        asset: true
      }
    });

    return NextResponse.json(updatedTicket);
  } catch (error) {
    console.error("Failed to update ticket:", error);
    return NextResponse.json({ error: "Failed to update ticket" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    await prisma.ticket.delete({
      where: { id }
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Failed to delete ticket:", error);
    return NextResponse.json({ error: "Failed to delete ticket" }, { status: 500 });
  }
}
