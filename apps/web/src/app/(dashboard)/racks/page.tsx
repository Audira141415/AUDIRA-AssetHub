"use client"

import { useState, useMemo, useEffect, useRef } from "react"
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
  Server,
  Box,
  CheckCircle2,
  Layout,
  Maximize2,
  ChevronLeft,
  ArrowUp,
  ArrowDown,
  Trash2,
  Copy,
  SearchX,
  MapPin,
  Calendar,
  Info,
  Thermometer,
  ShieldAlert,
  Zap
} from "lucide-react"

import { mockRacks, baseAssets } from "@/lib/mock-data"

// Types
type Rack = {
  id: string
  name: string
  desc: string
  code: string
  type: string
  height: string
  uPosition: string
  assets: number
  utilization: number
  usedU: number
  availableU: number
  power: number
  maxPower: number
  status: string
}

export default function RacksPage() {
  const initialRacks: Rack[] = mockRacks;

  const [racks, setRacks] = useState<Rack[]>(initialRacks)
  const [selectedRack, setSelectedRack] = useState<string | null>("RACK-01")
  
  // Feature States
  const [viewMode, setViewMode] = useState<"list" | "grid">("list")
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("All Status")
  const [typeFilter, setTypeFilter] = useState("All Rack Type")
  const [sortConfig, setSortConfig] = useState<{key: keyof Rack, direction: 'asc'|'desc'} | null>(null)
  
  // Interactive Panel States
  const [activeTab, setActiveTab] = useState("Overview")
  const [openMenuId, setOpenMenuId] = useState<string | null>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpenMenuId(null)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Derived Data (Filtering & Sorting)
  const filteredAndSortedRacks = useMemo(() => {
    let result = [...racks]
    
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      result = result.filter(r => 
        r.name.toLowerCase().includes(q) || 
        r.code.toLowerCase().includes(q) ||
        r.desc.toLowerCase().includes(q)
      )
    }
    if (statusFilter !== "All Status") result = result.filter(r => r.status === statusFilter)
    if (typeFilter !== "All Rack Type") result = result.filter(r => r.type === typeFilter)

    if (sortConfig) {
      result.sort((a, b) => {
        const aValue = a[sortConfig.key]
        const bValue = b[sortConfig.key]
        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1
        return 0
      })
    }
    return result
  }, [racks, searchQuery, statusFilter, typeFilter, sortConfig])

  // Helpers
  const handleSort = (key: keyof Rack) => {
    let direction: 'asc' | 'desc' = 'asc'
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc'
    }
    setSortConfig({ key, direction })
  }

  const getSortIcon = (key: keyof Rack) => {
    if (sortConfig?.key !== key) return <ChevronRight size={14} className="rotate-90 inline opacity-30 group-hover:opacity-100 transition-opacity" />
    return sortConfig.direction === 'asc' 
      ? <ArrowUp size={14} className="inline text-accent" />
      : <ArrowDown size={14} className="inline text-accent" />
  }

  const getBadgeColor = (type: string, value: string) => {
    if (type === "status") {
      if (value === "Active") return "text-green-500 shadow-neu-inset-small bg-background"
      if (value === "Warning" || value === "Maintenance") return "text-amber-500 shadow-neu-inset-small bg-background"
      if (value === "Available") return "text-blue-500 shadow-neu-inset-small bg-background"
      return "text-red-500 shadow-neu-inset-small bg-background"
    }
    if (type === "type") {
      if (value === "Server Rack") return "text-blue-500 shadow-neu-inset-small bg-background"
      if (value === "Network Rack") return "text-purple-500 shadow-neu-inset-small bg-background"
      if (value === "Storage Rack") return "text-emerald-500 shadow-neu-inset-small bg-background"
      if (value === "Power Rack") return "text-orange-500 shadow-neu-inset-small bg-background"
      if (value === "Spare Rack") return "text-gray-500 shadow-neu-inset-small bg-background"
      return "text-gray-500 shadow-neu-inset-small bg-background"
    }
    return "text-gray-500 shadow-neu-inset-small bg-background"
  }

  const activeRackData = racks.find(r => r.name === selectedRack)

  // Dynamic Options for Selects
  const uniqueStatuses = ["All Status", ...Array.from(new Set(racks.map(r => r.status)))]
  const uniqueTypes = ["All Rack Type", ...Array.from(new Set(racks.map(r => r.type)))]

  return (
    <div className="flex w-full gap-6 pb-6 h-full">
      <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${selectedRack ? 'pr-0' : ''}`}>
        
        {/* Breadcrumb & Header */}
        <div className="flex flex-col xl:flex-row xl:items-start justify-between mb-6 gap-4">
          <div>
            <div className="flex flex-wrap items-center text-xs text-muted-foreground mb-2 font-medium">
              <MapPin size={12} className="mr-1" />
              <span>Location</span>
              <ChevronRight size={12} className="mx-1" />
              <span>Buildings</span>
              <ChevronRight size={12} className="mx-1" />
              <span>Building A</span>
              <ChevronRight size={12} className="mx-1" />
              <span>Floors</span>
              <ChevronRight size={12} className="mx-1" />
              <span>Floor 1</span>
              <ChevronRight size={12} className="mx-1" />
              <span>Rooms</span>
              <ChevronRight size={12} className="mx-1" />
              <span>Server Room A</span>
              <ChevronRight size={12} className="mx-1" />
              <span className="text-foreground font-bold">Racks</span>
            </div>
            <h1 className="text-3xl font-bold text-foreground tracking-tight mb-1">Racks</h1>
            <p className="text-sm text-muted-foreground font-medium">Manage all racks in Server Room A, Floor 1, Building A</p>
          </div>
          <div className="flex gap-4 flex-wrap">
            <Button variant="ghost" className="bg-background shadow-neu-extruded text-foreground hover:text-accent hover:shadow-neu-hover active:shadow-neu-inset-small rounded-2xl flex items-center gap-2 h-12 px-6 transition-all font-bold whitespace-nowrap">
              <Upload size={18} />
              Import Racks
              <ChevronRight size={16} className="ml-1 rotate-90" />
            </Button>
            <Button className="bg-accent hover:bg-accent/90 text-white shadow-neu-extruded hover:shadow-neu-hover active:shadow-neu-inset-small rounded-2xl flex items-center gap-2 h-12 px-6 transition-all font-bold border-none whitespace-nowrap">
              <Plus size={18} />
              Add Rack
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-4 mb-6">
          <div className="bg-background shadow-neu-extruded border-neu rounded-[20px] p-4 flex items-center gap-3 min-w-0">
            <div className="w-12 h-12 rounded-2xl bg-background shadow-neu-inset-small flex items-center justify-center shrink-0">
              <Server className="text-accent" size={20} />
            </div>
            <div className="min-w-0 overflow-hidden">
              <p className="text-[10px] font-bold text-muted-foreground mb-0.5 uppercase tracking-wider truncate">Total Racks</p>
              <div className="flex items-baseline gap-1 truncate">
                <span className="text-2xl font-black text-foreground">{racks.length}</span>
              </div>
              <p className="text-[9px] font-medium text-muted-foreground mt-0.5 truncate">All racks in room</p>
            </div>
          </div>
          <div className="bg-background shadow-neu-extruded border-neu rounded-[20px] p-4 flex items-center gap-3 min-w-0">
            <div className="w-12 h-12 rounded-2xl bg-background shadow-neu-inset-small flex items-center justify-center shrink-0">
              <CheckCircle2 className="text-green-500" size={20} />
            </div>
            <div className="min-w-0 overflow-hidden">
              <p className="text-[10px] font-bold text-muted-foreground mb-0.5 uppercase tracking-wider truncate">Active Racks</p>
              <div className="flex items-baseline gap-1 truncate">
                <span className="text-2xl font-black text-foreground">{racks.filter(r => r.status === 'Active').length}</span>
              </div>
              <p className="text-[9px] font-medium text-muted-foreground mt-0.5 truncate">Currently active</p>
            </div>
          </div>
          <div className="bg-background shadow-neu-extruded border-neu rounded-[20px] p-4 flex items-center gap-3 min-w-0">
            <div className="w-12 h-12 rounded-2xl bg-background shadow-neu-inset-small flex items-center justify-center shrink-0">
              <Box className="text-purple-500" size={20} />
            </div>
            <div className="min-w-0 overflow-hidden">
              <p className="text-[10px] font-bold text-muted-foreground mb-0.5 uppercase tracking-wider truncate">Total Assets</p>
              <div className="flex items-baseline gap-1 truncate">
                <span className="text-2xl font-black text-foreground">{racks.reduce((acc, curr) => acc + curr.assets, 0)}</span>
              </div>
              <p className="text-[9px] font-medium text-muted-foreground mt-0.5 truncate">Across all racks</p>
            </div>
          </div>
          <div className="bg-background shadow-neu-extruded border-neu rounded-[20px] p-4 flex items-center gap-3 min-w-0">
            <div className="w-12 h-12 rounded-2xl bg-background shadow-neu-inset-small flex items-center justify-center shrink-0">
              <Layout className="text-orange-500" size={20} />
            </div>
            <div className="min-w-0 overflow-hidden">
              <p className="text-[10px] font-bold text-muted-foreground mb-0.5 uppercase tracking-wider truncate">Rack Utilization</p>
              <div className="flex items-baseline gap-1 truncate">
                <span className="text-2xl font-black text-foreground">
                  {Math.round(racks.reduce((acc, curr) => acc + curr.utilization, 0) / racks.length)}%
                </span>
              </div>
              <p className="text-[9px] font-medium text-muted-foreground mt-0.5 truncate">Average utilization</p>
            </div>
          </div>
          <div className="bg-background shadow-neu-extruded border-neu rounded-[20px] p-4 flex items-center gap-3 min-w-0">
            <div className="w-12 h-12 rounded-2xl bg-background shadow-neu-inset-small flex items-center justify-center shrink-0">
              <Maximize2 className="text-cyan-500" size={20} />
            </div>
            <div className="min-w-0 overflow-hidden">
              <p className="text-[10px] font-bold text-muted-foreground mb-0.5 uppercase tracking-wider truncate">Available Space</p>
              <div className="flex items-baseline gap-1 truncate">
                <span className="text-2xl font-black text-foreground">{racks.reduce((acc, curr) => acc + curr.availableU, 0)}U</span>
              </div>
              <p className="text-[9px] font-medium text-muted-foreground mt-0.5 truncate">Total available U</p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-4 mb-6">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input 
              placeholder="Search racks..." 
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
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="h-12 px-4 bg-background shadow-neu-extruded border-neu rounded-2xl text-sm font-bold text-foreground outline-none appearance-none pr-10 relative bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%236B7280%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-[length:16px_16px] bg-[right_16px_center] bg-no-repeat min-w-[140px] cursor-pointer hover:shadow-neu-hover transition-all"
          >
            {uniqueTypes.map(type => <option key={type} value={type}>{type}</option>)}
          </select>

          <Button 
            variant="ghost" 
            onClick={() => {
              setSearchQuery("")
              setStatusFilter("All Status")
              setTypeFilter("All Rack Type")
              setSortConfig(null)
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
          {filteredAndSortedRacks.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center bg-background shadow-neu-extruded border-neu rounded-[32px] mb-2 p-12 text-center">
              <div className="w-24 h-24 rounded-full bg-background shadow-neu-inset-deep flex items-center justify-center mb-6">
                <SearchX size={40} className="text-muted-foreground opacity-50" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-2">No racks found</h3>
              <p className="text-muted-foreground max-w-sm">We couldn't find any racks matching your current filters. Try adjusting your search query or clear the filters.</p>
              <Button 
                onClick={() => {
                  setSearchQuery("")
                  setStatusFilter("All Status")
                  setTypeFilter("All Rack Type")
                }}
                className="mt-8 bg-accent text-white shadow-neu-extruded hover:shadow-neu-hover active:shadow-neu-inset-small rounded-2xl px-8 h-12 font-bold border-none"
              >
                Clear all filters
              </Button>
            </div>
          ) : viewMode === "list" ? (
            /* Table View */
            <div className="flex flex-col gap-4 mb-2">
              <div className="bg-background shadow-neu-extruded border-neu rounded-[32px] flex flex-col overflow-hidden">
                <div className="overflow-x-auto w-full">
                  <table className="w-full text-sm text-left min-w-[900px]">
                    <thead className="text-xs text-muted-foreground uppercase bg-background shadow-neu-inset-small sticky top-0 z-10">
                      <tr>
                        <th className="px-5 py-4 font-bold whitespace-nowrap group" onClick={() => handleSort('name')}>
                          <div className="flex items-center gap-1 cursor-pointer hover:text-foreground tracking-wider">
                            Rack Name {getSortIcon('name')}
                          </div>
                        </th>
                        <th className="px-5 py-4 font-bold whitespace-nowrap group" onClick={() => handleSort('code')}>
                          <div className="flex items-center gap-1 cursor-pointer hover:text-foreground tracking-wider">
                            Code {getSortIcon('code')}
                          </div>
                        </th>
                        <th className="px-5 py-4 font-bold whitespace-nowrap group" onClick={() => handleSort('type')}>
                          <div className="flex items-center gap-1 cursor-pointer hover:text-foreground tracking-wider">
                            Rack Type {getSortIcon('type')}
                          </div>
                        </th>
                        <th className="px-5 py-4 font-bold whitespace-nowrap group" onClick={() => handleSort('height')}>
                          <div className="flex items-center gap-1 cursor-pointer hover:text-foreground tracking-wider">
                            Height {getSortIcon('height')}
                          </div>
                        </th>
                        <th className="px-5 py-4 font-bold whitespace-nowrap group" onClick={() => handleSort('uPosition')}>
                          <div className="flex items-center gap-1 cursor-pointer hover:text-foreground tracking-wider">
                            U Position {getSortIcon('uPosition')}
                          </div>
                        </th>
                        <th className="px-5 py-4 font-bold whitespace-nowrap group" onClick={() => handleSort('assets')}>
                          <div className="flex items-center justify-end gap-1 cursor-pointer hover:text-foreground tracking-wider">
                            Assets {getSortIcon('assets')}
                          </div>
                        </th>
                        <th className="px-5 py-4 font-bold whitespace-nowrap group" onClick={() => handleSort('utilization')}>
                          <div className="flex items-center gap-1 cursor-pointer hover:text-foreground tracking-wider">
                            Utilization {getSortIcon('utilization')}
                          </div>
                        </th>
                        <th className="px-5 py-4 font-bold whitespace-nowrap group" onClick={() => handleSort('power')}>
                          <div className="flex items-center justify-end gap-1 cursor-pointer hover:text-foreground tracking-wider">
                            Power (kW) {getSortIcon('power')}
                          </div>
                        </th>
                        <th className="px-5 py-4 font-bold whitespace-nowrap group" onClick={() => handleSort('status')}>
                          <div className="flex items-center gap-1 cursor-pointer hover:text-foreground tracking-wider">
                            Status {getSortIcon('status')}
                          </div>
                        </th>
                        <th className="px-5 py-4 font-bold whitespace-nowrap text-right tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredAndSortedRacks.map((rack) => (
                        <tr 
                          key={rack.id} 
                          className={`border-b border-[#A3B1C6]/20 cursor-pointer transition-all duration-300 ${selectedRack === rack.name ? 'shadow-neu-inset-small bg-background text-accent' : 'hover:shadow-neu-inset-small'}`}
                          onClick={() => setSelectedRack(rack.name)}
                        >
                          <td className="px-5 py-4 flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-background shadow-neu-extruded overflow-hidden p-1.5 shrink-0">
                              <img src={`/images/assets/${rack.type === 'Network Rack' ? 'network_rack' : 'rack'}.png`} alt={rack.name} className="w-full h-full object-contain" />
                            </div>
                            <div className="min-w-0">
                              <p className={`font-bold text-sm whitespace-nowrap truncate ${selectedRack === rack.name ? 'text-accent' : 'text-foreground'}`}>{rack.name}</p>
                              <p className="text-[11px] text-muted-foreground font-medium mt-0.5 whitespace-nowrap truncate">{rack.desc}</p>
                            </div>
                          </td>
                          <td className="px-5 py-4 font-bold text-foreground whitespace-nowrap">{rack.code}</td>
                          <td className="px-5 py-4 whitespace-nowrap">
                            <span className={`px-2.5 py-1 text-[10px] rounded-lg font-bold ${getBadgeColor('type', rack.type)}`}>
                              {rack.type}
                            </span>
                          </td>
                          <td className="px-5 py-4 font-bold text-foreground whitespace-nowrap">{rack.height}</td>
                          <td className="px-5 py-4 font-bold text-foreground whitespace-nowrap">{rack.uPosition}</td>
                          <td className="px-5 py-4 font-bold text-foreground text-right whitespace-nowrap">{rack.assets}</td>
                          <td className="px-5 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-foreground w-10">{rack.utilization}%</span>
                              <div className="w-16 h-1.5 bg-background shadow-neu-inset-deep rounded-full overflow-hidden">
                                <div className={`h-full rounded-full ${rack.utilization > 80 ? 'bg-red-500' : rack.utilization > 60 ? 'bg-amber-500' : 'bg-accent'}`} style={{ width: `${rack.utilization}%` }}></div>
                              </div>
                            </div>
                          </td>
                          <td className="px-5 py-4 font-bold text-foreground text-right whitespace-nowrap">{rack.power} kW</td>
                          <td className="px-5 py-4 whitespace-nowrap">
                            <span className={`px-2.5 py-1 text-[10px] rounded-lg font-bold ${getBadgeColor('status', rack.status)}`}>
                              {rack.status}
                            </span>
                          </td>
                          <td className="px-5 py-4 text-right whitespace-nowrap relative">
                            <div className="flex items-center justify-end gap-2">
                              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg shadow-neu-extruded text-muted-foreground hover:text-accent hover:shadow-neu-hover active:shadow-neu-inset-small transition-all">
                                <Eye size={14} />
                              </Button>
                              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg shadow-neu-extruded text-muted-foreground hover:text-accent hover:shadow-neu-hover active:shadow-neu-inset-small transition-all">
                                <Edit2 size={14} />
                              </Button>
                              <div className="relative" ref={openMenuId === rack.id ? menuRef : null}>
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setOpenMenuId(openMenuId === rack.id ? null : rack.id);
                                  }}
                                  className={`h-8 w-8 rounded-lg shadow-neu-extruded transition-all ${openMenuId === rack.id ? 'text-accent shadow-neu-inset-small' : 'text-muted-foreground hover:text-accent hover:shadow-neu-hover active:shadow-neu-inset-small'}`}
                                >
                                  <MoreVertical size={14} />
                                </Button>
                                {openMenuId === rack.id && (
                                  <div className="absolute right-0 top-10 w-40 bg-background shadow-neu-extruded border-neu rounded-2xl z-50 py-2 animate-in fade-in zoom-in-95 duration-200">
                                    <button className="w-full text-left px-4 py-2 text-sm font-bold text-foreground hover:text-accent hover:bg-background/50 hover:shadow-neu-inset-small transition-all flex items-center gap-2">
                                      <Eye size={14} /> View Details
                                    </button>
                                    <button className="w-full text-left px-4 py-2 text-sm font-bold text-foreground hover:text-accent hover:bg-background/50 hover:shadow-neu-inset-small transition-all flex items-center gap-2">
                                      <Copy size={14} /> Duplicate
                                    </button>
                                    <div className="h-px w-full bg-[#A3B1C6]/20 my-1"></div>
                                    <button className="w-full text-left px-4 py-2 text-sm font-bold text-red-500 hover:bg-background/50 hover:shadow-neu-inset-small transition-all flex items-center gap-2">
                                      <Trash2 size={14} /> Delete
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              
              <div className="bg-background shadow-neu-extruded rounded-[24px] p-4 flex flex-wrap gap-4 items-center justify-between text-sm text-muted-foreground font-medium shrink-0">
                <div>Showing 1 to {filteredAndSortedRacks.length} of {racks.length} racks</div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl shadow-neu-extruded text-muted-foreground opacity-50 cursor-not-allowed">
                      <ChevronLeft size={16} />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl shadow-neu-extruded bg-accent text-white hover:bg-accent/90 hover:text-white font-bold">
                      1
                    </Button>
                    <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl shadow-neu-extruded text-muted-foreground opacity-50 cursor-not-allowed">
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
            /* Grid View */
            <div className="flex-1 overflow-y-auto mb-2 pr-2">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-6">
                {filteredAndSortedRacks.map(rack => (
                  <div 
                    key={rack.id}
                    className={`bg-background shadow-neu-extruded border-neu rounded-[32px] overflow-hidden flex flex-col cursor-pointer transition-all hover:shadow-neu-hover ${selectedRack === rack.name ? 'ring-2 ring-accent ring-offset-4 ring-offset-background' : ''}`}
                    onClick={() => setSelectedRack(rack.name)}
                  >
                    <div className="h-40 w-full relative p-6 bg-background shadow-neu-inset-deep rounded-b-[32px] flex items-center justify-center">
                      <img src={`/images/assets/${rack.type === 'Network Rack' ? 'network_rack' : 'rack'}.png`} alt={rack.name} className="h-full object-contain filter drop-shadow-md" />
                      <span className={`absolute top-5 right-5 px-3 py-1 text-[10px] rounded-lg font-bold shadow-neu-extruded bg-background ${rack.status === 'Active' ? 'text-green-500' : rack.status === 'Warning' ? 'text-amber-500' : 'text-red-500'}`}>
                        {rack.status}
                      </span>
                    </div>
                    <div className="p-6 flex-1 flex flex-col">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="text-xl font-bold text-foreground truncate">{rack.name}</h3>
                          <p className="text-sm text-muted-foreground font-medium truncate">{rack.desc}</p>
                        </div>
                        <div className="relative" ref={openMenuId === rack.id ? menuRef : null}>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={(e) => {
                              e.stopPropagation();
                              setOpenMenuId(openMenuId === rack.id ? null : rack.id);
                            }}
                            className={`h-8 w-8 rounded-lg shadow-neu-extruded transition-all ${openMenuId === rack.id ? 'text-accent shadow-neu-inset-small' : 'text-muted-foreground hover:text-accent hover:shadow-neu-hover active:shadow-neu-inset-small'}`}
                          >
                            <MoreVertical size={14} />
                          </Button>
                        </div>
                      </div>

                      <div className="flex gap-2 mb-6 flex-wrap">
                        <span className={`px-2.5 py-1 text-[10px] rounded-lg font-bold ${getBadgeColor('type', rack.type)}`}>{rack.type}</span>
                        <span className={`px-2.5 py-1 text-[10px] rounded-lg font-bold shadow-neu-extruded bg-background text-muted-foreground`}>{rack.height}</span>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-6 mt-auto">
                        <div className="bg-background shadow-neu-inset-small rounded-2xl p-3 text-center">
                          <p className="text-xs font-bold text-muted-foreground mb-1">Assets</p>
                          <p className="text-xl font-black text-foreground">{rack.assets}</p>
                        </div>
                        <div className="bg-background shadow-neu-inset-small rounded-2xl p-3 text-center">
                          <p className="text-xs font-bold text-muted-foreground mb-1">Utilization</p>
                          <p className="text-xl font-black text-foreground">{rack.utilization}%</p>
                        </div>
                      </div>

                      <Button className="w-full h-12 bg-background shadow-neu-extruded hover:text-accent text-foreground hover:shadow-neu-hover active:shadow-neu-inset-small rounded-2xl font-bold transition-all">
                        View Rack Details
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right Side Panel */}
      {selectedRack && activeRackData && (
        <div className="w-[360px] bg-background shadow-neu-extruded border-neu rounded-[32px] flex flex-col h-full overflow-hidden shrink-0 transition-all mb-2 animate-in slide-in-from-right-8 duration-300">
          <div className="relative h-48 w-full p-4 shrink-0 flex items-center justify-center bg-background shadow-neu-inset-deep">
            <img src={`/images/assets/${activeRackData.type === 'Network Rack' ? 'network_rack' : 'rack'}.png`} alt={activeRackData.name} className="h-full object-contain drop-shadow-lg transition-transform hover:scale-105 duration-300" />
            <div className="absolute top-4 left-4">
              <div className="w-8 h-8 rounded-xl bg-background shadow-neu-extruded flex items-center justify-center">
                <Server size={14} className="text-accent" />
              </div>
            </div>
            <div className="absolute top-4 right-4 flex gap-2">
              <span className={`px-2.5 py-1 text-[10px] rounded-lg font-bold shadow-neu-extruded bg-background ${activeRackData.status === 'Active' ? 'text-green-500' : 'text-amber-500'}`}>
                {activeRackData.status}
              </span>
              <Button variant="ghost" size="icon" className="h-7 w-7 rounded-full shadow-neu-extruded bg-background text-foreground hover:text-red-500 hover:shadow-neu-hover active:shadow-neu-inset-small" onClick={() => setSelectedRack(null)}>
                <X size={14} />
              </Button>
            </div>
            <div className="absolute bottom-4 left-5 right-5 bg-background/80 backdrop-blur-md shadow-neu-extruded p-3 rounded-2xl">
              <h2 className="text-lg font-black text-foreground mb-0.5 truncate">{activeRackData.name}</h2>
              <p className="text-xs text-muted-foreground font-bold truncate">{activeRackData.desc}</p>
              <p className="text-[10px] text-muted-foreground mt-1 truncate">Server Room A • Floor 1 • Building A • {activeRackData.height} Rack</p>
            </div>
          </div>

          <div className="flex border-b border-[#A3B1C6]/20 px-2 pt-2 overflow-x-auto [&::-webkit-scrollbar]:hidden shrink-0">
            {['Overview', `Assets (${activeRackData.assets})`, 'Power', 'History'].map(tab => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-3 text-xs font-bold whitespace-nowrap transition-colors border-b-2 ${activeTab === tab ? 'text-accent border-accent' : 'text-muted-foreground hover:text-foreground border-transparent'}`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto p-5 relative">
            {activeTab === 'Overview' && (
              <div className="space-y-6 animate-in fade-in duration-300 pb-8">
                {/* Text properties */}
                <div className="grid grid-cols-[130px_1fr] gap-y-4 text-xs">
                  <div className="text-muted-foreground font-bold flex items-center gap-2"><Layout size={14} /> Rack Code</div>
                  <div className="text-foreground font-bold truncate">{activeRackData.code}</div>
                  
                  <div className="text-muted-foreground font-bold flex items-center gap-2"><Server size={14} /> Rack Type</div>
                  <div><span className={`px-2 py-0.5 text-[9px] rounded-lg ${getBadgeColor('type', activeRackData.type)} font-bold`}>{activeRackData.type}</span></div>
                  
                  <div className="text-muted-foreground font-bold flex items-center gap-2"><Maximize2 size={14} /> Height</div>
                  <div className="text-foreground font-bold truncate">{activeRackData.height}</div>
                  
                  <div className="text-muted-foreground font-bold flex items-center gap-2"><ArrowUp size={14} /> U Position</div>
                  <div className="text-foreground font-bold truncate">{activeRackData.uPosition}</div>
                  
                  <div className="text-muted-foreground font-bold flex items-center gap-2"><Box size={14} /> Total Assets</div>
                  <div className="text-foreground font-bold truncate">{activeRackData.assets}</div>
                  
                  <div className="text-muted-foreground font-bold flex items-center gap-2"><LayoutGrid size={14} /> Utilization</div>
                  <div className="text-foreground font-bold truncate">{activeRackData.utilization}% ({activeRackData.usedU}U / {activeRackData.height})</div>
                  
                  <div className="text-muted-foreground font-bold flex items-center gap-2"><Zap size={14} /> Power Usage</div>
                  <div className="text-foreground font-bold truncate">{activeRackData.power} kW / {activeRackData.maxPower} kW</div>
                  
                  <div className="text-muted-foreground font-bold flex items-center gap-2"><CheckCircle2 size={14} /> Status</div>
                  <div><span className={`px-2 py-0.5 text-[9px] rounded-lg ${getBadgeColor('status', activeRackData.status)} font-bold`}>{activeRackData.status}</span></div>
                  
                  <div className="text-muted-foreground font-bold flex items-center gap-2"><Calendar size={14} /> Installed Date</div>
                  <div className="text-foreground font-bold truncate">10 Jan 2023</div>

                  <div className="text-muted-foreground font-bold flex items-start gap-2 pt-1"><Info size={14} className="mt-0.5" /> Description</div>
                  <div className="text-foreground font-medium text-[10px] leading-relaxed">Primary server rack for critical applications. Ensures high availability.</div>
                </div>

                {/* Sub-panels: Rack Utilization and Rack Elevation side-by-side */}
                <div className="grid grid-cols-2 gap-4 mt-6">
                  {/* Rack Utilization Panel */}
                  <div className="bg-background shadow-neu-extruded rounded-[20px] p-4 border-neu">
                    <h3 className="font-bold text-foreground text-sm tracking-tight mb-4">Rack Utilization</h3>
                    
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-[10px] mb-1.5">
                          <span className="text-muted-foreground font-bold">Used</span>
                          <span className="text-accent font-black cursor-pointer hover:underline flex items-center gap-1">View {activeRackData.usedU}U</span>
                        </div>
                        <div className="h-2 w-full bg-background shadow-neu-inset-deep rounded-full overflow-hidden p-0.5">
                          <div className="h-full bg-accent rounded-full shadow-neu-extruded" style={{ width: `${(activeRackData.usedU / parseInt(activeRackData.height)) * 100}%` }}></div>
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-[10px] mb-1.5">
                          <span className="text-muted-foreground font-bold">Available</span>
                          <span className="text-foreground font-black">{activeRackData.availableU}U</span>
                        </div>
                        <div className="h-2 w-full bg-background shadow-neu-inset-deep rounded-full overflow-hidden p-0.5">
                          <div className="h-full bg-[#A3B1C6]/50 rounded-full" style={{ width: `${(activeRackData.availableU / parseInt(activeRackData.height)) * 100}%` }}></div>
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-[10px] mb-1.5">
                          <span className="text-muted-foreground font-bold">Utilization</span>
                          <span className="text-green-500 font-black">{activeRackData.utilization}%</span>
                        </div>
                        <div className="h-2 w-full bg-background shadow-neu-inset-deep rounded-full overflow-hidden p-0.5">
                          <div className="h-full bg-green-500 rounded-full shadow-neu-extruded" style={{ width: `${activeRackData.utilization}%` }}></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Rack Elevation Panel */}
                  <div className="bg-background shadow-neu-extruded rounded-[20px] p-4 border-neu flex flex-col">
                    <h3 className="font-bold text-foreground text-sm tracking-tight mb-4">Rack Elevation</h3>
                    
                    <div className="flex-1 flex justify-center items-center py-2 relative">
                      <div className="flex gap-2 items-center h-full">
                        {/* 42U Label Top */}
                        <span className="text-[9px] font-bold text-muted-foreground absolute top-0 left-2">42U</span>
                        
                        {/* Miniature Rack Graphic */}
                        <div className="w-14 h-32 bg-[#e0e5ec] shadow-neu-inset-deep rounded border border-white/50 p-1 flex flex-col gap-0.5 relative z-10">
                           {/* Render little blocks for rack units. Just a visual abstraction */}
                           {Array.from({ length: 14 }).map((_, i) => {
                             // Simplified: top slots are usually available, bottom/middle are used.
                             const isUsed = i > 3; // just mock visually
                             return (
                               <div 
                                 key={i} 
                                 className={`flex-1 w-full rounded-sm ${isUsed ? 'bg-accent/80 border border-accent/20' : 'bg-background/40 border border-[#A3B1C6]/30'}`}
                               ></div>
                             )
                           })}
                        </div>

                        {/* Labels Right side */}
                        <div className="flex flex-col justify-between h-full text-[8px] font-bold text-muted-foreground absolute right-2 py-1">
                           <span>42</span>
                           <span>40</span>
                           <span>30</span>
                           <span>20</span>
                           <span>10</span>
                           <span>1</span>
                        </div>
                      </div>
                    </div>

                    {/* Legend */}
                    <div className="flex justify-center gap-3 mt-auto pt-2 text-[9px] font-bold text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 rounded-sm bg-accent"></div> Used
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 rounded-sm bg-[#A3B1C6]/30 border border-[#A3B1C6]/50"></div> Available
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab.startsWith('Assets') && (
              <div className="space-y-3 animate-in fade-in duration-300">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-foreground text-sm tracking-tight">Recent Assets</h3>
                  <Button variant="ghost" size="sm" className="h-6 text-[10px] font-bold text-accent px-2">View All</Button>
                </div>
                {baseAssets.slice(0, 6).map(asset => (
                  <div key={asset.id} className="bg-background shadow-neu-extruded rounded-[16px] p-3 flex items-center gap-3 cursor-pointer hover:shadow-neu-hover transition-all">
                    <div className="w-8 h-8 rounded-lg shadow-neu-inset-small flex items-center justify-center shrink-0">
                      <Server size={14} className="text-accent" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="font-bold text-foreground text-xs truncate">{asset.tag}</h4>
                      <p className="text-[10px] text-muted-foreground font-medium mt-0.5 truncate">{asset.cat} • {asset.vendor}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {['Power', 'History'].includes(activeTab) && (
              <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-300">
                <div className="w-16 h-16 rounded-2xl bg-background shadow-neu-inset-deep flex items-center justify-center mb-4">
                  {activeTab === 'Power' ? <Zap size={24} className="text-muted-foreground" /> : <Calendar size={24} className="text-muted-foreground" />}
                </div>
                <h4 className="font-bold text-foreground mb-2">Manage {activeTab}</h4>
                <p className="text-xs text-muted-foreground mb-6">View and manage all {activeTab.toLowerCase()} associated with {activeRackData.name}.</p>
                <Button className="w-full bg-background shadow-neu-extruded text-accent hover:shadow-neu-hover active:shadow-neu-inset-small rounded-2xl font-bold transition-all">
                  Open {activeTab} Details
                </Button>
              </div>
            )}
          </div>

          <div className="p-5 border-t border-[#A3B1C6]/20 shrink-0">
            <Button className="w-full h-12 bg-accent hover:bg-accent/90 text-white shadow-neu-extruded hover:shadow-neu-hover active:shadow-neu-inset-small rounded-2xl font-bold text-sm transition-all border-none">
              View Rack Elevation Details
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
