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
  ArrowRightLeft,
  CalendarDays,
  Clock,
  CheckCircle2,
  XCircle,
  MapPin,
  Calendar,
  ChevronLeft
} from "lucide-react"

import { mockMovements } from "@/lib/mock-data"

// Types
type Movement = typeof mockMovements[0]

export default function MovementsPage() {
  const [movements, setMovements] = useState<Movement[]>(mockMovements)
  
  // Feature States
  const [viewMode, setViewMode] = useState<"list" | "grid">("list")
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("All Status")
  const [typeFilter, setTypeFilter] = useState("All Movement Type")
  
  // Side Panel state
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(true)

  // Derived Data (Filtering)
  const filteredMovements = useMemo(() => {
    let result = [...movements]
    
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      result = result.filter(m => 
        m.id.toLowerCase().includes(q) || 
        m.assetName.toLowerCase().includes(q) ||
        m.assetId.toLowerCase().includes(q) ||
        m.user.toLowerCase().includes(q)
      )
    }
    if (statusFilter !== "All Status") result = result.filter(m => m.status === statusFilter)
    if (typeFilter !== "All Movement Type") result = result.filter(m => m.type === typeFilter)

    return result
  }, [movements, searchQuery, statusFilter, typeFilter])

  // Helpers
  const getBadgeColor = (type: string, value: string) => {
    if (type === "status") {
      if (value === "Completed") return "text-green-500 shadow-neu-inset-small bg-background"
      if (value === "Scheduled") return "text-blue-500 shadow-neu-inset-small bg-background"
      if (value === "Cancelled") return "text-red-500 shadow-neu-inset-small bg-background"
      return "text-gray-500 shadow-neu-inset-small bg-background"
    }
    if (type === "type") {
      if (value === "Move") return "text-blue-500 bg-background shadow-neu-inset-small"
      if (value === "Transfer") return "text-purple-500 bg-background shadow-neu-inset-small"
      if (value === "Relocate") return "text-orange-500 bg-background shadow-neu-inset-small"
      if (value === "Install") return "text-green-500 bg-background shadow-neu-inset-small"
      if (value === "Remove") return "text-red-500 bg-background shadow-neu-inset-small"
      return "text-gray-500 bg-background shadow-neu-inset-small"
    }
    return "text-gray-500 bg-background shadow-neu-inset-small"
  }

  // Dynamic Options for Selects
  const uniqueStatuses = ["All Status", ...Array.from(new Set(movements.map(m => m.status)))]
  const uniqueTypes = ["All Movement Type", ...Array.from(new Set(movements.map(m => m.type)))]

  return (
    <div className="flex w-full gap-6 pb-6 h-full">
      <div className="flex-1 flex flex-col min-w-0 transition-all duration-300">
        
        {/* Breadcrumb & Header */}
        <div className="flex flex-col xl:flex-row xl:items-start justify-between mb-6 gap-4">
          <div>
            <div className="flex flex-wrap items-center text-xs text-muted-foreground mb-2 font-medium">
              <MapPin size={12} className="mr-1" />
              <span>Operations</span>
              <ChevronRight size={12} className="mx-1" />
              <span className="text-foreground font-bold">Asset Movements</span>
            </div>
            <h1 className="text-3xl font-bold text-foreground tracking-tight mb-1">Asset Movements</h1>
            <p className="text-sm text-muted-foreground font-medium">Track and manage all asset relocation and movement activities</p>
          </div>
          <div className="flex gap-4 flex-wrap">
            <Button variant="ghost" className="bg-background shadow-neu-extruded text-foreground hover:text-accent hover:shadow-neu-hover active:shadow-neu-inset-small rounded-2xl flex items-center gap-2 h-12 px-6 transition-all font-bold whitespace-nowrap">
              <Upload size={18} />
              Export
            </Button>
            <Button className="bg-accent hover:bg-accent/90 text-white shadow-neu-extruded hover:shadow-neu-hover active:shadow-neu-inset-small rounded-2xl flex items-center gap-2 h-12 px-6 transition-all font-bold border-none whitespace-nowrap">
              <Plus size={18} />
              New Movement
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-4 mb-6">
          <div className="bg-background shadow-neu-extruded border-neu rounded-[20px] p-4 flex items-center gap-3 min-w-0">
            <div className="w-12 h-12 rounded-2xl bg-background shadow-neu-inset-small flex items-center justify-center shrink-0">
              <ArrowRightLeft className="text-accent" size={20} />
            </div>
            <div className="min-w-0 overflow-hidden">
              <p className="text-[10px] font-bold text-muted-foreground mb-0.5 uppercase tracking-wider truncate">Total Movements</p>
              <div className="flex items-baseline gap-1 truncate">
                <span className="text-2xl font-black text-foreground">248</span>
              </div>
              <p className="text-[9px] font-medium text-muted-foreground mt-0.5 truncate">All time movements</p>
            </div>
          </div>
          <div className="bg-background shadow-neu-extruded border-neu rounded-[20px] p-4 flex items-center gap-3 min-w-0">
            <div className="w-12 h-12 rounded-2xl bg-background shadow-neu-inset-small flex items-center justify-center shrink-0">
              <CalendarDays className="text-green-500" size={20} />
            </div>
            <div className="min-w-0 overflow-hidden">
              <p className="text-[10px] font-bold text-muted-foreground mb-0.5 uppercase tracking-wider truncate">This Month</p>
              <div className="flex items-baseline gap-1 truncate">
                <span className="text-2xl font-black text-foreground">24</span>
              </div>
              <p className="text-[9px] font-medium text-muted-foreground mt-0.5 truncate">Movements this month</p>
            </div>
          </div>
          <div className="bg-background shadow-neu-extruded border-neu rounded-[20px] p-4 flex items-center gap-3 min-w-0">
            <div className="w-12 h-12 rounded-2xl bg-background shadow-neu-inset-small flex items-center justify-center shrink-0">
              <Clock className="text-amber-500" size={20} />
            </div>
            <div className="min-w-0 overflow-hidden">
              <p className="text-[10px] font-bold text-muted-foreground mb-0.5 uppercase tracking-wider truncate">Upcoming Moves</p>
              <div className="flex items-baseline gap-1 truncate">
                <span className="text-2xl font-black text-foreground">8</span>
              </div>
              <p className="text-[9px] font-medium text-muted-foreground mt-0.5 truncate">Scheduled movements</p>
            </div>
          </div>
          <div className="bg-background shadow-neu-extruded border-neu rounded-[20px] p-4 flex items-center gap-3 min-w-0">
            <div className="w-12 h-12 rounded-2xl bg-background shadow-neu-inset-small flex items-center justify-center shrink-0">
              <CheckCircle2 className="text-purple-500" size={20} />
            </div>
            <div className="min-w-0 overflow-hidden">
              <p className="text-[10px] font-bold text-muted-foreground mb-0.5 uppercase tracking-wider truncate">Completed</p>
              <div className="flex items-baseline gap-1 truncate">
                <span className="text-2xl font-black text-foreground">232</span>
              </div>
              <p className="text-[9px] font-medium text-muted-foreground mt-0.5 truncate">Completed movements</p>
            </div>
          </div>
          <div className="bg-background shadow-neu-extruded border-neu rounded-[20px] p-4 flex items-center gap-3 min-w-0">
            <div className="w-12 h-12 rounded-2xl bg-background shadow-neu-inset-small flex items-center justify-center shrink-0">
              <XCircle className="text-red-500" size={20} />
            </div>
            <div className="min-w-0 overflow-hidden">
              <p className="text-[10px] font-bold text-muted-foreground mb-0.5 uppercase tracking-wider truncate">Cancelled</p>
              <div className="flex items-baseline gap-1 truncate">
                <span className="text-2xl font-black text-foreground">16</span>
              </div>
              <p className="text-[9px] font-medium text-muted-foreground mt-0.5 truncate">Cancelled movements</p>
            </div>
          </div>
        </div>

        {/* Filters bar */}
        <div className="flex flex-wrap items-center gap-4 mb-6">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input 
              placeholder="Search movements..." 
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
            onClick={() => setIsFilterPanelOpen(!isFilterPanelOpen)}
            className={`shadow-neu-extruded text-foreground hover:text-accent rounded-2xl flex items-center gap-2 h-12 px-6 transition-all font-bold hover:shadow-neu-hover active:shadow-neu-inset-small whitespace-nowrap ${isFilterPanelOpen ? 'bg-background shadow-neu-inset-small text-accent' : 'bg-background'}`}
          >
            <Filter size={18} className={isFilterPanelOpen ? "text-accent" : "text-muted-foreground"} />
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
                  <table className="w-full text-sm text-left min-w-[1000px]">
                    <thead className="text-xs text-muted-foreground uppercase bg-background shadow-neu-inset-small sticky top-0 z-10">
                      <tr>
                        <th className="px-5 py-4 w-12">
                          <input type="checkbox" className="w-4 h-4 rounded text-accent bg-background border-muted-foreground/30 focus:ring-accent" />
                        </th>
                        <th className="px-2 py-4 font-bold whitespace-nowrap tracking-wider">Movement ID</th>
                        <th className="px-5 py-4 font-bold whitespace-nowrap tracking-wider">Asset</th>
                        <th className="px-5 py-4 font-bold whitespace-nowrap tracking-wider">Movement Type</th>
                        <th className="px-5 py-4 font-bold whitespace-nowrap tracking-wider">From</th>
                        <th className="px-5 py-4 font-bold whitespace-nowrap tracking-wider">To</th>
                        <th className="px-5 py-4 font-bold whitespace-nowrap tracking-wider">Scheduled Date</th>
                        <th className="px-5 py-4 font-bold whitespace-nowrap tracking-wider">Status</th>
                        <th className="px-5 py-4 font-bold whitespace-nowrap tracking-wider">Moved By</th>
                        <th className="px-5 py-4 font-bold whitespace-nowrap text-right tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredMovements.map((move) => (
                        <tr 
                          key={move.id} 
                          className={`border-b border-[#A3B1C6]/20 transition-all duration-300 hover:shadow-neu-inset-small`}
                        >
                          <td className="px-5 py-4">
                            <input type="checkbox" className="w-4 h-4 rounded text-accent bg-background border-muted-foreground/30 focus:ring-accent" />
                          </td>
                          <td className="px-2 py-4 font-bold text-accent whitespace-nowrap">{move.id}</td>
                          <td className="px-5 py-4 flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-background shadow-neu-extruded overflow-hidden p-1.5 shrink-0">
                              <img src={`/images/assets/${move.assetImage}.png`} alt={move.assetName} className="w-full h-full object-contain" />
                            </div>
                            <div className="min-w-0">
                              <p className={`font-bold text-sm text-foreground whitespace-nowrap truncate`}>{move.assetId}</p>
                              <p className="text-[11px] text-muted-foreground font-medium mt-0.5 whitespace-nowrap truncate">{move.assetName}</p>
                            </div>
                          </td>
                          <td className="px-5 py-4 whitespace-nowrap">
                            <span className={`px-2.5 py-1 text-[10px] rounded-lg font-bold flex items-center w-max gap-1 ${getBadgeColor('type', move.type)}`}>
                              {move.type === 'Move' && <ArrowRightLeft size={10} />}
                              {move.type === 'Transfer' && <ArrowRightLeft size={10} />}
                              {move.type === 'Install' && <Plus size={10} />}
                              {move.type === 'Relocate' && <MapPin size={10} />}
                              {move.type === 'Remove' && <X size={10} />}
                              {move.type}
                            </span>
                          </td>
                          <td className="px-5 py-4 whitespace-nowrap">
                            <p className="font-bold text-foreground text-xs">{move.fromLoc}</p>
                            <p className="text-[10px] text-muted-foreground mt-0.5">{move.fromRoom}</p>
                          </td>
                          <td className="px-5 py-4 whitespace-nowrap">
                            <p className="font-bold text-foreground text-xs">{move.toLoc}</p>
                            <p className="text-[10px] text-muted-foreground mt-0.5">{move.toRoom}</p>
                          </td>
                          <td className="px-5 py-4 whitespace-nowrap">
                            <p className="font-bold text-foreground text-xs">{move.date}</p>
                            <p className="text-[10px] text-muted-foreground mt-0.5">{move.time}</p>
                          </td>
                          <td className="px-5 py-4 whitespace-nowrap">
                            <span className={`px-2.5 py-1 text-[10px] rounded-lg font-bold ${getBadgeColor('status', move.status)}`}>
                              {move.status}
                            </span>
                          </td>
                          <td className="px-5 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <img src={move.userAvatar} alt={move.user} className="w-6 h-6 rounded-full border border-white/40 shadow-sm" />
                              <span className="font-bold text-foreground text-xs">{move.user}</span>
                            </div>
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
                <div>Showing 1 to 10 of 248 movements</div>
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
                    <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl shadow-neu-extruded text-muted-foreground hover:text-foreground">
                      3
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
                <p className="text-muted-foreground">Grid view is under construction for movements.</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right Side Panel: Filters & Movement Types */}
      {isFilterPanelOpen && (
        <div className="w-[300px] bg-background shadow-neu-extruded border-neu rounded-[32px] flex flex-col h-full overflow-hidden shrink-0 transition-all mb-2 animate-in slide-in-from-right-8 duration-300">
          
          {/* Filters Section */}
          <div className="p-6 border-b border-[#A3B1C6]/20">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-foreground tracking-tight">Filters</h3>
              <button className="text-[10px] font-bold text-accent hover:underline">Clear all</button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-bold text-muted-foreground mb-1.5 block">Date Range</label>
                <div className="bg-background shadow-neu-inset-deep border-t border-l border-[#A3B1C6]/30 border-b border-r border-white/60 h-10 rounded-xl px-3 flex items-center justify-between text-xs font-bold text-foreground">
                  <span>01 May 2025</span>
                  <ChevronRight size={12} className="text-muted-foreground" />
                  <span>31 May 2025</span>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-muted-foreground mb-1.5 block">Movement Type</label>
                <select className="w-full h-10 px-3 bg-background shadow-neu-extruded border-neu rounded-xl text-xs font-bold text-foreground outline-none appearance-none pr-8 relative cursor-pointer">
                  <option>All Types</option>
                  <option>Move</option>
                  <option>Transfer</option>
                  <option>Relocate</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold text-muted-foreground mb-1.5 block">Status</label>
                <select className="w-full h-10 px-3 bg-background shadow-neu-extruded border-neu rounded-xl text-xs font-bold text-foreground outline-none appearance-none pr-8 relative cursor-pointer">
                  <option>All Status</option>
                  <option>Completed</option>
                  <option>Scheduled</option>
                  <option>Cancelled</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold text-muted-foreground mb-1.5 block">From Location</label>
                <select className="w-full h-10 px-3 bg-background shadow-neu-extruded border-neu rounded-xl text-xs font-bold text-foreground outline-none appearance-none pr-8 relative cursor-pointer">
                  <option>All Locations</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold text-muted-foreground mb-1.5 block">To Location</label>
                <select className="w-full h-10 px-3 bg-background shadow-neu-extruded border-neu rounded-xl text-xs font-bold text-foreground outline-none appearance-none pr-8 relative cursor-pointer">
                  <option>All Locations</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold text-muted-foreground mb-1.5 block">Asset Category</label>
                <select className="w-full h-10 px-3 bg-background shadow-neu-extruded border-neu rounded-xl text-xs font-bold text-foreground outline-none appearance-none pr-8 relative cursor-pointer">
                  <option>All Categories</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold text-muted-foreground mb-1.5 block">Moved By</label>
                <select className="w-full h-10 px-3 bg-background shadow-neu-extruded border-neu rounded-xl text-xs font-bold text-foreground outline-none appearance-none pr-8 relative cursor-pointer">
                  <option>All Users</option>
                </select>
              </div>

              <Button className="w-full mt-2 bg-accent text-white shadow-neu-extruded hover:shadow-neu-hover active:shadow-neu-inset-small rounded-xl font-bold border-none transition-all h-10 text-xs">
                Apply Filters
              </Button>
            </div>
          </div>

          {/* Movement Types Legend Section */}
          <div className="p-6 bg-background shadow-neu-inset-deep flex-1 rounded-b-[32px]">
            <h3 className="font-bold text-foreground tracking-tight mb-4 text-sm">Movement Types</h3>
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="w-2 h-2 rounded-sm bg-blue-500 mt-1.5 shrink-0"></div>
                <div>
                  <p className="font-bold text-blue-500 text-xs mb-0.5">Move</p>
                  <p className="text-[10px] text-muted-foreground font-medium">Change position within same site/room</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-2 h-2 rounded-sm bg-purple-500 mt-1.5 shrink-0"></div>
                <div>
                  <p className="font-bold text-purple-500 text-xs mb-0.5">Transfer</p>
                  <p className="text-[10px] text-muted-foreground font-medium">Move between different locations</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-2 h-2 rounded-sm bg-orange-500 mt-1.5 shrink-0"></div>
                <div>
                  <p className="font-bold text-orange-500 text-xs mb-0.5">Relocate</p>
                  <p className="text-[10px] text-muted-foreground font-medium">Change rack or position</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-2 h-2 rounded-sm bg-green-500 mt-1.5 shrink-0"></div>
                <div>
                  <p className="font-bold text-green-500 text-xs mb-0.5">Install</p>
                  <p className="text-[10px] text-muted-foreground font-medium">New asset installation</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-2 h-2 rounded-sm bg-red-500 mt-1.5 shrink-0"></div>
                <div>
                  <p className="font-bold text-red-500 text-xs mb-0.5">Remove</p>
                  <p className="text-[10px] text-muted-foreground font-medium">Asset removal or decommission</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      )}
    </div>
  )
}
