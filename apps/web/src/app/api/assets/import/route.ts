import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import Papa from 'papaparse';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    if (!file) {
      return NextResponse.json({ error: "No file uploaded", errors: ["No file uploaded"] }, { status: 400 });
    }

    const text = await file.text();
    const result = Papa.parse(text, {
      header: true,
      skipEmptyLines: true,
    });

    if (result.errors.length > 0) {
      return NextResponse.json({ 
        error: "Failed to parse CSV", 
        errors: result.errors.map(e => e.message) 
      }, { status: 400 });
    }

    const rows = result.data as any[];
    const errors: string[] = [];
    let successCount = 0;

    for (const [index, row] of rows.entries()) {
      try {
        if (!row.tag || !row.category) {
          errors.push(`Row ${index + 1}: Missing required fields (tag or category)`);
          continue;
        }

        // Find or create category
        let category = await prisma.category.findFirst({
          where: { name: row.category }
        });

        if (!category) {
          category = await prisma.category.create({
            data: {
              name: row.category,
              code: row.category.substring(0, 3).toUpperCase(),
            }
          });
        }

        // Find or create location
        let location = null;
        if (row.location) {
          location = await prisma.location.findFirst({
            where: { name: row.location }
          });

          if (!location) {
            location = await prisma.location.create({
              data: {
                name: row.location,
                type: "Room",
              }
            });
          }
        }

        // Upsert Asset
        await prisma.asset.upsert({
          where: { tag: row.tag },
          update: {
            hostname: row.hostname || null,
            status: row.status || "Active",
            categoryId: category.id,
            locationId: location ? location.id : null,
            warranty: row.warranty || null,
            rack: row.rack || null,
            uPosition: row.uPosition || null,
            purchaseCost: row.purchaseCost ? parseFloat(row.purchaseCost) : null,
            purchaseDate: row.purchaseDate ? new Date(row.purchaseDate) : null,
            salvageValue: row.salvageValue ? parseFloat(row.salvageValue) : null,
            usefulLifeYears: row.usefulLifeYears ? parseInt(row.usefulLifeYears) : null,
          },
          create: {
            tag: row.tag,
            hostname: row.hostname || null,
            status: row.status || "Active",
            categoryId: category.id,
            locationId: location ? location.id : null,
            warranty: row.warranty || null,
            rack: row.rack || null,
            uPosition: row.uPosition || null,
            purchaseCost: row.purchaseCost ? parseFloat(row.purchaseCost) : null,
            purchaseDate: row.purchaseDate ? new Date(row.purchaseDate) : null,
            salvageValue: row.salvageValue ? parseFloat(row.salvageValue) : null,
            usefulLifeYears: row.usefulLifeYears ? parseInt(row.usefulLifeYears) : null,
          }
        });

        successCount++;
      } catch (err: any) {
        errors.push(`Row ${index + 1} (${row.tag || 'Unknown'}): ${err.message}`);
      }
    }

    return NextResponse.json({
      message: `Successfully imported ${successCount} assets.`,
      errors
    }, { status: 200 });

  } catch (error: any) {
    console.error("Bulk import error:", error);
    return NextResponse.json({ error: "Failed to process import", errors: [error.message] }, { status: 500 });
  }
}
