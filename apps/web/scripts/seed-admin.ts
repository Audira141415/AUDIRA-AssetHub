import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const adminEmail = 'admin@audira.local'
  const adminPassword = 'admin123'
  
  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail }
  })

  if (existingAdmin) {
    console.log(`Admin user ${adminEmail} already exists.`)
    return
  }

  const hashedPassword = await bcrypt.hash(adminPassword, 10)

  const admin = await prisma.user.create({
    data: {
      name: 'Super Admin',
      email: adminEmail,
      password: hashedPassword,
      role: 'Super Admin',
      status: 'Active'
    }
  })

  console.log(`Created default admin user: ${admin.email}`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
