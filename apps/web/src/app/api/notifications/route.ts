import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const notifications: any[] = [];

    // 1. Critical Tickets
    const criticalTickets = await prisma.ticket.findMany({
      where: { priority: 'Critical', status: 'Open' },
      include: { asset: true },
      take: 5
    });

    criticalTickets.forEach(t => {
      notifications.push({
        id: `ticket-${t.id}`,
        type: 'critical',
        title: 'Critical Ticket Open',
        message: `Ticket #${t.id} requires immediate attention.`,
        date: t.createdAt,
        link: `/tickets/${t.id}`
      });
    });

    // 2. Expired Warranties
    const expiredAssets = await prisma.asset.findMany({
      where: { warranty: 'Expired', status: 'Active' },
      take: 5
    });

    expiredAssets.forEach(a => {
      notifications.push({
        id: `asset-exp-${a.id}`,
        type: 'warning',
        title: 'Warranty Expired',
        message: `${a.tag} (${a.hostname || 'Unknown'}) warranty has expired.`,
        date: a.updatedAt,
        link: `/assets?q=${encodeURIComponent(a.tag)}`
      });
    });

    // 3. Maintenance Assets
    const maintenanceAssets = await prisma.asset.findMany({
      where: { status: 'Maintenance' },
      take: 5
    });

    maintenanceAssets.forEach(a => {
      notifications.push({
        id: `asset-maint-${a.id}`,
        type: 'info',
        title: 'Asset In Maintenance',
        message: `${a.tag} is currently undergoing maintenance.`,
        date: a.updatedAt,
        link: `/assets?q=${encodeURIComponent(a.tag)}`
      });
    });

    // Sort by date descending
    notifications.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return NextResponse.json(notifications.slice(0, 5))
  } catch (error) {
    console.error("Failed to fetch notifications:", error)
    return NextResponse.json({ error: "Failed to fetch notifications" }, { status: 500 })
  }
}
