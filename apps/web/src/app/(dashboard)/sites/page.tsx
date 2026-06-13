"use client"

import { useState, useEffect, useMemo } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  Globe, CheckCircle2, Box, Zap, MapPin, Search, 
  Plus, Edit2, Trash2, X, Upload
} from "lucide-react"
import { apiClient } from "@/lib/api-client"
import { HeroSection } from "@/components/ui/hero-section"

export default function SitesPage() {
  const [sites, setSites] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")

  // Drawer states
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  
  // Form states
  const [formData, setFormData] = useState({ name: "", type: "Site" })

  const fetchSites = async () => {
    try {
      setIsLoading(true);
      const res = await apiClient.get('/locations');
      // Filter only sites
      setSites(res.data.filter((loc: any) => loc.type === "Site"));
    } catch (err) {
      console.error("Failed to fetch sites", err);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchSites();
  }, [])

  const handleSave = async () => {
    if (!formData.name) return alert("Name is required.");
    try {
      if (isEditing && editingId) {
        await apiClient.put(`/locations/${editingId}`, formData);
      } else {
        await apiClient.post('/locations', formData);
      }
      setIsDrawerOpen(false);
      fetchSites();
    } catch (err) {
      console.error("Save failed", err);
      alert("Failed to save site.");
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this site?")) return;
    try {
      await apiClient.delete(`/locations/${id}`);
      fetchSites();
    } catch (err: any) {
      alert(err.response?.data?.error || "Failed to delete site.");
    }
  }

  const openCreateDrawer = () => {
    setFormData({ name: "", type: "Site" });
    setIsEditing(false);
    setEditingId(null);
    setIsDrawerOpen(true);
  }

  const openEditDrawer = (site: any) => {
    setFormData({ name: site.name, type: site.type });
    setIsEditing(true);
    setEditingId(site.id);
    setIsDrawerOpen(true);
  }

  const totalSites = sites.length
  const totalAssets = sites.reduce((sum, s) => sum + (s._count?.assets || 0), 0)

  const filteredSites = useMemo(() => {
    return sites.filter(s => {
      const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSearch;
    });
  }, [sites, searchQuery]);

  return (
    <div className="relative min-h-[calc(100vh-80px)] overflow-hidden flex">
      <div className={`flex-1 transition-all duration-500 ease-in-out p-6 md:p-8 overflow-y-auto`}>
        
        <div className="space-y-8 pb-12 mt-2">
          {/* Header */}
          <HeroSection
            title="Sites"
            description="Manage all data center sites and locations"
            imageSrc="/images/heroes/sites.png"
          >
            <div className="flex gap-4 flex-wrap">
              <Button onClick={openCreateDrawer} className="h-12 px-6 rounded-2xl shadow-[inset_2px_2px_4px_rgba(255,255,255,0.4),inset_-2px_-2px_4px_rgba(0,0,0,0.2),0_4px_10px_rgba(108,99,255,0.3)] border border-accent/50 font-bold text-white bg-accent hover:bg-accent-light flex items-center">
                <Plus className="w-5 h-5 mr-2" /> Add Site
              </Button>
            </div>
          </HeroSection>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
            <Card className="rounded-[24px] border-neu shadow-neu-extruded bg-background">
              <CardContent className="p-5 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#007DB8]/10 flex items-center justify-center shadow-neu-inset text-[#007DB8]">
                  <Globe className="w-6 h-6" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-bold text-[#007DB8] uppercase tracking-wider mb-0.5 truncate">Total Sites</p>
                  <p className="text-2xl font-display font-bold text-foreground truncate leading-none">{totalSites}</p>
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
                  <p className="text-2xl font-display font-bold text-foreground truncate leading-none">{totalSites}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-[24px] border-neu shadow-neu-extruded bg-background">
              <CardContent className="p-5 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#F59E0B]/10 flex items-center justify-center shadow-neu-inset text-[#F59E0B]">
                  <Box className="w-6 h-6" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-bold text-[#F59E0B] uppercase tracking-wider mb-0.5 truncate">Total Assets</p>
                  <p className="text-2xl font-display font-bold text-foreground truncate leading-none">{totalAssets}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="flex flex-col md:flex-row justify-between gap-4">
            <div className="flex flex-1 max-w-md gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input 
                  type="text" 
                  placeholder="Search sites..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-12 pl-12 pr-4 bg-background shadow-neu-inset border-t border-l border-[#A3B1C6]/30 border-b border-r border-white/60 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-accent/50 text-foreground" 
                />
              </div>
            </div>
          </div>

          {/* Sites Table */}
          <Card className="rounded-[32px] border-neu shadow-neu-extruded bg-background overflow-hidden">
            <div className="overflow-x-auto pb-4">
              <table className="w-full text-left border-collapse whitespace-nowrap">
                <thead>
                  <tr>
                    <th className="px-6 py-6 font-bold text-xs uppercase tracking-wider text-muted-foreground border-b border-[#A3B1C6]/20">Site Name</th>
                    <th className="px-6 py-6 font-bold text-xs uppercase tracking-wider text-muted-foreground border-b border-[#A3B1C6]/20">Assets</th>
                    <th className="px-6 py-6 font-bold text-xs uppercase tracking-wider text-muted-foreground border-b border-[#A3B1C6]/20 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#A3B1C6]/10">
                  {isLoading ? (
                    <tr><td colSpan={3} className="px-6 py-12 text-center text-muted-foreground font-bold">Loading sites...</td></tr>
                  ) : filteredSites.length === 0 ? (
                    <tr><td colSpan={3} className="px-6 py-12 text-center text-muted-foreground">No sites found.</td></tr>
                  ) : (
                    filteredSites.map((site) => (
                      <tr key={site.id} className="group hover:bg-[#A3B1C6]/10 transition-all duration-300">
                        <td className="px-6 py-5">
                          <p className="font-bold text-foreground text-base">{site.name}</p>
                        </td>
                        <td className="px-6 py-5 font-bold text-foreground">
                          {site._count?.assets || 0}
                        </td>
                        <td className="px-6 py-5 text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-accent hover:text-accent hover:bg-accent/10" onClick={() => openEditDrawer(site)}>
                              <Edit2 className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-red-500 hover:text-red-600 hover:bg-red-50" onClick={() => handleDelete(site.id)}>
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </div>

      {/* Drawer */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setIsDrawerOpen(false)}></div>
          
          <div className="relative w-full max-w-xl h-full bg-background shadow-[-10px_0_30px_rgba(0,0,0,0.1)] border-l border-white/50 flex flex-col animate-in slide-in-from-right duration-300">
            <div className="px-8 py-6 flex justify-between items-center border-b border-[#A3B1C6]/20">
              <div>
                <h2 className="text-2xl font-bold text-foreground">{isEditing ? 'Edit Site' : 'Add Site'}</h2>
              </div>
              <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl hover:bg-red-50 hover:text-red-500 hover:shadow-neu-inset" onClick={() => setIsDrawerOpen(false)}>
                <X className="w-5 h-5" />
              </Button>
            </div>

            <div className="flex-1 overflow-y-auto px-8 py-6 space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-muted-foreground uppercase">Site Name *</label>
                <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full h-12 px-4 bg-background shadow-neu-inset border-neu rounded-xl text-sm font-bold text-foreground focus:ring-2 focus:ring-accent/50 outline-none" />
              </div>
            </div>

            <div className="px-8 py-6 border-t border-[#A3B1C6]/20 bg-background flex justify-end gap-4">
              <Button variant="outline" className="h-12 px-8 rounded-2xl shadow-neu-extruded border-neu font-bold text-foreground" onClick={() => setIsDrawerOpen(false)}>Cancel</Button>
              <Button className="h-12 px-8 rounded-2xl border border-accent/50 font-bold text-white bg-accent shadow-[inset_2px_2px_4px_rgba(255,255,255,0.4),inset_-2px_-2px_4px_rgba(0,0,0,0.2),0_4px_10px_rgba(108,99,255,0.3)] hover:bg-accent-light" onClick={handleSave}>
                {isEditing ? 'Save' : 'Create'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
