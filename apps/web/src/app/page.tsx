"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { 
  Server, Cpu, Database, Activity, FileText, Shield, 
  ArrowRight, Network, CheckCircle2, ChevronRight,
  Plus, Terminal, AlertTriangle, Zap, Thermometer, ChevronDown,
  Search, Calendar, Clock, AlertCircle, Volume2, User, RefreshCw, X
} from "lucide-react"

// Mock data for interactive search lookup
const mockAssets = [
  { tag: "AST-SRV-001", hostname: "srv-db-01", type: "Database Host (2U)", location: "Rack Cabinet A1 - U3", status: "Active", power: "800W", ip: "10.120.45.2", sla: "24x7x4" },
  { tag: "AST-SRV-002", hostname: "srv-app-01", type: "Application Server (2U)", location: "Rack Cabinet A1 - U5", status: "Active", power: "500W", ip: "10.120.45.3", sla: "8x5 NBD" },
  { tag: "AST-NET-001", hostname: "core-sw-01", type: "Core Switch (1U)", location: "Rack Cabinet A1 - U1", status: "Active", power: "150W", ip: "10.120.45.1", sla: "24x7x4" },
  { tag: "AST-UPS-001", hostname: "ups-main-01", type: "Main UPS (3U)", location: "Rack Cabinet A1 - U7", status: "Maintenance", power: "3000W", ip: "10.120.45.10", sla: "24x7x4" },
  { tag: "AST-PAC-001", hostname: "pac-room1-01", type: "Precision Cooling (2U)", location: "Rack Cabinet A1 - U10", status: "Active", power: "5000W", ip: "10.120.45.11", sla: "24x7x4" },
  { tag: "AST-SRV-003", hostname: "srv-backup-01", type: "Backup Server (2U)", location: "Rack Cabinet A2 - U1", status: "Active", power: "400W", ip: "10.120.45.4", sla: "8x5 NBD" }
]

// Mock data for interactive maintenance schedules
const maintenanceSchedules = [
  { id: "m1", title: "Penggantian Baterai Rak UPS-01", time: "Besok, 02:00 - 05:00 WIB", type: "UPS / Power", status: "Scheduled", desc: "Downtime terencana pada sistem daya UPS cadangan untuk pemeliharaan baterai lithium sel.", contact: "Deni (Kelompok Daya)", affected: "Rack A1, A2, A3" },
  { id: "m2", title: "Migrasi Router Subnet 10.120.45.0/24", time: "Jumat, 23:00 WIB", type: "Network", status: "High Priority", desc: "Pembalik firmware switch core Cisco Nexus untuk menutup celah keamanan kritis.", contact: "Budi (Jaringan)", affected: "Seluruh Subnet A1" },
  { id: "m3", title: "Audit Suhu & Sensor Airflow Bulanan", time: "Senin, 09:00 - 12:00 WIB", type: "Environmental", status: "Routine", desc: "Pengecekan fisik dan kalibrasi sensor kelembapan serta sensor temperatur udara dingin (intake).", contact: "Agus Dwi R", affected: "Ruang Server 1" }
]

// Mock data for IT Announcements
const announcementsList = [
  { id: "a1", date: "28 Juni 2026", author: "IT Ops Lead", content: "PENTING: Seluruh operator diwajibkan menyelesaikan audit log fisik rak masing-masing paling lambat akhir minggu ini (Minggu pukul 23:59 WIB).", badge: "Penting" },
  { id: "a2", date: "26 Juni 2026", author: "SysAdmin", content: "Pemberitahuan: Format penamaan hostname server baru wajib mengikuti kebijakan penulisan baku: [tipe]-[fungsi]-[id] (contoh: srv-db-01).", badge: "Prosedur" },
  { id: "a3", date: "24 Juni 2026", author: "Security Team", content: "Pengingat Keamanan: Akses fisik ke Ruang Server 1 wajib menggunakan logging token ganda (kartu RFID + OTP Authenticator). Jangan membiarkan pintu terbuka.", badge: "Keamanan" }
]

// Mock data for interactive rack
const rackServers = [
  { id: "1", tag: "AST-NET-001", hostname: "core-sw-01", type: "Core Switch (1U)", power: "150W", sla: "24x7x4", status: "Active", bg: "bg-[#2D3748] border-t border-white/20" },
  { id: "2", tag: "AST-SRV-001", hostname: "srv-db-01", type: "Database Host (2U)", power: "800W", sla: "24x7x4", status: "Active", bg: "bg-accent/15 border-l-4 border-accent" },
  { id: "3", tag: "AST-SRV-002", hostname: "srv-app-01", type: "Application Server (2U)", power: "500W", sla: "8x5 NBD", status: "Active", bg: "bg-[#E2E8F0] shadow-neu-inset" },
  { id: "4", tag: "AST-UPS-001", hostname: "ups-main-01", type: "Main UPS (3U)", power: "3000W", sla: "24x7x4", status: "Maintenance", bg: "bg-amber-500/10 border-l-4 border-amber-500" },
  { id: "5", tag: "AST-PAC-001", hostname: "pac-room1-01", type: "Precision Cooling (2U)", power: "5000W", sla: "24x7x4", status: "Active", bg: "bg-emerald-500/10 border-l-4 border-emerald-500" }
]

// Mock FAQ data
const faqItems = [
  { q: "Bagaimana cara meminta akun akses?", a: "Akses ke platform Audira AssetHub dikelola oleh Administrator Sistem IT. Silakan hubungi Helpdesk Internal IT atau ajukan tiket permohonan akses melalui portal HR/SSO." },
  { q: "Mengapa aset saya tidak terdaftar di rak visual?", a: "Pastikan aset fisik telah ditautkan dengan koordinat rak yang valid (misalnya 'Floor' atau nama rak spesifik di area lokasi). Hubungi tim inventory data center jika data belum sinkron." },
  { q: "Apakah aktivitas perubahan data tercatat?", a: "Ya, setiap tindakan seperti pembuatan aset baru, perpindahan rak (movement log), audit internal, dan pembaruan lisensi terekam secara otomatis dalam sistem Audit Logs demi kepatuhan ISO 27001." }
]

export default function Home() {
  const [activeTab, setActiveTab] = useState<"rack" | "subnet" | "metrics">("rack")
  
  // Interactive states
  const [selectedServer, setSelectedServer] = useState<typeof rackServers[0] | null>(rackServers[1])
  const [allocatedIps, setAllocatedIps] = useState<string[]>(["10.120.45.1", "10.120.45.2", "10.120.45.3"])
  const [isAllocating, setIsAllocating] = useState(false)
  const [tempSlider, setTempSlider] = useState(42)
  const [logs, setLogs] = useState<string[]>([
    "System initialized. Core Switch online.",
    "Intake temperature stable at 22°C.",
    "No alerts reported in current shift."
  ])
  const [faqOpen, setFaqOpen] = useState<Record<number, boolean>>({})

  // New features states
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedMaint, setSelectedMaint] = useState<string | null>(null)
  const [readAnnouncements, setReadAnnouncements] = useState<Record<string, boolean>>({})

  // Search logic filtering
  const filteredAssets = searchQuery.trim() === "" 
    ? [] 
    : mockAssets.filter(asset => 
        asset.tag.toLowerCase().includes(searchQuery.toLowerCase()) ||
        asset.hostname.toLowerCase().includes(searchQuery.toLowerCase()) ||
        asset.ip.includes(searchQuery)
      )

  // Handle IP Allocation simulation
  const handleAllocateIp = () => {
    if (isAllocating) return
    setIsAllocating(true)
    setTimeout(() => {
      const nextIp = `10.120.45.${allocatedIps.length + 1}`
      setAllocatedIps(prev => [nextIp, ...prev])
      setIsAllocating(false)
    }, 1200)
  }

  // Handle live logs generation based on slider temp
  useEffect(() => {
    const timestamp = new Date().toLocaleTimeString()
    if (tempSlider > 75) {
      setLogs(prev => [
        `[${timestamp}] 🚨 CRITICAL: High temperature detected on AST-SRV-001 (${tempSlider}°C)`,
        `[${timestamp}] ⚠️ WARNING: Fan speed automatically set to 100% (Emergency Cooling)`,
        ...prev.slice(0, 4)
      ])
    } else if (tempSlider > 55) {
      setLogs(prev => [
        `[${timestamp}] ⚠️ WARNING: Server srv-db-01 running warm (${tempSlider}°C)`,
        `[${timestamp}] [INFO] Intake flow status: Satisfactory`,
        ...prev.slice(0, 4)
      ])
    } else {
      setLogs(prev => [
        `[${timestamp}] [INFO] System temperature normal (${tempSlider}°C)`,
        ...prev.slice(0, 4)
      ])
    }
  }, [tempSlider])

  // FAQ Accordion toggle
  const toggleFaq = (index: number) => {
    setFaqOpen(prev => ({
      ...prev,
      [index]: !prev[index]
    }))
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#E0E5EC] text-foreground font-sans relative overflow-x-hidden">
      <div className="flex-1">
      {/* Background Soft Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-accent/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-accent/5 blur-[120px] pointer-events-none" />

      {/* Navigation */}
      <nav className="relative z-50 max-w-[1400px] mx-auto px-8 py-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-background shadow-neu-extruded flex items-center justify-center border border-white/60">
            <Server className="w-5 h-5 text-accent animate-pulse" />
          </div>
          <span className="text-xl font-display font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/80">
            Audira <span className="text-accent">AssetHub</span>
          </span>
        </div>

        <div className="hidden md:flex items-center gap-8 text-sm font-bold text-muted-foreground">
          <a href="#about" className="hover:text-foreground transition-colors">Sistem Portal</a>
          <a href="#interactive-playground" className="hover:text-foreground transition-colors">Sandbox Demo</a>
          <a href="#faq" className="hover:text-foreground transition-colors">Bantuan Staf</a>
        </div>

        <div>
          <Link href="/dashboard" prefetch={false} className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-accent text-white shadow-neu-extruded hover:shadow-neu-hover active:shadow-neu-inset-small transition-all font-bold text-sm border-none">
            Masuk Portal Staff <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </nav>

      {/* Live System Health Status Banner */}
      <div className="relative z-40 max-w-[1400px] mx-auto px-8 mb-6">
        <div className="p-4 rounded-2xl bg-background/60 backdrop-blur-md shadow-neu-extruded border border-white/60 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground">
            <Volume2 className="w-4 h-4 text-accent animate-bounce" />
            <span className="uppercase tracking-wider">Status Infrastruktur:</span>
          </div>
          <div className="flex flex-wrap items-center gap-6 text-xs font-bold">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-foreground">API Gateway: <span className="text-emerald-600">Online</span></span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-foreground">Database: <span className="text-emerald-600">Connected</span></span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-foreground">SSO LDAP Sync: <span className="text-emerald-600">Active</span></span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-foreground">SLA Daemon: <span className="text-emerald-600">Monitoring</span></span>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative z-10 max-w-[1400px] mx-auto px-8 pt-6 pb-24 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-6 space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/40 backdrop-blur-md shadow-neu-inset border border-white/60 text-xs font-bold text-accent">
            <Shield className="w-3.5 h-3.5" /> Portal Jaringan DCIM Internal
          </div>

          <h1 className="text-5xl md:text-6xl font-display font-black tracking-tight leading-tight bg-clip-text text-transparent bg-gradient-to-br from-foreground via-foreground/90 to-foreground/70">
            Sistem Manajemen <br />
            <span className="text-accent bg-gradient-to-r from-accent to-[#8B84FF] bg-clip-text text-transparent">Aset Internal</span> Data Center
          </h1>

          <p className="text-lg text-muted-foreground font-semibold max-w-xl leading-relaxed">
            Selamat datang di Portal Manajemen Infrastruktur Jaringan & Perangkat Keras Audira Technologies. Harap masuk log menggunakan kredensial akun SSO/Karyawan Anda untuk mengakses dashboard manajemen.
          </p>

          {/* Quick Asset Lookup Bar */}
          <div className="relative space-y-2 max-w-md">
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block">Pencarian Cepat Aset ITAM/DCIM</label>
            <div className="relative flex items-center">
              <input 
                type="text" 
                placeholder="Cari tag, hostname, atau IP (misal: AST-SRV-001)..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-10 py-3 rounded-2xl bg-[#E0E5EC] shadow-neu-inset border border-white/40 text-sm focus:outline-none focus:shadow-neu-hover font-semibold placeholder:text-muted-foreground/60 text-foreground"
              />
              <Search className="absolute left-4 w-4 h-4 text-muted-foreground" />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery("")} 
                  className="absolute right-4 hover:text-red-500 text-muted-foreground transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Dropdown Results */}
            {searchQuery.trim() !== "" && (
              <div className="absolute left-0 right-0 mt-2 p-4 rounded-3xl bg-background shadow-neu-hover border border-white/60 z-50 space-y-3 max-h-60 overflow-y-auto">
                <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider pb-1 border-b border-[#A3B1C6]/20">Hasil Pencarian ({filteredAssets.length})</div>
                {filteredAssets.length > 0 ? (
                  filteredAssets.map((asset) => (
                    <div key={asset.tag} className="p-3 rounded-2xl bg-[#E0E5EC] shadow-neu-inset border border-white/40 text-xs space-y-1.5 font-semibold text-foreground">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-accent">{asset.tag}</span>
                        <span className={`px-1.5 py-0.5 rounded text-[9px] ${asset.status === 'Active' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'}`}>{asset.status}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-muted-foreground text-[10px]">
                        <div>Hostname: <span className="text-foreground">{asset.hostname}</span></div>
                        <div>IP Address: <span className="text-foreground">{asset.ip}</span></div>
                        <div>Lokasi: <span className="text-foreground">{asset.location}</span></div>
                        <div>SLA: <span className="text-accent">{asset.sla}</span></div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-xs text-muted-foreground text-center py-2">Tidak ada aset internal yang cocok.</div>
                )}
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Link href="/dashboard" prefetch={false} className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-accent text-white shadow-neu-extruded hover:shadow-neu-hover active:shadow-neu-inset-small transition-all font-bold text-base border-none">
              Log Masuk Staff <ChevronRight className="w-5 h-5" />
            </Link>
            <a href="#interactive-playground" className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-background text-foreground shadow-neu-extruded hover:shadow-neu-hover active:shadow-neu-inset-small transition-all font-bold text-base border border-white/60">
              Uji Coba Sandbox
            </a>
          </div>
        </div>

        {/* Visual Preview */}
        <div className="lg:col-span-6 relative">
          <div className="w-full rounded-[40px] bg-background shadow-neu-extruded border-8 border-white/60 p-6 flex flex-col justify-between overflow-hidden group">
            {/* Header Mockup */}
            <div className="flex items-center justify-between border-b border-[#A3B1C6]/30 pb-4">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-yellow-400" />
                <div className="w-3 h-3 rounded-full bg-green-400" />
              </div>
              <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                Internal Portal Status
              </div>
            </div>

            {/* Micro Dashboard Map Mockup */}
            <div className="my-6 space-y-4">
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3.5 rounded-2xl bg-[#E0E5EC] shadow-neu-inset border border-white/40 text-center">
                  <span className="text-[10px] font-bold text-muted-foreground block">Racks Uptime</span>
                  <span className="text-sm font-black text-emerald-500">99.998%</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-[#E0E5EC] shadow-neu-inset border border-white/40 text-center">
                  <span className="text-[10px] font-bold text-muted-foreground block">Active Tickets</span>
                  <span className="text-sm font-black text-red-500">2 Critical</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-[#E0E5EC] shadow-neu-inset border border-white/40 text-center">
                  <span className="text-[10px] font-bold text-muted-foreground block">Temp Margin</span>
                  <span className="text-sm font-black text-accent">Optimal</span>
                </div>
              </div>

              {/* DC Grid Visual */}
              <div className="p-4 rounded-3xl bg-[#E0E5EC] shadow-neu-inset border border-white/40">
                <span className="text-[10px] font-bold text-muted-foreground block mb-2">DC Floor Grid Layout Preview</span>
                <div className="grid grid-cols-5 gap-2">
                  {Array.from({ length: 15 }).map((_, i) => (
                    <div key={i} className={`h-8 rounded-lg flex items-center justify-center text-[10px] font-bold shadow-neu-extruded border ${i === 3 || i === 7 ? 'bg-accent text-white border-none' : i === 12 ? 'bg-amber-500 text-white border-none' : 'bg-background border-white/60 text-muted-foreground'}`}>
                      {i === 3 || i === 7 ? 'RK' : i === 12 ? 'UPS' : ''}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive DCIM Playground Section */}
      <section id="interactive-playground" className="max-w-[1400px] mx-auto px-8 py-20 space-y-10 relative z-10">
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-display font-black text-foreground">
            Sandbox Operasional Jaringan
          </h2>
          <p className="text-sm font-bold text-muted-foreground">
            Simulasi operasional internal data center. Klik tab di bawah untuk berinteraksi langsung dengan simulasi visualisasi rak dan pemetaan IP Address.
          </p>

          {/* Playground Tabs */}
          <div className="inline-flex bg-background shadow-neu-inset p-1.5 rounded-2xl gap-2 mt-4">
            <button 
              onClick={() => setActiveTab("rack")} 
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${activeTab === "rack" ? 'bg-background shadow-neu-extruded text-accent' : 'text-muted-foreground hover:text-foreground'}`}
            >
              <Server size={14} /> Live Rack Cabinet
            </button>
            <button 
              onClick={() => setActiveTab("subnet")} 
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${activeTab === "subnet" ? 'bg-background shadow-neu-extruded text-accent' : 'text-muted-foreground hover:text-foreground'}`}
            >
              <Network size={14} /> Subnet IPAM Map
            </button>
            <button 
              onClick={() => setActiveTab("metrics")} 
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${activeTab === "metrics" ? 'bg-background shadow-neu-extruded text-accent' : 'text-muted-foreground hover:text-foreground'}`}
            >
              <Activity size={14} /> SLA Live Monitor
            </button>
          </div>
        </div>

        {/* Dynamic Sandbox Display */}
        <div className="w-full bg-[#E0E5EC] shadow-neu-extruded border border-white/60 rounded-[40px] p-8 min-h-[450px] flex items-center justify-center">
          {/* TAB 1: RACK CABINET VISUALIZER */}
          {activeTab === "rack" && (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 w-full items-center">
              {/* Cabinet Rack Mockup */}
              <div className="md:col-span-5 flex flex-col justify-center items-center">
                <div className="w-full max-w-[280px] bg-background border-[6px] border-[#A3B1C6]/50 rounded-[32px] p-3 shadow-neu-inset space-y-2">
                  <div className="text-[10px] text-center font-bold text-muted-foreground tracking-wider pb-2 border-b border-[#A3B1C6]/20">RACK CABINET A1 (42U)</div>
                  
                  {rackServers.map((server) => (
                    <div 
                      key={server.id} 
                      onClick={() => setSelectedServer(server)}
                      className={`p-3 rounded-xl cursor-pointer text-center text-xs font-bold transition-all ${selectedServer?.id === server.id ? 'bg-accent text-white shadow-neu-extruded border-none scale-[1.03]' : 'bg-[#E0E5EC] text-foreground hover:bg-[#E0E5EC]/80 border border-white/60 shadow-neu-small'}`}
                    >
                      <div className="flex justify-between items-center text-[10px]">
                        <span>{server.tag}</span>
                        <span className={`px-1 rounded ${selectedServer?.id === server.id ? 'bg-white/20 text-white' : 'bg-background text-muted-foreground'}`}>{server.hostname}</span>
                      </div>
                      <div className="text-left mt-1 text-[11px] font-semibold">{server.type}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Server Info Display */}
              <div className="md:col-span-7 space-y-6">
                <div className="p-6 rounded-[32px] bg-background shadow-neu-extruded border border-white/60 space-y-4">
                  <div className="flex justify-between items-center pb-3 border-b border-[#A3B1C6]/30">
                    <h3 className="text-xl font-bold text-foreground">Hardware Inspector</h3>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${selectedServer?.status === 'Active' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'}`}>
                      {selectedServer?.status}
                    </span>
                  </div>

                  {selectedServer ? (
                    <div className="grid grid-cols-2 gap-4 text-sm font-semibold">
                      <div>
                        <span className="text-xs text-muted-foreground block">Asset Tag</span>
                        <span className="text-foreground font-bold">{selectedServer.tag}</span>
                      </div>
                      <div>
                        <span className="text-xs text-muted-foreground block">Device Hostname</span>
                        <span className="text-foreground font-bold">{selectedServer.hostname}</span>
                      </div>
                      <div>
                        <span className="text-xs text-muted-foreground block">Form Factor Size</span>
                        <span className="text-foreground font-bold">{selectedServer.type}</span>
                      </div>
                      <div>
                        <span className="text-xs text-muted-foreground block">SLA Support Profile</span>
                        <span className="text-accent font-bold">{selectedServer.sla}</span>
                      </div>
                      <div className="col-span-2">
                        <span className="text-xs text-muted-foreground block">Power Consumption Rate</span>
                        <div className="flex items-center gap-2 mt-1">
                          <Zap className="w-4 h-4 text-amber-500" />
                          <span className="text-foreground font-bold">{selectedServer.power}</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">Silakan klik server di kabinet rak untuk melihat rincian.</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: SUBNET IPAM MAP */}
          {activeTab === "subnet" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full items-center">
              {/* Network Topology Visualizer */}
              <div className="p-6 rounded-[32px] bg-background shadow-neu-extruded border border-white/60 space-y-4">
                <h3 className="text-lg font-bold text-foreground">Interactive Core Network</h3>
                
                <div className="relative border border-[#A3B1C6]/30 rounded-2xl p-6 bg-[#E0E5EC] shadow-neu-inset flex flex-col items-center gap-6">
                  {/* Core Switch Node */}
                  <div className="w-36 py-2 bg-accent text-white rounded-xl shadow-neu-extruded text-center text-xs font-bold flex items-center justify-center gap-1.5">
                    <Network size={14} className={isAllocating ? 'animate-bounce' : ''} /> core-switch-01
                  </div>

                  {/* Visual Connection Lines */}
                  <div className="flex justify-between w-full px-4 gap-2">
                    <div className="flex-1 border-t-2 border-dashed border-[#A3B1C6] h-1" />
                    <div className="flex-1 border-t-2 border-dashed border-[#A3B1C6] h-1" />
                  </div>

                  {/* Target Nodes */}
                  <div className="grid grid-cols-3 gap-2 w-full">
                    <div className="p-2 bg-background rounded-lg border border-white/60 shadow-neu-small text-center text-[10px] font-bold">
                      srv-db-01
                    </div>
                    <div className="p-2 bg-background rounded-lg border border-white/60 shadow-neu-small text-center text-[10px] font-bold">
                      srv-app-01
                    </div>
                    <div className="p-2 bg-background rounded-lg border border-white/60 shadow-neu-small text-center text-[10px] font-bold">
                      srv-app-02
                    </div>
                  </div>
                </div>

                <div className="pt-2 text-center">
                  <button 
                    onClick={handleAllocateIp}
                    disabled={isAllocating}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-accent text-white shadow-neu-extruded hover:shadow-neu-hover active:shadow-neu-inset-small transition-all font-bold text-xs border-none"
                  >
                    {isAllocating ? 'Allocating...' : 'Simulate IP Allocation'} <Plus size={14} />
                  </button>
                </div>
              </div>

              {/* Dynamic IP Address Allocations List */}
              <div className="p-6 rounded-[32px] bg-background shadow-neu-extruded border border-white/60 space-y-4">
                <h3 className="text-lg font-bold text-foreground">Active IPAM Subnet (10.120.45.0/24)</h3>
                
                <div className="h-64 overflow-y-auto pr-2 space-y-2">
                  {allocatedIps.map((ip, index) => (
                    <div key={index} className="flex justify-between items-center p-3 rounded-xl bg-[#E0E5EC] shadow-neu-inset border border-white/40 animate-in fade-in slide-in-from-top-3 duration-300">
                      <span className="font-mono text-xs font-bold text-foreground">{ip}</span>
                      <span className="text-[10px] font-bold text-emerald-500 flex items-center gap-1">
                        <CheckCircle2 size={12} /> Assigned (DHCP Reservation)
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: SLA LIVE MONITOR */}
          {activeTab === "metrics" && (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 w-full items-center">
              {/* Slider Controller */}
              <div className="md:col-span-5 space-y-6">
                <div className="p-6 rounded-[32px] bg-background shadow-neu-extruded border border-white/60 space-y-6">
                  <div>
                    <h3 className="text-lg font-bold text-foreground">Environmental Controls</h3>
                    <p className="text-[11px] text-muted-foreground">Sesuaikan suhu kabinet di bawah untuk melihat respons otomatis sensor logs.</p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between text-sm font-bold">
                      <span className="flex items-center gap-1 text-foreground"><Thermometer className="w-4 h-4 text-accent" /> Sensor A1 Temp</span>
                      <span className={`font-mono ${tempSlider > 75 ? 'text-red-500' : tempSlider > 55 ? 'text-amber-500' : 'text-emerald-500'}`}>{tempSlider}°C</span>
                    </div>
                    
                    <input 
                      type="range" 
                      min="15" 
                      max="95" 
                      value={tempSlider} 
                      onChange={(e) => setTempSlider(parseInt(e.target.value))}
                      className="w-full h-2 bg-[#E0E5EC] rounded-lg appearance-none cursor-pointer shadow-neu-inset focus:outline-none" 
                    />
                  </div>
                </div>
              </div>

              {/* Live Simulated Console Logs */}
              <div className="md:col-span-7 space-y-4">
                <div className="p-6 rounded-[32px] bg-background shadow-neu-extruded border border-white/60 space-y-3">
                  <div className="flex items-center gap-2 pb-2 border-b border-[#A3B1C6]/30 text-foreground font-bold">
                    <Terminal className="w-5 h-5 text-accent" />
                    <span>Real-time Event Logs</span>
                  </div>

                  <div className="bg-[#2D3748] rounded-2xl p-4 h-48 font-mono text-[11px] text-emerald-400 overflow-y-auto space-y-2.5">
                    {logs.map((log, index) => (
                      <div key={index} className={log.includes("🚨 CRITICAL") ? 'text-red-400 font-bold' : log.includes("⚠️ WARNING") ? 'text-amber-300' : ''}>
                        {log}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* IT Operations Dashboard & Announcements Section */}
      <section className="max-w-[1400px] mx-auto px-8 py-16 grid grid-cols-1 lg:grid-cols-12 gap-12 relative z-10">
        
        {/* Left Column: Maintenance Schedules Timeline */}
        <div className="lg:col-span-6 space-y-8">
          <div className="space-y-2">
            <h2 className="text-2xl md:text-3xl font-display font-black text-foreground flex items-center gap-2">
              <Calendar className="w-6 h-6 text-accent" /> Jadwal Pemeliharaan IT
            </h2>
            <p className="text-xs font-bold text-muted-foreground">
              Rencana pengerjaan dan downtime terjadwal infrastruktur jaringan & daya data center.
            </p>
          </div>

          <div className="space-y-4">
            {maintenanceSchedules.map((maint) => (
              <div 
                key={maint.id}
                onClick={() => setSelectedMaint(selectedMaint === maint.id ? null : maint.id)}
                className={`p-5 rounded-[28px] bg-[#E0E5EC] shadow-neu-extruded border border-white/60 cursor-pointer transition-all duration-300 ${selectedMaint === maint.id ? 'shadow-neu-inset bg-background/20' : 'hover:shadow-neu-hover'}`}
              >
                <div className="flex justify-between items-start gap-4">
                  <div className="space-y-1">
                    <span className="inline-block px-2.5 py-0.5 rounded-full text-[9px] font-bold bg-accent/10 text-accent uppercase tracking-wider">
                      {maint.type}
                    </span>
                    <h3 className="text-sm font-black text-foreground">{maint.title}</h3>
                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground">
                      <Clock size={12} /> {maint.time}
                    </div>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${maint.status === 'High Priority' ? 'bg-red-500/10 text-red-500' : 'bg-blue-500/10 text-blue-500'}`}>
                    {maint.status}
                  </span>
                </div>

                {selectedMaint === maint.id && (
                  <div className="mt-4 pt-4 border-t border-[#A3B1C6]/30 text-xs font-semibold text-muted-foreground space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
                    <p className="leading-relaxed text-foreground">{maint.desc}</p>
                    <div className="grid grid-cols-2 gap-2 text-[10px] bg-background/40 p-2.5 rounded-xl border border-white/40">
                      <div>PIC Teknis: <span className="text-foreground">{maint.contact}</span></div>
                      <div>Area Terdampak: <span className="text-accent">{maint.affected}</span></div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: IT Announcements Bulletin Board */}
        <div className="lg:col-span-6 space-y-8">
          <div className="space-y-2">
            <h2 className="text-2xl md:text-3xl font-display font-black text-foreground flex items-center gap-2">
              <Volume2 className="w-6 h-6 text-accent" /> Buletin Pengumuman IT
            </h2>
            <p className="text-xs font-bold text-muted-foreground">
              Informasi regulasi, instruksi operasional, dan pengumuman keamanan data center internal.
            </p>
          </div>

          <div className="space-y-4">
            {announcementsList.map((ann) => (
              <div 
                key={ann.id}
                onClick={() => setReadAnnouncements(prev => ({ ...prev, [ann.id]: true }))}
                className="p-5 rounded-[28px] bg-[#E0E5EC] shadow-neu-extruded border border-white/60 relative group hover:shadow-neu-hover transition-all duration-300 cursor-pointer"
              >
                {/* Unread dot indicator */}
                {!readAnnouncements[ann.id] && (
                  <span className="absolute top-4 right-4 w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                )}
                
                <div className="flex justify-between items-center pb-2 border-b border-[#A3B1C6]/20 mb-3 text-[10px] font-bold text-muted-foreground">
                  <span className="flex items-center gap-1"><User size={12} /> {ann.author}</span>
                  <span>{ann.date}</span>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${ann.badge === 'Penting' ? 'bg-red-500/10 text-red-500' : ann.badge === 'Prosedur' ? 'bg-blue-500/10 text-blue-500' : 'bg-amber-500/10 text-amber-500'}`}>
                      {ann.badge}
                    </span>
                  </div>
                  <p className="text-xs font-semibold leading-relaxed text-foreground">{ann.content}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="bg-background py-16 relative z-10">
        <div className="max-w-[1400px] mx-auto px-8 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-3xl font-display font-black text-foreground">Ketentuan Kebijakan Portal</h2>
            <p className="text-sm font-semibold text-muted-foreground leading-relaxed">
              Audira AssetHub adalah portal tertutup milik internal perusahaan. Penggunaan platform tunduk pada kebijakan privasi data internal perusahaan dan standar sertifikasi keamanan ISO 27001.
            </p>
            <div className="space-y-3 font-bold text-xs text-foreground">
              <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-accent" /> Otentikasi Terintegrasi SSO Staf</div>
              <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-accent" /> Enkripsi Jaringan & Audit Log Aktivitas</div>
              <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-accent" /> Proteksi Kepatuhan SLA Perangkat Keras</div>
            </div>
          </div>
          <div className="p-8 rounded-[32px] bg-[#E0E5EC] shadow-neu-extruded border border-white/60 space-y-4">
            <h3 className="text-lg font-bold text-foreground">System Specifications</h3>
            <div className="border border-[#A3B1C6]/30 rounded-2xl p-4 bg-[#E0E5EC] shadow-neu-inset space-y-2 font-mono text-xs text-muted-foreground">
              <div>HOST: portal-assethub.internal.net</div>
              <div>AUTH: Active Directory (LDAP) Enabled</div>
              <div>ENCRYPTION: TLS 1.3 Active</div>
              <div>ROLES: Admin, Operator, FinOps, Staff</div>
            </div>
          </div>
        </div>
      </section>

      {/* Collapsible FAQ Section */}
      <section id="faq" className="max-w-[1000px] mx-auto px-8 py-16 space-y-12 relative z-10">
        <div className="text-center space-y-3">
          <h2 className="text-3xl font-display font-black text-foreground">Pusat Bantuan & Panduan Staf</h2>
          <p className="text-sm font-bold text-muted-foreground">Pertanyaan umum seputar administrasi logistik perangkat data center.</p>
        </div>

        <div className="space-y-6">
          {faqItems.map((faq, index) => (
            <div key={index} className="rounded-3xl bg-[#E0E5EC] shadow-neu-extruded border border-white/60 overflow-hidden transition-all duration-300">
              <button 
                onClick={() => toggleFaq(index)}
                className="w-full px-8 py-5 flex justify-between items-center text-left font-bold text-foreground hover:text-accent transition-colors"
              >
                <span>{faq.q}</span>
                <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${faqOpen[index] ? 'rotate-180 text-accent' : 'text-muted-foreground'}`} />
              </button>

              <div className={`transition-all duration-300 ease-in-out ${faqOpen[index] ? 'max-h-48 border-t border-[#A3B1C6]/30' : 'max-h-0'}`}>
                <div className="p-8 text-sm text-muted-foreground font-semibold leading-relaxed bg-[#E0E5EC]">
                  {faq.a}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      </div>

      {/* Footer */}
      <footer className="border-t border-[#A3B1C6]/30 bg-background/50 backdrop-blur-md relative z-10 py-6 mt-auto">
        <div className="max-w-[1400px] mx-auto px-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-background shadow-neu-extruded flex items-center justify-center border border-white/60">
              <Server className="w-4 h-4 text-accent" />
            </div>
            <span className="text-sm font-display font-black tracking-tight text-foreground">
              Audira <span className="text-accent">AssetHub</span>
            </span>
          </div>

          <div className="text-xs font-bold text-muted-foreground">
            Licensed by Agus Dwi R (AUDIRA) &bull; &copy; {new Date().getFullYear()} Audira Technologies. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}
