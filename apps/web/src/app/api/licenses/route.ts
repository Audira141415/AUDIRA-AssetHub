import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  try {
    const licenses = await prisma.license.findMany({
      include: {
        assets: {
          include: {
            asset: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(licenses)
  } catch (error) {
    console.error("Failed to fetch licenses:", error)
    return NextResponse.json({ error: "Failed to fetch licenses" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, productKey, vendor, totalSeats, purchaseCost, purchaseDate, expiryDate } = body

    const newLicense = await prisma.license.create({
      data: {
        name,
        productKey,
        vendor,
        totalSeats: parseInt(totalSeats) || 1,
        purchaseCost: purchaseCost ? parseFloat(purchaseCost) : null,
        purchaseDate: purchaseDate ? new Date(purchaseDate) : null,
        expiryDate: expiryDate ? new Date(expiryDate) : null
      }
    })

    return NextResponse.json(newLicense, { status: 201 })
  } catch (error) {
    console.error("Failed to create license:", error)
    return NextResponse.json({ error: "Failed to create license" }, { status: 500 })
  }
}
