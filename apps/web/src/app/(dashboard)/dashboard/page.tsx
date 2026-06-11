"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Package, Activity, ShieldAlert, MapPin, Calendar, ArrowRightLeft, Plus, Pen, Minus, Server, HardDrive, Database, ScanLine, ChevronDown, MoreVertical } from "lucide-react"
import { getAssetImage } from "@/lib/mock-data"
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
  Cell
} from "recharts"

const donutData = [
  { name: 'Servers', value: 512, color: '#6C63FF', percentage: '41.0%' },
  { name: 'Network Devices', value: 356, color: '#38B2AC', percentage: '28.5%' },
  { name: 'Storage', value: 198, color: '#8B84FF', percentage: '15.9%' },
  { name: 'Power', value: 112, color: '#F59E0B', percentage: '9.0%' },
  { name: 'Others', value: 70, color: '#A0AEC0', percentage: '5.6%' },
]

const barData = [
  { name: 'Batam DC', value: 520 },
  { name: 'Jakarta DC', value: 280 },
  { name: 'Surabaya DC', value: 198 },
  { name: 'Bandung DC', value: 150 },
  { name: 'Others', value: 100 },
]

const recentAssets = [
  { tag: 'SRV-250501-001', host: 'SRV-PROD-01', cat: 'Server', loc: 'Batam DC', room: 'Server Room A', rack: 'R01 - U24', status: 'Active', end: '12 Dec 2026' },
  { tag: 'SW-250501-002', host: 'SW-CORE-01', cat: 'Network', loc: 'Jakarta DC', room: 'Network Room', rack: 'R02 - U12', status: 'Active', end: '18 Oct 2026' },
  { tag: 'STG-250501-003', host: 'STG-01', cat: 'Storage', loc: 'Surabaya DC', room: 'Storage Room', rack: 'R03 - U08', status: 'Active', end: '5 Aug 2026' },
  { tag: 'PDU-250501-004', host: 'PDU-R01', cat: 'Power', loc: 'Batam DC', room: 'Power Room', rack: 'R01 - U42', status: 'Active', end: '22 Feb 2027' },
  { tag: 'FW-250501-005', host: 'FW-EDGE-01', cat: 'Network', loc: 'Bandung DC', room: 'Network Room', rack: 'R05 - U18', status: 'Maintenance', end: '10 Nov 2025' },
]

export default function DashboardPage() {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  return (
    <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
      {/* Main Content (Spans 3 cols on xl) */}
      <div className="xl:col-span-3 space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold tracking-tight text-foreground">Dashboard</h1>
            <p className="text-base text-muted-foreground mt-1">Overview of your data center assets</p>
          </div>
          <Button variant="outline" className="shadow-neu-extruded">
            <Calendar className="mr-2 h-4 w-4 text-accent" />
            <span className="font-semibold">May 1 – May 31, 2025</span>
            <ChevronDown className="ml-2 h-4 w-4 text-muted-foreground" />
          </Button>
        </div>

        {/* 4 Top Widgets */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="px-6 py-6">
            <CardContent className="p-0">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Total Assets</p>
                  <h3 className="text-4xl font-display font-bold text-foreground mt-2">1,248</h3>
                  <p className="text-xs font-semibold text-muted-foreground mt-2"><span className="text-accent">↑ 12.5%</span> vs last month</p>
                </div>
                <div className="p-3 bg-background shadow-neu-inset rounded-2xl">
                  <Package className="h-6 w-6 text-accent" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="px-6 py-6">
            <CardContent className="p-0">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Active Assets</p>
                  <h3 className="text-4xl font-display font-bold text-foreground mt-2">1,064</h3>
                  <p className="text-xs font-semibold text-muted-foreground mt-2"><span className="text-[#38B2AC]">↑ 85.2%</span> of total</p>
                </div>
                <div className="p-3 bg-background shadow-neu-inset rounded-2xl">
                  <Activity className="h-6 w-6 text-[#38B2AC]" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="px-6 py-6">
            <CardContent className="p-0">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Expired Warranty</p>
                  <h3 className="text-4xl font-display font-bold text-foreground mt-2">48</h3>
                  <p className="text-xs font-semibold text-muted-foreground mt-2">Needs attention</p>
                </div>
                <div className="p-3 bg-background shadow-neu-inset rounded-2xl">
                  <ShieldAlert className="h-6 w-6 text-red-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="px-6 py-6">
            <CardContent className="p-0">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Total Locations</p>
                  <h3 className="text-4xl font-display font-bold text-foreground mt-2">15</h3>
                  <p className="text-xs font-semibold text-muted-foreground mt-2">Sites & Rooms</p>
                </div>
                <div className="p-3 bg-background shadow-neu-inset rounded-2xl">
                  <MapPin className="h-6 w-6 text-[#F59E0B]" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader className="pb-0 pt-2 px-0">
              <CardTitle className="text-lg font-bold text-foreground">Assets by Category</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-between h-72 px-0 pb-0">
              <div className="w-[45%] h-full min-h-[250px] relative">
                {isMounted ? (
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie data={donutData} innerRadius={55} outerRadius={75} paddingAngle={4} dataKey="value" stroke="none">
                        {donutData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{backgroundColor: '#E0E5EC', border: 'none', borderRadius: '16px', boxShadow: '9px 9px 16px rgb(163 177 198 / 0.6), -9px -9px 16px rgba(255 255 255 / 0.5)'}} itemStyle={{color: '#3D4852', fontWeight: 'bold'}} />
                    </PieChart>
                  </ResponsiveContainer>
                ) : null}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-2xl font-display font-bold text-foreground">1,248</span>
                  <span className="text-[10px] font-bold text-muted-foreground">Total</span>
                </div>
              </div>
              <div className="w-[55%] space-y-4 pr-4">
                {donutData.map((item) => (
                  <div key={item.name} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full shadow-neu-extruded" style={{ backgroundColor: item.color }} />
                      <span className="text-foreground font-semibold">{item.name}</span>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-foreground font-bold">{item.value}</span>
                      <span className="text-muted-foreground w-11 text-right font-medium text-[11px]">({item.percentage})</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-0 pt-2 px-0">
              <CardTitle className="text-lg font-bold text-foreground">Assets by Site</CardTitle>
              <Button variant="outline" size="sm" className="h-8 text-xs font-bold rounded-xl">
                Top 5 <ChevronDown className="ml-1 h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent className="h-72 pt-8 px-0 pb-0 min-h-[250px]">
              {isMounted ? (
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={barData} margin={{ top: 25, right: 0, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#A3B1C6" opacity={0.3} />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontSize: 12, fontWeight: 600}} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontSize: 12, fontWeight: 600}} />
                    <Tooltip cursor={{fill: '#A3B1C6', opacity: 0.1}} contentStyle={{backgroundColor: '#E0E5EC', border: 'none', borderRadius: '16px', boxShadow: '9px 9px 16px rgb(163 177 198 / 0.6), -9px -9px 16px rgba(255 255 255 / 0.5)'}} itemStyle={{color: '#3D4852', fontWeight: 'bold'}} />
                    <Bar dataKey="value" fill="#6C63FF" radius={[8, 8, 0, 0]} maxBarSize={32} label={{ position: 'top', fill: '#6C63FF', fontSize: 12, fontWeight: 'bold' }} />
                  </BarChart>
                </ResponsiveContainer>
              ) : null}
            </CardContent>
          </Card>
        </div>

        {/* Recent Assets Table */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between py-4 px-0">
            <CardTitle className="text-lg font-bold text-foreground">Recent Assets</CardTitle>
            <a href="#" className="text-sm font-bold text-accent hover:text-accent-light transition-colors">View all</a>
          </CardHeader>
          <div className="overflow-x-auto rounded-2xl shadow-neu-inset bg-background p-4 mb-4">
            <table className="w-full text-sm text-left border-collapse">
              <thead className="text-xs text-muted-foreground uppercase tracking-wider border-b border-[#A3B1C6]/30">
                <tr>
                  <th className="px-6 py-4 font-bold border-b border-white/60 whitespace-nowrap">Asset Tag</th>
                  <th className="px-6 py-4 font-bold border-b border-white/60 whitespace-nowrap">Hostname</th>
                  <th className="px-6 py-4 font-bold border-b border-white/60 whitespace-nowrap">Category</th>
                  <th className="px-6 py-4 font-bold border-b border-white/60 whitespace-nowrap">Location</th>
                  <th className="px-6 py-4 font-bold border-b border-white/60 whitespace-nowrap">Rack</th>
                  <th className="px-6 py-4 font-bold border-b border-white/60 whitespace-nowrap">Status</th>
                  <th className="px-6 py-4 font-bold border-b border-white/60 whitespace-nowrap">Warranty End</th>
                  <th className="px-6 py-4 font-bold border-b border-white/60 whitespace-nowrap"></th>
                </tr>
              </thead>
              <tbody className="text-foreground divide-y divide-[#A3B1C6]/20">
                {recentAssets.map((asset) => (
                  <tr key={asset.tag} className="group hover:bg-[#E4E9F2]/50 transition-colors">
                    <td className="px-6 py-4 font-bold text-foreground bg-background group-hover:bg-[#E4E9F2]/50 transition-all border-b border-white/60 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-background shadow-neu-extruded border border-white/40 flex items-center justify-center shrink-0 overflow-hidden">
                          <img src={getAssetImage(asset.cat)} alt={asset.cat} className="w-full h-full object-cover scale-[1.3]" />
                        </div>
                        <span className="truncate">{asset.tag}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-medium bg-background group-hover:bg-[#E4E9F2]/50 transition-all border-b border-white/60 whitespace-nowrap">{asset.host}</td>
                    <td className="px-6 py-4 bg-background group-hover:bg-[#E4E9F2]/50 transition-all border-b border-white/60 whitespace-nowrap">
                      <span className="px-3 py-1.5 text-xs font-bold bg-background shadow-neu-extruded border-neu rounded-lg text-accent uppercase tracking-wider">{asset.cat}</span>
                    </td>
                    <td className="px-6 py-4 bg-background group-hover:bg-[#E4E9F2]/50 transition-all border-b border-white/60 whitespace-nowrap">
                      <div className="flex flex-col">
                        <span className="font-semibold">{asset.loc}</span>
                        <span className="text-xs text-muted-foreground">{asset.room}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-medium bg-background group-hover:bg-[#E4E9F2]/50 transition-all border-b border-white/60 whitespace-nowrap">{asset.rack}</td>
                    <td className="px-6 py-4 bg-background group-hover:bg-[#E4E9F2]/50 transition-all border-b border-white/60 whitespace-nowrap">
                      <span className={`px-3 py-1.5 text-xs font-bold bg-background shadow-neu-extruded border-neu rounded-lg uppercase tracking-wider ${asset.status === 'Active' ? 'text-[#38B2AC]' : 'text-red-500'}`}>{asset.status}</span>
                    </td>
                    <td className="px-6 py-4 font-medium bg-background group-hover:bg-[#E4E9F2]/50 transition-all border-b border-white/60 whitespace-nowrap">{asset.end}</td>
                    <td className="px-6 py-4 text-right bg-background group-hover:bg-[#E4E9F2]/50 transition-all border-b border-white/60 whitespace-nowrap">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-accent shadow-none border border-transparent hover:border-neu hover:shadow-neu-extruded"><MoreVertical className="h-5 w-5" /></Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between text-sm font-semibold text-muted-foreground mt-4 px-2">
            <span>Showing 1 to 5 of 50 assets</span>
            <div className="flex gap-2">
              <Button variant="outline" size="icon" className="h-8 w-8 rounded-xl disabled:opacity-50"><ArrowRightLeft className="h-4 w-4 rotate-180" /></Button>
              <Button variant="default" size="icon" className="h-8 w-8 rounded-xl">1</Button>
              <Button variant="outline" size="icon" className="h-8 w-8 rounded-xl">2</Button>
              <Button variant="outline" size="icon" className="h-8 w-8 rounded-xl">3</Button>
              <span className="px-2 py-1">...</span>
              <Button variant="outline" size="icon" className="h-8 w-8 rounded-xl">10</Button>
              <Button variant="outline" size="icon" className="h-8 w-8 rounded-xl"><ArrowRightLeft className="h-4 w-4" /></Button>
            </div>
          </div>
        </Card>
      </div>

      {/* Right Sidebar (Spans 1 col on xl) */}
      <div className="xl:col-span-1 space-y-8">
        
        {/* Recent Movements */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between py-4 px-0 border-b border-[#A3B1C6]/20">
            <CardTitle className="text-lg font-bold text-foreground">Recent Movements</CardTitle>
            <a href="#" className="text-sm font-bold text-accent hover:text-accent-light">View all</a>
          </CardHeader>
          <CardContent className="space-y-0 pt-0 px-0 pb-0 divide-y divide-[#A3B1C6]/20">
            <div className="flex gap-4 items-start group py-4 border-t border-white/60">
              <div className="p-3 bg-background shadow-neu-extruded border-neu group-hover:shadow-neu-inset rounded-2xl shrink-0 transition-all">
                <ArrowRightLeft className="h-5 w-5 text-accent" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <p className="text-sm font-bold text-foreground">SRV-250501-001</p>
                  <span className="text-xs font-semibold text-muted-foreground">2h ago</span>
                </div>
                <p className="text-sm font-medium text-muted-foreground mt-1">Moved to <span className="text-foreground font-bold">Rack R05 - U24</span></p>
                <p className="text-xs font-semibold text-muted-foreground mt-0.5">Batam DC - Server Room A</p>
              </div>
            </div>
            
            <div className="flex gap-4 items-start group py-4 border-t border-white/60">
              <div className="p-3 bg-background shadow-neu-extruded border-neu group-hover:shadow-neu-inset rounded-2xl shrink-0 transition-all">
                <Plus className="h-5 w-5 text-[#38B2AC]" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <p className="text-sm font-bold text-foreground">SW-250501-002</p>
                  <span className="text-xs font-semibold text-muted-foreground">5h ago</span>
                </div>
                <p className="text-sm font-medium text-muted-foreground mt-1">Added to <span className="text-foreground font-bold">Rack R02 - U12</span></p>
                <p className="text-xs font-semibold text-muted-foreground mt-0.5">Jakarta DC - Network Room</p>
              </div>
            </div>

            <div className="flex gap-4 items-start group py-4 border-t border-white/60">
              <div className="p-3 bg-background shadow-neu-extruded border-neu group-hover:shadow-neu-inset rounded-2xl shrink-0 transition-all">
                <Pen className="h-5 w-5 text-[#F59E0B]" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <p className="text-sm font-bold text-foreground">STG-250501-003</p>
                  <span className="text-xs font-semibold text-muted-foreground">1d ago</span>
                </div>
                <p className="text-sm font-medium text-muted-foreground mt-1">Changed information</p>
                <p className="text-xs font-semibold text-muted-foreground mt-0.5">Surabaya DC - Storage Room</p>
              </div>
            </div>

            <div className="flex gap-4 items-start group py-4 border-t border-white/60">
              <div className="p-3 bg-background shadow-neu-extruded border-neu group-hover:shadow-neu-inset rounded-2xl shrink-0 transition-all">
                <Minus className="h-5 w-5 text-red-500" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <p className="text-sm font-bold text-foreground">PDU-250430-004</p>
                  <span className="text-xs font-semibold text-muted-foreground">2d ago</span>
                </div>
                <p className="text-sm font-medium text-muted-foreground mt-1">Removed from Rack R01</p>
                <p className="text-xs font-semibold text-muted-foreground mt-0.5">Batam DC - Power Room</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Warranty Expiring Soon */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between py-4 px-0 border-b border-[#A3B1C6]/20">
            <CardTitle className="text-lg font-bold text-foreground">Warranty Expiring Soon</CardTitle>
            <a href="#" className="text-sm font-bold text-accent hover:text-accent-light">View all</a>
          </CardHeader>
          <CardContent className="space-y-0 pt-0 px-0 pb-0 divide-y divide-[#A3B1C6]/20">
            
            <div className="flex gap-4 items-center group py-4 border-t border-white/60">
              <div className="w-12 h-12 bg-background shadow-neu-inset border-t border-l border-[#A3B1C6]/30 border-b border-r border-white/60 rounded-2xl shrink-0 overflow-hidden">
                <img src={getAssetImage("server")} alt="Server" className="w-full h-full object-cover scale-[1.3]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-foreground truncate">SRV-240601-001</p>
                <p className="text-xs font-semibold text-muted-foreground truncate">Dell PowerEdge R750</p>
              </div>
              <div className="text-right shrink-0">
                <span className="px-3 py-1.5 text-xs font-bold bg-background shadow-neu-extruded text-[#F59E0B] rounded-lg">15 days</span>
                <p className="text-xs font-semibold text-muted-foreground mt-2">15 Jun 2025</p>
              </div>
            </div>

            <div className="flex gap-4 items-center group py-4 border-t border-white/60">
              <div className="w-12 h-12 bg-background shadow-neu-inset border-t border-l border-[#A3B1C6]/30 border-b border-r border-white/60 rounded-2xl shrink-0 overflow-hidden">
                <img src={getAssetImage("switch")} alt="Switch" className="w-full h-full object-cover scale-[1.3]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-foreground truncate">SW-240702-002</p>
                <p className="text-xs font-semibold text-muted-foreground truncate">Cisco Catalyst 9500</p>
              </div>
              <div className="text-right shrink-0">
                <span className="px-3 py-1.5 text-xs font-bold bg-background shadow-neu-extruded text-[#F59E0B] rounded-lg">28 days</span>
                <p className="text-xs font-semibold text-muted-foreground mt-2">28 Jun 2025</p>
              </div>
            </div>

            <div className="flex gap-4 items-center group py-4 border-t border-white/60">
              <div className="w-12 h-12 bg-background shadow-neu-inset border-t border-l border-[#A3B1C6]/30 border-b border-r border-white/60 rounded-2xl shrink-0 overflow-hidden">
                <img src={getAssetImage("storage")} alt="Storage" className="w-full h-full object-cover scale-[1.3]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-foreground truncate">STG-240803-003</p>
                <p className="text-xs font-semibold text-muted-foreground truncate">HPE MSA 2062</p>
              </div>
              <div className="text-right shrink-0">
                <span className="px-3 py-1.5 text-xs font-bold bg-background shadow-neu-extruded text-red-500 rounded-lg">5 days</span>
                <p className="text-xs font-semibold text-muted-foreground mt-2">5 Jun 2025</p>
              </div>
            </div>

            <Button variant="outline" className="w-full mt-4 h-12 font-bold text-sm">
              View all warranties
            </Button>
          </CardContent>
        </Card>

        {/* Scan Asset QR */}
        <Card className="relative overflow-hidden group">
          <div className="absolute inset-0 bg-accent/5 transition-all group-hover:bg-accent/10"></div>
          <CardContent className="p-8 flex flex-col items-center text-center relative z-10">
            <div className="flex items-center gap-5 w-full mb-6">
              <div className="p-4 bg-background shadow-neu-extruded rounded-2xl shrink-0 group-hover:shadow-neu-inset transition-all">
                <ScanLine className="h-8 w-8 text-accent" />
              </div>
              <div className="text-left flex-1">
                <h4 className="text-lg font-bold text-foreground">Scan Asset QR</h4>
                <p className="text-sm font-medium text-muted-foreground leading-tight mt-1">Scan QR code on your asset to view details instantly</p>
              </div>
            </div>
            <Button className="w-full h-14 text-base font-bold transition-all shadow-neu-extruded hover:-translate-y-1 hover:shadow-neu-hover active:shadow-neu-inset">
              Start Scanning
            </Button>
          </CardContent>
        </Card>

      </div>
    </div>
  )
}

