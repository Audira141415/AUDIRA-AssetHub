import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const msg = body.message.toLowerCase();
    const originalMsg = body.message; // Preserve case for extracting tags/reasons

    let responseText = "I am the AUDIRA AssetHub Copilot. I can help you find assets, check tickets, and even create maintenance requests automatically.";

    // MODULE 0: SYSTEM IDENTITY & CONTEXT (Pelajaran Nyata tentang Web Ini)
    // e.g. "who created you", "what is this web", "about audira"
    if (msg.match(/(?:who created|who made|creator|author|who developed)/i)) {
      responseText = `I was created by **Agus Dwi R (AUDIRA)**. This entire AUDIRA AssetHub application is an Enterprise-grade ITAM system built by him, licensed under the MIT License.`;
      return NextResponse.json({ response: responseText }, { status: 200 });
    }
    if (msg.match(/(?:what is this|about this web|what is audira|what is assethub)/i)) {
      responseText = `**AUDIRA AssetHub** is a comprehensive Enterprise IT Asset Management (ITAM) and Data Center Infrastructure Management (DCIM) platform.\n\nIt is designed to track physical hardware, visualize rack spaces, manage software licenses, monitor IP networks, and handle IT maintenance tickets—all in one unified Neumorphic dashboard.`;
      return NextResponse.json({ response: responseText }, { status: 200 });
    }
    if (msg.match(/(?:what can you do|your capabilities|how can you help)/i)) {
      responseText = `As the local AUDIRA Copilot, I am deeply integrated into this web application. I can:\n- 📍 Locate specific assets (e.g., "Where is SRV-001")\n- 🛠️ Automatically create tickets (e.g., "Create critical ticket for SRV-001: disk failure")\n- 📉 Analyze lifecycle & warranties (e.g., "Assets older than 5 years")\n- 🌐 Check network IPAM (e.g., "What is the IP of SRV-001")\n- 📞 Find vendor contacts (e.g., "Vendor for SRV-002")`;
      return NextResponse.json({ response: responseText }, { status: 200 });
    }

    // FEATURE 1: ASSET LOCATOR
    // e.g. "where is SRV-001", "find SRV-001", "status of SRV-001"
    const locateMatch = msg.match(/(?:where is|find|status of|locate)\s+([a-zA-Z0-9-]+)/i);
    if (locateMatch) {
      const tag = locateMatch[1].toUpperCase();
      const asset = await prisma.asset.findUnique({
        where: { tag: tag },
        include: { location: true, category: true }
      });

      if (asset) {
        const loc = asset.location ? asset.location.name : "Unassigned";
        const rackInfo = asset.rack ? ` in Rack ${asset.rack} (U${asset.uPosition || '?'})` : "";
        responseText = `Asset **${asset.tag}** (${asset.category?.name || 'Unknown'}) is currently **${asset.status}**. It is located at **${loc}**${rackInfo}.`;
      } else {
        responseText = `I couldn't find any asset with the tag **${tag}** in the database.`;
      }
      return NextResponse.json({ response: responseText }, { status: 200 });
    }

    // FEATURE 3: ACTION EXECUTION (Create Ticket)
    // e.g. "create critical ticket for SRV-001: fan failure"
    const ticketMatch = originalMsg.match(/create\s+(?:a\s+)?(critical|high|medium|low)?\s*ticket\s+for\s+([a-zA-Z0-9-]+)(?:\s*:\s*|\s+due to\s+)(.+)/i);
    if (ticketMatch) {
      const priority = ticketMatch[1] ? ticketMatch[1].charAt(0).toUpperCase() + ticketMatch[1].slice(1).toLowerCase() : "High";
      const tag = ticketMatch[2].toUpperCase();
      const reason = ticketMatch[3].trim();

      const asset = await prisma.asset.findUnique({ where: { tag: tag } });
      if (asset) {
        const newTicket = await prisma.ticket.create({
          data: {
            title: `[AI Generated] Issue with ${tag}`,
            description: reason,
            priority: priority,
            status: "Open",
            type: "Repair",
            assetId: asset.id,
            reportedBy: "AI Copilot"
          }
        });
        responseText = `✅ **Action Completed:** I have created a **${priority}** priority ticket for **${tag}**. \n\n**Reason:** ${reason}\n**Ticket ID:** ${newTicket.id}`;
      } else {
        responseText = `I cannot create a ticket because I couldn't find an asset with the tag **${tag}**.`;
      }
      return NextResponse.json({ response: responseText }, { status: 200 });
    }

    // FEATURE 2: TICKET INSIGHTS
    if (msg.includes("critical tickets") || msg.includes("open tickets")) {
      const openTickets = await prisma.ticket.findMany({
        where: { status: "Open" },
        include: { asset: true },
        orderBy: { createdAt: 'desc' }
      });
      
      const criticalCount = openTickets.filter(t => t.priority === "Critical" || t.priority === "High").length;
      
      if (openTickets.length === 0) {
        responseText = "Great news! There are currently **no open tickets** in the system.";
      } else {
        let details = openTickets.slice(0, 3).map(t => `- **${t.asset?.tag || 'System'}**: ${t.title} (${t.priority})`).join("\n");
        responseText = `There are currently **${openTickets.length} open tickets**, with **${criticalCount}** of them being High/Critical priority.\n\nRecent issues:\n${details}`;
      }
      return NextResponse.json({ response: responseText }, { status: 200 });
    }

    // FEATURE 4: FINOPS / REPLACEMENT INSIGHTS
    if (msg.includes("assets older than 5 years") || msg.includes("need replacement") || msg.includes("replace")) {
      const currentYear = new Date().getFullYear();
      const assets = await prisma.asset.findMany();
      
      const olderAssets = assets.filter(a => {
        const pDate = a.purchaseDate || a.createdAt;
        const ageYears = (new Date().getTime() - new Date(pDate).getTime()) / (1000 * 60 * 60 * 24 * 365);
        return ageYears > 5;
      });

      if (olderAssets.length > 0) {
        responseText = `There are **${olderAssets.length}** assets older than 5 years. This represents ${Math.round((olderAssets.length / assets.length) * 100)}% of your inventory that may need replacement soon.`;
      } else {
        responseText = "Your infrastructure looks fresh! There are currently no assets older than 5 years.";
      }
      return NextResponse.json({ response: responseText }, { status: 200 });
    }

    // MODULE 1: IPAM INTELLIGENCE
    // e.g. "what is the ip of SRV-001"
    const ipMatch = msg.match(/(?:ip address|ip|network).+?([a-zA-Z0-9-]+)/i);
    if (ipMatch && !msg.includes("create")) {
      const tag = ipMatch[1].toUpperCase();
      const ipRecord = await prisma.iPAddress.findFirst({
        where: { asset: { tag: tag } },
        include: { subnet: true }
      });
      if (ipRecord) {
        responseText = `The asset **${tag}** is currently assigned the IP Address **${ipRecord.address}** on the ${ipRecord.subnet.name} (${ipRecord.subnet.cidr}).`;
      } else {
        responseText = `I couldn't find any IP address assigned to **${tag}**. It might be offline or using DHCP without a reservation.`;
      }
      return NextResponse.json({ response: responseText }, { status: 200 });
    }

    // MODULE 3: VENDOR & SLA KNOWLEDGE
    // e.g. "who is the vendor for SRV-001" or "support number for SRV-001"
    const vendorMatch = msg.match(/(?:vendor|support|contact|manufacturer).+?([a-zA-Z0-9-]+)/i);
    if (vendorMatch && !msg.includes("create")) {
      const tag = vendorMatch[1].toUpperCase();
      const asset = await prisma.asset.findUnique({
        where: { tag: tag },
        include: { vendor: true }
      });
      if (asset) {
        if (asset.vendor) {
          responseText = `**${tag}** was supplied by **${asset.vendor.name}**.\nType: ${asset.vendor.type}\nPhone: ${asset.vendor.phone || 'N/A'}\nEmail: ${asset.vendor.email || 'N/A'}`;
        } else {
          responseText = `**${tag}** is manufactured by ${asset.manufacturer || 'an unknown brand'} but doesn't have an active Vendor support profile linked in the database.`;
        }
        return NextResponse.json({ response: responseText }, { status: 200 });
      }
    }

    // MODULE 4: AUDIT TRAIL / CHAIN OF CUSTODY
    // e.g. "who moved SRV-001 last" or "movement history for SRV-001"
    const movementMatch = msg.match(/(?:who moved|when was|movement|last moved|moved).+?([a-zA-Z0-9-]+)/i);
    if (movementMatch && !msg.includes("create")) {
      const tag = movementMatch[1].toUpperCase();
      const movement = await prisma.movement.findFirst({
        where: { asset: { tag: tag } },
        orderBy: { date: 'desc' }
      });
      if (movement) {
        const dateStr = new Date(movement.date).toLocaleDateString();
        responseText = `**${tag}** was last moved on **${dateStr}** by **${movement.user}**.\nIt was moved from **${movement.fromLoc || 'Unknown'}** to **${movement.toLoc || 'Unknown'}**.\nNotes: ${movement.notes || 'None'}`;
      } else {
        responseText = `There are no recorded movements for **${tag}** in the audit ledger.`;
      }
      return NextResponse.json({ response: responseText }, { status: 200 });
    }

    // MODULE 2: LICENSE COMPLIANCE
    // e.g. "how many licenses are left" or "license compliance"
    if (msg.includes("license") || msg.includes("licenses")) {
      const licenses = await prisma.license.findMany({
        include: { _count: { select: { assets: true } } }
      });
      if (licenses.length > 0) {
        let details = licenses.map(l => {
          const used = l._count.assets;
          const remaining = l.totalSeats - used;
          return `- **${l.name}**: ${remaining} seats left (out of ${l.totalSeats})`;
        }).join("\n");
        responseText = `Here is your current software license compliance status:\n\n${details}`;
      } else {
        responseText = "You currently do not have any software licenses tracked in the system.";
      }
      return NextResponse.json({ response: responseText }, { status: 200 });
    }

    // BASIC STATS / FALLBACKS
    if (msg.includes("how many assets") || msg.includes("total assets")) {
      const count = await prisma.asset.count();
      responseText = `You currently have **${count}** assets registered in the system.`;
    } 
    else if (msg.includes("how many locations") || msg.includes("total locations")) {
      const count = await prisma.location.count();
      responseText = `There are **${count}** locations tracked in your infrastructure.`;
    }
    else if (msg.includes("how many users") || msg.includes("total users")) {
      const count = await prisma.user.count();
      responseText = `Your organization currently has **${count}** registered users.`;
    }
    else if (msg.includes("warranty") || msg.includes("expiring") || msg.includes("expired")) {
      const currentYear = new Date().getFullYear();
      const assets = await prisma.asset.findMany({ where: { warranty: { not: null } } });
      const expiredCount = assets.filter((a) => {
        const year = parseInt(a.warranty || '0');
        return year < currentYear && year > 0;
      }).length;
      responseText = `There are currently **${expiredCount}** assets with expired or expiring warranties.`;
    }
    else if (msg.includes("hi") || msg.includes("hello")) {
      responseText = "Hello! How can I assist you with your data center inventory today?";
    }

    return NextResponse.json({ response: responseText }, { status: 200 });
  } catch (error) {
    console.error("AI Chat API failed:", error);
    return NextResponse.json({ error: "Failed to process chat" }, { status: 500 });
  }
}
