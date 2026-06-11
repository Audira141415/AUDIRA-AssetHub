"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  Globe, CheckCircle2, Box, Zap, MapPin, Search, Filter, 
  List, LayoutGrid, Eye, Edit2, MoreHorizontal, X, Plus, Upload, 
  Clock, Map, Building2, Server, Settings, Info, BatteryCharging, 
  Snowflake, ChevronDown, ChevronLeft, ChevronRight
} from "lucide-react"
import { mockSites } from "@/lib/mock-data"

export default function SitesPage() {
  const [viewMode, setViewMode] = useState<"table" | "grid">("table")
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("All Status")
  const [countryFilter, setCountryFilter] = useState("All Country")
  const [selectedSiteId, setSelectedSiteId] = useState<string | null>(null)
  const [drawerTab, setDrawerTab] = useState("Overview")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const totalSites = mockSites.length
  const activeSites = mockSites.filter(s => s.status === "Active").length
  const totalAssets = mockSites.reduce((sum, s) => sum + s.totalAssets, 0)
  const totalCapacity = mockSites.reduce((sum, s) => sum + parseInt(s.powerCapacity.replace(/,/g, '')), 0)
  const totalArea = mockSites.reduce((sum, s) => sum + parseInt(s.totalArea.replace(/,/g, '')), 0)

  const filteredSites = mockSites.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          s.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          s.code.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "All Status" ? true : s.status === statusFilter;
    const matchesCountry = countryFilter === "All Country" ? true : s.country === countryFilter;
    
    return matchesSearch && matchesStatus && matchesCountry;
  });

  const totalPages = Math.ceil(filteredSites.length / itemsPerPage)
  const paginatedSites = filteredSites.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const selectedSite = mockSites.find(s => s.id === selectedSiteId)

  return (
    <div className="relative min-h-[calc(100vh-80px)] overflow-hidden flex">
      
      {/* Main Content Area */}
      <div className={`flex-1 transition-all duration-500 ease-in-out p-6 md:p-8 overflow-y-auto ${selectedSiteId ? 'pr-[400px]' : ''}`}>
        
        <div className="space-y-8 pb-12">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                <MapPin className="w-4 h-4" />
                <span>Location</span>
                <span>/</span>
                <span className="text-foreground font-medium">Sites</span>
              </div>
              <h1 className="text-3xl font-display font-bold text-foreground">Sites</h1>
              <p className="text-muted-foreground font-medium mt-1">Manage all data center sites and locations</p>
            </div>
            <div className="flex gap-4">
              <Button variant="outline" className="h-12 px-6 rounded-2xl shadow-neu-extruded border-neu font-bold text-foreground hover:text-accent group flex items-center">
                <Upload className="w-5 h-5 mr-2" /> 
                Import Sites
                <ChevronDown className="w-4 h-4 ml-2 opacity-50 group-hover:opacity-100" />
              </Button>
              <Button className="h-12 px-6 rounded-2xl shadow-[inset_2px_2px_4px_rgba(255,255,255,0.4),inset_-2px_-2px_4px_rgba(0,0,0,0.2),0_4px_10px_rgba(108,99,255,0.3)] border border-accent/50 font-bold text-white bg-accent hover:bg-accent-light">
                <Plus className="w-5 h-5 mr-2" /> Add Site
              </Button>
            </div>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 md:gap-5">
            <Card className="rounded-[24px] border-neu shadow-neu-extruded bg-background">
              <CardContent className="p-5 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#007DB8]/10 flex items-center justify-center shadow-neu-inset text-[#007DB8]">
                  <Globe className="w-6 h-6" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-bold text-[#007DB8] uppercase tracking-wider mb-0.5 truncate">Total Sites</p>
                  <p className="text-2xl font-display font-bold text-foreground truncate leading-none">{totalSites}</p>
                  <p className="text-[10px] text-muted-foreground truncate mt-1">All data center sites</p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="rounded-[24px] border-neu shadow-neu-extruded bg-background">
              <CardContent className="p-5 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#38B2AC]/10 flex items-center justify-center shadow-neu-inset text-[#38B2AC]">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-bold text-[#38B2AC] uppercase tracking-wider mb-0.5 truncate">Active Sites</p>
                  <p className="text-2xl font-display font-bold text-foreground truncate leading-none">{activeSites}</p>
                  <p className="text-[10px] text-muted-foreground truncate mt-1">Currently active</p>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-[24px] border-neu shadow-neu-extruded bg-background">
              <CardContent className="p-5 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#8B5CF6]/10 flex items-center justify-center shadow-neu-inset text-[#8B5CF6]">
                  <Box className="w-6 h-6" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-bold text-[#8B5CF6] uppercase tracking-wider mb-0.5 truncate">Total Assets</p>
                  <p className="text-2xl font-display font-bold text-foreground truncate leading-none">{totalAssets.toLocaleString()}</p>
                  <p className="text-[10px] text-muted-foreground truncate mt-1">Across all sites</p>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-[24px] border-neu shadow-neu-extruded bg-background">
              <CardContent className="p-5 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#F59E0B]/10 flex items-center justify-center shadow-neu-inset text-[#F59E0B]">
                  <Zap className="w-6 h-6" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-bold text-[#F59E0B] uppercase tracking-wider mb-0.5 truncate flex items-center gap-1">Total Capacity <span className="text-[8px] text-muted-foreground opacity-70">(kW)</span></p>
                  <p className="text-2xl font-display font-bold text-foreground truncate leading-none">{totalCapacity.toLocaleString()}</p>
                  <p className="text-[10px] text-muted-foreground truncate mt-1">Power capacity</p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="rounded-[24px] border-neu shadow-neu-extruded bg-background">
              <CardContent className="p-5 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#049FD9]/10 flex items-center justify-center shadow-neu-inset text-[#049FD9]">
                  <Map className="w-6 h-6" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-bold text-[#049FD9] uppercase tracking-wider mb-0.5 truncate flex items-center gap-1">Total Area <span className="text-[8px] text-muted-foreground opacity-70">(m²)</span></p>
                  <p className="text-2xl font-display font-bold text-foreground truncate leading-none">{totalArea.toLocaleString()}</p>
                  <p className="text-[10px] text-muted-foreground truncate mt-1">Total site area</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Data Section */}
          <div className="space-y-4">
            {/* Toolbar */}
            <div className="flex flex-col lg:flex-row justify-between gap-4">
              <div className="flex flex-1 max-w-3xl gap-4 flex-wrap sm:flex-nowrap">
                <div className="relative flex-1 min-w-[200px]">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input 
                    type="text" 
                    placeholder="Search sites..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full h-12 pl-12 pr-4 bg-background shadow-neu-inset border-t border-l border-[#A3B1C6]/30 border-b border-r border-white/60 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-accent/50 text-foreground" 
                  />
                </div>
                
                <div className="relative min-w-[140px]">
                  <select 
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full appearance-none h-12 px-4 pr-10 bg-background shadow-neu-extruded rounded-xl border border-white/50 text-sm font-bold cursor-pointer text-foreground focus:outline-none focus:ring-2 focus:ring-accent/50"
                  >
                    <option value="All Status">All Status</option>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                </div>
                
                <div className="relative min-w-[140px]">
                  <select 
                    value={countryFilter}
                    onChange={(e) => setCountryFilter(e.target.value)}
                    className="w-full appearance-none h-12 px-4 pr-10 bg-background shadow-neu-extruded rounded-xl border border-white/50 text-sm font-bold cursor-pointer text-foreground focus:outline-none focus:ring-2 focus:ring-accent/50"
                  >
                    <option value="All Country">All Country</option>
                    <option value="Indonesia">Indonesia</option>
                    <option value="Singapore">Singapore</option>
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                </div>
                
                <Button variant="outline" className="h-12 px-6 rounded-xl shadow-neu-extruded border-neu font-bold text-foreground">
                  <Filter className="w-4 h-4 mr-2" /> Filter
                </Button>
              </div>
              
              <div className="flex bg-background shadow-neu-inset border-neu rounded-xl p-1 h-12 self-start">
                <button 
                  className={`flex items-center justify-center w-12 rounded-lg transition-all ${viewMode === 'table' ? 'bg-background shadow-neu-extruded text-accent' : 'text-muted-foreground hover:text-foreground'}`}
                  onClick={() => setViewMode('table')}
                  title="Table View"
                >
                  <List className="w-5 h-5" />
                </button>
                <button 
                  className={`flex items-center justify-center w-12 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-background shadow-neu-extruded text-accent' : 'text-muted-foreground hover:text-foreground'}`}
                  onClick={() => setViewMode('grid')}
                  title="Grid View"
                >
                  <LayoutGrid className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Table */}
            {viewMode === 'table' ? (
              <Card className="rounded-[32px] border-neu shadow-neu-extruded bg-background overflow-hidden">
                <div className="overflow-x-auto pb-4">
                  <table className="w-full text-left border-collapse whitespace-nowrap">
                    <thead>
                      <tr>
                        <th className="px-6 py-6 font-bold text-[11px] uppercase tracking-wider text-muted-foreground border-b border-[#A3B1C6]/20">Site Name</th>
                        <th className="px-6 py-6 font-bold text-[11px] uppercase tracking-wider text-muted-foreground border-b border-[#A3B1C6]/20 flex items-center gap-1">Code <ChevronDown className="w-3 h-3 opacity-50"/></th>
                        <th className="px-6 py-6 font-bold text-[11px] uppercase tracking-wider text-muted-foreground border-b border-[#A3B1C6]/20">Country</th>
                        <th className="px-6 py-6 font-bold text-[11px] uppercase tracking-wider text-muted-foreground border-b border-[#A3B1C6]/20">City</th>
                        <th className="px-6 py-6 font-bold text-[11px] uppercase tracking-wider text-muted-foreground border-b border-[#A3B1C6]/20 flex items-center gap-1">Status <ChevronDown className="w-3 h-3 opacity-50"/></th>
                        <th className="px-6 py-6 font-bold text-[11px] uppercase tracking-wider text-muted-foreground border-b border-[#A3B1C6]/20">Total Assets</th>
                        <th className="px-6 py-6 font-bold text-[11px] uppercase tracking-wider text-muted-foreground border-b border-[#A3B1C6]/20">Power Capacity</th>
                        <th className="px-6 py-6 font-bold text-[11px] uppercase tracking-wider text-muted-foreground border-b border-[#A3B1C6]/20 flex items-center gap-1">Area <ChevronDown className="w-3 h-3 opacity-50"/></th>
                        <th className="px-6 py-6 font-bold text-[11px] uppercase tracking-wider text-muted-foreground border-b border-[#A3B1C6]/20 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#A3B1C6]/10">
                      {paginatedSites.length === 0 ? (
                        <tr>
                          <td colSpan={9} className="px-6 py-12 text-center text-muted-foreground">
                            No sites found matching your criteria.
                          </td>
                        </tr>
                      ) : (
                        paginatedSites.map((site) => (
                          <tr 
                            key={site.id} 
                            className={`group hover:bg-[#A3B1C6]/10 transition-all duration-300 cursor-pointer ${selectedSiteId === site.id ? 'bg-[#A3B1C6]/10 shadow-[inset_4px_0_0_0_#6C63FF]' : 'hover:shadow-[inset_4px_0_0_0_#6C63FF]'}`}
                            onClick={() => setSelectedSiteId(site.id)}
                          >
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-background shadow-neu-extruded flex items-center justify-center overflow-hidden border border-white/50">
                                  {/* Using a gradient icon as a placeholder for actual images */}
                                  <div className="w-full h-full bg-gradient-to-br from-[#A3B1C6] to-[#8C9BB4] flex items-center justify-center relative">
                                    <Building2 className="w-6 h-6 text-white absolute bottom-1 right-1 opacity-70" />
                                    <span className="text-xs font-bold text-white uppercase absolute top-1 left-1 opacity-50">{site.name.substring(0,3)}</span>
                                  </div>
                                </div>
                                <div>
                                  <span className="font-bold text-foreground text-sm">{site.name}</span>
                                  <p className="text-xs text-muted-foreground mt-0.5">{site.type}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <span className="font-mono text-xs font-medium text-foreground">{site.code}</span>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-2">
                                <div className="w-5 h-3.5 rounded-[2px] overflow-hidden flex shadow-sm border border-white/20">
                                  {site.country === 'Indonesia' ? (
                                    <div className="w-full h-full flex flex-col"><div className="bg-red-600 h-1/2"></div><div className="bg-white h-1/2"></div></div>
                                  ) : (
                                    <div className="w-full h-full flex flex-col"><div className="bg-red-600 h-1/2 flex items-center"><div className="w-1.5 h-1.5 rounded-full bg-white ml-0.5"></div></div><div className="bg-white h-1/2"></div></div>
                                  )}
                                </div>
                                <span className="text-sm font-medium text-foreground">{site.country}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-sm text-muted-foreground font-medium">{site.city}</td>
                            <td className="px-6 py-4">
                              <span className={`inline-flex px-2.5 py-1 rounded-md text-[10px] font-bold shadow-neu-inset border border-white/20
                                ${site.status === 'Active' ? 'text-[#38B2AC] bg-[#38B2AC]/5' : 'text-red-500 bg-red-500/5'}`}>
                                {site.status}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <span className="text-sm font-bold text-foreground">{site.totalAssets}</span>
                            </td>
                            <td className="px-6 py-4">
                              <span className="text-sm font-medium text-foreground">{site.powerCapacity} kW</span>
                            </td>
                            <td className="px-6 py-4">
                              <span className="text-sm font-medium text-foreground">{site.totalArea} m²</span>
                            </td>
                            <td className="px-6 py-4 text-right">
                              <div className="flex justify-end gap-1" onClick={(e) => e.stopPropagation()}>
                                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:text-accent hover:bg-accent/10" onClick={() => setSelectedSiteId(site.id)}>
                                  <Eye className="w-4 h-4" />
                                </Button>
                                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:text-accent hover:bg-accent/10">
                                  <Edit2 className="w-4 h-4" />
                                </Button>
                                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-muted-foreground hover:text-foreground">
                                  <MoreHorizontal className="w-4 h-4" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
                
                {/* Pagination */}
                <div className="px-6 py-4 border-t border-[#A3B1C6]/20 flex items-center justify-between">
                  <span className="text-sm text-muted-foreground font-medium">
                    Showing {Math.min((currentPage - 1) * itemsPerPage + 1, filteredSites.length)} to {Math.min(currentPage * itemsPerPage, filteredSites.length)} of {filteredSites.length} sites
                  </span>
                  <div className="flex gap-2 items-center bg-background shadow-neu-inset px-2 py-1.5 rounded-xl">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="w-8 h-8 rounded-lg text-muted-foreground hover:text-foreground hover:shadow-neu-extruded"
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </Button>
                    
                    <Button variant="default" size="sm" className="w-8 h-8 p-0 bg-accent text-white rounded-lg shadow-neu-extruded">{currentPage}</Button>
                    
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="w-8 h-8 rounded-lg text-muted-foreground hover:text-foreground hover:shadow-neu-extruded"
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages || totalPages === 0}
                    >
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                    <div className="ml-2 pl-4 border-l border-[#A3B1C6]/30 flex items-center">
                      <select className="bg-transparent text-sm font-medium text-foreground focus:outline-none cursor-pointer appearance-none pr-4 relative">
                        <option>10 / page</option>
                        <option>20 / page</option>
                      </select>
                      <ChevronDown className="w-3 h-3 text-muted-foreground -ml-4 pointer-events-none" />
                    </div>
                  </div>
                </div>
              </Card>
            ) : (
              <div className="py-20 text-center">
                <LayoutGrid className="w-16 h-16 text-muted-foreground opacity-30 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-foreground">Grid View Coming Soon</h3>
                <p className="text-muted-foreground">This feature is currently under development.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Detail Drawer (Right Panel) */}
      <div 
        className={`fixed top-[80px] right-0 h-[calc(100vh-80px)] w-[400px] bg-[#F4F7FB] border-l border-[#A3B1C6]/30 shadow-[-10px_0_30px_rgba(0,0,0,0.05)] transition-transform duration-500 ease-in-out z-40 overflow-y-auto ${selectedSite ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {selectedSite && (
          <div className="p-0">
            {/* Drawer Header Image */}
            <div className="h-48 w-full bg-gradient-to-b from-[#8C9BB4] to-[#4A5A73] relative">
              <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay"></div>
              <Button variant="ghost" size="icon" className="absolute top-4 right-4 h-8 w-8 rounded-full bg-black/20 text-white hover:bg-black/40 border border-white/10" onClick={() => setSelectedSiteId(null)}>
                <X className="w-4 h-4" />
              </Button>
              <div className="absolute bottom-4 right-4">
                <span className={`inline-flex px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider backdrop-blur-md border border-white/20 shadow-lg
                  ${selectedSite.status === 'Active' ? 'text-[#38B2AC] bg-black/40' : 'text-red-400 bg-black/40'}`}>
                  {selectedSite.status}
                </span>
              </div>
            </div>

            {/* Drawer Title Section */}
            <div className="px-6 pt-6 pb-4">
              <h2 className="text-2xl font-display font-bold text-foreground leading-tight">{selectedSite.name}</h2>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-sm text-muted-foreground">{selectedSite.type}</span>
                <span className="text-muted-foreground opacity-30">•</span>
                <span className="text-xs font-mono text-muted-foreground font-medium">{selectedSite.code}</span>
              </div>
            </div>

            {/* Drawer Tabs */}
            <div className="px-6 flex gap-4 border-b border-[#A3B1C6]/30 mb-6 overflow-x-auto no-scrollbar">
              {["Overview", "Buildings", "Capacity", "Contacts", "History"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setDrawerTab(tab)}
                  className={`pb-3 text-xs font-bold transition-all border-b-2 whitespace-nowrap ${
                    drawerTab === tab 
                      ? 'border-accent text-accent' 
                      : 'border-transparent text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Overview Content */}
            {drawerTab === "Overview" && (
              <div className="px-6 pb-8 space-y-8">
                
                {/* Details List */}
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="w-6 flex justify-center"><Building2 className="w-4 h-4 mt-0.5 text-muted-foreground" /></div>
                    <div className="grid grid-cols-3 w-full">
                      <p className="text-xs text-muted-foreground font-medium col-span-1">Site Code</p>
                      <p className="text-xs font-mono font-bold text-foreground col-span-2">{selectedSite.code}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="w-6 flex justify-center"><Globe className="w-4 h-4 mt-0.5 text-muted-foreground" /></div>
                    <div className="grid grid-cols-3 w-full">
                      <p className="text-xs text-muted-foreground font-medium col-span-1">Country</p>
                      <div className="col-span-2 flex items-center gap-2">
                        <div className="w-4 h-3 rounded-[2px] overflow-hidden flex shadow-sm border border-white/20">
                          {selectedSite.country === 'Indonesia' ? (
                            <div className="w-full h-full flex flex-col"><div className="bg-red-600 h-1/2"></div><div className="bg-white h-1/2"></div></div>
                          ) : (
                            <div className="w-full h-full flex flex-col"><div className="bg-red-600 h-1/2 flex items-center"><div className="w-1 h-1 rounded-full bg-white ml-0.5"></div></div><div className="bg-white h-1/2"></div></div>
                          )}
                        </div>
                        <p className="text-xs font-bold text-foreground">{selectedSite.country}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-6 flex justify-center"><MapPin className="w-4 h-4 mt-0.5 text-muted-foreground" /></div>
                    <div className="grid grid-cols-3 w-full">
                      <p className="text-xs text-muted-foreground font-medium col-span-1">City</p>
                      <p className="text-xs font-bold text-foreground col-span-2">{selectedSite.city}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-6 flex justify-center"><Map className="w-4 h-4 mt-0.5 text-muted-foreground" /></div>
                    <div className="grid grid-cols-3 w-full">
                      <p className="text-xs text-muted-foreground font-medium col-span-1">Address</p>
                      <p className="text-xs font-medium text-foreground col-span-2 whitespace-pre-line leading-relaxed">{selectedSite.address}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-6 flex justify-center"><Clock className="w-4 h-4 mt-0.5 text-muted-foreground" /></div>
                    <div className="grid grid-cols-3 w-full">
                      <p className="text-xs text-muted-foreground font-medium col-span-1">Timezone</p>
                      <p className="text-xs font-medium text-foreground col-span-2">{selectedSite.timezone}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-6 flex justify-center"><Settings className="w-4 h-4 mt-0.5 text-muted-foreground" /></div>
                    <div className="grid grid-cols-3 w-full">
                      <p className="text-xs text-muted-foreground font-medium col-span-1">Status</p>
                      <div className="col-span-2">
                        <span className={`inline-flex px-2 py-0.5 rounded-[4px] text-[10px] font-bold ${selectedSite.status === 'Active' ? 'text-[#38B2AC] bg-[#38B2AC]/10' : 'text-red-500 bg-red-500/10'}`}>
                          {selectedSite.status}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-6 flex justify-center"><Clock className="w-4 h-4 mt-0.5 text-muted-foreground" /></div>
                    <div className="grid grid-cols-3 w-full">
                      <p className="text-xs text-muted-foreground font-medium col-span-1">Established</p>
                      <p className="text-xs font-medium text-foreground col-span-2">{selectedSite.established}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-6 flex justify-center"><Box className="w-4 h-4 mt-0.5 text-muted-foreground" /></div>
                    <div className="grid grid-cols-3 w-full">
                      <p className="text-xs text-muted-foreground font-medium col-span-1">Total Assets</p>
                      <p className="text-xs font-bold text-foreground col-span-2">{selectedSite.totalAssets}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-6 flex justify-center"><Zap className="w-4 h-4 mt-0.5 text-muted-foreground" /></div>
                    <div className="grid grid-cols-3 w-full">
                      <p className="text-xs text-muted-foreground font-medium col-span-1">Power Capacity</p>
                      <p className="text-xs font-bold text-foreground col-span-2">{selectedSite.powerCapacity} kW</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-6 flex justify-center"><LayoutGrid className="w-4 h-4 mt-0.5 text-muted-foreground" /></div>
                    <div className="grid grid-cols-3 w-full">
                      <p className="text-xs text-muted-foreground font-medium col-span-1">Total Area</p>
                      <p className="text-xs font-bold text-foreground col-span-2">{selectedSite.totalArea} m²</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-6 flex justify-center"><BatteryCharging className="w-4 h-4 mt-0.5 text-muted-foreground" /></div>
                    <div className="grid grid-cols-3 w-full">
                      <p className="text-xs text-muted-foreground font-medium col-span-1">PUE</p>
                      <p className="text-xs font-bold text-foreground col-span-2">{selectedSite.pue}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 pt-2 border-t border-[#A3B1C6]/20">
                    <div className="w-6 flex justify-center"><Info className="w-4 h-4 mt-0.5 text-muted-foreground" /></div>
                    <div className="grid grid-cols-3 w-full">
                      <p className="text-xs text-muted-foreground font-medium col-span-1">Description</p>
                      <p className="text-xs font-medium text-foreground col-span-2 leading-relaxed">{selectedSite.description}</p>
                    </div>
                  </div>
                </div>

                {/* Capacity Utilization */}
                <div className="bg-background rounded-2xl shadow-neu-extruded border border-white/50 p-5 mt-8">
                  <div className="flex items-center justify-between mb-5">
                    <h3 className="text-sm font-bold text-foreground">Capacity Utilization</h3>
                    <button className="text-[10px] font-bold text-accent hover:underline">View details</button>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="font-medium text-muted-foreground">Power</span>
                        <span className="font-bold text-foreground">{selectedSite.capacity.power}%</span>
                      </div>
                      <div className="w-full bg-[#A3B1C6]/20 rounded-full h-1.5 shadow-neu-inset overflow-hidden">
                        <div className="bg-accent h-1.5 rounded-full" style={{ width: `${selectedSite.capacity.power}%` }}></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="font-medium text-muted-foreground">Space (U)</span>
                        <span className="font-bold text-foreground">{selectedSite.capacity.space}%</span>
                      </div>
                      <div className="w-full bg-[#A3B1C6]/20 rounded-full h-1.5 shadow-neu-inset overflow-hidden">
                        <div className="bg-[#38B2AC] h-1.5 rounded-full" style={{ width: `${selectedSite.capacity.space}%` }}></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="font-medium text-muted-foreground">Cooling</span>
                        <span className="font-bold text-foreground">{selectedSite.capacity.cooling}%</span>
                      </div>
                      <div className="w-full bg-[#A3B1C6]/20 rounded-full h-1.5 shadow-neu-inset overflow-hidden">
                        <div className="bg-[#F59E0B] h-1.5 rounded-full" style={{ width: `${selectedSite.capacity.cooling}%` }}></div>
                      </div>
                    </div>
                  </div>
                </div>

                <Button className="w-full h-12 rounded-xl shadow-[inset_2px_2px_4px_rgba(255,255,255,0.4),inset_-2px_-2px_4px_rgba(0,0,0,0.2),0_4px_10px_rgba(108,99,255,0.3)] border border-accent/50 font-bold text-white bg-accent hover:bg-accent-light mt-6">
                  View Site Details
                </Button>

              </div>
            )}

            {/* Other Tabs Placeholder */}
            {drawerTab !== "Overview" && (
              <div className="py-16 text-center px-6">
                <Box className="w-12 h-12 text-muted-foreground opacity-30 mx-auto mb-4" />
                <h3 className="font-bold text-foreground">Coming Soon</h3>
                <p className="text-sm text-muted-foreground mt-2">The {drawerTab} view is currently under development and will be available in the next release.</p>
              </div>
            )}
            
          </div>
        )}
      </div>

    </div>
  )
}
