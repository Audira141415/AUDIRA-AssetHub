import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const rackName = decodeURIComponent(params.id);

    // Get the rack location to determine capacity
    const location = await prisma.location.findFirst({
      where: { name: rackName, type: 'Rack' }
    });
    const height_u = location?.capacity || 42;

    // Get all assets in this rack
    const assets = await prisma.asset.findMany({
      where: {
        rack: rackName,
        parentAssetId: null // Only get top-level assets in the rack (chassis/servers)
      },
      select: {
        id: true,
        tag: true,
        manufacturer: true,
        model: true,
        status: true,
        uPosition: true,
        _count: {
          select: { childAssets: true }
        }
      }
    });

    // Format the assets to match what the frontend expects
    const formattedAssets = assets.map(a => ({
      id: a.id,
      asset_tag: a.tag,
      manufacturer: a.manufacturer || 'Unknown',
      model: a.model || 'Unknown',
      status: a.status,
      u_position: a.uPosition ? parseInt(a.uPosition) : null,
      is_chassis: a._count.childAssets > 0,
      child_count: a._count.childAssets
    }));

    // Calculate utilization percentage
    let usedU = new Set();
    formattedAssets.forEach(a => {
      if (a.u_position && a.u_position > 0 && a.u_position <= height_u) {
        usedU.add(a.u_position);
      }
    });
    
    const utilization_percentage = Math.round((usedU.size / height_u) * 100);

    return NextResponse.json({
      id: rackName,
      name: rackName,
      height_u,
      utilization_percentage,
      assets: formattedAssets
    });

  } catch (error) {
    console.error("Failed to fetch rack visualization:", error);
    return NextResponse.json({ error: "Failed to fetch rack visualization" }, { status: 500 });
  }
}
