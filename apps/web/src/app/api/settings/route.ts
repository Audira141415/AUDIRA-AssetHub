import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Allow retrieving multiple settings or a specific setting
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    
    let whereClause = {};
    if (category) {
      whereClause = { category };
    }

    const settings = await prisma.setting.findMany({
      where: whereClause
    });
    
    // Convert to a key-value object for easier frontend consumption
    const settingsMap = settings.reduce((acc: Record<string, string>, setting) => {
      acc[setting.key] = setting.value;
      return acc;
    }, {});

    return NextResponse.json(settingsMap)
  } catch (error) {
    console.error("Failed to fetch settings:", error)
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 })
  }
}

// Allow updating settings in bulk
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { settings, category = 'General' } = body;
    
    if (!settings || typeof settings !== 'object') {
      return NextResponse.json({ error: "Invalid settings format" }, { status: 400 });
    }

    // Upsert each setting
    const updatePromises = Object.entries(settings).map(([key, value]) => {
      return prisma.setting.upsert({
        where: { key },
        update: { value: String(value) },
        create: {
          key,
          value: String(value),
          category
        }
      });
    });

    await Promise.all(updatePromises);

    return NextResponse.json({ success: true, message: "Settings updated successfully" })
  } catch (error) {
    console.error("Failed to update settings:", error)
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 })
  }
}
