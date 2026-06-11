"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  ChevronRight, 
  Upload, 
  Plus, 
  Search, 
  Filter, 
  List, 
  LayoutGrid,
  MoreVertical,
  Eye,
  Edit2,
  X,
  ShieldCheck,
  Shield,
  Clock,
  XCircle,
  CalendarDays,
  MapPin,
  Calendar,
  Box,
  CheckCircle2,
  AlertCircle,
  ChevronLeft
} from "lucide-react"

import { mockWarranties } from "@/lib/mock-data"

// Types
type Warranty = typeof mockWarranties[0]

export default function WarrantyPage() {
  const [warranties, setWarranties] = useState<Warranty[]>(mockWarranties)
  const [selectedWarranty, setSelectedWarranty] = useState<string | null>("WAR-2025-0312")
  
  // Feature States
  const [viewMode, setViewMode] = useState<"list" | "grid">("list")
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("All Status")
  const [vendorFilter, setVendorFilter] = useState("All Vendors")
  
  const [activeTab, setActiveTab] = useState("Overview")

  // Derived Data (Filtering)
  const filteredWarranties = useMemo(() => {
    let result = [...warranties]
    
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      result = result.filter(w => 
        w.id.toLowerCase().includes(q) || 
        w.assetName.toLowerCase().includes(q) ||
        w.assetId.toLowerCase().includes(q) ||
        w.sn.toLowerCase().includes(q)
      )
    }
    if (statusFilter !== "All Status") result = result.filter(w => w.status === statusFilter)
    if (vendorFilter !== "All Vendors") result = result.filter(w => w.vendor === vendorFilter)

    return result
  }, [warranties, searchQuery, statusFilter, vendorFilter])

  // Helpers
  const getBadgeColor = (type: string, value: string) => {
    if (type === "status") {
      if (value === "Active") return "text-green-500 shadow-neu-inset-small bg-background"
      if (value === "Expiring Soon") return "text-amber-500 shadow-neu-inset-small bg-background"
      if (value === "Expired") return "text-red-500 shadow-neu-inset-small bg-background"
      return "text-gray-500 shadow-neu-inset-small bg-background"
    }
    return "text-gray-500 shadow-neu-inset-small bg-background"
  }

  const activeWarrantyData = warranties.find(w => w.id === selectedWarranty)

  // Dynamic Options for Selects
  const uniqueStatuses = ["All Status", ...Array.from(new Set(warranties.map(w => w.status)))]
  const uniqueVendors = ["All Vendors", ...Array.from(new Set(warranties.map(w => w.vendor)))]

  return (
    <div className="flex w-full gap-6 pb-6 h-full">
      <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${selectedWarranty ? 'pr-0' : ''}`}>
        
        {/* Breadcrumb & Header */}
        <div className="flex flex-col xl:flex-row xl:items-start justify-between mb-6 gap-4">
          <div>
            <div className="flex flex-wrap items-center text-xs text-muted-foreground mb-2 font-medium">
              <MapPin size={12} className="mr-1" />
              <span>Operations</span>
              <ChevronRight size={12} className="mx-1" />
              <span className="text-foreground font-bold">Warranty</span>
            </div>
            <h1 className="text-3xl font-bold text-foreground tracking-tight mb-1">Warranty</h1>
            <p className="text-sm text-muted-foreground font-medium">Track and manage all asset warranties and support contracts</p>
          </div>
          <div className="flex gap-4 flex-wrap">
            <Button variant="ghost" className="bg-background shadow-neu-extruded text-foreground hover:text-accent hover:shadow-neu-hover active:shadow-neu-inset-small rounded-2xl flex items-center gap-2 h-12 px-6 transition-all font-bold whitespace-nowrap">
              <Upload size={18} />
              Export
            </Button>
            <Button className="bg-accent hover:bg-accent/90 text-white shadow-neu-extruded hover:shadow-neu-hover active:shadow-neu-inset-small rounded-2xl flex items-center gap-2 h-12 px-6 transition-all font-bold border-none whitespace-nowrap">
              <Plus size={18} />
              Add Warranty
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-4 mb-6">
          <div className="bg-background shadow-neu-extruded border-neu rounded-[20px] p-4 flex items-center gap-3 min-w-0">
            <div className="w-12 h-12 rounded-2xl bg-background shadow-neu-inset-small flex items-center justify-center shrink-0">
              <ShieldCheck className="text-accent" size={20} />
            </div>
            <div className="min-w-0 overflow-hidden">
              <p className="text-[10px] font-bold text-muted-foreground mb-0.5 uppercase tracking-wider truncate">Total Warranties</p>
              <div className="flex items-baseline gap-1 truncate">
                <span className="text-2xl font-black text-foreground">312</span>
              </div>
              <p className="text-[9px] font-medium text-muted-foreground mt-0.5 truncate">All time</p>
            </div>
          </div>
          <div className="bg-background shadow-neu-extruded border-neu rounded-[20px] p-4 flex items-center gap-3 min-w-0">
            <div className="w-12 h-12 rounded-2xl bg-background shadow-neu-inset-small flex items-center justify-center shrink-0">
              <Shield className="text-green-500" size={20} />
            </div>
            <div className="min-w-0 overflow-hidden">
              <p className="text-[10px] font-bold text-muted-foreground mb-0.5 uppercase tracking-wider truncate">Active</p>
              <div className="flex items-baseline gap-1 truncate">
                <span className="text-2xl font-black text-foreground">228</span>
              </div>
              <p className="text-[9px] font-medium text-muted-foreground mt-0.5 truncate">73% of total</p>
            </div>
          </div>
          <div className="bg-background shadow-neu-extruded border-neu rounded-[20px] p-4 flex items-center gap-3 min-w-0">
            <div className="w-12 h-12 rounded-2xl bg-background shadow-neu-inset-small flex items-center justify-center shrink-0">
              <Clock className="text-amber-500" size={20} />
            </div>
            <div className="min-w-0 overflow-hidden">
              <p className="text-[10px] font-bold text-muted-foreground mb-0.5 uppercase tracking-wider truncate">Expiring Soon</p>
              <div className="flex items-baseline gap-1 truncate">
                <span className="text-2xl font-black text-foreground">42</span>
              </div>
              <p className="text-[9px] font-medium text-muted-foreground mt-0.5 truncate">Within 90 days</p>
            </div>
          </div>
          <div className="bg-background shadow-neu-extruded border-neu rounded-[20px] p-4 flex items-center gap-3 min-w-0">
            <div className="w-12 h-12 rounded-2xl bg-background shadow-neu-inset-small flex items-center justify-center shrink-0">
              <XCircle className="text-red-500" size={20} />
            </div>
            <div className="min-w-0 overflow-hidden">
              <p className="text-[10px] font-bold text-muted-foreground mb-0.5 uppercase tracking-wider truncate">Expired</p>
              <div className="flex items-baseline gap-1 truncate">
                <span className="text-2xl font-black text-foreground">42</span>
              </div>
              <p className="text-[9px] font-medium text-muted-foreground mt-0.5 truncate">14% of total</p>
            </div>
          </div>
          <div className="bg-background shadow-neu-extruded border-neu rounded-[20px] p-4 flex items-center gap-3 min-w-0">
            <div className="w-12 h-12 rounded-2xl bg-background shadow-neu-inset-small flex items-center justify-center shrink-0">
              <CalendarDays className="text-purple-500" size={20} />
            </div>
            <div className="min-w-0 overflow-hidden">
              <p className="text-[10px] font-bold text-muted-foreground mb-0.5 uppercase tracking-wider truncate">Avg. Remaining</p>
              <div className="flex items-baseline gap-1 truncate">
                <span className="text-2xl font-black text-foreground">218</span>
              </div>
              <p className="text-[9px] font-medium text-muted-foreground mt-0.5 truncate">Days</p>
            </div>
          </div>
        </div>

        {/* Filters bar */}
        <div className="flex flex-wrap items-center gap-4 mb-6">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input 
              placeholder="Search warranty by asset, serial number..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 bg-background shadow-neu-inset-deep border-t border-l border-[#A3B1C6]/30 border-b border-r border-white/60 h-12 rounded-2xl text-sm font-medium focus-visible:ring-0 focus-visible:border-accent"
            />
            {searchQuery && (
              <X 
                size={16} 
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground cursor-pointer hover:text-foreground"
                onClick={() => setSearchQuery("")}
              />
            )}
          </div>
          
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-12 px-4 bg-background shadow-neu-extruded border-neu rounded-2xl text-sm font-bold text-foreground outline-none appearance-none pr-10 relative bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%236B7280%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-[length:16px_16px] bg-[right_16px_center] bg-no-repeat min-w-[140px] cursor-pointer hover:shadow-neu-hover transition-all"
          >
            {uniqueStatuses.map(status => <option key={status} value={status}>{status}</option>)}
          </select>
          
          <select 
            value={vendorFilter}
            onChange={(e) => setVendorFilter(e.target.value)}
            className="h-12 px-4 bg-background shadow-neu-extruded border-neu rounded-2xl text-sm font-bold text-foreground outline-none appearance-none pr-10 relative bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%236B7280%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-[length:16px_16px] bg-[right_16px_center] bg-no-repeat min-w-[140px] cursor-pointer hover:shadow-neu-hover transition-all"
          >
            {uniqueVendors.map(v => <option key={v} value={v}>{v}</option>)}
          </select>
          
          <select 
            className="h-12 px-4 bg-background shadow-neu-extruded border-neu rounded-2xl text-sm font-bold text-foreground outline-none appearance-none pr-10 relative bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%236B7280%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-[length:16px_16px] bg-[right_16px_center] bg-no-repeat min-w-[140px] cursor-pointer hover:shadow-neu-hover transition-all"
          >
            <option>All Categories</option>
          </select>

          <Button 
            variant="ghost" 
            onClick={() => {
              setSearchQuery("")
              setStatusFilter("All Status")
              setVendorFilter("All Vendors")
            }}
            className="bg-background shadow-neu-extruded text-foreground hover:text-accent rounded-2xl flex items-center gap-2 h-12 px-6 transition-all font-bold hover:shadow-neu-hover active:shadow-neu-inset-small whitespace-nowrap"
          >
            <Filter size={18} className="text-accent" />
            Filter
          </Button>
          
          <div className="flex bg-background shadow-neu-inset-small rounded-2xl p-1 h-12 items-center">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setViewMode("list")}
              className={`h-10 w-10 rounded-xl shrink-0 transition-all ${viewMode === 'list' ? 'shadow-neu-extruded bg-background text-accent' : 'text-muted-foreground hover:text-foreground'}`}
            >
              <List size={18} />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setViewMode("grid")}
              className={`h-10 w-10 rounded-xl shrink-0 transition-all ${viewMode === 'grid' ? 'shadow-neu-extruded bg-background text-accent' : 'text-muted-foreground hover:text-foreground'}`}
            >
              <LayoutGrid size={18} />
            </Button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 flex flex-col">
          {viewMode === "list" ? (
            /* Table View */
            <div className="flex flex-col gap-4 mb-2">
              <div className="bg-background shadow-neu-extruded border-neu rounded-[32px] flex flex-col overflow-hidden">
                <div className="overflow-x-auto w-full">
                  <table className="w-full text-sm text-left min-w-[1100px]">
                    <thead className="text-xs text-muted-foreground uppercase bg-background shadow-neu-inset-small sticky top-0 z-10">
                      <tr>
                        <th className="px-5 py-4 font-bold whitespace-nowrap tracking-wider">Warranty ID</th>
                        <th className="px-5 py-4 font-bold whitespace-nowrap tracking-wider">Asset</th>
                        <th className="px-5 py-4 font-bold whitespace-nowrap tracking-wider">Vendor</th>
                        <th className="px-5 py-4 font-bold whitespace-nowrap tracking-wider">Start Date</th>
                        <th className="px-5 py-4 font-bold whitespace-nowrap tracking-wider">End Date</th>
                        <th className="px-5 py-4 font-bold whitespace-nowrap tracking-wider text-right">Days Remaining</th>
                        <th className="px-5 py-4 font-bold whitespace-nowrap tracking-wider">Status</th>
                        <th className="px-5 py-4 font-bold whitespace-nowrap tracking-wider">Coverage Type</th>
                        <th className="px-5 py-4 font-bold whitespace-nowrap text-right tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredWarranties.map((war) => (
                        <tr 
                          key={war.id} 
                          className={`border-b border-[#A3B1C6]/20 cursor-pointer transition-all duration-300 ${selectedWarranty === war.id ? 'shadow-neu-inset-small bg-background text-accent' : 'hover:shadow-neu-inset-small'}`}
                          onClick={() => setSelectedWarranty(war.id)}
                        >
                          <td className="px-5 py-4 font-bold text-accent whitespace-nowrap">{war.id}</td>
                          <td className="px-5 py-4 flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-background shadow-neu-extruded overflow-hidden p-1.5 shrink-0">
                              <img src={`/images/assets/${war.assetImage}.png`} alt={war.assetName} className="w-full h-full object-contain" />
                            </div>
                            <div className="min-w-0">
                              <p className={`font-bold text-sm whitespace-nowrap truncate ${selectedWarranty === war.id ? 'text-accent' : 'text-foreground'}`}>{war.assetId}</p>
                              <p className="text-[11px] text-muted-foreground font-medium mt-0.5 whitespace-nowrap truncate">{war.assetName}</p>
                              <p className="text-[9px] text-muted-foreground font-bold whitespace-nowrap truncate">SN: {war.sn}</p>
                            </div>
                          </td>
                          <td className="px-5 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <div className="w-5 h-5 rounded-md bg-background shadow-neu-extruded flex items-center justify-center text-accent">
                                <Box size={10} />
                              </div>
                              <span className="font-bold text-foreground text-xs">{war.vendor}</span>
                            </div>
                          </td>
                          <td className="px-5 py-4 whitespace-nowrap font-medium">{war.startDate}</td>
                          <td className="px-5 py-4 whitespace-nowrap font-medium">{war.endDate}</td>
                          <td className="px-5 py-4 whitespace-nowrap text-right">
                            <span className={`font-bold text-sm ${war.daysRemaining < 0 ? 'text-red-500' : 'text-foreground'}`}>
                              {war.daysRemaining}
                            </span>
                          </td>
                          <td className="px-5 py-4 whitespace-nowrap">
                            <span className={`px-2.5 py-1 text-[10px] rounded-lg font-bold ${getBadgeColor('status', war.status)}`}>
                              {war.status}
                            </span>
                          </td>
                          <td className="px-5 py-4 whitespace-nowrap">
                            <span className="font-bold text-foreground text-xs">{war.coverageType}</span>
                          </td>
                          <td className="px-5 py-4 text-right whitespace-nowrap relative">
                            <div className="flex items-center justify-end gap-2">
                              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg shadow-neu-extruded text-muted-foreground hover:text-accent hover:shadow-neu-hover active:shadow-neu-inset-small transition-all">
                                <Eye size={14} />
                              </Button>
                              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg shadow-neu-extruded text-muted-foreground hover:text-accent hover:shadow-neu-hover active:shadow-neu-inset-small transition-all">
                                <Edit2 size={14} />
                              </Button>
                              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg shadow-neu-extruded text-muted-foreground hover:text-accent hover:shadow-neu-hover active:shadow-neu-inset-small transition-all">
                                <MoreVertical size={14} />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              
              <div className="bg-background shadow-neu-extruded rounded-[24px] p-4 flex flex-wrap gap-4 items-center justify-between text-sm text-muted-foreground font-medium shrink-0">
                <div>Showing 1 to {filteredWarranties.length} of 312 warranties</div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl shadow-neu-extruded text-muted-foreground opacity-50 cursor-not-allowed">
                      <ChevronLeft size={16} />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl shadow-neu-extruded bg-accent text-white hover:bg-accent/90 hover:text-white font-bold">
                      1
                    </Button>
                    <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl shadow-neu-extruded text-muted-foreground hover:text-foreground">
                      2
                    </Button>
                    <span className="px-2">...</span>
                    <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl shadow-neu-extruded text-muted-foreground hover:text-foreground">
                      <ChevronRight size={16} />
                    </Button>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl shadow-neu-extruded cursor-pointer hover:shadow-neu-hover">
                    <span className="font-bold text-foreground">10 / page</span>
                    <ChevronRight size={14} className="rotate-90 text-muted-foreground" />
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Grid View (stub) */
            <div className="flex-1 overflow-y-auto mb-2">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-6">
                <p className="text-muted-foreground">Grid view is under construction.</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right Side Panel */}
      {selectedWarranty && activeWarrantyData && (
        <div className="w-[360px] bg-background shadow-neu-extruded border-neu rounded-[32px] flex flex-col h-full overflow-hidden shrink-0 transition-all mb-2 animate-in slide-in-from-right-8 duration-300">
          
          <div className="relative p-6 pt-10 pb-4 bg-background shadow-neu-inset-deep flex flex-col items-center shrink-0 border-b border-[#A3B1C6]/20">
            <div className="absolute top-4 right-4 flex gap-2">
              <span className={`px-2.5 py-1 text-[10px] rounded-lg font-bold shadow-neu-extruded bg-background ${activeWarrantyData.status === 'Active' ? 'text-green-500' : activeWarrantyData.status === 'Expiring Soon' ? 'text-amber-500' : 'text-red-500'}`}>
                {activeWarrantyData.status}
              </span>
              <Button variant="ghost" size="icon" className="h-7 w-7 rounded-full shadow-neu-extruded bg-background text-foreground hover:text-red-500 hover:shadow-neu-hover active:shadow-neu-inset-small" onClick={() => setSelectedWarranty(null)}>
                <X size={14} />
              </Button>
            </div>
            
            <div className="w-24 h-24 rounded-2xl bg-background shadow-neu-extruded mb-4 flex items-center justify-center p-3">
              <img src={`/images/assets/${activeWarrantyData.assetImage}.png`} alt={activeWarrantyData.assetName} className="w-full h-full object-contain filter drop-shadow-md" />
            </div>
            <h2 className="text-lg font-black text-foreground mb-1 text-center">{activeWarrantyData.assetId}</h2>
            <p className="text-sm text-muted-foreground font-bold text-center">{activeWarrantyData.assetName}</p>
            <p className="text-xs text-muted-foreground mt-1 text-center font-medium">SN: {activeWarrantyData.sn}</p>
          </div>

          <div className="flex border-b border-[#A3B1C6]/20 px-2 pt-2 overflow-x-auto [&::-webkit-scrollbar]:hidden shrink-0">
            {['Overview', 'Coverage', 'Documents', 'History'].map(tab => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-3 text-xs font-bold whitespace-nowrap transition-colors border-b-2 ${activeTab === tab ? 'text-accent border-accent' : 'text-muted-foreground hover:text-foreground border-transparent'}`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto p-5 relative space-y-6 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {activeTab === 'Overview' && (
              <div className="space-y-6 animate-in fade-in duration-300 pb-4">
                
                {/* Properties */}
                <div className="grid grid-cols-[130px_1fr] gap-y-3.5 text-xs">
                  <div className="text-muted-foreground font-bold flex items-center gap-2"><Shield size={14} /> Warranty ID</div>
                  <div className="text-foreground font-bold truncate">{activeWarrantyData.id}</div>
                  
                  <div className="text-muted-foreground font-bold flex items-center gap-2"><Box size={14} /> Vendor</div>
                  <div className="text-foreground font-bold truncate">{activeWarrantyData.vendor}</div>
                  
                  <div className="text-muted-foreground font-bold flex items-center gap-2"><Calendar size={14} /> Start Date</div>
                  <div className="text-foreground font-bold truncate">{activeWarrantyData.startDate}</div>
                  
                  <div className="text-muted-foreground font-bold flex items-center gap-2"><Calendar size={14} /> End Date</div>
                  <div className="text-foreground font-bold truncate">{activeWarrantyData.endDate}</div>
                  
                  <div className="text-muted-foreground font-bold flex items-center gap-2"><Clock size={14} /> Days Remaining</div>
                  <div className={`font-bold truncate ${activeWarrantyData.daysRemaining < 0 ? 'text-red-500' : 'text-green-500'}`}>
                    {activeWarrantyData.daysRemaining} Days
                  </div>
                  
                  <div className="text-muted-foreground font-bold flex items-center gap-2"><CheckCircle2 size={14} /> Status</div>
                  <div className={`font-bold truncate ${activeWarrantyData.status === 'Active' ? 'text-green-500' : activeWarrantyData.status === 'Expiring Soon' ? 'text-amber-500' : 'text-red-500'}`}>
                    {activeWarrantyData.status}
                  </div>
                  
                  <div className="text-muted-foreground font-bold flex items-center gap-2"><ShieldCheck size={14} /> Coverage Type</div>
                  <div className="text-foreground font-bold truncate">{activeWarrantyData.coverageType}</div>
                  
                  <div className="text-muted-foreground font-bold flex items-center gap-2 mt-2 pt-2 border-t border-[#A3B1C6]/20"><AlertCircle size={14} /> Contact Person</div>
                  <div className="text-foreground font-bold truncate mt-2 pt-2 border-t border-[#A3B1C6]/20">{activeWarrantyData.contactPerson}</div>
                  
                  <div className="text-muted-foreground font-bold flex items-center gap-2"><AlertCircle size={14} className="opacity-0" /> Phone</div>
                  <div className="text-foreground font-bold truncate">{activeWarrantyData.phone}</div>
                  
                  <div className="text-muted-foreground font-bold flex items-center gap-2"><AlertCircle size={14} className="opacity-0" /> Email</div>
                  <div className="text-accent font-bold truncate hover:underline cursor-pointer">{activeWarrantyData.email}</div>
                  
                  <div className="text-muted-foreground font-bold flex items-center gap-2"><AlertCircle size={14} className="opacity-0" /> Contract Number</div>
                  <div className="text-foreground font-bold truncate">{activeWarrantyData.contractNum}</div>
                </div>

                {/* Coverage Timeline */}
                <div className="bg-background shadow-neu-extruded rounded-[20px] p-4 border-neu">
                  <h3 className="font-bold text-foreground text-sm tracking-tight mb-4">Coverage Timeline</h3>
                  
                  <div className="flex justify-between text-[9px] font-bold text-muted-foreground mb-2">
                    <span>{activeWarrantyData.startDate}<br/>Start Date</span>
                    <span className="text-right">{activeWarrantyData.endDate}<br/>End Date</span>
                  </div>
                  
                  <div className="relative w-full h-2 bg-background shadow-neu-inset-deep rounded-full overflow-visible p-0.5 mt-2 mb-4">
                    {/* Background track */}
                    <div className="absolute inset-0 bg-[#A3B1C6]/20 rounded-full"></div>
                    
                    {/* Fill */}
                    <div 
                      className={`absolute top-0.5 bottom-0.5 left-0.5 rounded-full shadow-neu-extruded ${activeWarrantyData.daysRemaining < 0 ? 'bg-red-500' : 'bg-green-500'}`} 
                      style={{ 
                        width: `${Math.min(100, Math.max(0, ((activeWarrantyData.totalDays - Math.max(0, activeWarrantyData.daysRemaining)) / activeWarrantyData.totalDays) * 100))}%` 
                      }}
                    ></div>
                    
                    {/* Dots at start and end for styling */}
                    <div className={`absolute -left-1 -top-1 w-4 h-4 rounded-full border-2 border-background shadow-neu-extruded ${activeWarrantyData.daysRemaining < 0 ? 'bg-red-500' : 'bg-green-500'}`}></div>
                    <div className="absolute -right-1 -top-1 w-4 h-4 rounded-full border-2 border-background shadow-neu-extruded bg-[#A3B1C6]/40"></div>
                  </div>
                  
                  <div className="text-center">
                    <p className={`text-[10px] font-bold ${activeWarrantyData.daysRemaining < 0 ? 'text-red-500' : 'text-green-500'}`}>
                      {activeWarrantyData.daysRemaining < 0 ? `${Math.abs(activeWarrantyData.daysRemaining)} days expired` : `${activeWarrantyData.daysRemaining} days remaining`}
                    </p>
                    <p className="text-[9px] text-muted-foreground font-medium">of {activeWarrantyData.totalDays} days total</p>
                  </div>
                </div>

                {/* Warranty Status (Global summary inside panel per design) */}
                <div className="bg-background shadow-neu-extruded rounded-[20px] p-4 border-neu">
                  <h3 className="font-bold text-foreground text-sm tracking-tight mb-4">Warranty Status</h3>
                  <div className="flex items-center gap-6">
                    {/* Mock Doughnut Chart */}
                    <div className="relative w-20 h-20 shrink-0">
                      <svg viewBox="0 0 36 36" className="w-full h-full">
                        <path
                          className="text-red-500"
                          strokeDasharray="14, 100"
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          fill="none" stroke="currentColor" strokeWidth="4" strokeDashoffset="0"
                        />
                        <path
                          className="text-amber-500"
                          strokeDasharray="13, 100"
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          fill="none" stroke="currentColor" strokeWidth="4" strokeDashoffset="-14"
                        />
                        <path
                          className="text-green-500"
                          strokeDasharray="73, 100"
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          fill="none" stroke="currentColor" strokeWidth="4" strokeDashoffset="-27"
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-sm font-black text-foreground">312</span>
                        <span className="text-[7px] font-bold text-muted-foreground uppercase">Total</span>
                      </div>
                    </div>

                    <div className="flex-1 space-y-3">
                      <div className="flex justify-between items-center text-[10px]">
                        <div className="flex items-center gap-2 font-bold text-foreground">
                          <div className="w-2 h-2 rounded-sm bg-green-500"></div> Active
                        </div>
                        <div className="font-bold text-muted-foreground">228 (73%)</div>
                      </div>
                      <div className="flex justify-between items-center text-[10px]">
                        <div className="flex items-center gap-2 font-bold text-foreground">
                          <div className="w-2 h-2 rounded-sm bg-amber-500"></div> Expiring Soon
                        </div>
                        <div className="font-bold text-muted-foreground">42 (13%)</div>
                      </div>
                      <div className="flex justify-between items-center text-[10px]">
                        <div className="flex items-center gap-2 font-bold text-foreground">
                          <div className="w-2 h-2 rounded-sm bg-red-500"></div> Expired
                        </div>
                        <div className="font-bold text-muted-foreground">42 (14%)</div>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            )}

            {activeTab !== 'Overview' && (
              <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-300">
                <div className="w-16 h-16 rounded-2xl bg-background shadow-neu-inset-deep flex items-center justify-center mb-4">
                  {activeTab === 'Coverage' ? <ShieldCheck size={24} className="text-muted-foreground" /> : activeTab === 'Documents' ? <Box size={24} className="text-muted-foreground" /> : <Clock size={24} className="text-muted-foreground" />}
                </div>
                <h4 className="font-bold text-foreground mb-2">Manage {activeTab}</h4>
                <p className="text-xs text-muted-foreground mb-6">View and manage all {activeTab.toLowerCase()} associated with {activeWarrantyData.id}.</p>
                <Button className="w-full bg-background shadow-neu-extruded text-accent hover:shadow-neu-hover active:shadow-neu-inset-small rounded-2xl font-bold transition-all">
                  Open {activeTab} Details
                </Button>
              </div>
            )}
          </div>

          <div className="p-5 border-t border-[#A3B1C6]/20 shrink-0">
            <Button className="w-full h-12 bg-accent hover:bg-accent/90 text-white shadow-neu-extruded hover:shadow-neu-hover active:shadow-neu-inset-small rounded-2xl font-bold text-sm transition-all border-none gap-2">
              <Eye size={16} />
              View Asset Details
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
