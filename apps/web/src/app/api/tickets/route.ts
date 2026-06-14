import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    
    // Optional filtering
    const status = searchParams.get('status')
    const priority = searchParams.get('priority')
    
    let whereClause = {}
    if (status) whereClause = { ...whereClause, status }
    if (priority) whereClause = { ...whereClause, priority }

    const tickets = await prisma.ticket.findMany({
      where: whereClause,
      include: {
        asset: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(tickets)
  } catch (error) {
    console.error("Failed to fetch tickets:", error)
    return NextResponse.json({ error: "Failed to fetch tickets" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { title, description, priority, status, type, assetId, reportedBy, assignedTo } = body

    const newTicket = await prisma.ticket.create({
      data: {
        title,
        description,
        priority: priority || "Medium",
        status: status || "Open",
        type: type || "Repair",
        assetId,
        reportedBy,
        assignedTo,
      },
      include: {
        asset: true
      }
    })

    return NextResponse.json(newTicket, { status: 201 })
  } catch (error) {
    console.error("Failed to create ticket:", error)
    return NextResponse.json({ error: "Failed to create ticket" }, { status: 500 })
  }
}
