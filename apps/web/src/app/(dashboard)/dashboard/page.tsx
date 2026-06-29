"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Package, Activity, ShieldAlert, MapPin, Calendar, ArrowRightLeft, Server, HardDrive, Database, ScanLine, MoreVertical, Download, WifiOff, Clock, AlertTriangle, User } from "lucide-react"
import { apiClient } from "@/lib/api-client"
import { HeroSection } from "@/components/ui/hero-section"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from "recharts"

export default function DashboardPage() {
  const [isMounted, setIsMounted] = useState(false)
  const [apiSummary, setApiSummary] = useState<any>(null)
  const [isOffline, setIsOffline] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Mock data for new widgets
  const criticalAlerts = [
    { id: "ca1", device: "srv-db-01 (AST-SRV-001)", type: "Temperature", message: "Intake temperature is abnormally high (78°C). Fan speed failed to scale automatically.", severity: "Critical", time: "5 mins ago" },
    { id: "ca2", device: "ups-main-01 (AST-UPS-001)", type: "Battery", message: "UPS battery bank cell #12 reports voltage variance outside normal limits.", severity: "Warning", time: "18 mins ago" }
  ]

  const expiringSlas = [
    { id: "es1", tag: "AST-NET-001", hostname: "core-sw-01", type: "Core Switch", provider: "Cisco SmartNet 24x7x4", daysLeft: 12 },
    { id: "es2", tag: "AST-SRV-002", hostname: "srv-app-01", type: "App Server", provider: "Dell ProSupport Plus NBD", daysLeft: 25 },
    { id: "es3", tag: "AST-PAC-001", hostname: "pac-room1-01", type: "Precision Cooling", provider: "Vertiv Premium Care SLA", daysLeft: 29 }
  ]

  const auditLogs = [
    { id: "al1", user: "Agus Dwi R", action: "Changed Status", target: "AST-UPS-001", detail: "Active -> Maintenance", time: "10 mins ago" },
    { id: "al2", user: "Deni", action: "Moved Asset", target: "AST-SRV-003", detail: "Warehouse -> Rack A2 - U1", time: "45 mins ago" },
    { id: "al3", user: "Budi", action: "Updated Subnet", target: "10.120.45.0/24", detail: "Assigned srv-app-02 IP reservation", time: "2 hours ago" }
  ]

  useEffect(() => {
    setIsMounted(true)
    
    const fetchSummary = async () => {
      try {
        setIsLoading(true);
        const res = await apiClient.get('/dashboard/summary')
        setApiSummary(res.data)
        setIsOffline(false)
      } catch (err) {
        console.error("Failed to fetch dashboard summary", err)
        setIsOffline(true)
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchSummary()
  }, [])

  if (!isMounted) return null;

  if (isLoading) {
    return (
      <div className="flex w-full h-full items-center justify-center">
        <p className="text-xl font-bold text-muted-foreground animate-pulse">Loading Dashboard...</p>
      </div>
    )
  }

  if (isOffline || !apiSummary) {
    return (
      <div className="flex w-full h-full items-center justify-center flex-col gap-4">
        <WifiOff className="w-12 h-12 text-muted-foreground" />
        <p className="text-xl font-bold text-muted-foreground">Unable to connect to API.</p>
      </div>
    )
  }

  // Formatting Data from API
  const vendorColors = ['#6C63FF', '#38B2AC', '#F59E0B', '#8B84FF', '#A3B1C6'];
  const processedVendors = apiSummary.vendorData.slice(0, 5).map((v: any, i: number) => ({
    ...v, 
    color: vendorColors[i % vendorColors.length],
    percentage: apiSummary.totalAssets > 0 ? ((v.value / apiSummary.totalAssets) * 100).toFixed(1) + '%' : '0%'
  }));

  const statusColors: Record<string, string> = { "Active": "#38B2AC", "Maintenance": "#F59E0B", "Spare/Stock": "#6C63FF", "Decommissioned": "#EF4444" };
  const processedStatus = apiSummary.statusData.map((s: any) => ({
    ...s,
    color: statusColors[s.name] || '#A3B1C6',
    percentage: apiSummary.totalAssets > 0 ? ((s.value / apiSummary.totalAssets) * 100).toFixed(1) + '%' : '0%'
  }));

  const ageColors = ['#38B2AC', '#6C63FF', '#F59E0B', '#EF4444'];
  const processedAge = apiSummary.ageData.map((a: any, i: number) => ({
    ...a,
    color: ageColors[i % ageColors.length],
    percentage: apiSummary.totalAssets > 0 ? ((a.value / apiSummary.totalAssets) * 100).toFixed(1) + '%' : '0%'
  }));

  const displayHistoryData = apiSummary.historyData;
  const displayAgeData = processedAge;
  const olderThan5 = apiSummary.olderThan5;

  const quickActions = [
    { icon: <ScanLine className="w-5 h-5 text-accent" />, label: "Scan QR/Barcode", color: "bg-accent/10" },
    { icon: <Package className="w-5 h-5 text-[#38B2AC]" />, label: "Add New Asset", color: "bg-[#38B2AC]/10" },
    { icon: <ArrowRightLeft className="w-5 h-5 text-[#F59E0B]" />, label: "Move Asset", color: "bg-[#F59E0B]/10" },
    { icon: <ShieldAlert className="w-5 h-5 text-[#EF4444]" />, label: "Report Issue", color: "bg-[#EF4444]/10" },
  ]

  return (
    <div className="flex w-full gap-6 pb-6 h-full">
      <div className="flex-1 flex flex-col min-w-0 transition-all duration-300 pr-6 pl-6">
        
        <HeroSection
          title="Overview Dashboard"
          description="A high-level summary of your global IT infrastructure and operations."
          imageSrc="/images/heroes/dashboard.png"
        >
          <div className="flex gap-4 flex-wrap">
            <Button variant="ghost" className="bg-background/50 backdrop-blur-md shadow-neu-extruded text-foreground hover:text-accent hover:shadow-neu-hover active:shadow-neu-inset-small rounded-2xl flex items-center gap-2 h-12 px-6 transition-all font-bold whitespace-nowrap">
              <Download size={18} /> Export PDF
            </Button>
          </div>
        </HeroSection>

        {/* Top KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8 mt-2">
          {/* Total Assets */}
          <Card className="rounded-[32px] border-neu shadow-neu-extruded bg-background overflow-hidden relative group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Package className="w-16 h-16 text-accent" />
            </div>
            <CardContent className="p-6 relative z-10 flex flex-col h-full">
              <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center mb-4 text-accent shadow-neu-inset">
                <Package className="w-6 h-6" />
              </div>
              <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-1">Total Assets</p>
              <div className="flex items-end gap-3 mt-auto">
                <h3 className="text-4xl font-black text-foreground tracking-tight">{apiSummary.totalAssets}</h3>
              </div>
            </CardContent>
          </Card>

          {/* Active Assets */}
          <Card className="rounded-[32px] border-neu shadow-neu-extruded bg-background overflow-hidden relative group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Activity className="w-16 h-16 text-[#38B2AC]" />
            </div>
            <CardContent className="p-6 relative z-10 flex flex-col h-full">
              <div className="w-12 h-12 rounded-2xl bg-[#38B2AC]/10 flex items-center justify-center mb-4 text-[#38B2AC] shadow-neu-inset">
                <Activity className="w-6 h-6" />
              </div>
              <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-1">Active / Operational</p>
              <div className="flex items-end gap-3 mt-auto">
                <h3 className="text-4xl font-black text-foreground tracking-tight">{apiSummary.activeAssets}</h3>
                <span className="text-sm font-bold text-[#38B2AC] bg-[#38B2AC]/10 px-2 py-1 rounded-lg mb-1">{apiSummary.activePercent}%</span>
              </div>
            </CardContent>
          </Card>

          {/* Locations */}
          <Card className="rounded-[32px] border-neu shadow-neu-extruded bg-background overflow-hidden relative group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <MapPin className="w-16 h-16 text-[#6C63FF]" />
            </div>
            <CardContent className="p-6 relative z-10 flex flex-col h-full">
              <div className="w-12 h-12 rounded-2xl bg-[#6C63FF]/10 flex items-center justify-center mb-4 text-[#6C63FF] shadow-neu-inset">
                <MapPin className="w-6 h-6" />
              </div>
              <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-1">Locations</p>
              <div className="flex items-end gap-3 mt-auto">
                <h3 className="text-4xl font-black text-foreground tracking-tight">{apiSummary.locations}</h3>
              </div>
            </CardContent>
          </Card>

          {/* Vendors */}
          <Card className="rounded-[32px] border-neu shadow-neu-extruded bg-background overflow-hidden relative group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <ShieldAlert className="w-16 h-16 text-[#EF4444]" />
            </div>
            <CardContent className="p-6 relative z-10 flex flex-col h-full">
              <div className="w-12 h-12 rounded-2xl bg-[#EF4444]/10 flex items-center justify-center mb-4 text-[#EF4444] shadow-neu-inset">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-1">Vendors</p>
              <div className="flex items-end gap-3 mt-auto">
                <h3 className="text-4xl font-black text-foreground tracking-tight">{apiSummary.vendors}</h3>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions & Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          
          <div className="lg:col-span-2 space-y-8">
            {/* Historical Trend Chart */}
            <Card className="rounded-[32px] border-neu shadow-neu-extruded bg-background">
              <CardHeader className="pb-2 flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-lg font-bold text-foreground">Asset Growth Trend</CardTitle>
                  <CardDescription className="text-xs font-bold text-muted-foreground">Total vs Active assets over last 6 months</CardDescription>
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="h-[280px] w-full min-h-[280px]">
                  <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                    <AreaChart data={displayHistoryData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#A3B1C6" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#A3B1C6" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="colorActive" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#38B2AC" stopOpacity={0.5}/>
                          <stop offset="95%" stopColor="#38B2AC" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#A3B1C6" opacity={0.2} />
                      <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fontSize: 12, fontWeight: 700, fill: '#A3B1C6'}} dy={10} />
                      <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fontWeight: 700, fill: '#A3B1C6'}} />
                      <Tooltip 
                        contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '8px 8px 16px rgba(163,177,198,0.4), -8px -8px 16px rgba(255,255,255,0.8)', backgroundColor: 'var(--background)' }}
                        itemStyle={{ fontWeight: 700 }}
                        labelStyle={{ fontWeight: 800, color: 'var(--foreground)', marginBottom: '8px' }}
                      />
                      <Area type="monotone" dataKey="total" name="Total Assets" stroke="#A3B1C6" strokeWidth={3} fillOpacity={1} fill="url(#colorTotal)" />
                      <Area type="monotone" dataKey="active" name="Active Assets" stroke="#38B2AC" strokeWidth={3} fillOpacity={1} fill="url(#colorActive)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Asset Distribution by Location (Bar Chart) */}
            <Card className="rounded-[32px] border-neu shadow-neu-extruded bg-background">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-bold text-foreground">Assets by Category</CardTitle>
                <CardDescription className="text-xs font-bold text-muted-foreground">Top categories</CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="h-[250px] w-full min-h-[250px]">
                  <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                    <BarChart data={apiSummary.catData.slice(0, 6)} margin={{ top: 10, right: 10, left: -20, bottom: 20 }} barSize={32}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#A3B1C6" opacity={0.2} />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 700, fill: '#A3B1C6'}} dy={10} angle={-15} textAnchor="end" />
                      <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fontWeight: 700, fill: '#A3B1C6'}} />
                      <Tooltip 
                        cursor={{fill: 'rgba(163,177,198,0.1)'}}
                        contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '8px 8px 16px rgba(163,177,198,0.4), -8px -8px 16px rgba(255,255,255,0.8)', backgroundColor: 'var(--background)' }}
                        itemStyle={{ fontWeight: 700, color: '#6C63FF' }}
                      />
                      <Bar dataKey="value" name="Assets" fill="#6C63FF" radius={[6, 6, 6, 6]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-8">
            {/* Quick Actions */}
            <Card className="rounded-[32px] border-neu shadow-neu-inset bg-background">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-bold text-foreground">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  {quickActions.map((action, i) => (
                    <Button key={i} variant="ghost" className="h-24 flex flex-col items-center justify-center gap-3 rounded-2xl bg-background shadow-neu-extruded hover:shadow-neu-hover active:shadow-neu-inset-small transition-all border border-white/50">
                      <div className={`w-10 h-10 rounded-xl ${action.color} flex items-center justify-center shadow-neu-inset-small`}>
                        {action.icon}
                      </div>
                      <span className="text-xs font-bold text-foreground whitespace-normal text-center leading-tight">{action.label}</span>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Status Breakdown (Pie) */}
            <Card className="rounded-[32px] border-neu shadow-neu-extruded bg-background">
              <CardHeader className="pb-0">
                <CardTitle className="text-lg font-bold text-foreground">Asset Status</CardTitle>
              </CardHeader>
              <CardContent className="pt-2">
                <div className="h-[200px] w-full flex items-center justify-center relative">
                  <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                    <PieChart>
                      <Pie
                        data={processedStatus}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                        stroke="none"
                      >
                        {processedStatus.map((entry: any, index: number) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '8px 8px 16px rgba(163,177,198,0.4), -8px -8px 16px rgba(255,255,255,0.8)', backgroundColor: 'var(--background)' }}
                        itemStyle={{ fontWeight: 700 }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  {/* Center Label */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-2xl font-black text-foreground">{apiSummary.totalAssets}</span>
                    <span className="text-[10px] font-bold text-muted-foreground uppercase">Total</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-x-4 gap-y-3 mt-2">
                  {processedStatus.map((s: any, i: number) => (
                    <div key={i} className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full shadow-neu-inset-small shrink-0" style={{ backgroundColor: s.color }}></div>
                      <div className="min-w-0">
                        <p className="text-[11px] font-bold text-foreground truncate">{s.name}</p>
                        <p className="text-[10px] font-bold text-muted-foreground">{s.percentage} ({s.value})</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

          </div>
        </div>

        {/* Operations & System Logs Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Column 1: Critical Alerts Feed */}
          <Card className="rounded-[32px] border-neu shadow-neu-extruded bg-background">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-bold text-foreground flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-500 animate-pulse" /> Critical Alerts
              </CardTitle>
              <CardDescription className="text-xs font-bold text-muted-foreground">
                Active hardware & cooling anomalies
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-4">
              {criticalAlerts.map((alert) => (
                <div key={alert.id} className="p-4 rounded-2xl bg-[#E0E5EC] shadow-neu-inset border border-white/40 text-xs space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-foreground truncate max-w-[150px]">{alert.device}</span>
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-red-500/10 text-red-500 uppercase tracking-wider">{alert.severity}</span>
                  </div>
                  <p className="text-muted-foreground font-semibold leading-relaxed">{alert.message}</p>
                  <div className="flex justify-between items-center pt-1 border-t border-[#A3B1C6]/20">
                    <span className="text-[10px] text-muted-foreground flex items-center gap-1"><Clock size={10} /> {alert.time}</span>
                    <Button size="xs" variant="ghost" className="h-7 px-3 rounded-lg bg-accent text-white shadow-neu-extruded hover:shadow-neu-hover active:shadow-neu-inset-small text-[10px] font-bold border-none cursor-pointer">
                      Create Ticket
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Column 2: SLA & Warranty Expirations */}
          <Card className="rounded-[32px] border-neu shadow-neu-extruded bg-background">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-bold text-foreground flex items-center gap-2">
                <Calendar className="w-5 h-5 text-accent" /> SLA & Warranties
              </CardTitle>
              <CardDescription className="text-xs font-bold text-muted-foreground">
                Support contracts ending within 30 days
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 pt-4">
              {expiringSlas.map((sla) => (
                <div key={sla.id} className="p-3.5 rounded-2xl bg-[#E0E5EC] shadow-neu-inset border border-white/40 text-xs flex justify-between items-center font-semibold text-foreground">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-accent">{sla.tag}</span>
                      <span className="text-[10px] text-muted-foreground">({sla.hostname})</span>
                    </div>
                    <p className="text-[10px] text-muted-foreground">{sla.provider}</p>
                  </div>
                  <span className="px-2 py-1 rounded-xl text-[10px] font-bold bg-amber-500/10 text-amber-600 shadow-neu-small border border-white/60">
                    {sla.daysLeft} days
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Column 3: Recent System Audit Logs */}
          <Card className="rounded-[32px] border-neu shadow-neu-extruded bg-background">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-bold text-foreground flex items-center gap-2">
                <User className="w-5 h-5 text-accent" /> System Audit Logs
              </CardTitle>
              <CardDescription className="text-xs font-bold text-muted-foreground">
                Recent layout and inventory changes
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 pt-4">
              {auditLogs.map((log) => (
                <div key={log.id} className="p-3.5 rounded-2xl bg-[#E0E5EC] shadow-neu-inset border border-white/40 text-xs space-y-1.5">
                  <div className="flex justify-between items-center text-[10px] font-bold text-muted-foreground">
                    <span className="text-foreground flex items-center gap-1"><User size={10} /> {log.user}</span>
                    <span>{log.time}</span>
                  </div>
                  <p className="font-semibold text-foreground leading-normal">
                    {log.action} <span className="text-accent">{log.target}</span>
                  </p>
                  <p className="text-[10px] text-muted-foreground font-semibold bg-background/30 p-1.5 rounded-lg border border-white/30 truncate">{log.detail}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  )
}
