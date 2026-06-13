import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    // To simulate a comprehensive system log, we will fetch recent records across multiple tables
    // and standardize them into a single "Log" format.
    
    // Fetch recent Assets
    const assets = await prisma.asset.findMany({
      orderBy: { updatedAt: 'desc' },
      take: 20,
      select: { id: true, tag: true, hostname: true, updatedAt: true, createdAt: true }
    });

    // Fetch recent Movements
    const movements = await prisma.movement.findMany({
      orderBy: { date: 'desc' },
      take: 20,
      select: { id: true, asset: { select: { tag: true } }, user: true, date: true, fromLoc: true, toLoc: true }
    });

    // Fetch recent Tickets
    const tickets = await prisma.ticket.findMany({
      orderBy: { updatedAt: 'desc' },
      take: 20,
      select: { id: true, title: true, status: true, reportedBy: true, updatedAt: true, createdAt: true }
    });

    // Normalize and combine
    const logs: any[] = [];

    assets.forEach(a => {
      if (a.createdAt.getTime() === a.updatedAt.getTime()) {
        logs.push({
          id: `log-ast-c-${a.id}`,
          action: "Created Asset",
          target: a.tag,
          user: "System",
          date: a.createdAt,
          details: `New asset registered: ${a.hostname || a.tag}`,
          module: "Assets"
        });
      } else {
        logs.push({
          id: `log-ast-u-${a.id}`,
          action: "Updated Asset",
          target: a.tag,
          user: "System",
          date: a.updatedAt,
          details: `Asset details modified: ${a.hostname || a.tag}`,
          module: "Assets"
        });
      }
    });

    movements.forEach(m => {
      logs.push({
        id: `log-mov-${m.id}`,
        action: "Moved Asset",
        target: m.asset.tag,
        user: m.user,
        date: m.date,
        details: `Moved from ${m.fromLoc} to ${m.toLoc}`,
        module: "Movements"
      });
    });

    tickets.forEach(t => {
      if (t.createdAt.getTime() === t.updatedAt.getTime()) {
        logs.push({
          id: `log-tkt-c-${t.id}`,
          action: "Created Ticket",
          target: `Ticket ${t.id.slice(-4)}`,
          user: t.reportedBy || "System",
          date: t.createdAt,
          details: t.title,
          module: "Maintenance"
        });
      } else {
        logs.push({
          id: `log-tkt-u-${t.id}`,
          action: `Ticket ${t.status}`,
          target: `Ticket ${t.id.slice(-4)}`,
          user: "System",
          date: t.updatedAt,
          details: t.title,
          module: "Maintenance"
        });
      }
    });

    // Sort by date descending
    logs.sort((a, b) => b.date.getTime() - a.date.getTime());

    return NextResponse.json(logs.slice(0, 50));
  } catch (error) {
    console.error("Failed to fetch logs:", error);
    return NextResponse.json({ error: "Failed to fetch logs" }, { status: 500 });
  }
}
