"use client"

import { useState, useEffect, useMemo } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { 
  Users, CheckCircle2, Box, PieChart,
  Search, Filter, Plus, Edit2, Eye, MoreHorizontal, X, Upload,
  Mail, Phone, Trash2
} from "lucide-react"
import { HeroSection } from "@/components/ui/hero-section"
import { apiClient } from "@/lib/api-client"

export default function VendorsPage() {
  const [vendors, setVendors] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")

  // Drawer states
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  
  // Form states
  const [formData, setFormData] = useState({ name: "", type: "Hardware", email: "", phone: "", status: "Active" })

  const fetchVendors = async () => {
    try {
      setIsLoading(true);
      const res = await apiClient.get('/vendors');
      setVendors(res.data);
    } catch (err) {
      console.error("Failed to fetch vendors", err);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchVendors();
  }, [])

  const handleSave = async () => {
    if (!formData.name || !formData.type) return alert("Name and Type are required.");
    try {
      if (isEditing && editingId) {
        await apiClient.put(`/vendors/${editingId}`, formData);
      } else {
        await apiClient.post('/vendors', formData);
      }
      setIsDrawerOpen(false);
      fetchVendors();
    } catch (err) {
      console.error("Save failed", err);
      alert("Failed to save vendor.");
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this vendor?")) return;
    try {
      await apiClient.delete(`/vendors/${id}`);
      fetchVendors();
    } catch (err: any) {
      alert(err.response?.data?.error || "Failed to delete vendor.");
    }
  }

  const openCreateDrawer = () => {
    setFormData({ name: "", type: "Hardware", email: "", phone: "", status: "Active" });
    setIsEditing(false);
    setEditingId(null);
    setIsDrawerOpen(true);
  }

  const openEditDrawer = (vendor: any) => {
    setFormData({ name: vendor.name, type: vendor.type, email: vendor.email || "", phone: vendor.phone || "", status: vendor.status });
    setIsEditing(true);
    setEditingId(vendor.id);
    setIsDrawerOpen(true);
  }

  const totalVendors = vendors.length
  const activeVendors = vendors.filter(v => v.status === "Active").length
  const totalAssets = vendors.reduce((sum, v) => sum + (v._count?.assets || 0), 0)
  const topVendor = vendors.length > 0 ? vendors.reduce((prev, current) => ((prev._count?.assets || 0) > (current._count?.assets || 0)) ? prev : current) : { name: "N/A" }

  const filteredVendors = useMemo(() => {
    return vendors.filter(v => {
      const matchesSearch = v.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            v.type.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSearch;
    });
  }, [vendors, searchQuery]);

  return (
    <div className="relative min-h-[calc(100vh-80px)] overflow-hidden flex">
      
      {/* Main Content Area */}
      <div className={`flex-1 transition-all duration-500 ease-in-out p-6 md:p-8 overflow-y-auto`}>
        
        <div className="space-y-8 pb-12 mt-2">
          {/* Header */}
          <HeroSection
            title="Vendors"
            description="Manage your asset vendors and suppliers"
            imageSrc="/images/heroes/vendors.png"
          >
            <div className="flex gap-4 flex-wrap">
              <Button onClick={openCreateDrawer} className="h-12 px-6 rounded-2xl shadow-[inset_2px_2px_4px_rgba(255,255,255,0.4),inset_-2px_-2px_4px_rgba(0,0,0,0.2),0_4px_10px_rgba(108,99,255,0.3)] border border-accent/50 font-bold text-white bg-accent hover:bg-accent-light flex items-center">
                <Plus className="w-5 h-5 mr-2" /> Add Vendor
              </Button>
            </div>
          </HeroSection>

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
                  <p className="text-2xl font-display font-bold text-foreground truncate">{activeVendors}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-[24px] border-neu shadow-neu-extruded bg-background">
              <CardContent className="p-5 flex flex-col gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#F59E0B]/10 flex items-center justify-center shadow-neu-inset text-[#F59E0B]">
                  <Box className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-0.5 truncate" title="Assets Provided">Assets Provided</p>
                  <p className="text-2xl font-display font-bold text-foreground truncate">{totalAssets}</p>
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
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Toolbar */}
          <div className="flex flex-col md:flex-row justify-between gap-4">
            <div className="flex flex-1 max-w-md gap-4">
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
            </div>
          </div>

          {/* Vendors Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {isLoading ? (
               <div className="col-span-full py-12 text-center text-muted-foreground font-bold">Loading vendors...</div>
            ) : filteredVendors.length === 0 ? (
              <div className="col-span-full py-12 text-center text-muted-foreground">
                No vendors found.
              </div>
            ) : (
              filteredVendors.map((vendor) => (
                <Card 
                  key={vendor.id} 
                  className={`rounded-2xl border-neu shadow-neu-extruded bg-background overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-neu-hover`}
                >
                  <div className="h-2 w-full" style={{ backgroundColor: vendor.status === 'Active' ? '#38B2AC' : '#A3B1C6' }}></div>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center shadow-neu-inset text-accent font-display font-bold text-xl uppercase">
                        {vendor.name.substring(0, 2)}
                      </div>
                      <span className={`inline-flex px-2.5 py-1 rounded-full text-[10px] font-bold shadow-neu-inset uppercase tracking-wider ${vendor.status === 'Active' ? 'text-[#38B2AC]' : 'text-muted-foreground'}`}>
                        {vendor.status}
                      </span>
                    </div>
                    
                    <h3 className="font-bold text-lg text-foreground mb-1 line-clamp-1">{vendor.name}</h3>
                    <p className="text-xs text-accent font-bold uppercase tracking-wider mb-4">{vendor.type}</p>
                    
                    <div className="space-y-3 mb-6">
                      <div className="flex items-center gap-3 text-sm">
                        <div className="w-8 h-8 rounded-lg shadow-neu-inset flex items-center justify-center text-muted-foreground shrink-0">
                          <Mail className="w-4 h-4" />
                        </div>
                        <span className="text-foreground truncate">{vendor.email || "N/A"}</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm">
                        <div className="w-8 h-8 rounded-lg shadow-neu-inset flex items-center justify-center text-muted-foreground shrink-0">
                          <Phone className="w-4 h-4" />
                        </div>
                        <span className="text-foreground truncate">{vendor.phone || "N/A"}</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm">
                        <div className="w-8 h-8 rounded-lg shadow-neu-inset flex items-center justify-center text-muted-foreground shrink-0">
                          <Box className="w-4 h-4" />
                        </div>
                        <span className="text-foreground font-bold">{vendor._count?.assets || 0} <span className="text-muted-foreground font-normal">Assets supplied</span></span>
                      </div>
                    </div>
                    
                    <div className="pt-4 border-t border-[#A3B1C6]/20 flex justify-between gap-2">
                      <Link href={`/vendors/${vendor.id}`} className="flex-1">
                        <Button variant="ghost" className="w-full h-10 shadow-neu-inset hover:shadow-neu-extruded text-accent hover:text-accent font-bold">
                          <Eye className="w-4 h-4 mr-2" /> View
                        </Button>
                      </Link>
                      <Button variant="ghost" className="flex-1 h-10 shadow-neu-inset hover:shadow-neu-extruded text-accent hover:text-accent font-bold" onClick={(e) => { e.stopPropagation(); openEditDrawer(vendor); }}>
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" className="flex-1 h-10 shadow-neu-inset hover:shadow-neu-extruded text-red-500 hover:text-red-600 font-bold" onClick={(e) => { e.stopPropagation(); handleDelete(vendor.id); }}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Slide-Over Drawer for Vendor Form */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setIsDrawerOpen(false)}></div>
          
          <div className="relative w-full max-w-xl h-full bg-background shadow-[-10px_0_30px_rgba(0,0,0,0.1)] border-l border-white/50 flex flex-col animate-in slide-in-from-right duration-300">
            <div className="px-8 py-6 flex justify-between items-center border-b border-[#A3B1C6]/20">
              <div>
                <h2 className="text-2xl font-bold text-foreground">{isEditing ? 'Edit Vendor' : 'Add Vendor'}</h2>
                <p className="text-sm text-muted-foreground font-medium">Manage vendor details</p>
              </div>
              <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl hover:bg-red-50 hover:text-red-500 hover:shadow-neu-inset" onClick={() => setIsDrawerOpen(false)}>
                <X className="w-5 h-5" />
              </Button>
            </div>

            <div className="flex-1 overflow-y-auto px-8 py-6 space-y-6">
              <div className="space-y-6 animate-in fade-in">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Vendor Name *</label>
                  <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="e.g. Dell EMC" className="w-full h-12 px-4 bg-background shadow-neu-inset border-neu rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-accent/50 text-foreground" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Type *</label>
                  <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} className="w-full h-12 px-4 bg-background shadow-neu-inset border-neu rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-accent/50 text-foreground">
                    <option value="Hardware">Hardware</option>
                    <option value="Software">Software</option>
                    <option value="Service">Service</option>
                    <option value="Network">Network</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Status</label>
                  <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className="w-full h-12 px-4 bg-background shadow-neu-inset border-neu rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-accent/50 text-foreground">
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Email</label>
                  <input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} placeholder="contact@vendor.com" className="w-full h-12 px-4 bg-background shadow-neu-inset border-neu rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-accent/50 text-foreground" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Phone</label>
                  <input type="text" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} placeholder="+1 234 567 890" className="w-full h-12 px-4 bg-background shadow-neu-inset border-neu rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-accent/50 text-foreground" />
                </div>
              </div>
            </div>

            <div className="px-8 py-6 border-t border-[#A3B1C6]/20 bg-background flex justify-end gap-4">
              <Button variant="outline" className="h-12 px-8 rounded-2xl shadow-neu-extruded border-neu font-bold text-foreground" onClick={() => setIsDrawerOpen(false)}>
                Cancel
              </Button>
              <Button className="h-12 px-8 rounded-2xl shadow-[inset_2px_2px_4px_rgba(255,255,255,0.4),inset_-2px_-2px_4px_rgba(0,0,0,0.2),0_4px_10px_rgba(108,99,255,0.3)] border border-accent/50 font-bold text-white bg-accent hover:bg-accent-light" onClick={handleSave}>
                {isEditing ? 'Save Changes' : 'Create Vendor'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
