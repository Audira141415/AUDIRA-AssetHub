const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database with extended Data Center demo data...')

  // Vendors
  const in30Days = new Date();
  in30Days.setDate(in30Days.getDate() + 25);
  
  const in1Year = new Date();
  in1Year.setFullYear(in1Year.getFullYear() + 1);

  let dell = await prisma.vendor.findFirst({ where: { name: 'Dell Technologies' } })
  if (!dell) dell = await prisma.vendor.create({ 
    data: { 
      name: 'Dell Technologies', type: 'Hardware', email: 'support@dell.com', phone: '1-800-456-3355',
      rating: 4.8, contractExpiry: in1Year, accountManagerName: 'Michael Dell Jr', accountManagerEmail: 'michael@dell.com', techSupportL1Phone: '1-800-456-1111', techSupportL2Phone: '1-800-456-2222'
    } 
  })
  else await prisma.vendor.update({ where: { id: dell.id }, data: { rating: 4.8, contractExpiry: in1Year, accountManagerName: 'Michael Dell Jr', accountManagerEmail: 'michael@dell.com', techSupportL1Phone: '1-800-456-1111', techSupportL2Phone: '1-800-456-2222' } })
  
  let cisco = await prisma.vendor.findFirst({ where: { name: 'Cisco Systems' } })
  if (!cisco) cisco = await prisma.vendor.create({ 
    data: { 
      name: 'Cisco Systems', type: 'Hardware', email: 'tac@cisco.com', phone: '1-800-553-2447',
      rating: 4.9, contractExpiry: in30Days, accountManagerName: 'Chuck Robbins', accountManagerEmail: 'chuck@cisco.com', techSupportL1Phone: '1-800-553-1111', techSupportL2Phone: '1-800-553-2222'
    } 
  })
  else await prisma.vendor.update({ where: { id: cisco.id }, data: { rating: 4.9, contractExpiry: in30Days, accountManagerName: 'Chuck Robbins', accountManagerEmail: 'chuck@cisco.com', techSupportL1Phone: '1-800-553-1111', techSupportL2Phone: '1-800-553-2222' } })

  let schneider = await prisma.vendor.findFirst({ where: { name: 'Schneider Electric' } })
  if (!schneider) schneider = await prisma.vendor.create({ 
    data: { 
      name: 'Schneider Electric', type: 'Infrastructure', email: 'customercare@se.com', phone: '1-888-778-2733',
      rating: 4.5, contractExpiry: in1Year, accountManagerName: 'Jean-Pascal', accountManagerEmail: 'jean@se.com', techSupportL1Phone: '1-888-778-1111', techSupportL2Phone: '1-888-778-2222'
    } 
  })
  else await prisma.vendor.update({ where: { id: schneider.id }, data: { rating: 4.5, contractExpiry: in1Year, accountManagerName: 'Jean-Pascal', accountManagerEmail: 'jean@se.com', techSupportL1Phone: '1-888-778-1111', techSupportL2Phone: '1-888-778-2222' } })

  let hikvision = await prisma.vendor.findFirst({ where: { name: 'Hikvision' } })
  if (!hikvision) hikvision = await prisma.vendor.create({ 
    data: { 
      name: 'Hikvision', type: 'Security', email: 'support.asia@hikvision.com', phone: '+86 571 8807 5998',
      rating: 4.0, contractExpiry: in1Year, accountManagerName: 'Chen Zongyan', accountManagerEmail: 'chen@hikvision.com', techSupportL1Phone: '+86 571 1111', techSupportL2Phone: '+86 571 2222'
    } 
  })
  else await prisma.vendor.update({ where: { id: hikvision.id }, data: { rating: 4.0, contractExpiry: in1Year, accountManagerName: 'Chen Zongyan', accountManagerEmail: 'chen@hikvision.com', techSupportL1Phone: '+86 571 1111', techSupportL2Phone: '+86 571 2222' } })

  // Locations
  let locBatam = await prisma.location.findFirst({ where: { name: 'Batam Data Center' } })
  if (!locBatam) locBatam = await prisma.location.create({ data: { name: 'Batam Data Center', type: 'Site' } })

  // Categories
  const categoriesToCreate = [
    { code: 'CAT-SRV', name: 'Servers', description: 'Compute instances' },
    { code: 'CAT-NET', name: 'Network', description: 'Switches and Routers' },
    { code: 'CAT-FW', name: 'Firewall', description: 'Security appliances' },
    { code: 'CAT-UPS', name: 'UPS', description: 'Uninterruptible Power Supply' },
    { code: 'CAT-PAC', name: 'Cooling PAC', description: 'Precision Air Conditioning' },
    { code: 'CAT-CCTV', name: 'CCTV Camera', description: 'Surveillance cameras' },
    { code: 'CAT-ACC', name: 'Access Door', description: 'Biometric access control' },
    { code: 'CAT-FIRE', name: 'FM200 Cylinder', description: 'Fire suppression gas' },
    { code: 'CAT-SENS', name: 'Environmental Sensor', description: 'Temp/Humidity sensors' },
    { code: 'CAT-PDU', name: 'PDU', description: 'Power Distribution Unit' },
  ]

  const categoryMap: Record<string, string> = {}
  for (const c of categoriesToCreate) {
    let cat = await prisma.category.findFirst({ where: { code: c.code } })
    if (!cat) cat = await prisma.category.create({ data: c })
    categoryMap[c.code] = cat.id
  }

  // Assets
  const newAssets = [
    // Servers
    { tag: 'AST-SRV-001', hostname: 'srv-db-01', cat: 'CAT-SRV', vendor: dell.id, cost: 12000, watts: 800, weight: 25, btu: 2700, sla: '24x7x4', app: 'Core DB', owner: 'DBA Team' },
    { tag: 'AST-SRV-002', hostname: 'srv-app-01', cat: 'CAT-SRV', vendor: dell.id, cost: 8500, watts: 500, weight: 15, btu: 1700, sla: '8x5 NBD', app: 'Internal Portal', owner: 'App Team' },
    { tag: 'AST-SRV-003', hostname: 'srv-app-02', cat: 'CAT-SRV', vendor: dell.id, cost: 8500, watts: 500, weight: 15, btu: 1700, sla: '8x5 NBD', app: 'Internal Portal', owner: 'App Team' },
    // Network
    { tag: 'AST-NET-001', hostname: 'core-sw-01', cat: 'CAT-NET', vendor: cisco.id, cost: 15000, watts: 350, weight: 10, btu: 1200, sla: '24x7x4', app: 'Core Network', owner: 'Network Team' },
    { tag: 'AST-NET-002', hostname: 'leaf-sw-01', cat: 'CAT-NET', vendor: cisco.id, cost: 5000, watts: 150, weight: 5, btu: 511, sla: '8x5 NBD', app: 'Access Net', owner: 'Network Team' },
    { tag: 'AST-FW-001', hostname: 'fw-edge-01', cat: 'CAT-FW', vendor: cisco.id, cost: 18000, watts: 400, weight: 8, btu: 1360, sla: '24x7x4', app: 'Perimeter Security', owner: 'SecOps Team' },
    // Power & Cooling
    { tag: 'AST-UPS-001', hostname: 'ups-main-01', cat: 'CAT-UPS', vendor: schneider.id, cost: 45000, watts: 0, weight: 500, btu: 5000, sla: '24x7x4', app: 'Main Power', owner: 'Facilities' },
    { tag: 'AST-UPS-002', hostname: 'ups-main-02', cat: 'CAT-UPS', vendor: schneider.id, cost: 45000, watts: 0, weight: 500, btu: 5000, sla: '24x7x4', app: 'Redundant Power', owner: 'Facilities' },
    { tag: 'AST-PDU-001', hostname: 'pdu-rack-A1', cat: 'CAT-PDU', vendor: schneider.id, cost: 1200, watts: 0, weight: 5, btu: 0, sla: '8x5 NBD', app: 'Rack Power', owner: 'Facilities' },
    { tag: 'AST-PAC-001', hostname: 'pac-room1-01', cat: 'CAT-PAC', vendor: schneider.id, cost: 35000, watts: 5000, weight: 300, btu: 0, sla: '24x7x4', app: 'Cooling', owner: 'Facilities' },
    { tag: 'AST-PAC-002', hostname: 'pac-room1-02', cat: 'CAT-PAC', vendor: schneider.id, cost: 35000, watts: 5000, weight: 300, btu: 0, sla: '24x7x4', app: 'Cooling', owner: 'Facilities' },
    // Security & Environment
    { tag: 'AST-CCTV-001', hostname: 'cam-entry-01', cat: 'CAT-CCTV', vendor: hikvision.id, cost: 800, watts: 15, weight: 1, btu: 50, sla: 'N/A', app: 'Physical Security', owner: 'SecOps Team' },
    { tag: 'AST-CCTV-002', hostname: 'cam-aisle-01', cat: 'CAT-CCTV', vendor: hikvision.id, cost: 800, watts: 15, weight: 1, btu: 50, sla: 'N/A', app: 'Physical Security', owner: 'SecOps Team' },
    { tag: 'AST-ACC-001', hostname: 'door-main-01', cat: 'CAT-ACC', vendor: hikvision.id, cost: 2500, watts: 30, weight: 2, btu: 100, sla: 'N/A', app: 'Access Control', owner: 'SecOps Team' },
    { tag: 'AST-FIRE-001', hostname: 'fm200-cyl-01', cat: 'CAT-FIRE', vendor: schneider.id, cost: 8000, watts: 0, weight: 150, btu: 0, sla: 'Yearly Maintenance', app: 'Fire Suppression', owner: 'Facilities' },
    { tag: 'AST-SENS-001', hostname: 'sens-temp-01', cat: 'CAT-SENS', vendor: schneider.id, cost: 300, watts: 5, weight: 0.2, btu: 17, sla: 'N/A', app: 'Environment Monitoring', owner: 'Facilities' },
  ]

  for (const a of newAssets) {
    const existing = await prisma.asset.findUnique({ where: { tag: a.tag } })
    if (!existing) {
      const purchaseDate = new Date()
      purchaseDate.setFullYear(purchaseDate.getFullYear() - 1)
      
      const eolDate = new Date()
      eolDate.setFullYear(eolDate.getFullYear() + 4)
      
      await prisma.asset.create({ 
        data: {
          tag: a.tag,
          hostname: a.hostname,
          status: 'Active',
          lifecycleState: 'Production',
          purchaseDate: purchaseDate,
          purchaseCost: a.cost,
          usefulLifeYears: 5,
          salvageValue: a.cost * 0.1,
          vendorId: a.vendor,
          locationId: locBatam.id,
          categoryId: categoryMap[a.cat],
          rack: 'Floor',
          powerWatts: a.watts,
          weightKg: a.weight,
          coolingBTU: a.btu,
          slaLevel: a.sla,
          businessApp: a.app,
          techOwner: a.owner,
          costCenter: 'IT-OPEX-001',
          eolDate: eolDate,
          eosDate: eolDate,
          contractNumber: `CTR-${Math.random().toString(36).substring(7).toUpperCase()}`,
        }
      })
    }
  }
  
  // Seed Licenses
  console.log('Seeding Licenses...')
  const licenses = [
    { name: 'VMware vSphere 8 Enterprise', productKey: 'XXXX-YYYY-ZZZZ-1111', vendor: 'VMware', totalSeats: 50, purchaseCost: 150000000 },
    { name: 'Windows Server 2022 Datacenter', productKey: 'WIN-2022-DC-001', vendor: 'Microsoft', totalSeats: 20, purchaseCost: 80000000 },
    { name: 'Red Hat Enterprise Linux', productKey: 'RHEL-9-SUB-992', vendor: 'Red Hat', totalSeats: 100, purchaseCost: 50000000 },
    { name: 'Cisco Prime Infrastructure', productKey: 'CISCO-PI-88', vendor: 'Cisco', totalSeats: 5, purchaseCost: 200000000 },
  ]
  
  let createdLicenses = [];
  for (const l of licenses) {
    const created = await prisma.license.create({
      data: {
        name: l.name,
        productKey: l.productKey,
        vendor: l.vendor,
        totalSeats: l.totalSeats,
        purchaseCost: l.purchaseCost,
        purchaseDate: new Date(),
        expiryDate: new Date(new Date().setFullYear(new Date().getFullYear() + 3))
      }
    });
    createdLicenses.push(created);
  }

  // Seed Tickets
  console.log('Seeding Tickets...')
  const servers = await prisma.asset.findMany({ take: 5 })
  
  if (servers.length > 0) {
    await prisma.ticket.create({
      data: {
        title: 'PSU Failure on Core Router',
        description: 'Power supply unit 2 is showing red LED and reporting failure on SNMP trap.',
        priority: 'Critical',
        status: 'Open',
        type: 'Hardware Replacement',
        assetId: servers[0]?.id,
        reportedBy: 'NOC Team',
        assignedTo: 'Hardware Engineer'
      }
    });
    
    await prisma.ticket.create({
      data: {
        title: 'Firmware Upgrade Required',
        description: 'Vulnerability detected on ESXi host. Needs patching to latest build.',
        priority: 'Medium',
        status: 'In Progress',
        type: 'Software Update',
        assetId: servers[1]?.id,
        reportedBy: 'Security Auditor',
        assignedTo: 'SysAdmin'
      }
    });
    
    await prisma.ticket.create({
      data: {
        title: 'High CPU Temperature Alert',
        description: 'Thermal sensor reading 85C for the past 2 hours. Inspect cooling fan.',
        priority: 'High',
        status: 'Resolved',
        type: 'Maintenance',
        assetId: servers[2]?.id,
        reportedBy: 'Automated Alerting',
        assignedTo: 'Datacenter Ops',
        resolvedAt: new Date(),
        resolutionNotes: 'Replaced faulty chassis fan.'
      }
    });
  }

  console.log('Extended Seeding completed!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
