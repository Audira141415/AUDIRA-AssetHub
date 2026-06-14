import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const ticket = await prisma.ticket.findUnique({
      where: { id },
      include: {
        asset: {
          include: {
            location: true,
            vendor: true
          }
        }
      }
    })
    
    if (!ticket) return NextResponse.json({ error: "Ticket not found" }, { status: 404 })
    return NextResponse.json(ticket)
  } catch (error) {
    console.error("Failed to fetch ticket:", error)
    return NextResponse.json({ error: "Failed to fetch ticket" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await request.json()
    const { status, assignedTo, resolutionNotes, resolvedAt, priority } = body

    const updated = await prisma.ticket.update({
      where: { id },
      data: {
        status,
        assignedTo,
        resolutionNotes,
        resolvedAt: resolvedAt ? new Date(resolvedAt) : null,
        priority
      }
    })

    return NextResponse.json(updated)
  } catch (error) {
    console.error("Failed to update ticket:", error)
    return NextResponse.json({ error: "Failed to update ticket" }, { status: 500 })
  }
}
