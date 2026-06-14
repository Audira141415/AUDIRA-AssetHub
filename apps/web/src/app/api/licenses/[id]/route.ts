import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const license = await prisma.license.findUnique({
      where: { id },
      include: {
        assets: {
          include: {
            asset: true
          }
        }
      }
    })
    
    if (!license) return NextResponse.json({ error: "License not found" }, { status: 404 })
    return NextResponse.json(license)
  } catch (error) {
    console.error("Failed to fetch license:", error)
    return NextResponse.json({ error: "Failed to fetch license" }, { status: 500 })
  }
}

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  // This is the Assignment endpoint. Since we don't have a separate assign/route.ts, we handle POST here.
  try {
    const { id } = await params
    const body = await request.json()
    const { assetId, notes } = body

    if (!assetId) return NextResponse.json({ error: "Asset ID required" }, { status: 400 })

    const license = await prisma.license.findUnique({
      where: { id },
      include: { assets: true }
    })

    if (!license) return NextResponse.json({ error: "License not found" }, { status: 404 })

    if (license.assets.length >= license.totalSeats) {
      return NextResponse.json({ error: "No seats available for this license" }, { status: 400 })
    }

    // Check if already assigned to this asset
    const existing = await prisma.assetLicense.findFirst({
      where: { assetId, licenseId: id }
    })

    if (existing) {
      return NextResponse.json({ error: "Asset already has this license" }, { status: 400 })
    }

    const assignment = await prisma.assetLicense.create({
      data: {
        assetId,
        licenseId: id,
        notes
      }
    })

    return NextResponse.json(assignment, { status: 201 })
  } catch (error) {
    console.error("Failed to assign license:", error)
    return NextResponse.json({ error: "Failed to assign license" }, { status: 500 })
  }
}
