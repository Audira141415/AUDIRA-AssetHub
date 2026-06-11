"use client"

import { useState, useMemo } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { 
  Plus, Search, Filter, MoreHorizontal, Server, Activity, Wrench, ShieldAlert, 
  ChevronRight, ArrowUpDown, ChevronDown, CheckCircle2, AlertCircle
} from "lucide-react"
import { baseAssets, getAssetImage } from "@/lib/mock-data"

export default function AllAssetsPage() {
  
  // Mock KPI Data
  const kpis = [
    { label: "Total Assets", value: "1,248", icon: <Server className="text-accent" />, trend: "+12 this month" },
    { label: "Active Assets", value: "1,064", icon: <CheckCircle2 className="text-[#38B2AC]" />, trend: "85% utilization" },
    { label: "Maintenance", value: "42", icon: <Wrench className="text-[#8B84FF]" />, trend: "5 scheduled today" },
    { label: "Expired Warranty", value: "48", icon: <ShieldAlert className="text-red-500" />, trend: "Needs renewal" },
  ]

  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("All")
  const [statusFilter, setStatusFilter] = useState("All")
  const [siteFilter, setSiteFilter] = useState("All")
  const [warrantyFilter, setWarrantyFilter] = useState("All")

  const categories = useMemo(() => Array.from(new Set(baseAssets.map(a => a.cat))).sort(), [])
  const statuses = useMemo(() => Array.from(new Set(baseAssets.map(a => a.status))).sort(), [])
  const sites = useMemo(() => Array.from(new Set(baseAssets.map(a => a.loc))).sort(), [])
  const warranties = useMemo(() => Array.from(new Set(baseAssets.map(a => a.warranty))).sort(), [])

  const filteredAssets = useMemo(() => {
    return baseAssets.filter(asset => {
      const matchesSearch = 
        asset.tag.toLowerCase().includes(searchQuery.toLowerCase()) || 
        asset.host.toLowerCase().includes(searchQuery.toLowerCase()) ||
        asset.vendor.toLowerCase().includes(searchQuery.toLowerCase());
        
      const matchesCategory = categoryFilter === "All" || asset.cat === categoryFilter;
      const matchesStatus = statusFilter === "All" || asset.status === statusFilter;
      const matchesSite = siteFilter === "All" || asset.loc === siteFilter;
      const matchesWarranty = warrantyFilter === "All" || asset.warranty === warrantyFilter;
      
      return matchesSearch && matchesCategory && matchesStatus && matchesSite && matchesWarranty;
    });
  }, [searchQuery, categoryFilter, statusFilter, siteFilter, warrantyFilter])

  return (
    <div className="space-y-8 pb-10">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mt-2">
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground">All Assets</h1>
          <p className="text-muted-foreground font-medium mt-1">Manage and track your entire data center inventory.</p>
        </div>
        <Link href="/assets/create">
          <Button className="h-12 px-6 rounded-2xl shadow-neu-extruded border-neu font-bold text-sm bg-accent text-white hover:bg-accent-light">
            <Plus className="w-5 h-5 mr-2" /> Create Asset
          </Button>
        </Link>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {kpis.map((kpi, i) => (
          <Card key={i} className="rounded-3xl hover:shadow-neu-inset hover:-translate-y-1 transition-all cursor-pointer">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-2">{kpi.label}</p>
                  <h3 className="text-4xl font-display font-bold text-foreground">{kpi.value}</h3>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-background shadow-neu-extruded border-neu flex items-center justify-center shrink-0">
                  {kpi.icon}
                </div>
              </div>
              <p className="text-xs font-semibold text-muted-foreground mt-4">{kpi.trend}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters & Search */}
      <Card className="rounded-[32px]">
        <CardContent className="p-4 sm:p-6 flex flex-col xl:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Search assets by tag, hostname, serial..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-12 pl-12 pr-4 bg-background shadow-neu-inset border-t border-l border-[#A3B1C6]/30 border-b border-r border-white/60 rounded-2xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-accent/50"
            />
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <select 
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="appearance-none w-36 md:w-40 lg:w-48 truncate h-12 pl-4 pr-10 rounded-2xl shadow-neu-extruded border-neu font-bold text-sm text-foreground hover:text-accent bg-background focus:outline-none cursor-pointer"
              >
                <option value="All">All Categories</option>
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none text-muted-foreground" />
            </div>

            <div className="relative">
              <select 
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="appearance-none w-32 md:w-36 lg:w-40 truncate h-12 pl-4 pr-10 rounded-2xl shadow-neu-extruded border-neu font-bold text-sm text-foreground hover:text-accent bg-background focus:outline-none cursor-pointer"
              >
                <option value="All">All Statuses</option>
                {statuses.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none text-muted-foreground" />
            </div>

            <div className="relative hidden md:block">
              <select 
                value={siteFilter}
                onChange={(e) => setSiteFilter(e.target.value)}
                className="appearance-none w-32 md:w-36 lg:w-40 truncate h-12 pl-4 pr-10 rounded-2xl shadow-neu-extruded border-neu font-bold text-sm text-foreground hover:text-accent bg-background focus:outline-none cursor-pointer"
              >
                <option value="All">All Sites</option>
                {sites.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none text-muted-foreground" />
            </div>

            <div className="relative hidden lg:block">
              <select 
                value={warrantyFilter}
                onChange={(e) => setWarrantyFilter(e.target.value)}
                className="appearance-none w-36 md:w-40 lg:w-48 truncate h-12 pl-4 pr-10 rounded-2xl shadow-neu-extruded border-neu font-bold text-sm text-foreground hover:text-accent bg-background focus:outline-none cursor-pointer"
              >
                <option value="All">All Warranties</option>
                {warranties.map(w => <option key={w} value={w}>{w}</option>)}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none text-muted-foreground" />
            </div>
            <Button variant="outline" className="h-12 w-12 px-0 rounded-2xl shadow-neu-extruded border-neu text-muted-foreground hover:text-accent flex items-center justify-center">
              <Filter className="w-5 h-5" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Data Table */}
      <Card className="rounded-[32px] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border-collapse min-w-[1000px]">
            <thead className="text-xs text-muted-foreground uppercase tracking-wider bg-[#E4E9F2]/50 border-b border-[#A3B1C6]/30">
              <tr>
                <th className="px-6 py-5 font-bold cursor-pointer hover:text-accent group whitespace-nowrap">
                  <div className="flex items-center gap-2">Asset Tag <ArrowUpDown className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" /></div>
                </th>
                <th className="px-6 py-5 font-bold whitespace-nowrap">Hostname</th>
                <th className="px-6 py-5 font-bold whitespace-nowrap">Category</th>
                <th className="px-6 py-5 font-bold whitespace-nowrap">Location</th>
                <th className="px-6 py-5 font-bold whitespace-nowrap">Rack</th>
                <th className="px-6 py-5 font-bold whitespace-nowrap">Status</th>
                <th className="px-6 py-5 font-bold whitespace-nowrap">Warranty</th>
                <th className="px-6 py-5 font-bold text-right whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody className="text-foreground">
              {filteredAssets.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-muted-foreground font-bold">
                    <AlertCircle className="w-8 h-8 mx-auto mb-3 opacity-50" />
                    No assets found matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredAssets.map((asset) => (
                  <tr key={asset.id} className="hover:bg-[#E4E9F2]/50 transition-colors group">
                    <td className="px-6 py-4 border-b border-white/60 whitespace-nowrap">
                      <Link href={`/assets/${asset.tag}`} className="font-bold text-accent hover:underline flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-background shadow-neu-extruded border border-white/40 flex items-center justify-center shrink-0 overflow-hidden">
                          <img src={getAssetImage(asset.cat)} alt={asset.cat} className="w-full h-full object-cover scale-[1.3]" />
                        </div>
                        <span className="truncate">{asset.tag}</span>
                      </Link>
                    </td>
                    <td className="px-6 py-4 font-semibold border-b border-white/60 whitespace-nowrap">{asset.host}</td>
                    <td className="px-6 py-4 border-b border-white/60 whitespace-nowrap">
                      <span className="px-3 py-1 bg-background shadow-neu-extruded border-neu text-muted-foreground text-[10px] font-bold rounded-lg uppercase">{asset.cat}</span>
                    </td>
                    <td className="px-6 py-4 font-semibold border-b border-white/60 whitespace-nowrap">{asset.loc}</td>
                    <td className="px-6 py-4 font-mono text-xs font-bold border-b border-white/60 text-muted-foreground whitespace-nowrap">{asset.rack}-{asset.u}</td>
                    <td className="px-6 py-4 border-b border-white/60 whitespace-nowrap">
                      {asset.status === 'Active' && <span className="px-3 py-1 bg-[#38B2AC]/10 text-[#38B2AC] text-[10px] font-bold rounded-lg uppercase whitespace-nowrap">Active</span>}
                      {asset.status === 'Maintenance' && <span className="px-3 py-1 bg-[#8B84FF]/10 text-[#8B84FF] text-[10px] font-bold rounded-lg uppercase whitespace-nowrap">Maint</span>}
                      {asset.status === 'Offline' && <span className="px-3 py-1 bg-red-500/10 text-red-500 text-[10px] font-bold rounded-lg uppercase whitespace-nowrap">Offline</span>}
                    </td>
                    <td className="px-6 py-4 border-b border-white/60 whitespace-nowrap">
                      <span className={`text-xs font-bold ${asset.warranty === 'Expired' ? 'text-red-500' : 'text-muted-foreground'}`}>{asset.warranty}</span>
                    </td>
                    <td className="px-6 py-4 border-b border-white/60 text-right whitespace-nowrap">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-accent shadow-none">
                        <MoreHorizontal className="w-5 h-5" />
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination Dummy */}
        <div className="p-4 sm:p-6 border-t border-[#A3B1C6]/30 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-sm font-semibold text-muted-foreground">Showing {filteredAssets.length} entries</span>
          <div className="flex gap-2">
            <Button variant="outline" className="h-10 px-4 rounded-xl shadow-neu-extruded border-neu font-bold text-sm text-muted-foreground" disabled>Previous</Button>
            <Button variant="default" className="h-10 w-10 px-0 rounded-xl shadow-neu-inset-deep bg-accent text-white font-bold text-sm">1</Button>
            <Button variant="outline" className="h-10 w-10 px-0 rounded-xl shadow-neu-extruded border-neu font-bold text-sm text-foreground hover:text-accent">2</Button>
            <Button variant="outline" className="h-10 w-10 px-0 rounded-xl shadow-neu-extruded border-neu font-bold text-sm text-foreground hover:text-accent">3</Button>
            <span className="h-10 px-2 flex items-center text-muted-foreground">...</span>
            <Button variant="outline" className="h-10 px-4 rounded-xl shadow-neu-extruded border-neu font-bold text-sm text-foreground hover:text-accent">Next</Button>
          </div>
        </div>
      </Card>
      
    </div>
  )
}
