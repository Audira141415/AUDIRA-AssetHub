import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const totalAssets = await prisma.asset.count();
    
    const activeAssetsCount = await prisma.asset.count({
      where: {
        status: 'Active'
      }
    });

    const activePercent = totalAssets > 0 ? Math.round((activeAssetsCount / totalAssets) * 100) : 0;

    const totalLocations = await prisma.location.count();
    const totalVendors = await prisma.vendor.count();
    const totalTickets = await prisma.ticket.count();

    // Group by status
    const statusGroups = await prisma.asset.groupBy({
      by: ['status'],
      _count: {
        _all: true
      }
    });

    const statusData = statusGroups.map(g => ({
      name: g.status,
      value: g._count._all
    }));

    // Group by Category
    const assetsWithCategories = await prisma.asset.findMany({
      include: {
        category: true
      }
    });

    const catMap: Record<string, number> = {};
    assetsWithCategories.forEach(a => {
      const catName = a.category?.name || "Uncategorized";
      catMap[catName] = (catMap[catName] || 0) + 1;
    });

    const catData = Object.keys(catMap)
      .map(key => ({ name: key, value: catMap[key] }))
      .sort((a, b) => b.value - a.value);

    // Group by Location
    const assetsWithLocations = await prisma.asset.findMany({
      include: {
        location: true
      }
    });

    const locMap: Record<string, number> = {};
    assetsWithLocations.forEach(a => {
      const locName = a.location?.name || "Unassigned";
      locMap[locName] = (locMap[locName] || 0) + 1;
    });

    const locData = Object.keys(locMap)
      .map(key => ({ name: key, value: locMap[key] }))
      .sort((a, b) => b.value - a.value);

    // Group by Vendor
    const assetsWithVendors = await prisma.asset.findMany({
      include: {
        vendor: true
      }
    });

    const vendorMap: Record<string, number> = {};
    assetsWithVendors.forEach(a => {
      const vName = a.vendor?.name || "Unknown";
      vendorMap[vName] = (vendorMap[vName] || 0) + 1;
    });

    const vendorData = Object.keys(vendorMap)
      .map(key => ({ name: key, value: vendorMap[key] }))
      .sort((a, b) => b.value - a.value);

    return NextResponse.json({
      totalAssets,
      activeAssets: activeAssetsCount,
      activePercent,
      locations: totalLocations,
      vendors: totalVendors,
      tickets: totalTickets,
      statusData,
      catData,
      locData,
      vendorData
    });
  } catch (error) {
    console.error("Failed to fetch dashboard summary:", error);
    return NextResponse.json({ error: "Failed to fetch summary" }, { status: 500 });
  }
}
