import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendEmail } from '@/lib/email'

export async function GET() {
  try {
    const tickets = await prisma.ticket.findMany({
      include: {
        asset: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(tickets);
  } catch (error) {
    console.error("Failed to fetch tickets:", error);
    return NextResponse.json({ error: "Failed to fetch tickets" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, description, priority, type, assetId, reportedBy, assignedTo, status } = body;

    const newTicket = await prisma.ticket.create({
      data: {
        title,
        description,
        priority: priority || "Medium",
        status: status || "Open",
        type: type || "Repair",
        assetId: assetId || null,
        assignedTo: assignedTo || null,
        reportedBy: reportedBy || "System Admin"
      },
      include: {
        asset: true
      }
    });

    // Send email notification if ticket is assigned to someone
    if (assignedTo) {
      // In a real system, you'd lookup the assigned user's email from the DB
      // For this demonstration, we'll construct a mock email or use a default one
      // if assignedTo looks like an email, we use it, else we mock
      const targetEmail = assignedTo.includes('@') ? assignedTo : 'technician@audira.local';
      
      const emailHtml = `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden;">
          <div style="background-color: #6C63FF; color: white; padding: 20px; text-align: center;">
            <h2 style="margin: 0;">New Work Order Assigned</h2>
          </div>
          <div style="padding: 24px;">
            <p>Hello <strong>${assignedTo}</strong>,</p>
            <p>A new maintenance ticket has been assigned to you.</p>
            <div style="background-color: #f8fafc; border-radius: 8px; padding: 16px; margin: 20px 0;">
              <h3 style="margin-top: 0; color: #0f172a;">${newTicket.title}</h3>
              <p style="color: #475569; margin-bottom: 0;">${newTicket.description}</p>
              <div style="margin-top: 16px; display: flex; gap: 12px;">
                <span style="background-color: #e2e8f0; padding: 4px 12px; border-radius: 999px; font-size: 12px; font-weight: bold;">Priority: ${newTicket.priority}</span>
                ${newTicket.asset ? `<span style="background-color: #e2e8f0; padding: 4px 12px; border-radius: 999px; font-size: 12px; font-weight: bold;">Asset: ${newTicket.asset.tag}</span>` : ''}
              </div>
            </div>
            <p>Please log in to the AssetHub Dashboard to update the status.</p>
            <div style="text-align: center; margin-top: 30px;">
              <a href="http://localhost:3412/maintenance" style="background-color: #6C63FF; color: white; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-weight: bold; display: inline-block;">View Ticket</a>
            </div>
          </div>
        </div>
      `;

      // Run asynchronously without awaiting so API responds fast
      sendEmail({
        to: targetEmail,
        subject: `[AssetHub] New Ticket: ${newTicket.title}`,
        html: emailHtml
      });
    }

    return NextResponse.json(newTicket, { status: 201 });
  } catch (error) {
    console.error("Failed to create ticket:", error);
    return NextResponse.json({ error: "Failed to create ticket" }, { status: 500 });
  }
}
