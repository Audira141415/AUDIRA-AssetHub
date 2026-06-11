"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { 
  Users, CheckCircle2, Box, PieChart,
  Search, Filter, Plus, Edit2, Eye, MoreHorizontal, X, Upload,
  Mail, Phone, Globe, MapPin, Building2, Server, Network, ShieldAlert,
  HardDrive, Zap, Layers, Copy
} from "lucide-react"
import { mockVendors, baseAssets } from "@/lib/mock-data"

const iconMap: any = {
  Server, Network, ShieldAlert, HardDrive, Zap, Layers, Users
}

export default function VendorsPage() {
  const [activeTab, setActiveTab] = useState("All Vendors")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedVendorId, setSelectedVendorId] = useState<string | null>(null)
  const [drawerTab, setDrawerTab] = useState("Overview")
  const [statusFilter, setStatusFilter] = useState("All")
  const [typeFilter, setTypeFilter] = useState("All")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const totalVendors = mockVendors.length
  const activeVendorsCount = mockVendors.filter(v => v.status === "Active").length
  const totalAssets = mockVendors.reduce((sum, v) => sum + v.assetsCount, 0)
  
  // Assuming the highest asset count is the top vendor
  const topVendor = [...mockVendors].sort((a, b) => b.assetsCount - a.assetsCount)[0]

  const filteredVendors = mockVendors.filter(v => {
    const matchesSearch = v.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          v.contactPerson.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          v.type.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === "All" ? true : v.status === statusFilter;
    const matchesType = typeFilter === "All" ? true : v.type === typeFilter;
    
    if (activeTab === "All Vendors") return matchesSearch && matchesStatus && matchesType;
    if (activeTab === "Inactive Vendors") return matchesSearch && v.status === "Inactive" && matchesType;
    return matchesSearch && matchesStatus && matchesType;
  });

  const totalPages = Math.ceil(filteredVendors.length / itemsPerPage)
  const paginatedVendors = filteredVendors.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const selectedVendor = mockVendors.find(v => v.id === selectedVendorId)
  
  // Find recent assets for this vendor from mock data
  const vendorAssets = selectedVendor ? baseAssets.filter(a => a.vendor.toLowerCase().includes(selectedVendor.name.split(' ')[0].toLowerCase())).slice(0, 3) : []

  return (
    <div className="relative min-h-[calc(100vh-80px)] overflow-hidden flex">
      
      {/* Main Content Area */}
      <div className={`flex-1 transition-all duration-500 ease-in-out p-6 md:p-8 overflow-y-auto ${selectedVendorId ? 'pr-[400px]' : ''}`}>
        
        <div className="space-y-8 pb-12">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-display font-bold text-foreground">Vendors</h1>
              <p className="text-muted-foreground font-medium mt-1">Manage your asset vendors and suppliers</p>
            </div>
            <div className="flex gap-4">
              <Button variant="outline" className="h-12 px-6 rounded-2xl shadow-neu-extruded border-neu font-bold text-foreground hover:text-accent">
                <Upload className="w-5 h-5 mr-2" /> Import Vendors
              </Button>
              <Button className="h-12 px-6 rounded-2xl shadow-[inset_2px_2px_4px_rgba(255,255,255,0.4),inset_-2px_-2px_4px_rgba(0,0,0,0.2),0_4px_10px_rgba(108,99,255,0.3)] border border-accent/50 font-bold text-white bg-accent hover:bg-accent-light">
                <Plus className="w-5 h-5 mr-2" /> Add Vendor
              </Button>
            </div>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            <Card className="rounded-[24px] border-neu shadow-neu-extruded bg-background">
              <CardContent className="p-5 flex flex-col gap-3">
                <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center shadow-neu-inset text-accent">
                  <Users className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-0.5 truncate" title="Total Vendors">Total Vendors</p>
                  <p className="text-2xl font-display font-bold text-foreground truncate">{totalVendors}</p>
                  <p className="text-[10px] text-muted-foreground truncate mt-1">All registered vendors</p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="rounded-[24px] border-neu shadow-neu-extruded bg-background">
              <CardContent className="p-5 flex flex-col gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#38B2AC]/10 flex items-center justify-center shadow-neu-inset text-[#38B2AC]">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-0.5 truncate" title="Active Vendors">Active Vendors</p>
                  <p className="text-2xl font-display font-bold text-foreground truncate">{activeVendorsCount}</p>
                  <p className="text-[10px] text-muted-foreground truncate mt-1">Currently active</p>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-[24px] border-neu shadow-neu-extruded bg-background">
              <CardContent className="p-5 flex flex-col gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#F59E0B]/10 flex items-center justify-center shadow-neu-inset text-[#F59E0B]">
                  <Box className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-0.5 truncate" title="Assets from Vendors">Assets from Vendors</p>
                  <p className="text-2xl font-display font-bold text-foreground truncate">{totalAssets.toLocaleString()}</p>
                  <p className="text-[10px] text-muted-foreground truncate mt-1">Across all vendors</p>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-[24px] border-neu shadow-neu-extruded bg-background">
              <CardContent className="p-5 flex flex-col gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#8B5CF6]/10 flex items-center justify-center shadow-neu-inset text-[#8B5CF6]">
                  <PieChart className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-0.5 truncate" title="Top Vendor">Top Vendor</p>
                  <p className="text-xl font-display font-bold text-foreground truncate" title={topVendor.name}>{topVendor.name}</p>
                  <p className="text-[10px] text-muted-foreground truncate mt-1">{topVendor.assetPercentage}% of total assets</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Data Section */}
          <div className="space-y-4">
            {/* Tabs */}
            <div className="flex gap-6 border-b border-[#A3B1C6]/30 px-2">
              {["All Vendors", "Inactive Vendors"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-3 font-bold text-sm transition-all border-b-2 ${
                    activeTab === tab 
                      ? 'border-accent text-accent' 
                      : 'border-transparent text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Toolbar */}
            <div className="flex flex-col md:flex-row justify-between gap-4 pt-2">
              <div className="flex flex-1 max-w-2xl gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input 
                    type="text" 
                    placeholder="Search vendors..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full h-12 pl-12 pr-4 bg-background shadow-neu-inset border-t border-l border-[#A3B1C6]/30 border-b border-r border-white/60 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-accent/50 text-foreground" 
                  />
                </div>
                
                {/* Selects would go here in a real app, using simple divs for mockup styling */}
                <select 
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="hidden sm:flex items-center px-4 h-12 bg-background shadow-neu-extruded rounded-xl border border-white/50 text-sm font-bold cursor-pointer text-foreground focus:outline-none focus:ring-2 focus:ring-accent/50"
                >
                  <option value="All">All Status</option>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="Maintenance">Maintenance</option>
                </select>
                <select 
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="hidden sm:flex items-center px-4 h-12 bg-background shadow-neu-extruded rounded-xl border border-white/50 text-sm font-bold cursor-pointer text-foreground focus:outline-none focus:ring-2 focus:ring-accent/50"
                >
                  <option value="All">All Type</option>
                  <option value="Hardware">Hardware</option>
                  <option value="Network">Network</option>
                  <option value="Power">Power</option>
                  <option value="Storage">Storage</option>
                  <option value="Security">Security</option>
                  <option value="Cooling">Cooling</option>
                  <option value="Software">Software</option>
                </select>
                
                <Button variant="outline" className="h-12 px-6 rounded-xl shadow-neu-extruded border-neu font-bold text-foreground">
                  <Filter className="w-4 h-4 mr-2" /> Filter
                </Button>
              </div>
            </div>

            {/* Table */}
            <Card className="rounded-[32px] border-neu shadow-neu-extruded bg-background overflow-hidden">
              <div className="overflow-x-auto pb-4">
                <table className="w-full text-left border-collapse whitespace-nowrap">
                  <thead>
                    <tr>
                      <th className="px-6 py-6 font-bold text-xs uppercase tracking-wider text-muted-foreground border-b border-[#A3B1C6]/20">Vendor Name</th>
                      <th className="px-6 py-6 font-bold text-xs uppercase tracking-wider text-muted-foreground border-b border-[#A3B1C6]/20">Type</th>
                      <th className="px-6 py-6 font-bold text-xs uppercase tracking-wider text-muted-foreground border-b border-[#A3B1C6]/20">Contact Person</th>
                      <th className="px-6 py-6 font-bold text-xs uppercase tracking-wider text-muted-foreground border-b border-[#A3B1C6]/20">Email</th>
                      <th className="px-6 py-6 font-bold text-xs uppercase tracking-wider text-muted-foreground border-b border-[#A3B1C6]/20">Phone</th>
                      <th className="px-6 py-6 font-bold text-xs uppercase tracking-wider text-muted-foreground border-b border-[#A3B1C6]/20">Assets</th>
                      <th className="px-6 py-6 font-bold text-xs uppercase tracking-wider text-muted-foreground border-b border-[#A3B1C6]/20">Status</th>
                      <th className="px-6 py-6 font-bold text-xs uppercase tracking-wider text-muted-foreground border-b border-[#A3B1C6]/20 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#A3B1C6]/10">
                    {paginatedVendors.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="px-6 py-12 text-center text-muted-foreground">
                          No vendors found matching your filters.
                        </td>
                      </tr>
                    ) : (
                      paginatedVendors.map((vendor) => {
                        return (
                        <tr 
                          key={vendor.id} 
                          className={`group hover:bg-[#A3B1C6]/10 transition-all duration-300 cursor-pointer ${selectedVendorId === vendor.id ? 'bg-[#A3B1C6]/10 shadow-[inset_4px_0_0_0_#6C63FF]' : 'hover:shadow-[inset_4px_0_0_0_#6C63FF]'}`}
                          onClick={() => setSelectedVendorId(vendor.id)}
                        >
                          <td className="px-6 py-5 flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white shadow-md text-xs" style={{ backgroundColor: vendor.color }}>
                              {vendor.name.substring(0, 3).toUpperCase()}
                            </div>
                            <span className="font-bold text-foreground">{vendor.name}</span>
                          </td>
                          <td className="px-6 py-5">
                            <span className={`inline-flex px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider
                              ${vendor.type === 'Hardware' ? 'bg-[#007DB8]/10 text-[#007DB8]' : ''}
                              ${vendor.type === 'Network' ? 'bg-[#049FD9]/10 text-[#049FD9]' : ''}
                              ${vendor.type === 'Power' ? 'bg-[#F59E0B]/10 text-[#F59E0B]' : ''}
                              ${vendor.type === 'Storage' ? 'bg-[#8B5CF6]/10 text-[#8B5CF6]' : ''}
                              ${vendor.type === 'Security' ? 'bg-[#EF4444]/10 text-[#EF4444]' : ''}
                              ${vendor.type === 'Software' ? 'bg-[#EC4899]/10 text-[#EC4899]' : ''}
                            `}>
                              {vendor.type}
                            </span>
                          </td>
                          <td className="px-6 py-5">
                            <p className="font-bold text-foreground text-sm">{vendor.contactPerson}</p>
                            <p className="text-xs text-muted-foreground">{vendor.contactTitle}</p>
                          </td>
                          <td className="px-6 py-5 text-sm text-muted-foreground">{vendor.email}</td>
                          <td className="px-6 py-5 text-sm text-muted-foreground">{vendor.phone}</td>
                          <td className="px-6 py-5 text-sm">
                            <span className="font-bold text-foreground">{vendor.assetsCount}</span> 
                            <span className="text-muted-foreground ml-1">({vendor.assetPercentage}%)</span>
                          </td>
                          <td className="px-6 py-5">
                            <span className={`inline-flex font-bold text-sm ${vendor.status === 'Active' ? 'text-[#38B2AC]' : 'text-red-500'}`}>
                              {vendor.status}
                            </span>
                          </td>
                          <td className="px-6 py-5 text-right">
                            <div className="flex justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:text-accent" onClick={() => setSelectedVendorId(vendor.id)}>
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:text-accent" onClick={() => alert("Edit Feature Coming Soon!")}>
                                <Edit2 className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-muted-foreground hover:text-foreground">
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      )})
                    )}
                  </tbody>
                </table>
              </div>
              
              {/* Pagination Mockup */}
              <div className="px-6 py-4 border-t border-[#A3B1C6]/20 flex items-center justify-between">
                <span className="text-sm text-muted-foreground font-medium">
                  Showing {Math.min((currentPage - 1) * itemsPerPage + 1, filteredVendors.length)} to {Math.min(currentPage * itemsPerPage, filteredVendors.length)} of {filteredVendors.length} vendors
                </span>
                <div className="flex gap-1 items-center">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="w-8 h-8 p-0 text-muted-foreground hover:text-foreground"
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                  >&lt;</Button>
                  
                  {[...Array(totalPages)].map((_, i) => (
                    <Button 
                      key={i} 
                      variant={currentPage === i + 1 ? "default" : "ghost"} 
                      size="sm" 
                      className={`w-8 h-8 p-0 rounded-lg ${currentPage === i + 1 ? 'bg-accent text-white' : 'text-foreground hover:bg-[#A3B1C6]/10'}`}
                      onClick={() => setCurrentPage(i + 1)}
                    >
                      {i + 1}
                    </Button>
                  ))}
                  
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="w-8 h-8 p-0 text-muted-foreground hover:text-foreground"
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages || totalPages === 0}
                  >&gt;</Button>
                  <div className="ml-4 pl-4 border-l border-[#A3B1C6]/30 text-sm font-medium text-foreground cursor-pointer">
                    {itemsPerPage} / page <span className="text-xs ml-1">▼</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Detail Drawer (Right Panel) */}
      <div 
        className={`fixed top-[80px] right-0 h-[calc(100vh-80px)] w-[400px] bg-[#F4F7FB] border-l border-[#A3B1C6]/30 shadow-[-10px_0_30px_rgba(0,0,0,0.05)] transition-transform duration-500 ease-in-out z-40 overflow-y-auto ${selectedVendor ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {selectedVendor && (
          <div className="p-6">
            {/* Drawer Header */}
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center font-bold text-white shadow-lg text-lg" style={{ backgroundColor: selectedVendor.color }}>
                  {selectedVendor.name.substring(0, 3).toUpperCase()}
                </div>
                <div>
                  <h2 className="text-xl font-display font-bold text-foreground leading-tight">{selectedVendor.name}</h2>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-sm text-muted-foreground">{selectedVendor.type} Vendor</span>
                    <span className={`text-xs font-bold ${selectedVendor.status === 'Active' ? 'text-[#38B2AC]' : 'text-red-500'}`}>
                      {selectedVendor.status}
                    </span>
                  </div>
                </div>
              </div>
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full bg-background shadow-neu-extruded text-muted-foreground hover:text-foreground" onClick={() => setSelectedVendorId(null)}>
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* Drawer Tabs */}
            <div className="flex gap-4 border-b border-[#A3B1C6]/30 mb-6">
              {["Overview", "Contacts", "Assets", "Contracts"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setDrawerTab(tab)}
                  className={`pb-2 text-sm font-bold transition-all border-b-2 ${
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
              <div className="space-y-6">
                
                {/* Details List */}
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Building2 className="w-4 h-4 mt-0.5 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider mb-0.5">Vendor Type</p>
                      <p className="text-sm text-foreground font-medium">{selectedVendor.type}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Globe className="w-4 h-4 mt-0.5 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider mb-0.5">Website</p>
                      <a href={`http://${selectedVendor.website}`} target="_blank" rel="noreferrer" className="text-sm text-accent hover:underline font-medium">{selectedVendor.website}</a>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Mail className="w-4 h-4 mt-0.5 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider mb-0.5">Email</p>
                      <p className="text-sm text-foreground font-medium">{selectedVendor.email}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Phone className="w-4 h-4 mt-0.5 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider mb-0.5">Phone</p>
                      <p className="text-sm text-foreground font-medium">{selectedVendor.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin className="w-4 h-4 mt-0.5 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider mb-0.5">Address</p>
                      <p className="text-sm text-foreground font-medium whitespace-pre-line">{selectedVendor.address}</p>
                    </div>
                  </div>
                </div>

                {/* Vendor Statistics */}
                <div className="bg-background rounded-3xl shadow-neu-extruded border border-white/50 p-5">
                  <h3 className="font-bold text-foreground mb-4">Vendor Statistics</h3>
                  <div className="flex justify-between items-center">
                    <div className="space-y-3 flex-1">
                      <div className="flex items-center gap-2 text-sm">
                        <span className="w-2 h-2 rounded-full bg-accent"></span>
                        <span className="text-muted-foreground">Total Assets</span>
                        <span className="ml-auto font-bold text-foreground">{selectedVendor.assetsCount}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <span className="w-2 h-2 rounded-full bg-[#38B2AC]"></span>
                        <span className="text-muted-foreground">Active Assets</span>
                        <span className="ml-auto font-bold text-foreground">{selectedVendor.activeAssets}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <span className="w-2 h-2 rounded-full bg-[#F59E0B]"></span>
                        <span className="text-muted-foreground">Expired Warranty</span>
                        <span className="ml-auto font-bold text-foreground">{selectedVendor.expiredWarranty}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <span className="w-2 h-2 rounded-full bg-[#EF4444]"></span>
                        <span className="text-muted-foreground">Contracts</span>
                        <span className="ml-auto font-bold text-foreground">{selectedVendor.contracts}</span>
                      </div>
                    </div>
                    {/* Conceptual Donut Chart */}
                    <div className="w-24 h-24 rounded-full border-8 border-background shadow-neu-inset ml-4 flex items-center justify-center relative">
                      <svg className="absolute inset-0 w-full h-full transform -rotate-90">
                        <circle cx="40" cy="40" r="36" fill="transparent" stroke="#A3B1C6" strokeWidth="8" strokeOpacity="0.2" className="translate-x-2 translate-y-2" />
                        <circle cx="40" cy="40" r="36" fill="transparent" stroke="#6C63FF" strokeWidth="8" strokeDasharray="226" strokeDashoffset={226 - (226 * selectedVendor.assetPercentage / 100)} className="translate-x-2 translate-y-2 transition-all duration-1000" strokeLinecap="round" />
                      </svg>
                      <div className="text-center z-10">
                        <p className="font-bold text-foreground text-sm">{selectedVendor.assetPercentage}%</p>
                        <p className="text-[8px] text-muted-foreground leading-tight">of total<br/>assets</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recent Assets */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-bold text-foreground">Recent Assets</h3>
                    <button className="text-xs font-bold text-accent hover:underline">View all</button>
                  </div>
                  <div className="space-y-2">
                    {vendorAssets.length > 0 ? vendorAssets.map((asset) => (
                      <div key={asset.id} className="flex items-center justify-between p-3 bg-background rounded-2xl shadow-neu-extruded border border-white/50">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-accent/10 text-accent flex items-center justify-center">
                            <Server className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-foreground">{asset.tag}</p>
                            <p className="text-xs text-muted-foreground">{asset.host}</p>
                          </div>
                        </div>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${asset.status === 'Active' ? 'bg-[#38B2AC]/10 text-[#38B2AC]' : 'bg-[#F59E0B]/10 text-[#F59E0B]'}`}>
                          {asset.status}
                        </span>
                      </div>
                    )) : (
                      <p className="text-sm text-muted-foreground italic text-center p-4">No recent assets found.</p>
                    )}
                    {vendorAssets.length > 0 && <p className="text-xs text-center text-muted-foreground mt-2 font-medium">+ {Math.max(0, selectedVendor.assetsCount - vendorAssets.length)} more</p>}
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <h3 className="font-bold text-foreground mb-2">Notes</h3>
                  <div className="p-4 bg-[#A3B1C6]/5 rounded-2xl border border-[#A3B1C6]/20">
                    <p className="text-sm text-foreground whitespace-pre-line font-medium leading-relaxed">{selectedVendor.notes}</p>
                  </div>
                </div>

              </div>
            )}

            {/* Contacts Content */}
            {drawerTab === "Contacts" && (
              <div className="space-y-4">
                <div className="bg-background rounded-2xl shadow-neu-extruded border border-white/50 p-5">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center text-accent">
                      <Users className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-foreground text-lg">{selectedVendor.contactPerson}</h3>
                      <p className="text-sm text-muted-foreground">{selectedVendor.contactTitle}</p>
                    </div>
                  </div>
                  <div className="space-y-3 pt-3 border-t border-[#A3B1C6]/20">
                    <div className="flex items-center gap-3">
                      <Mail className="w-4 h-4 text-muted-foreground" />
                      <p className="text-sm font-medium text-foreground">{selectedVendor.email}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="w-4 h-4 text-muted-foreground" />
                      <p className="text-sm font-medium text-foreground">{selectedVendor.phone}</p>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 bg-[#A3B1C6]/5 rounded-2xl border border-[#A3B1C6]/20 text-center mt-4">
                  <p className="text-sm text-muted-foreground font-medium mb-3">Need to add another contact?</p>
                  <Button variant="outline" className="w-full h-10 rounded-xl shadow-neu-extruded border-neu font-bold text-accent">
                    <Plus className="w-4 h-4 mr-2" /> Add Contact
                  </Button>
                </div>
              </div>
            )}

            {/* Assets Content */}
            {drawerTab === "Assets" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-foreground">All Supplied Assets</h3>
                  <span className="text-xs font-bold px-2 py-1 bg-accent/10 text-accent rounded-md">{selectedVendor.assetsCount} Total</span>
                </div>
                <div className="space-y-3">
                  {vendorAssets.length > 0 ? vendorAssets.map((asset) => (
                    <div key={asset.id} className="p-4 bg-background rounded-2xl shadow-neu-extruded border border-white/50 hover:shadow-[inset_4px_0_0_0_#6C63FF] transition-all cursor-pointer">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-bold text-foreground">{asset.tag}</p>
                          <p className="text-xs text-muted-foreground">{asset.cat}</p>
                        </div>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${asset.status === 'Active' ? 'bg-[#38B2AC]/10 text-[#38B2AC]' : 'bg-[#F59E0B]/10 text-[#F59E0B]'}`}>
                          {asset.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground mt-3">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" /> {asset.loc}
                        </div>
                        <div className="flex items-center gap-1">
                          <ShieldAlert className="w-3 h-3" /> {asset.warranty}
                        </div>
                      </div>
                    </div>
                  )) : (
                    <div className="py-8 text-center">
                      <HardDrive className="w-10 h-10 text-muted-foreground opacity-30 mx-auto mb-3" />
                      <p className="text-sm text-muted-foreground font-medium">No assets recorded for this vendor yet.</p>
                    </div>
                  )}
                  {vendorAssets.length > 0 && <Button variant="outline" className="w-full mt-2 font-bold text-muted-foreground border-dashed">Load More Assets</Button>}
                </div>
              </div>
            )}

            {/* Contracts Content */}
            {drawerTab === "Contracts" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-foreground">Service Contracts</h3>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-accent"><Plus className="w-4 h-4"/></Button>
                </div>
                
                {selectedVendor.contracts > 0 ? (
                  <div className="p-4 bg-background rounded-2xl shadow-neu-extruded border border-white/50 relative overflow-hidden">
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#38B2AC]"></div>
                    <div className="flex justify-between items-start mb-3 pl-2">
                      <div>
                        <p className="font-bold text-foreground text-sm">Enterprise Support SLA</p>
                        <p className="text-xs text-muted-foreground">CTR-{selectedVendor.name.substring(0,3).toUpperCase()}-2024-001</p>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 bg-[#38B2AC]/10 text-[#38B2AC] rounded-md">Active</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 mt-4 pl-2">
                      <div>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold">Start Date</p>
                        <p className="text-xs font-medium text-foreground">01 Jan 2024</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold">End Date</p>
                        <p className="text-xs font-medium text-foreground">31 Dec 2026</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="py-8 text-center bg-[#A3B1C6]/5 rounded-2xl border border-dashed border-[#A3B1C6]/30">
                    <Layers className="w-10 h-10 text-muted-foreground opacity-30 mx-auto mb-3" />
                    <p className="text-sm text-muted-foreground font-medium">No active contracts.</p>
                  </div>
                )}
              </div>
            )}
            
          </div>
        )}
      </div>

    </div>
  )
}
