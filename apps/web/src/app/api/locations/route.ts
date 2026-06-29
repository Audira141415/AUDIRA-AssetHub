import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const locations = await prisma.location.findMany({
      orderBy: { name: 'asc' },
    });

    const assets = await prisma.asset.findMany({
      select: {
        id: true,
        locationId: true,
        purchaseCost: true,
        status: true,
        lifecycleState: true,
        lastAuditDate: true,
        category: {
          select: {
            name: true
          }
        }
      }
    });

    // Map location ID to Location object with enriched properties
    const locationMap = new Map();
    locations.forEach(loc => {
      locationMap.set(loc.id, {
        ...loc,
        _count: { assets: 0 },
        assetsCount: 0,
        valuation: 0,
        buildingsCount: 0,
        floorsCount: 0,
        roomsCount: 0,
        racksCount: 0,
        statusBreakdown: {
          Active: 0,
          InStorage: 0,
          UnderRepair: 0,
          Retired: 0,
          Other: 0
        },
        categoryDistribution: {} as Record<string, number>,
        lastAuditDate: null as string | null
      });
    });

    // Helper to find root site
    function getRootSite(locationId: string | null): any | null {
      if (!locationId) return null;
      let current = locationMap.get(locationId);
      let visited = new Set();
      while (current) {
        if (visited.has(current.id)) break; // Prevent infinite loops
        visited.add(current.id);
        if (current.type === 'Site') {
          return current;
        }
        if (!current.parentLoc) break;
        current = locationMap.get(current.parentLoc);
      }
      return null;
    }

    // Helper to find parent building
    function getParentBuilding(locationId: string | null): any | null {
      if (!locationId) return null;
      let current = locationMap.get(locationId);
      let visited = new Set();
      while (current) {
        if (visited.has(current.id)) break; // Prevent infinite loops
        visited.add(current.id);
        if (current.type === 'Building') {
          return current;
        }
        if (!current.parentLoc) break;
        current = locationMap.get(current.parentLoc);
      }
      return null;
    }

    // Helper to find parent floor
    function getParentFloor(locationId: string | null): any | null {
      if (!locationId) return null;
      let current = locationMap.get(locationId);
      let visited = new Set();
      while (current) {
        if (visited.has(current.id)) break; // Prevent infinite loops
        visited.add(current.id);
        if (current.type === 'Floor') {
          return current;
        }
        if (!current.parentLoc) break;
        current = locationMap.get(current.parentLoc);
      }
      return null;
    }

    // Distribute sub-locations count to their root sites, parent buildings & parent floors
    locations.forEach(loc => {
      if (loc.type === 'Site') return;
      
      // Site rollup
      const rootSite = getRootSite(loc.id);
      if (rootSite) {
        if (loc.type === 'Building') rootSite.buildingsCount++;
        else if (loc.type === 'Room') rootSite.roomsCount++;
        else if (loc.type === 'Rack') rootSite.racksCount++;
      }

      // Building rollup
      if (loc.type !== 'Building') {
        const parentBld = getParentBuilding(loc.id);
        if (parentBld) {
          if (loc.type === 'Floor') parentBld.floorsCount++;
          else if (loc.type === 'Room') parentBld.roomsCount++;
          else if (loc.type === 'Rack') parentBld.racksCount++;
        }
      }

      // Floor rollup
      if (loc.type !== 'Floor' && loc.type !== 'Building' && loc.type !== 'Site') {
        const parentFlr = getParentFloor(loc.id);
        if (parentFlr) {
          if (loc.type === 'Room') parentFlr.roomsCount++;
          else if (loc.type === 'Rack') parentFlr.racksCount++;
        }
      }
    });

    // Distribute assets info to their root sites, parent buildings & parent floors
    assets.forEach(asset => {
      // 1. Direct count for location
      if (asset.locationId) {
        const directLoc = locationMap.get(asset.locationId);
        if (directLoc) {
          directLoc._count.assets++;
        }
      }

      // Helper to apply asset stats to rollup target
      function rollupAssetData(targetNode: any) {
        if (!targetNode) return;
        targetNode.assetsCount++;
        targetNode.valuation += asset.purchaseCost || 0;
        
        // Map status / lifecycleState
        const state = (asset.lifecycleState || asset.status || '').toLowerCase().replace(/[^a-z]/g, '');
        if (state === 'production' || state === 'active') {
          targetNode.statusBreakdown.Active++;
        } else if (state === 'instorage' || state === 'storage') {
          targetNode.statusBreakdown.InStorage++;
        } else if (state === 'underrepair' || state === 'repair' || state === 'rma' || state === 'maintenance') {
          targetNode.statusBreakdown.UnderRepair++;
        } else if (state === 'retired' || state === 'disposed') {
          targetNode.statusBreakdown.Retired++;
        } else {
          targetNode.statusBreakdown.Other++;
        }

        // Category distribution rollup
        if (asset.category?.name) {
          const catName = asset.category.name;
          targetNode.categoryDistribution[catName] = (targetNode.categoryDistribution[catName] || 0) + 1;
        }

        // Keep track of latest audit date
        if (asset.lastAuditDate) {
          const auditDateStr = new Date(asset.lastAuditDate).toISOString();
          if (!targetNode.lastAuditDate || auditDateStr > targetNode.lastAuditDate) {
            targetNode.lastAuditDate = auditDateStr;
          }
        }
      }

      // Rollup to root site
      const rootSite = getRootSite(asset.locationId);
      rollupAssetData(rootSite);

      // Rollup to parent building
      const parentBld = getParentBuilding(asset.locationId);
      rollupAssetData(parentBld);

      // Rollup to parent floor
      const parentFlr = getParentFloor(asset.locationId);
      rollupAssetData(parentFlr);
    });

    // Convert map back to list
    const result = Array.from(locationMap.values());
    return NextResponse.json(result);
  } catch (error) {
    console.error("Failed to fetch locations:", error);
    return NextResponse.json({ error: "Failed to fetch locations" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.name || !body.type) {
      return NextResponse.json({ error: "Name and type are required" }, { status: 400 });
    }

    const location = await prisma.location.create({
      data: {
        name: body.name,
        type: body.type,
        parentLoc: body.parentLoc || null,
        capacity: body.capacity ? parseInt(body.capacity) : null,
      }
    });
    
    return NextResponse.json(location, { status: 201 });
  } catch (error) {
    console.error("Failed to create location:", error);
    return NextResponse.json({ error: "Failed to create location" }, { status: 500 });
  }
}
