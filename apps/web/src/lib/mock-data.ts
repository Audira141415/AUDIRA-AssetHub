export function getAssetImage(category: string): string {
  const cat = category.toLowerCase();
  
  // Storage & Servers
  if (cat.includes("storage")) return "/images/assets/storage.png";
  if (cat.includes("mainframe")) return "/images/assets/mainframe.png";
  if (cat.includes("network rack")) return "/images/assets/network_rack.png";
  if (cat.includes("rack")) return "/images/assets/rack.png";
  if (cat.includes("router")) return "/images/assets/router.png";
  if (cat.includes("firewall")) return "/images/assets/firewall.png";
  
  // Power
  if (cat.includes("battery")) return "/images/assets/battery.png";
  if (cat.includes("pdu")) return "/images/assets/pdu.png";
  if (cat.includes("ats")) return "/images/assets/ats.png";
  if (cat.includes("rectifier")) return "/images/assets/rectifier.png";
  if (cat.includes("mdp") || cat.includes("main distribution")) return "/images/assets/mdp.png";
  if (cat.includes("input") || cat.includes("output") || cat.includes("iop") || cat.includes("panel")) return "/images/assets/iop.png";
  if (cat.includes("generator") || cat.includes("genset")) return "/images/assets/genset.png";
  if (cat.includes("ups")) return "/images/assets/ups.png";
  
  // HVAC
  if (cat.includes("humidifier") || cat.includes("dehumidifier")) return "/images/assets/humidifier.png";
  if (cat.includes("chiller")) return "/images/assets/chiller.png";
  if (cat.includes("in-row") || cat.includes("row")) return "/images/assets/in_row.png";
  if (cat.includes("standing") || cat.includes("comfort")) return "/images/assets/ac_standing.png";
  if (cat.includes("split") || cat.includes("wall")) return "/images/assets/ac_wall.png";
  if (cat.includes("pac") || cat.includes("crac") || cat.includes("cooling")) return "/images/assets/pac.png";
  
  // Security & Safety
  if (cat.includes("nvr") || cat.includes("dvr")) return "/images/assets/nvr.png";
  if (cat.includes("door") || cat.includes("biometric")) return "/images/assets/biometric.png";
  if (cat.includes("board")) return "/images/assets/controller.png";
  if (cat.includes("alarm")) return "/images/assets/alarm.png";
  if (cat.includes("vesda")) return "/images/assets/vesda.png";
  if (cat.includes("photoelectric")) return "/images/assets/photoelectric.png";
  if (cat.includes("smoke") || cat.includes("detector")) return "/images/assets/detector.png";
  if (cat.includes("fss control panel")) return "/images/assets/fss_panel.png";
  if (cat.includes("cylinder")) return "/images/assets/cylinder.png";
  if (cat.includes("fire") || cat.includes("fss")) return "/images/assets/fm200.png";
  if (cat.includes("turnstile") || cat.includes("flap")) return "/images/assets/turnstile.png";
  if (cat.includes("cctv") || cat.includes("camera") || cat.includes("access controller")) return "/images/assets/cctv.png";
  
  // Network & Misc
  if (cat.includes("access point")) return "/images/assets/access_point.png";
  if (cat.includes("san switch")) return "/images/assets/san_switch.png";
  if (cat.includes("odf") || cat.includes("optical")) return "/images/assets/odf.png";
  if (cat.includes("transceiver") || cat.includes("sfp")) return "/images/assets/transceiver.png";
  if (cat.includes("sensor")) return "/images/assets/sensor.png";
  if (cat.includes("switch") || cat.includes("network")) return "/images/assets/switch.png";
  if (cat.includes("server")) return "/images/assets/server.png";
  
  return "/images/assets/server.png";
}

export function deleteAsset(tag: string): boolean {
  const index = mockAssets.findIndex(a => a.tag === tag);
  if (index !== -1) {
    mockAssets.splice(index, 1);
    return true;
  }
  return false;
}

export function cloneAsset(tag: string): string | null {
  const assetToClone = mockAssets.find(a => a.tag === tag);
  if (!assetToClone) return null;
  
  const newTag = assetToClone.tag + "-COPY-" + Math.floor(Math.random() * 1000);
  const clonedAsset = {
    ...assetToClone,
    tag: newTag,
    hostname: assetToClone.hostname + "-COPY",
    status: "Inactive", // Cloned assets start as inactive
  };
  
  mockAssets.unshift(clonedAsset); // Add to beginning
  return newTag;
}

export function updateAssetLocation(tag: string, site: string, building: string, room: string, rack: string, uPosition: string): boolean {
  const asset = mockAssets.find(a => a.tag === tag);
  if (asset) {
    asset.site = site;
    asset.building = building;
    asset.room = room;
    asset.rack = rack;
    asset.uPosition = uPosition;
    asset.locationQuick = `${site} • ${rack} • U${uPosition}`;
    return true;
  }
  return false;
}

export const baseAssets = [
  { id: 1, tag: "SRV-2026-001", host: "SRV-PROD-01", cat: "Server", loc: "Batam DC", room: "Server Room A", rack: "R01", u: "24", status: "Active", warranty: "2028", vendor: "Dell" },
  { id: 2, tag: "STR-2026-001", host: "SAN-PROD-01", cat: "Storage Array", loc: "Batam DC", room: "Server Room A", rack: "R01", u: "10", status: "Active", warranty: "2027", vendor: "NetApp" },
  { id: 3, tag: "MF-2026-001", host: "IBM-Z16", cat: "Mainframe", loc: "Jakarta DC", room: "Main Hall", rack: "Floor", u: "-", status: "Active", warranty: "2030", vendor: "IBM" },
  { id: 4, tag: "RCK-S-001", host: "RACK-SRV-01", cat: "Server Rack", loc: "Batam DC", room: "Server Room A", rack: "Floor", u: "-", status: "Active", warranty: "Lifetime", vendor: "APC" },
  { id: 5, tag: "RCK-N-001", host: "RACK-NET-01", cat: "Network Rack", loc: "Batam DC", room: "Network Room", rack: "Floor", u: "-", status: "Active", warranty: "Lifetime", vendor: "APC" },
  { id: 6, tag: "SW-2026-001", host: "SW-CORE-01", cat: "Network Switch", loc: "Batam DC", room: "Network Room", rack: "N01", u: "40", status: "Active", warranty: "2026", vendor: "Cisco" },
  { id: 7, tag: "RT-2026-001", host: "RT-EDGE-01", cat: "Router", loc: "Batam DC", room: "Network Room", rack: "N01", u: "38", status: "Maintenance", warranty: "2026", vendor: "Juniper" },
  { id: 8, tag: "FW-2026-001", host: "FW-MAIN-01", cat: "Firewall / Security", loc: "Batam DC", room: "Network Room", rack: "N01", u: "36", status: "Active", warranty: "2025", vendor: "Palo Alto" },
  { id: 9, tag: "SSW-2026-001", host: "SAN-SW-01", cat: "SAN Switch", loc: "Batam DC", room: "Server Room A", rack: "R01", u: "34", status: "Active", warranty: "2027", vendor: "Brocade" },
  { id: 10, tag: "AP-2026-001", host: "AP-ROOF-01", cat: "Wireless Access Point", loc: "Batam DC", room: "Office/Support Room", rack: "Ceiling", u: "-", status: "Active", warranty: "2026", vendor: "Aruba" },
  { id: 11, tag: "SFP-2026-001", host: "N/A", cat: "Transceiver / SFP", loc: "Batam DC", room: "Network Room", rack: "N01", u: "-", status: "Active", warranty: "2025", vendor: "Cisco" },
  { id: 12, tag: "ODF-2026-001", host: "ODF-MAIN", cat: "Optical Distribution Frame (ODF)", loc: "Batam DC", room: "Network Room", rack: "N01", u: "42", status: "Active", warranty: "Lifetime", vendor: "Corning" },
  { id: 13, tag: "UPS-2026-001", host: "UPS-SYS-A", cat: "UPS (Main Unit)", loc: "Batam DC", room: "Power Room", rack: "Floor", u: "-", status: "Active", warranty: "2029", vendor: "Schneider" },
  { id: 14, tag: "BAT-2026-001", host: "BAT-BANK-A1", cat: "UPS Battery Bank", loc: "Batam DC", room: "Power Room", rack: "Floor", u: "-", status: "Active", warranty: "2027", vendor: "Schneider" },
  { id: 15, tag: "PDU-2026-001", host: "PDU-R01-A", cat: "PDU (Rack / Floor)", loc: "Batam DC", room: "Server Room A", rack: "R01", u: "VERT", status: "Active", warranty: "2028", vendor: "Raritan" },
  { id: 16, tag: "MDP-2026-001", host: "MDP-MAIN", cat: "MDP (Main Distribution Panel)", loc: "Batam DC", room: "Power Room", rack: "Wall Mount", u: "-", status: "Active", warranty: "2035", vendor: "Siemens" },
  { id: 17, tag: "PIU-2026-001", host: "PANEL-IN-UPS", cat: "Panel Input UPS", loc: "Batam DC", room: "Power Room", rack: "Wall Mount", u: "-", status: "Active", warranty: "2035", vendor: "Siemens" },
  { id: 18, tag: "ATS-2026-001", host: "ATS-MAIN", cat: "ATS / STS", loc: "Batam DC", room: "Power Room", rack: "Wall Mount", u: "-", status: "Active", warranty: "2030", vendor: "Eaton" },
  { id: 19, tag: "GEN-2026-001", host: "GENSET-1", cat: "Generator Set (Genset)", loc: "Batam DC", room: "Utility Yard", rack: "Pad", u: "-", status: "Maintenance", warranty: "2035", vendor: "Caterpillar" },
  { id: 20, tag: "REC-2026-001", host: "REC-DC-01", cat: "Rectifier / Inverter", loc: "Batam DC", room: "Power Room", rack: "Floor", u: "-", status: "Active", warranty: "2028", vendor: "Vertiv" },
  { id: 21, tag: "PAC-2026-001", host: "CRAC-01", cat: "PAC / CRAC Unit", loc: "Batam DC", room: "Server Room A", rack: "Floor", u: "-", status: "Active", warranty: "2029", vendor: "Stulz" },
  { id: 22, tag: "ACS-2026-001", host: "AC-STAND-01", cat: "AC Standing (Precision/Comfort)", loc: "Jakarta DC", room: "Network Room", rack: "Floor", u: "-", status: "Active", warranty: "2026", vendor: "Daikin" },
  { id: 23, tag: "ACW-2026-001", host: "AC-WALL-01", cat: "AC Split Wall", loc: "Jakarta DC", room: "Office/Support Room", rack: "Wall Mount", u: "-", status: "Active", warranty: "2025", vendor: "Panasonic" },
  { id: 24, tag: "IRC-2026-001", host: "IRC-R01-R02", cat: "In-Row Cooling", loc: "Batam DC", room: "Server Room A", rack: "Row A", u: "-", status: "Active", warranty: "2028", vendor: "APC" },
  { id: 25, tag: "CHL-2026-001", host: "CHILLER-01", cat: "Chiller", loc: "Batam DC", room: "Roof Platform", rack: "Pad", u: "-", status: "Active", warranty: "2035", vendor: "Trane" },
  { id: 26, tag: "ENS-2026-001", host: "TEMP-SENS-01", cat: "Environmental Sensor", loc: "Batam DC", room: "Server Room A", rack: "R01", u: "TOP", status: "Active", warranty: "2025", vendor: "NetBotz" },
  { id: 27, tag: "HUM-2026-001", host: "HUMID-01", cat: "Humidifier / Dehumidifier", loc: "Batam DC", room: "Server Room A", rack: "Floor", u: "-", status: "Active", warranty: "2027", vendor: "Condair" },
  { id: 28, tag: "CAM-2026-001", host: "CAM-AISLE-A", cat: "CCTV Camera", loc: "Batam DC", room: "Server Room A", rack: "Ceiling", u: "-", status: "Active", warranty: "2026", vendor: "Axis" },
  { id: 29, tag: "NVR-2026-001", host: "NVR-MAIN-01", cat: "NVR / DVR System", loc: "Batam DC", room: "Security Room", rack: "SEC-R1", u: "10", status: "Active", warranty: "2028", vendor: "Hikvision" },
  { id: 30, tag: "ACC-2026-001", host: "DOOR-MAIN-BIO", cat: "Access Door / Biometric", loc: "Batam DC", room: "Lobby", rack: "Wall Mount", u: "-", status: "Active", warranty: "2027", vendor: "Suprema" },
  { id: 31, tag: "ACB-2026-001", host: "CTRL-DOOR-1", cat: "Access Controller Board", loc: "Batam DC", room: "Security Room", rack: "Wall Mount", u: "-", status: "Active", warranty: "2028", vendor: "HID" },
  { id: 32, tag: "ALM-2026-001", host: "ALARM-PANEL", cat: "Alarm System", loc: "Batam DC", room: "Security Room", rack: "Wall Mount", u: "-", status: "Active", warranty: "2029", vendor: "Bosch" },
  { id: 33, tag: "FSS-2026-001", host: "FM200-PANEL", cat: "FSS Control Panel", loc: "Batam DC", room: "FSS Room", rack: "Wall Mount", u: "-", status: "Active", warranty: "2030", vendor: "Kidde" },
  { id: 34, tag: "TRN-2026-001", host: "TURNSTILE-IN", cat: "Turnstile / Flap Barrier", loc: "Batam DC", room: "Lobby", rack: "Floor", u: "-", status: "Active", warranty: "2027", vendor: "Gunnebo" },
  { id: 35, tag: "POU-2026-001", host: "PANEL-OUT-UPS", cat: "Panel Output UPS", loc: "Batam DC", room: "Power Room", rack: "Wall Mount", u: "-", status: "Active", warranty: "2035", vendor: "Siemens" },
  { id: 36, tag: "PPC-2026-001", host: "PANEL-PAC-01", cat: "Panel PAC", loc: "Batam DC", room: "Server Room A", rack: "Wall Mount", u: "-", status: "Active", warranty: "2035", vendor: "Schneider" },
  { id: 37, tag: "PDB-2026-001", host: "PANEL-PDU-01", cat: "Panel PDU", loc: "Batam DC", room: "Server Room A", rack: "Wall Mount", u: "-", status: "Active", warranty: "2035", vendor: "Schneider" },
  { id: 38, tag: "FSC-2026-001", host: "FM200-CYL-1", cat: "Fire Suppression Cylinder", loc: "Batam DC", room: "FSS Room", rack: "Floor", u: "-", status: "Active", warranty: "2035", vendor: "Kidde" },
  { id: 39, tag: "FSC-2026-002", host: "FM200-CYL-2", cat: "Fire Suppression Cylinder", loc: "Batam DC", room: "FSS Room", rack: "Floor", u: "-", status: "Active", warranty: "2035", vendor: "Kidde" },
  { id: 40, tag: "SMK-2026-001", host: "SMOKE-R01", cat: "Smoke Detector", loc: "Batam DC", room: "Server Room A", rack: "Ceiling", u: "-", status: "Active", warranty: "2028", vendor: "Notifier" },
  { id: 41, tag: "PHD-2026-001", host: "PHOTO-R01", cat: "Photoelectric Detector", loc: "Batam DC", room: "Server Room A", rack: "Ceiling", u: "-", status: "Active", warranty: "2028", vendor: "Notifier" },
  { id: 42, tag: "VSD-2026-001", host: "VESDA-MAIN", cat: "VESDA System", loc: "Batam DC", room: "Server Room A", rack: "Wall Mount", u: "-", status: "Active", warranty: "2030", vendor: "Xtralis" },
];

const generatedRacks = Array.from({ length: 100 }, (_, i) => ({
  id: 1000 + i,
  tag: `RCK-${2018 + (i % 9)}-${(100 + i).toString()}`,
  host: `RACK-${(i+1).toString().padStart(3, '0')}`,
  cat: "Server Rack / Cabinet",
  loc: "Batam DC",
  room: `Server Room ${i < 50 ? 'A' : 'B'}`,
  rack: "Floor",
  u: "-",
  status: "Active",
  warranty: "Lifetime",
  vendor: "APC"
}));

const generatedServers = Array.from({ length: 100 }, (_, i) => ({
  id: 2000 + i,
  tag: `SRV-${2018 + (i % 9)}-${(100 + i).toString()}`,
  host: `APP-NODE-${(i+1).toString().padStart(3, '0')}`,
  cat: "Server Node / Chassis",
  loc: "Batam DC",
  room: `Server Room ${i < 50 ? 'A' : 'B'}`,
  rack: `RACK-${(Math.floor(i / 2) + 1).toString().padStart(3, '0')}`,
  u: (i % 2 === 0) ? "10" : "20",
  status: "Active",
  warranty: "2029",
  vendor: i % 2 === 0 ? "Dell" : "HPE"
}));

const generatedUPS = Array.from({ length: 2 }, (_, i) => ({
  id: 3000 + i,
  tag: `UPS-2026-${(100 + i).toString()}`,
  host: `UPS-SYS-${i+1}`,
  cat: "UPS Main Unit",
  loc: "Batam DC",
  room: "Power Room",
  rack: "Floor",
  u: "-",
  status: "Active",
  warranty: "2032",
  vendor: "Schneider"
}));

const generatedNVR = Array.from({ length: 2 }, (_, i) => ({
  id: 4000 + i,
  tag: `NVR-2026-${(100 + i).toString()}`,
  host: `NVR-MAIN-${i+1}`,
  cat: "NVR / DVR System",
  loc: "Batam DC",
  room: "Security Room",
  rack: "SEC-R1",
  u: (i * 2 + 10).toString(),
  status: "Active",
  warranty: "2028",
  vendor: "Hikvision"
}));

baseAssets.push(...generatedRacks, ...generatedServers, ...generatedUPS, ...generatedNVR);

export function getFullAssetDetails(tag: string) {
  const base = baseAssets.find(a => a.tag === tag) || baseAssets[0];
  
  // Base details common to all
  const details = {
    tag: base.tag,
    modelDesc: `${base.vendor} Enterprise Edition`,
    status: base.status,
    locationQuick: `${base.loc} • ${base.room} • ${base.rack !== 'Floor' && base.rack !== 'Wall Mount' && base.rack !== 'Pad' && base.rack !== 'Ceiling' ? 'Rack ' + base.rack : base.rack} ${base.u !== '-' ? '• U' + base.u : ''}`,
    hostname: base.host,
    category: base.cat,
    manufacturer: base.vendor,
    model: "Standard Enterprise Model",
    assetNumber: `02.06.02.${base.id.toString().padStart(3, '0')}`,
    serial: `SN-${base.tag.replace(/[^0-9A-Z]/g, '')}`,
    lifecycle: "Production",
    criticality: "High",
    dept: "IT Operations",
    owner: "Infrastructure Team",
    purchaseDate: "10 May 2025",
    purchaseCost: "155,000,000",
    currency: "IDR",
    vendor: base.vendor,
    poNumber: "PO-2505-0891",
    invoiceNumber: "INV-2025-05-001",
    depreciation: "Straight Line (5 Yrs)",
    currentValue: "124,000,000",
    businessService: "Core Infrastructure",
    appOwner: "Budi Santoso",
    techOwner: "Agus Dwi R",
    env: "Production",
    site: base.loc,
    building: "Main Facility",
    floor: "1",
    room: base.room,
    rack: base.rack,
    uPosition: parseInt(base.u) || 1,
    warrantyStart: "10 May 2025",
    warrantyEnd: `12 Dec ${base.warranty !== 'Lifetime' && base.warranty !== 'Expired' ? base.warranty : '2030'}`,
    warrantyRemaining: base.warranty === 'Expired' ? "0 days" : "Active",
    supportVendor: `${base.vendor} ProSupport`,
    supportEmail: `support@${base.vendor.toLowerCase().replace(' ', '')}.com`,
    supportPhone: "+62 800 123 4567",
    contractNum: `CTR-${base.vendor.toUpperCase()}-2025-099`
  };

  // Generic technical specs
  const specs: Record<string, string> = {};

  if (base.cat.includes("Server") || base.cat.includes("Storage") || base.cat.includes("Mainframe")) {
    specs.CPU = "2x Intel Xeon Gold 6430";
    specs.RAM = "512 GB DDR5";
    specs.Storage = "4x 3.84TB NVMe SSD";
    specs.Network = "4x 25GbE";
    specs["Power Supply"] = "2x 1400W Redundant";
    specs.OS = "Ubuntu Server 22.04 LTS";
    specs.Hypervisor = "VMware ESXi 8.0";
  } else if (base.cat.includes("UPS") || base.cat.includes("Power") || base.cat.includes("PDU") || base.cat.includes("MDP") || base.cat.includes("ATS") || base.cat.includes("Genset") || base.cat.includes("Rectifier") || base.cat.includes("Panel")) {
    specs["Capacity (kVA)"] = "100 kVA";
    specs["Input Voltage"] = "380V Three-Phase";
    specs["Output Voltage"] = "220V Single-Phase";
    specs["Battery Type"] = "VRLA 12V 100Ah";
    specs.Runtime = "30 Minutes at Full Load";
    specs.Topology = "Online Double Conversion";
  } else if (base.cat.includes("Switch") || base.cat.includes("Router") || base.cat.includes("Firewall") || base.cat.includes("Access Point")) {
    specs.Ports = "48x 10/25GbE SFP28, 6x 100GbE QSFP28";
    specs["Throughput"] = "3.2 Tbps";
    specs.Latency = "< 1 microsecond";
    specs.Firmware = "NX-OS v9.3.4";
    specs["Power Supply"] = "2x 650W AC";
  } else if (base.cat.includes("AC") || base.cat.includes("Cooling") || base.cat.includes("Chiller") || base.cat.includes("PAC")) {
    specs["Cooling Capacity"] = "50 kW (170,000 BTU)";
    specs.Airflow = "Downflow / Underfloor";
    specs.Refrigerant = "R410A";
    specs["Compressor Type"] = "Inverter Scroll";
    specs["Fan Type"] = "EC Motor";
  } else if (base.cat.includes("NVR") || base.cat.includes("DVR")) {
    specs.Channels = "64-Channel IP Video Input";
    specs.Decoding = "H.265+ / H.265 / H.264";
    specs["Storage Capacity"] = "8x SATA interfaces, up to 10TB each";
    specs.Throughput = "320 Mbps Incoming / 256 Mbps Outgoing";
    specs["Network Interface"] = "2x RJ-45 10/100/1000 Mbps";
  } else if (base.cat.includes("Turnstile") || base.cat.includes("Flap")) {
    specs.Throughput = "35-40 Persons / Minute";
    specs.Material = "SUS304 Stainless Steel";
    specs.MCBF = "5,000,000 Cycles (Mean Cycles Between Failure)";
    specs["Motor Type"] = "Brushless DC Motor";
    specs.Interface = "RS485 / Dry Contact";
  } else if (base.cat.includes("Biometric") || base.cat.includes("Door") || base.cat.includes("Access")) {
    specs.Authentication = "Face / Fingerprint / RFID Card";
    specs["Template Capacity"] = "10,000 Faces / 50,000 Cards";
    specs["Recognition Time"] = "< 0.2 seconds";
    specs.Communication = "TCP/IP, Wiegand, RS485";
    specs["IP Rating"] = "IP65 (Weatherproof)";
  } else if (base.cat.includes("Alarm") || base.cat.includes("FSS Panel")) {
    specs["System Type"] = "Addressable Control Panel";
    specs.Zones = "16 Configurable Zones";
    specs.Communication = "TCP/IP, GSM/GPRS Module";
    specs["Battery Backup"] = "2x 12V 7Ah SLA";
    specs.Protocol = "Modbus RTU / BACnet IP";
  } else if (base.cat.includes("Cylinder") || base.cat.includes("Fire Suppression")) {
    specs["Agent Type"] = "FM-200 (HFC-227ea)";
    specs["Cylinder Capacity"] = "150 lbs / 68 kg";
    specs["Operating Pressure"] = "360 psi (25 bar)";
    specs["Discharge Time"] = "< 10 Seconds";
    specs["Valve Type"] = "Brass Solenoid Actuated";
  } else if (base.cat.includes("Detector")) {
    specs["Detection Type"] = "Optical Photoelectric / Ionization";
    specs.Sensitivity = "0.5% - 2.0% obs/ft";
    specs["Coverage Area"] = "900 sq.ft (83 sq.m)";
    specs["Operating Voltage"] = "24V DC";
    specs["Alarm Current"] = "50mA";
  } else if (base.cat.includes("VESDA")) {
    specs["Detection Technology"] = "Laser-based Aspiration";
    specs["Pipe Length"] = "Up to 200m total";
    specs["Sensitivity Range"] = "0.005% - 20% obs/m";
    specs["Area Coverage"] = "Up to 2,000 sq.m";
    specs.Communication = "Modbus / Ethernet";
  } else if (base.cat.includes("CCTV") || base.cat.includes("Camera")) {
    specs.Resolution = "4K Ultra HD (8MP)";
    specs.Connectivity = "PoE (Power over Ethernet)";
    specs["Field of View"] = "120 Degree Wide Angle";
    specs.Storage = "NVR Connected / MicroSD Edge";
    specs.Firmware = "v2.0.1 (Latest)";
  } else {
    // Fallback generic physical
    specs["Dimensions"] = "600x1000x2000 mm";
    specs.Weight = "45 kg";
    specs.Material = "Heavy Duty Steel";
    specs["Mounting"] = "Standard 19-inch";
  }

  return { details, specs };
}

export const mockVendors = [
  {
    id: "v-dell",
    name: "PT. Dell Indonesia",
    type: "Hardware",
    contactPerson: "Budi Santoso",
    contactTitle: "Enterprise Account Manager",
    email: "budi.santoso@dell.com",
    phone: "+62 812-1234-5678",
    status: "Active",
    assetsCount: 15,
    assetPercentage: 23.5,
    website: "www.dell.com/id",
    address: "Menara BCA Lt. 48\nJl. M.H. Thamrin No. 1\nJakarta Pusat 10310\nIndonesia",
    activeAssets: 14,
    expiredWarranty: 1,
    contracts: 2,
    icon: "Server",
    color: "#007DB8",
    notes: "Preferred vendor for Dell servers and storage.\nExcellent support and delivery performance.\nLast updated: 10 May 2025 by Agus Dwi R"
  },
  {
    id: "v-cisco",
    name: "PT. Cisco Systems Indonesia",
    type: "Network",
    contactPerson: "Rina Handayani",
    contactTitle: "Systems Engineer",
    email: "rina.handayani@cisco.com",
    phone: "+62 811-9876-5432",
    status: "Active",
    assetsCount: 10,
    assetPercentage: 15.0,
    website: "www.cisco.com/c/id_id",
    address: "Capital Place, 29th Floor\nJl. Jend. Gatot Subroto Kav. 18\nJakarta 12710\nIndonesia",
    activeAssets: 10,
    expiredWarranty: 0,
    contracts: 1,
    icon: "Network",
    color: "#049FD9",
    notes: "Main supplier for core network switches and transceivers."
  },
  {
    id: "v-schneider",
    name: "PT. Schneider Electric Indonesia",
    type: "Power",
    contactPerson: "Taufik Hidayat",
    contactTitle: "Datacenter Sales Manager",
    email: "taufik.hidayat@se.com",
    phone: "+62 811-3333-4455",
    status: "Active",
    assetsCount: 8,
    assetPercentage: 12.5,
    website: "www.se.com/id",
    address: "Ventura Building 7th Floor\nJl. R.A. Kartini 26\nJakarta Selatan 12430\nIndonesia",
    activeAssets: 8,
    expiredWarranty: 0,
    contracts: 1,
    icon: "Zap",
    color: "#3DCD58",
    notes: "Primary supplier for UPS, Battery Banks, and APC Racks."
  },
  {
    id: "v-netapp",
    name: "PT. NetApp Indonesia",
    type: "Storage",
    contactPerson: "Yudi Pratama",
    contactTitle: "Storage Specialist",
    email: "yudi.pratama@netapp.com",
    phone: "+62 812-4444-5566",
    status: "Active",
    assetsCount: 5,
    assetPercentage: 7.9,
    website: "www.netapp.com",
    address: "Sentral Senayan II\nJl. Asia Afrika No. 8\nJakarta 10270\nIndonesia",
    activeAssets: 5,
    expiredWarranty: 0,
    contracts: 1,
    icon: "HardDrive",
    color: "#0067C5",
    notes: "Enterprise storage provider for main DC SAN Storage."
  },
  {
    id: "v-paloalto",
    name: "PT. Palo Alto Networks Indonesia",
    type: "Security",
    contactPerson: "Dimas Ramadhan",
    contactTitle: "Security Account Manager",
    email: "dramadhan@paloaltonetworks.com",
    phone: "+62 813-6666-7788",
    status: "Active",
    assetsCount: 4,
    assetPercentage: 5.8,
    website: "www.paloaltonetworks.com",
    address: "Menara BCA 50th Floor\nJl. M.H. Thamrin No. 1\nJakarta 10310\nIndonesia",
    activeAssets: 4,
    expiredWarranty: 0,
    contracts: 1,
    icon: "ShieldAlert",
    color: "#EF4444",
    notes: "Core perimeter security and firewall solutions."
  },
  {
    id: "v-vertiv",
    name: "PT. Vertiv Technology Indonesia",
    type: "Power",
    contactPerson: "Fajar Nugroho",
    contactTitle: "Sales Engineer",
    email: "fajar.nugroho@vertiv.com",
    phone: "+62 821-8888-9900",
    status: "Active",
    assetsCount: 3,
    assetPercentage: 4.5,
    website: "www.vertiv.com/id",
    address: "South Quarter Tower A\nJl. R.A. Kartini Kav. 8\nJakarta Selatan 12430\nIndonesia",
    activeAssets: 3,
    expiredWarranty: 0,
    contracts: 1,
    icon: "Zap",
    color: "#F59E0B",
    notes: "Supplier for Rectifiers, Inverters, and specialized DC Power."
  },
  {
    id: "v-stulz",
    name: "PT. Stulz Air Technology",
    type: "Cooling",
    contactPerson: "Andi Wijaya",
    contactTitle: "Cooling Specialist",
    email: "awijaya@stulz.co.id",
    phone: "+62 813-5555-1122",
    status: "Active",
    assetsCount: 3,
    assetPercentage: 3.4,
    website: "www.stulz.com",
    address: "Kawasan Industri MM2100\nCibitung, Bekasi\nIndonesia",
    activeAssets: 3,
    expiredWarranty: 0,
    contracts: 1,
    icon: "Snowflake",
    color: "#06B6D4",
    notes: "Precision Air Conditioning (PAC/CRAC) solutions for Data Center."
  },
  {
    id: "v-hikvision",
    name: "PT. Hikvision Technology Indonesia",
    type: "Security",
    contactPerson: "Dewi Lestari",
    contactTitle: "Project Manager",
    email: "dewi.lestari@hikvision.com",
    phone: "+62 852-2222-3344",
    status: "Active",
    assetsCount: 2,
    assetPercentage: 2.9,
    website: "www.hikvision.com",
    address: "APL Tower 36th Floor\nCentral Park, Letjen S. Parman\nJakarta Barat 11470\nIndonesia",
    activeAssets: 2,
    expiredWarranty: 0,
    contracts: 1,
    icon: "ShieldAlert",
    color: "#C81F27",
    notes: "CCTV and NVR security surveillance systems."
  },
  {
    id: "v-ibm",
    name: "PT. IBM Indonesia",
    type: "Hardware",
    contactPerson: "Rizky Firmansyah",
    contactTitle: "Mainframe Account Executive",
    email: "rizky.firmansyah@id.ibm.com",
    phone: "+62 822-9999-0011",
    status: "Active",
    assetsCount: 1,
    assetPercentage: 1.4,
    website: "www.ibm.com/id-en",
    address: "The Plaza Office Tower\nJl. M.H. Thamrin Kav. 28-30\nJakarta 10350\nIndonesia",
    activeAssets: 1,
    expiredWarranty: 0,
    contracts: 1,
    icon: "Server",
    color: "#0530AD",
    notes: "Mainframe (IBM zSystems) hardware and support."
  },
  {
    id: "v-trakindo",
    name: "PT. Trakindo Utama (Caterpillar)",
    type: "Power",
    contactPerson: "Bowo Santoso",
    contactTitle: "Power Systems Engineer",
    email: "bowo.santoso@trakindo.co.id",
    phone: "+62 811-2222-1111",
    status: "Maintenance",
    assetsCount: 1,
    assetPercentage: 1.4,
    website: "www.trakindo.co.id",
    address: "Gedung TMT 1\nJl. Cilandak KKO No. 1\nJakarta Selatan 12560\nIndonesia",
    activeAssets: 0,
    expiredWarranty: 0,
    contracts: 1,
    icon: "Zap",
    color: "#F59E0B",
    notes: "Heavy-duty Generator Sets (Genset) for Data Center backup power."
  }
];

export const mockCategories = [
  {
    id: "cat-infra",
    name: "Infrastructure",
    code: "INF",
    parent: null,
    description: "Core physical IT infrastructure",
    icon: "Layers",
    color: "#3B82F6",
    status: "Active",
    assetCount: 1240,
    createdDate: "2025-01-10",
    rules: { requireSerial: true, requireWarranty: true, requireLocation: true },
    templates: []
  },
  {
    id: "cat-server",
    name: "Servers",
    code: "SRV",
    parent: "cat-infra",
    description: "Physical and virtual server assets",
    icon: "Server",
    color: "#3B82F6",
    status: "Active",
    assetCount: 512,
    createdDate: "2025-01-15",
    rules: { requireSerial: true, requireWarranty: true, requireVendor: true, requireRackPosition: true, requireLocation: true },
    templates: ["CPU", "RAM", "Storage", "Power Supply", "Network Interface", "Operating System"]
  },
  {
    id: "cat-storage",
    name: "Storage",
    code: "STR",
    parent: "cat-infra",
    description: "SAN, NAS, and Direct Attached Storage",
    icon: "HardDrive",
    color: "#8B5CF6",
    status: "Active",
    assetCount: 198,
    createdDate: "2025-01-16",
    rules: { requireSerial: true, requireWarranty: true, requireVendor: true, requireRackPosition: true, requireLocation: true },
    templates: ["Total Capacity", "Drive Type", "RAID Level", "Controllers", "Host Ports"]
  },
  {
    id: "cat-network",
    name: "Network",
    code: "NET",
    parent: null,
    description: "Networking equipment and appliances",
    icon: "Network",
    color: "#10B981",
    status: "Active",
    assetCount: 356,
    createdDate: "2025-01-10",
    rules: { requireSerial: true, requireWarranty: true, requireLocation: true },
    templates: []
  },
  {
    id: "cat-switch",
    name: "Core Switch",
    code: "SWC",
    parent: "cat-network",
    description: "High-capacity backbone switches",
    icon: "Share2",
    color: "#10B981",
    status: "Active",
    assetCount: 42,
    createdDate: "2025-01-16",
    rules: { requireSerial: true, requireWarranty: true, requireVendor: true, requireRackPosition: true, requireLocation: true },
    templates: ["Ports", "Speed", "Vendor", "Firmware", "Management IP", "Throughput"]
  },
  {
    id: "cat-router",
    name: "Router",
    code: "RTR",
    parent: "cat-network",
    description: "Edge and core routing equipment",
    icon: "Router",
    color: "#10B981",
    status: "Active",
    assetCount: 28,
    createdDate: "2025-01-16",
    rules: { requireSerial: true, requireWarranty: true, requireVendor: true, requireRackPosition: true, requireLocation: true },
    templates: ["Routing Protocols", "WAN Ports", "LAN Ports", "Throughput", "Management IP"]
  },
  {
    id: "cat-firewall",
    name: "Firewall",
    code: "FWL",
    parent: "cat-network",
    description: "Security appliances and firewalls",
    icon: "ShieldAlert",
    color: "#EF4444",
    status: "Active",
    assetCount: 56,
    createdDate: "2025-01-17",
    rules: { requireSerial: true, requireWarranty: true, requireVendor: true, requireRackPosition: true, requireLocation: true },
    templates: ["Inspection Throughput", "VPN Tunnels", "Concurrent Sessions", "Firmware", "Management IP"]
  },
  {
    id: "cat-power",
    name: "Power",
    code: "PWR",
    parent: null,
    description: "Power infrastructure and distribution",
    icon: "Zap",
    color: "#F59E0B",
    status: "Active",
    assetCount: 112,
    createdDate: "2025-01-10",
    rules: { requireSerial: true, requireWarranty: true, requireLocation: true },
    templates: []
  },
  {
    id: "cat-ups",
    name: "UPS",
    code: "UPS",
    parent: "cat-power",
    description: "Uninterruptible Power Supplies",
    icon: "BatteryCharging",
    color: "#F59E0B",
    status: "Active",
    assetCount: 24,
    createdDate: "2025-01-18",
    rules: { requireSerial: true, requireWarranty: true, requireVendor: true, requireLocation: true },
    templates: ["Capacity (kVA)", "Battery Type", "Input Voltage", "Output Voltage", "Runtime", "Topology"]
  },
  {
    id: "cat-pdu",
    name: "PDU",
    code: "PDU",
    parent: "cat-power",
    description: "Power Distribution Units",
    icon: "Plug",
    color: "#F59E0B",
    status: "Active",
    assetCount: 80,
    createdDate: "2025-01-18",
    rules: { requireSerial: true, requireWarranty: true, requireRackPosition: true, requireLocation: true },
    templates: ["Phase", "Amperage", "Outlets", "Input Plug", "Monitoring"]
  },
  {
    id: "cat-cooling",
    name: "Cooling",
    code: "COL",
    parent: null,
    description: "Precision cooling systems",
    icon: "Snowflake",
    color: "#06B6D4",
    status: "Active",
    assetCount: 38,
    createdDate: "2025-01-10",
    rules: { requireSerial: true, requireWarranty: true, requireLocation: true },
    templates: []
  },
  {
    id: "cat-crac",
    name: "CRAC",
    code: "CRA",
    parent: "cat-cooling",
    description: "Computer Room Air Conditioning",
    icon: "Wind",
    color: "#06B6D4",
    status: "Active",
    assetCount: 16,
    createdDate: "2025-01-19",
    rules: { requireSerial: true, requireWarranty: true, requireVendor: true, requireLocation: true },
    templates: ["Cooling Capacity", "Airflow", "Refrigerant", "Compressor Type", "Fan Type"]
  },
  {
    id: "cat-security",
    name: "Security",
    code: "SEC",
    parent: null,
    description: "Physical security systems",
    icon: "Shield",
    color: "#EF4444",
    status: "Active",
    assetCount: 18,
    createdDate: "2025-01-10",
    rules: { requireSerial: true, requireLocation: true },
    templates: []
  },
  {
    id: "cat-software",
    name: "Software",
    code: "SFW",
    parent: null,
    description: "Licensed software and systems",
    icon: "Box",
    color: "#8B5CF6",
    status: "Active",
    assetCount: 8,
    createdDate: "2025-01-10",
    rules: { requireWarranty: true },
    templates: []
  }
];

export const mockSites = [
  {
    id: "s-btm-01",
    name: "Batam DC",
    type: "Main Data Center",
    code: "BTM-DC-01",
    country: "Indonesia",
    city: "Batam",
    address: "Jl. Sudirman No. 1\nBatam Center, Batam\nIndonesia 29400",
    timezone: "WIB (UTC+7)",
    status: "Active",
    established: "1 Jan 2018",
    totalAssets: 520,
    powerCapacity: "3,000",
    totalArea: "4,200",
    pue: "1.45",
    description: "Primary data center located in Batam, Tier III facility with high availability.",
    capacity: { power: 62, space: 58, cooling: 55 },
    color: "#007DB8"
  },
  {
    id: "s-jkt-01",
    name: "Jakarta DC",
    type: "Jakarta Data Center",
    code: "JKT-DC-01",
    country: "Indonesia",
    city: "Jakarta",
    address: "Jl. Jend. Gatot Subroto\nJakarta Selatan\nIndonesia 12710",
    timezone: "WIB (UTC+7)",
    status: "Active",
    established: "15 Mar 2015",
    totalAssets: 280,
    powerCapacity: "2,000",
    totalArea: "3,100",
    pue: "1.60",
    description: "Legacy primary data center now serving as secondary site.",
    capacity: { power: 85, space: 90, cooling: 82 },
    color: "#049FD9"
  },
  {
    id: "s-sby-01",
    name: "Surabaya DC",
    type: "Surabaya Data Center",
    code: "SBY-DC-01",
    country: "Indonesia",
    city: "Surabaya",
    address: "Jl. Basuki Rahmat\nSurabaya\nIndonesia 60271",
    timezone: "WIB (UTC+7)",
    status: "Active",
    established: "10 Aug 2019",
    totalAssets: 198,
    powerCapacity: "1,500",
    totalArea: "2,600",
    pue: "1.52",
    description: "Regional data center covering Eastern Indonesia.",
    capacity: { power: 45, space: 40, cooling: 50 },
    color: "#3DCD58"
  },
  {
    id: "s-bdg-01",
    name: "Bandung DC",
    type: "Bandung Data Center",
    code: "BDG-DC-01",
    country: "Indonesia",
    city: "Bandung",
    address: "Jl. Asia Afrika\nBandung\nIndonesia 40111",
    timezone: "WIB (UTC+7)",
    status: "Active",
    established: "22 Nov 2020",
    totalAssets: 150,
    powerCapacity: "1,250",
    totalArea: "1,850",
    pue: "1.48",
    description: "Edge data center serving local West Java clients.",
    capacity: { power: 30, space: 35, cooling: 25 },
    color: "#8B5CF6"
  },
  {
    id: "s-sgp-01",
    name: "Singapore DC",
    type: "Singapore Data Center",
    code: "SGP-DC-01",
    country: "Singapore",
    city: "Singapore",
    address: "Tanjong Pagar\nSingapore 088540",
    timezone: "SGT (UTC+8)",
    status: "Active",
    established: "05 May 2022",
    totalAssets: 80,
    powerCapacity: "750",
    totalArea: "1,200",
    pue: "1.35",
    description: "Colocation site for international connectivity.",
    capacity: { power: 20, space: 15, cooling: 18 },
    color: "#EF4444"
  },
  {
    id: "s-dr-01",
    name: "Backup DC",
    type: "Disaster Recovery Site",
    code: "DR-DC-01",
    country: "Indonesia",
    city: "Batam",
    address: "Nongsa Digital Park\nBatam\nIndonesia 29466",
    timezone: "WIB (UTC+7)",
    status: "Inactive",
    established: "12 Dec 2023",
    totalAssets: 20,
    powerCapacity: "250",
    totalArea: "480",
    pue: "1.80",
    description: "Cold disaster recovery site, currently under construction/inactive.",
    capacity: { power: 5, space: 10, cooling: 0 },
    color: "#6B7280"
  }
];

// Array of 20 Indonesian Cities for Data Centers
const indoCities = [
  "Medan", "Palembang", "Pekanbaru", "Padang", "Bandar Lampung",
  "Bogor", "Depok", "Tangerang", "Bekasi", "Cirebon",
  "Semarang", "Yogyakarta", "Surakarta", "Malang", "Sidoarjo",
  "Denpasar", "Mataram", "Balikpapan", "Makassar", "Manado"
];

// Generate 20 more mock sites to reach 26 total locations
const additionalSites = indoCities.map((city, i) => ({
  id: `s-mock-${i}`,
  name: `${city} Data Center`,
  type: i % 3 === 0 ? "Regional Core Data Center" : "Edge Data Center",
  code: `${city.substring(0, 3).toUpperCase()}-DC-01`,
  country: "Indonesia",
  city: city,
  address: `Jl. Teknologi No. ${i + 1}\n${city}, Indonesia\nZip ${10000 + (i * 123)}`,
  timezone: i >= 17 ? "WITA (UTC+8)" : "WIB (UTC+7)",
  status: i % 8 === 0 ? "Maintenance" : "Active",
  established: `10 ${['Jan', 'Mar', 'Jun', 'Sep', 'Nov'][i % 5]} 202${i % 5}`,
  totalAssets: 50 + (i * 24),
  powerCapacity: (100 + i * 50).toString(),
  totalArea: (200 + i * 100).toString(),
  pue: "1." + (40 + (i % 20)).toString(),
  description: `Facility located in the growing tech hub of ${city}.`,
  capacity: { power: 10 + (i % 80), space: 20 + (i % 70), cooling: 30 + (i % 60) },
  color: ['#007DB8', '#049FD9', '#3DCD58', '#8B5CF6', '#EF4444', '#F59E0B'][i % 6]
}));

mockSites.push(...additionalSites);

export const mockBuildings = [
  { 
    id: "1", name: "Building A", subtitle: "Primary Building", desc: "Primary building for critical IT infrastructure with N+1 power and cooling design.", 
    site: "Batam DC", siteCode: "BTM-DC-01", code: "B-A", 
    floors: 5, rooms: 12, racks: 120, assets: 520, power: 3000, area: 12500, status: "Active",
    country: "Indonesia", address: "Jl. Sudirman No. 1, Batam Center, Batam, Indonesia 29400", established: "15 Feb 2019",
    utilization: { power: 62, space: 58, cooling: 55 }
  },
  { 
    id: "2", name: "Building B", subtitle: "Secondary Building", desc: "Secondary building for backup and non-critical operations.", 
    site: "Batam DC", siteCode: "BTM-DC-01", code: "B-B", 
    floors: 4, rooms: 10, racks: 80, assets: 320, power: 2000, area: 8200, status: "Active",
    country: "Indonesia", address: "Jl. Sudirman No. 2, Batam Center, Batam, Indonesia 29400", established: "20 Aug 2020",
    utilization: { power: 45, space: 60, cooling: 40 }
  },
  { 
    id: "3", name: "Tower 1", subtitle: "Main Tower", desc: "Main Tower housing enterprise core services.", 
    site: "Jakarta DC", siteCode: "JKT-DC-01", code: "T1", 
    floors: 12, rooms: 24, racks: 240, assets: 480, power: 4000, area: 18600, status: "Active",
    country: "Indonesia", address: "Sudirman CBD, Jakarta Selatan, 12190", established: "10 Jan 2018",
    utilization: { power: 78, space: 82, cooling: 75 }
  },
  { 
    id: "4", name: "Tower 2", subtitle: "Expansion Tower", desc: "Expansion Tower for colocation and cloud services.", 
    site: "Jakarta DC", siteCode: "JKT-DC-01", code: "T2", 
    floors: 10, rooms: 20, racks: 160, assets: 280, power: 2500, area: 14800, status: "Active",
    country: "Indonesia", address: "Sudirman CBD, Jakarta Selatan, 12190", established: "05 May 2021",
    utilization: { power: 50, space: 45, cooling: 48 }
  },
  { 
    id: "5", name: "Building 1", subtitle: "Main Building", desc: "Main DC for East Java region operations.", 
    site: "Surabaya DC", siteCode: "SBY-DC-01", code: "S1", 
    floors: 3, rooms: 8, racks: 60, assets: 198, power: 1500, area: 6800, status: "Active",
    country: "Indonesia", address: "Jl. Pemuda No. 10, Surabaya 60271", established: "12 Nov 2017",
    utilization: { power: 85, space: 90, cooling: 80 }
  },
  { 
    id: "6", name: "Building 2", subtitle: "Support Building", desc: "Support building undergoing infrastructure upgrade.", 
    site: "Surabaya DC", siteCode: "SBY-DC-01", code: "S2", 
    floors: 2, rooms: 6, racks: 40, assets: 74, power: 800, area: 3200, status: "Inactive",
    country: "Indonesia", address: "Jl. Pemuda No. 12, Surabaya 60271", established: "20 Mar 2015",
    utilization: { power: 0, space: 10, cooling: 0 }
  },
  { 
    id: "7", name: "Main Building", subtitle: "Primary Building", desc: "Primary facility serving West Java zone.", 
    site: "Bandung DC", siteCode: "BDG-DC-01", code: "MB", 
    floors: 4, rooms: 10, racks: 72, assets: 150, power: 1250, area: 5980, status: "Active",
    country: "Indonesia", address: "Jl. Asia Afrika No. 50, Bandung 40111", established: "08 Sep 2019",
    utilization: { power: 60, space: 65, cooling: 58 }
  },
  { 
    id: "8", name: "Facility Building", subtitle: "Support Facility", desc: "Regional hub for international cross-connects.", 
    site: "Singapore DC", siteCode: "SGP-DC-01", code: "FB", 
    floors: 3, rooms: 5, racks: 36, assets: 80, power: 750, area: 4600, status: "Active",
    country: "Singapore", address: "10 Tanjong Penjuru, Singapore 609027", established: "25 Oct 2022",
    utilization: { power: 40, space: 35, cooling: 42 }
  },
];

export const mockRooms = [
  { id: "1", name: "Server Room A", desc: "Primary Server Room", code: "SR-A", type: "Server Room", usage: "Production", area: 450, racks: 24, assets: 210, status: "Active" },
  { id: "2", name: "Server Room B", desc: "Secondary Server Room", code: "SR-B", type: "Server Room", usage: "Production", area: 360, racks: 20, assets: 160, status: "Active" },
  { id: "3", name: "Network Room", desc: "Network Equipment Room", code: "NET-01", type: "Network Room", usage: "Production", area: 120, racks: 10, assets: 60, status: "Active" },
  { id: "4", name: "Power Room", desc: "Power Distribution Room", code: "PWR-01", type: "Power Room", usage: "Production", area: 180, racks: 8, assets: 40, status: "Maintenance" },
  { id: "5", name: "Storage Room", desc: "Storage System Room", code: "STG-01", type: "Storage Room", usage: "Backup", area: 150, racks: 12, assets: 30, status: "Active" },
  { id: "6", name: "Office/Support Room", desc: "Operations Room", code: "OPS-01", type: "Office", usage: "Support", area: 90, racks: 0, assets: 20, status: "Active" },
];

export const mockRacks = [
  { id: "1", name: "RACK-01", desc: "Primary Rack", code: "R01", type: "Server Rack", height: "42U", uPosition: "1 - 42", assets: 28, utilization: 81, usedU: 34, availableU: 8, power: 2.8, status: "Active", maxPower: 4.0 },
  { id: "2", name: "RACK-02", desc: "Secondary Rack", code: "R02", type: "Server Rack", height: "42U", uPosition: "1 - 42", assets: 24, utilization: 67, usedU: 28, availableU: 14, power: 2.2, status: "Active", maxPower: 4.0 },
  { id: "3", name: "RACK-03", desc: "Network Rack", code: "R03", type: "Network Rack", height: "42U", uPosition: "1 - 42", assets: 18, utilization: 54, usedU: 22, availableU: 20, power: 1.6, status: "Active", maxPower: 3.0 },
  { id: "4", name: "RACK-04", desc: "Storage Rack", code: "R04", type: "Storage Rack", height: "42U", uPosition: "1 - 42", assets: 26, utilization: 74, usedU: 31, availableU: 11, power: 2.5, status: "Active", maxPower: 4.0 },
  { id: "5", name: "RACK-05", desc: "Power Rack", code: "R05", type: "Power Rack", height: "42U", uPosition: "1 - 42", assets: 12, utilization: 38, usedU: 16, availableU: 26, power: 1.8, status: "Active", maxPower: 5.0 },
  { id: "6", name: "RACK-06", desc: "Backup Rack", code: "R06", type: "Server Rack", height: "42U", uPosition: "1 - 42", assets: 16, utilization: 46, usedU: 19, availableU: 23, power: 1.9, status: "Maintenance", maxPower: 4.0 },
  { id: "7", name: "RACK-07", desc: "Spare Rack", code: "R07", type: "Spare Rack", height: "42U", uPosition: "1 - 42", assets: 0, utilization: 0, usedU: 0, availableU: 42, power: 0, status: "Available", maxPower: 4.0 },
  { id: "8", name: "RACK-08", desc: "Edge Rack", code: "R08", type: "Server Rack", height: "42U", uPosition: "1 - 42", assets: 14, utilization: 41, usedU: 17, availableU: 25, power: 1.3, status: "Active", maxPower: 4.0 },
];

export const mockFloors = [
  { id: "1", name: "Floor 1", desc: "First Floor", code: "F1", type: "Data Center", area: 2500, rooms: 6, racks: 80, assets: 156, status: "Active", raisedFloor: "600 mm", floorHeight: "3,600 mm", power: 4000, cooling: 3000, utilization: 62, building: "Building A", site: "Batam DC" },
  { id: "2", name: "Floor 2", desc: "Second Floor", code: "F2", type: "Data Center", area: 2500, rooms: 6, racks: 64, assets: 122, status: "Active", raisedFloor: "600 mm", floorHeight: "3,600 mm", power: 3500, cooling: 2500, utilization: 50, building: "Building A", site: "Batam DC" },
  { id: "3", name: "Floor 3", desc: "Third Floor", code: "F3", type: "Data Center", area: 2500, rooms: 6, racks: 72, assets: 138, status: "Active", raisedFloor: "600 mm", floorHeight: "3,600 mm", power: 3800, cooling: 2800, utilization: 58, building: "Building A", site: "Batam DC" },
  { id: "4", name: "Floor 4", desc: "Fourth Floor", code: "F4", type: "Office", area: 2500, rooms: 8, racks: 48, assets: 64, status: "Active", raisedFloor: "None", floorHeight: "3,000 mm", power: 500, cooling: 400, utilization: 30, building: "Building A", site: "Batam DC" },
  { id: "5", name: "Floor 5", desc: "Roof Floor", code: "F5", type: "Mechanical", area: 2500, rooms: 4, racks: 56, assets: 40, status: "Active", raisedFloor: "None", floorHeight: "Open", power: 1000, cooling: 800, utilization: 45, building: "Building A", site: "Batam DC" }
];

export const mockMovements = [
  { id: "MOV-2025-0056", assetId: "SRV-250501-001", assetName: "Dell PowerEdge R750", assetImage: "server", type: "Move", fromLoc: "RACK-01 / U24", fromRoom: "Server Room A", toLoc: "RACK-05 / U18", toRoom: "Server Room A", date: "10 Jun 2025", time: "10:00 AM", status: "Completed", user: "Agus S.", userAvatar: "https://i.pravatar.cc/150?u=agus" },
  { id: "MOV-2025-0055", assetId: "SW-250430-002", assetName: "Cisco Catalyst 9500", assetImage: "switch", type: "Transfer", fromLoc: "RACK-02 / U12", fromRoom: "Server Room A", toLoc: "RACK-01 / U08", toRoom: "Server Room B", date: "09 Jun 2025", time: "02:30 PM", status: "Completed", user: "Rudi H.", userAvatar: "https://i.pravatar.cc/150?u=rudi" },
  { id: "MOV-2025-0054", assetId: "UPS-250415-001", assetName: "APC Smart-UPS 3000", assetImage: "ups", type: "Install", fromLoc: "-", fromRoom: "-", toLoc: "RACK-03 / U01", toRoom: "Power Room", date: "08 Jun 2025", time: "09:00 AM", status: "Completed", user: "Dewi K.", userAvatar: "https://i.pravatar.cc/150?u=dewi" },
  { id: "MOV-2025-0053", assetId: "SRV-250428-003", assetName: "HPE ProLiant DL380", assetImage: "server", type: "Move", fromLoc: "RACK-07 / U20", fromRoom: "Server Room B", toLoc: "RACK-07 / U22", toRoom: "Server Room B", date: "12 Jun 2025", time: "11:00 AM", status: "Scheduled", user: "Agus S.", userAvatar: "https://i.pravatar.cc/150?u=agus" },
  { id: "MOV-2025-0052", assetId: "STG-250420-001", assetName: "Dell PowerStore 1000T", assetImage: "storage", type: "Relocate", fromLoc: "RACK-04 / U15", fromRoom: "Storage Room", toLoc: "RACK-04 / U10", toRoom: "Storage Room", date: "13 Jun 2025", time: "01:00 PM", status: "Scheduled", user: "Rudi H.", userAvatar: "https://i.pravatar.cc/150?u=rudi" },
  { id: "MOV-2025-0051", assetId: "FW-250410-001", assetName: "FortiGate 200F", assetImage: "firewall", type: "Move", fromLoc: "RACK-01 / U05", fromRoom: "Server Room B", toLoc: "RACK-02 / U05", toRoom: "Server Room B", date: "14 Jun 2025", time: "10:30 AM", status: "Scheduled", user: "Dewi K.", userAvatar: "https://i.pravatar.cc/150?u=dewi" },
  { id: "MOV-2025-0050", assetId: "SRV-250405-002", assetName: "Dell PowerEdge R740", assetImage: "server", type: "Remove", fromLoc: "RACK-03 / U18", fromRoom: "Server Room A", toLoc: "-", toRoom: "-", date: "07 Jun 2025", time: "03:00 PM", status: "Completed", user: "Agus S.", userAvatar: "https://i.pravatar.cc/150?u=agus" },
  { id: "MOV-2025-0049", assetId: "SW-250401-003", assetName: "Cisco Nexus 93180YC", assetImage: "switch", type: "Transfer", fromLoc: "RACK-05 / U07", fromRoom: "Server Room C", toLoc: "RACK-06 / U07", toRoom: "Server Room C", date: "06 Jun 2025", time: "11:15 AM", status: "Cancelled", user: "Rudi H.", userAvatar: "https://i.pravatar.cc/150?u=rudi" },
  { id: "MOV-2025-0048", assetId: "PDU-250330-001", assetName: "Vertiv Geist Basic Rack PDU", assetImage: "pdu", type: "Move", fromLoc: "RACK-02 / U40", fromRoom: "Server Room A", toLoc: "RACK-02 / U42", toRoom: "Server Room A", date: "05 Jun 2025", time: "09:45 AM", status: "Completed", user: "Dewi K.", userAvatar: "https://i.pravatar.cc/150?u=dewi" },
  { id: "MOV-2025-0047", assetId: "SRV-250325-001", assetName: "HPE ProLiant DL380", assetImage: "server", type: "Relocate", fromLoc: "RACK-04 / U22", fromRoom: "Server Room A", toLoc: "RACK-04 / U24", toRoom: "Server Room A", date: "04 Jun 2025", time: "02:00 PM", status: "Completed", user: "Agus S.", userAvatar: "https://i.pravatar.cc/150?u=agus" },
];

export const mockWarranties = [
  { id: "WAR-2025-0312", assetId: "SRV-250501-001", assetName: "Dell PowerEdge R750", sn: "9YBX123", assetImage: "server", vendor: "Dell Technologies", vendorIcon: "Box", startDate: "10 Jan 2025", endDate: "09 Jan 2027", daysRemaining: 410, totalDays: 730, status: "Active", coverageType: "Onsite Support", contactPerson: "Dell Support", phone: "0804-1-458-3355", email: "support@dell.com", contractNum: "CN-DEL-2025-0012" },
  { id: "WAR-2025-0311", assetId: "UPS-250415-001", assetName: "APC Smart-UPS 3000", sn: "AS203RX12345", assetImage: "ups", vendor: "Schneider Electric", vendorIcon: "Box", startDate: "15 Apr 2025", endDate: "14 Apr 2027", daysRemaining: 505, totalDays: 730, status: "Active", coverageType: "Onsite Support", contactPerson: "APC Support", phone: "1500-055", email: "support@se.com", contractNum: "CN-APC-2025-0044" },
  { id: "WAR-2025-0310", assetId: "SW-250401-001", assetName: "Cisco Nexus 93180YC", sn: "FOC2345X0M0", assetImage: "switch", vendor: "Cisco Systems", vendorIcon: "Box", startDate: "01 Apr 2025", endDate: "31 Mar 2027", daysRemaining: 491, totalDays: 730, status: "Active", coverageType: "SMARTnet 24x7x4", contactPerson: "Cisco TAC", phone: "001-803-657-122", email: "tac@cisco.com", contractNum: "CN-CIS-2025-0082" },
  { id: "WAR-2025-0309", assetId: "STG-250420-001", assetName: "Dell PowerStore 1000T", sn: "8KJH23X", assetImage: "storage", vendor: "Dell Technologies", vendorIcon: "Box", startDate: "20 Apr 2025", endDate: "19 Apr 2026", daysRemaining: 42, totalDays: 365, status: "Expiring Soon", coverageType: "ProSupport", contactPerson: "Dell Support", phone: "0804-1-458-3355", email: "support@dell.com", contractNum: "CN-DEL-2025-0015" },
  { id: "WAR-2025-0308", assetId: "FW-250410-001", assetName: "FortiGate 200F", sn: "FGT200F3X123", assetImage: "firewall", vendor: "Fortinet", vendorIcon: "Box", startDate: "10 Apr 2025", endDate: "09 Apr 2026", daysRemaining: 32, totalDays: 365, status: "Expiring Soon", coverageType: "FortiCare Premium", contactPerson: "Fortinet Support", phone: "001-803-015-204", email: "support@fortinet.com", contractNum: "CN-FGT-2025-0018" },
  { id: "WAR-2025-0307", assetId: "PD-250330-001", assetName: "Vertiv Geist Basic Rack PDU", sn: "VP1234567890", assetImage: "pdu", vendor: "Vertiv", vendorIcon: "Box", startDate: "30 Mar 2025", endDate: "29 Mar 2026", daysRemaining: 21, totalDays: 365, status: "Expiring Soon", coverageType: "Onsite Support", contactPerson: "Vertiv Service", phone: "1500-111", email: "service@vertiv.com", contractNum: "CN-VER-2025-0021" },
  { id: "WAR-2025-0306", assetId: "AC-250317-001", assetName: "Liebert CRV 25kW", sn: "LC250317001", assetImage: "pac", vendor: "Vertiv", vendorIcon: "Box", startDate: "17 Mar 2025", endDate: "16 Mar 2026", daysRemaining: 8, totalDays: 365, status: "Expiring Soon", coverageType: "Onsite Support", contactPerson: "Vertiv Service", phone: "1500-111", email: "service@vertiv.com", contractNum: "CN-VER-2025-0019" },
  { id: "WAR-2025-0305", assetId: "SRV-240301-002", assetName: "HPE ProLiant DL380 Gen10", sn: "2M2345DABC", assetImage: "server", vendor: "Hewlett Packard", vendorIcon: "Box", startDate: "01 Mar 2024", endDate: "28 Feb 2025", daysRemaining: -10, totalDays: 365, status: "Expired", coverageType: "Proactive Care", contactPerson: "HPE Pointnext", phone: "0800-1-473-473", email: "support@hpe.com", contractNum: "CN-HPE-2024-0011" },
  { id: "WAR-2025-0304", assetId: "SW-240215-001", assetName: "Cisco Catalyst 9500-48Y4C", sn: "FOC2341A182", assetImage: "switch", vendor: "Cisco Systems", vendorIcon: "Box", startDate: "15 Feb 2024", endDate: "14 Feb 2025", daysRemaining: -24, totalDays: 365, status: "Expired", coverageType: "SMARTnet 24x7x4", contactPerson: "Cisco TAC", phone: "001-803-657-122", email: "tac@cisco.com", contractNum: "CN-CIS-2024-0042" },
  { id: "WAR-2025-0303", assetId: "BAT-240101-001", assetName: "APC Replacement Battery", sn: "ASBATT12345", assetImage: "battery", vendor: "Schneider Electric", vendorIcon: "Box", startDate: "01 Jan 2024", endDate: "31 Dec 2024", daysRemaining: -129, totalDays: 365, status: "Expired", coverageType: "Replacement", contactPerson: "APC Support", phone: "1500-055", email: "support@se.com", contractNum: "CN-APC-2024-0005" },
];

export const mockUsers = [
  { id: "USR-0001", name: "Agus Setiawan", username: "@agus.setiawan", role: "Super Admin", roleLabel: "Super Administrator", email: "agus.setiawan@audira.id", location: "Head Office", status: "Active", lastLogin: "Today, 09:15 AM", joinedDate: "10 Jan 2025", phone: "0804-1-458-3355", language: "English", timezone: "(UTC+07:00) Jakarta", avatar: "https://i.pravatar.cc/150?u=agus", activity: { logins: 28, assetsCreated: 12, assetMovements: 7, warrantiesManaged: 15, reportsGenerated: 9 } },
  { id: "USR-0002", name: "Rudi Hermawan", username: "@rudi.hermawan", role: "Admin", roleLabel: "Administrator", email: "rudi.hermawan@audira.id", location: "Data Center 1", status: "Active", lastLogin: "Today, 08:42 AM", joinedDate: "15 Jan 2025", phone: "0812-3456-7890", language: "Indonesian", timezone: "(UTC+07:00) Jakarta", avatar: "https://i.pravatar.cc/150?u=rudi", activity: { logins: 45, assetsCreated: 5, assetMovements: 12, warrantiesManaged: 2, reportsGenerated: 1 } },
  { id: "USR-0003", name: "Dewi Kartika", username: "@dewi.kartika", role: "Manager", roleLabel: "Manager", email: "dewi.kartika@audira.id", location: "Data Center 1", status: "Active", lastLogin: "Yesterday, 04:30 PM", joinedDate: "20 Jan 2025", phone: "0813-4567-8901", language: "English", timezone: "(UTC+07:00) Jakarta", avatar: "https://i.pravatar.cc/150?u=dewi", activity: { logins: 20, assetsCreated: 0, assetMovements: 5, warrantiesManaged: 8, reportsGenerated: 14 } },
  { id: "USR-0004", name: "Budi Santoso", username: "@budi.santoso", role: "Technician", roleLabel: "Technician", email: "budi.santoso@audira.id", location: "Data Center 1", status: "Active", lastLogin: "Yesterday, 03:12 PM", joinedDate: "05 Feb 2025", phone: "0814-5678-9012", language: "Indonesian", timezone: "(UTC+07:00) Jakarta", avatar: "https://i.pravatar.cc/150?u=budi", activity: { logins: 60, assetsCreated: 30, assetMovements: 45, warrantiesManaged: 1, reportsGenerated: 0 } },
  { id: "USR-0005", name: "Siti Nurhaliza", username: "@siti.nurhaliza", role: "Operator", roleLabel: "Operator", email: "siti.nurhaliza@audira.id", location: "Data Center 2", status: "Active", lastLogin: "Yesterday, 11:05 AM", joinedDate: "10 Feb 2025", phone: "0815-6789-0123", language: "English", timezone: "(UTC+07:00) Jakarta", avatar: "https://i.pravatar.cc/150?u=siti", activity: { logins: 55, assetsCreated: 8, assetMovements: 20, warrantiesManaged: 0, reportsGenerated: 2 } },
  { id: "USR-0006", name: "Fajar Pratama", username: "@fajar.pratama", role: "Viewer", roleLabel: "Viewer", email: "fajar.pratama@audira.id", location: "Data Center 2", status: "Active", lastLogin: "2 days ago, 02:20 PM", joinedDate: "15 Feb 2025", phone: "0816-7890-1234", language: "Indonesian", timezone: "(UTC+07:00) Jakarta", avatar: "https://i.pravatar.cc/150?u=fajar", activity: { logins: 10, assetsCreated: 0, assetMovements: 0, warrantiesManaged: 0, reportsGenerated: 5 } },
  { id: "USR-0007", name: "Indah Permata", username: "@indah.permata", role: "Technician", roleLabel: "Technician", email: "indah.permata@audira.id", location: "Data Center 3", status: "Inactive", lastLogin: "15 days ago", joinedDate: "20 Feb 2025", phone: "0817-8901-2345", language: "English", timezone: "(UTC+07:00) Jakarta", avatar: "https://i.pravatar.cc/150?u=indah", activity: { logins: 5, assetsCreated: 2, assetMovements: 3, warrantiesManaged: 0, reportsGenerated: 0 } },
  { id: "USR-0008", name: "Yudi Setiawan", username: "@yudi.setiawan", role: "Operator", roleLabel: "Operator", email: "yudi.setiawan@audira.id", location: "Data Center 3", status: "Inactive", lastLogin: "1 month ago", joinedDate: "25 Feb 2025", phone: "0818-9012-3456", language: "Indonesian", timezone: "(UTC+07:00) Jakarta", avatar: "https://i.pravatar.cc/150?u=yudi", activity: { logins: 2, assetsCreated: 0, assetMovements: 1, warrantiesManaged: 0, reportsGenerated: 0 } },
];

export const mockLogs = [
  { id: "LOG-001", timestamp: "31 May 2025, 09:15 AM", user: "Agus Setiawan", userRole: "Super Admin", userAvatar: "https://i.pravatar.cc/150?u=agus", action: "Updated", module: "Asset", resource: "Dell PowerEdge R750", resourceId: "AST-250501-001", ip: "192.168.1.10", severity: "Info", userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/124.0.0.0", description: "Asset details updated: Status, Location, and Warranty information.", changes: [{field: "Status", from: "Active", to: "Maintenance"}, {field: "Location", from: "Server Room A", to: "Server Room B"}, {field: "Warranty", from: "WAR-2024-0211", to: "WAR-2025-0312"}] },
  { id: "LOG-002", timestamp: "31 May 2025, 09:12 AM", user: "Rudi Hermawan", userRole: "Admin", userAvatar: "https://i.pravatar.cc/150?u=rudi", action: "Created", module: "User", resource: "New User: Indah Permata", resourceId: "USR-0051", ip: "192.168.1.15", severity: "Info", userAgent: "Mozilla/5.0...", description: "Created a new user account.", changes: [] },
  { id: "LOG-003", timestamp: "31 May 2025, 09:08 AM", user: "Dewi Kartika", userRole: "Manager", userAvatar: "https://i.pravatar.cc/150?u=dewi", action: "Deleted", module: "Asset", resource: "Cisco Catalyst 9500", resourceId: "AST-250430-002", ip: "192.168.1.12", severity: "Critical", userAgent: "Mozilla/5.0...", description: "Asset permanently deleted from inventory.", changes: [] },
  { id: "LOG-004", timestamp: "31 May 2025, 08:55 AM", user: "Budi Santoso", userRole: "Technician", userAvatar: "https://i.pravatar.cc/150?u=budi", action: "Moved", module: "Asset", resource: "HPE ProLiant DL380", resourceId: "AST-250415-001", ip: "192.168.1.18", severity: "Info", userAgent: "Mozilla/5.0...", description: "Asset location updated.", changes: [{field: "Location", from: "Server Room A", to: "Server Room C"}] },
  { id: "LOG-005", timestamp: "31 May 2025, 08:43 AM", user: "Siti Nurhaliza", userRole: "Operator", userAvatar: "https://i.pravatar.cc/150?u=siti", action: "Updated", module: "Room", resource: "Server Room A", resourceId: "RM-001", ip: "192.168.1.22", severity: "Info", userAgent: "Mozilla/5.0...", description: "Room capacity updated.", changes: [] },
  { id: "LOG-006", timestamp: "31 May 2025, 08:30 AM", user: "Fajar Pratama", userRole: "Viewer", userAvatar: "https://i.pravatar.cc/150?u=fajar", action: "Viewed", module: "Report", resource: "Asset Summary Report", resourceId: "RPT-20250531-001", ip: "192.168.1.25", severity: "Info", userAgent: "Mozilla/5.0...", description: "Report accessed.", changes: [] },
  { id: "LOG-007", timestamp: "31 May 2025, 08:21 AM", user: "Indah Permata", userRole: "Technician", userAvatar: "https://i.pravatar.cc/150?u=indah", action: "Created", module: "Warranty", resource: "Warranty: WAR-2025-0312", resourceId: "WAR-2025-0312", ip: "192.168.1.15", severity: "Info", userAgent: "Mozilla/5.0...", description: "New warranty added.", changes: [] },
  { id: "LOG-008", timestamp: "31 May 2025, 08:10 AM", user: "Yudi Setiawan", userRole: "Operator", userAvatar: "https://i.pravatar.cc/150?u=yudi", action: "Updated", module: "Vendor", resource: "Dell Technologies", resourceId: "VEN-001", ip: "192.168.1.20", severity: "Info", userAgent: "Mozilla/5.0...", description: "Vendor contact updated.", changes: [] },
  { id: "LOG-009", timestamp: "31 May 2025, 07:58 AM", user: "Agus Setiawan", userRole: "Super Admin", userAvatar: "https://i.pravatar.cc/150?u=agus", action: "Role Changed", module: "User", resource: "Rudi Hermawan", resourceId: "USR-0021", ip: "192.168.1.10", severity: "Warning", userAgent: "Mozilla/5.0...", description: "User role elevated.", changes: [{field: "Role", from: "Manager", to: "Admin"}] },
  { id: "LOG-010", timestamp: "31 May 2025, 07:45 AM", user: "System", userRole: "System", userAvatar: "https://i.pravatar.cc/150?u=system", action: "Login Failed", module: "Auth", resource: "Login Attempt", resourceId: "-", ip: "192.168.1.99", severity: "Critical", userAgent: "Unknown", description: "Multiple failed login attempts detected.", changes: [] },
];

export const mockMaintenanceTickets = [
  { id: "TKT-2025-101", assetId: "SRV-2026-001", assetName: "Dell PowerEdge R750", title: "Fan failure on node 2", description: "System reporting fan 2 failure. Requires immediate replacement to prevent overheating.", priority: "High", status: "Open", reportedBy: "Budi Santoso", assignedTo: "Hardware Team", date: "12 Jun 2025", type: "Repair" },
  { id: "TKT-2025-102", assetId: "UPS-2026-001", assetName: "APC Smart-UPS 3000", title: "Battery replacement", description: "Routine battery replacement scheduled. Batteries arrived on site.", priority: "Medium", status: "In Progress", reportedBy: "Agus Setiawan", assignedTo: "Power Team", date: "10 Jun 2025", type: "Preventative" },
  { id: "TKT-2025-103", assetId: "SW-2026-001", assetName: "Cisco Catalyst 9500", title: "Firmware upgrade required", description: "Vulnerability CVE-2025-1024 requires patching firmware to v9.3.5", priority: "High", status: "Open", reportedBy: "Security Team", assignedTo: "Network Team", date: "11 Jun 2025", type: "Update" },
  { id: "TKT-2025-104", assetId: "PAC-2026-001", assetName: "CRAC-01", title: "Coolant leak check", description: "Minor condensation observed near the valve. Needs inspection.", priority: "Low", status: "Closed", reportedBy: "Dewi Kartika", assignedTo: "Facilities", date: "05 Jun 2025", type: "Inspection" },
  { id: "TKT-2025-105", assetId: "STG-2026-001", assetName: "Dell PowerStore 1000T", title: "Drive 4 predictive failure", description: "SMART status shows predictive failure for Drive bay 4. Need hot-swap.", priority: "Medium", status: "In Progress", reportedBy: "System Monitor", assignedTo: "Storage Team", date: "09 Jun 2025", type: "Repair" },
];

export const mockPreventativeSchedules = [
  { id: "PM-2025-01", assetCategory: "Generators", taskName: "Bi-Annual Load Bank Testing", frequency: "6 Months", nextDueDate: "15 Jul 2025", assignedVendor: "PT. Trakindo Utama", status: "Scheduled" },
  { id: "PM-2025-02", assetCategory: "Cooling / CRAC", taskName: "Quarterly Filter & Valve Check", frequency: "3 Months", nextDueDate: "20 Jun 2025", assignedVendor: "PT. Stulz Air Technology", status: "Pending Approval" },
  { id: "PM-2025-03", assetCategory: "UPS Systems", taskName: "Annual Battery Impedance Test", frequency: "12 Months", nextDueDate: "01 Aug 2025", assignedVendor: "PT. Schneider Electric", status: "Scheduled" },
  { id: "PM-2025-04", assetCategory: "Fire Suppression", taskName: "FM-200 Cylinder Pressure Check", frequency: "6 Months", nextDueDate: "10 Jul 2025", assignedVendor: "Internal Facilities", status: "Scheduled" },
];
