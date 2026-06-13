import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const assets = await prisma.asset.findMany({
      select: {
        id: true,
        tag: true,
        hostname: true,
        status: true,
        purchaseCost: true,
        purchaseDate: true,
        salvageValue: true,
        usefulLifeYears: true,
        category: { select: { name: true } },
        location: { select: { name: true } }
      },
      orderBy: { tag: 'asc' }
    });

    const audits = assets.map(a => {
      // Calculate basic depreciation for auditing
      const cost = a.purchaseCost || 0;
      const salvage = a.salvageValue || 0;
      const life = a.usefulLifeYears || 5;
      const pDate = a.purchaseDate ? new Date(a.purchaseDate) : new Date();
      const ageYears = (new Date().getTime() - pDate.getTime()) / (1000 * 60 * 60 * 24 * 365);
      
      let currentValue = cost;
      if (cost > 0 && ageYears > 0) {
        const annualDepreciation = (cost - salvage) / life;
        currentValue = Math.max(salvage, cost - (annualDepreciation * ageYears));
      }

      // Simulate audit status
      let auditStatus = "Compliant";
      if (ageYears > life) auditStatus = "Needs Replacement";
      if (a.status === "Inactive" && currentValue > 0) auditStatus = "Flagged";

      return {
        id: `AUD-${a.id}`,
        assetTag: a.tag,
        assetName: a.hostname || a.category?.name || "Unknown",
        location: a.location?.name || "Unknown",
        purchaseCost: cost,
        currentValue: currentValue,
        purchaseDate: pDate,
        auditStatus: auditStatus,
        lastAudited: new Date(new Date().getTime() - Math.random() * 10000000000)
      };
    });

    return NextResponse.json(audits);
  } catch (error) {
    console.error("Failed to fetch auditing data:", error);
    return NextResponse.json({ error: "Failed to fetch auditing data" }, { status: 500 });
  }
}
