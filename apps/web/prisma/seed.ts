import { PrismaClient } from '@prisma/client'
import { baseAssets, mockCategories, mockVendors, mockUsers, mockMaintenanceTickets } from '../src/lib/mock-data'
const prisma = new PrismaClient()

async function main() {
  console.log('Seeding Database...')

  // Seed Categories
  console.log('Seeding Categories...')
  for (const cat of mockCategories) {
    await prisma.category.upsert({
      where: { id: cat.id || cat.code || cat.name },
      update: {},
      create: {
        id: cat.id || cat.code || cat.name,
        name: cat.name,
        code: cat.code || cat.id || cat.name,
        description: cat.desc || cat.description,
      },
    })
  }

  // Seed Vendors
  console.log('Seeding Vendors...')
  for (const ven of mockVendors) {
    await prisma.vendor.upsert({
      where: { id: ven.id },
      update: {},
      create: {
        id: ven.id,
        name: ven.name,
        type: ven.type || 'Hardware',
        email: ven.email || 'contact@' + ven.name.toLowerCase().replace(/\s/g, '') + '.com',
        phone: ven.phone || '000-000-0000',
        status: ven.status || 'Active',
      },
    })
  }

  // Seed Users
  console.log('Seeding Users...')
  for (const user of mockUsers) {
    await prisma.user.upsert({
      where: { email: user.email },
      update: {},
      create: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
      },
    })
  }

  // Seed Assets (simplified, since locations might be tricky with mock mapping)
  console.log('Seeding Assets...')
  for (const asset of baseAssets) {
    // Try to find a matching category code, fallback to a dummy if needed
    let category = await prisma.category.findFirst({ where: { name: asset.cat } })
    if (!category) {
      category = await prisma.category.create({
        data: {
          name: asset.cat,
          code: asset.cat.substring(0, 3).toUpperCase(),
        }
      })
    }

    // Try to find a matching vendor
    let vendor = await prisma.vendor.findFirst({ where: { name: asset.vendor } })
    if (!vendor) {
      vendor = await prisma.vendor.create({
        data: {
          name: asset.vendor || 'Unknown Vendor',
          type: 'Hardware',
        }
      })
    }

    await prisma.asset.upsert({
      where: { tag: asset.tag },
      update: {},
      create: {
        tag: asset.tag,
        hostname: asset.host || asset.tag,
        status: asset.status,
        categoryId: category.id,
        vendorId: vendor.id,
        rack: asset.rack || '-',
        uPosition: asset.u || '-',
        warranty: asset.warranty || 'None',
      },
    })
  }

  // Seed Tickets
  console.log('Seeding Tickets...')
  for (const tkt of mockMaintenanceTickets) {
    await prisma.ticket.create({
      data: {
        id: tkt.id,
        title: tkt.title,
        description: tkt.description,
        priority: tkt.priority,
        status: tkt.status,
        type: tkt.type,
        reportedBy: tkt.reportedBy,
        assignedTo: tkt.assignedTo,
      }
    })
  }

  console.log('Seeding completed successfully!')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
