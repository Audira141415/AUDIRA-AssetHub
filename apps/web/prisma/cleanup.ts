import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Cleaning up Prisma Database...');
  
  await prisma.movement.deleteMany();
  await prisma.assetLicense.deleteMany();
  await prisma.license.deleteMany();
  await prisma.ticket.deleteMany();
  await prisma.iPAddress.deleteMany();
  await prisma.subnet.deleteMany();
  
  await prisma.asset.deleteMany();
  await prisma.location.deleteMany();
  await prisma.category.deleteMany();
  await prisma.vendor.deleteMany();
  
  console.log('Prisma Database cleaned up successfully.');
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
