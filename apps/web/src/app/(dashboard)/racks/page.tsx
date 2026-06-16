"use client"

import { useState, useEffect, useMemo } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Server, Box, Search, Plus, Edit2, Trash2, X, Eye, Activity, CheckCircle2 } from "lucide-react"
import { apiClient } from "@/lib/api-client"
import { HeroSection } from "@/components/ui/hero-section"
import Link from "next/link"

export default function RacksPage() {
  const [locations, setLocations] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")

  // Edit Drawer
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({ name: "", type: "Rack", parentLoc: "", capacity: "42" })
  const [rooms, setRooms] = useState<any[]>([])
  const [parentRacks, setParentRacks] = useState<any[]>([])

  // Visualizer Drawer
  const [isVisualizerOpen, setIsVisualizerOpen] = useState(false)
  const [visualizingRack, setVisualizingRack] = useState<any>(null)
  const [rackLayout, setRackLayout] = useState<any>(null)
  const [isVisualizerLoading, setIsVisualizerLoading] = useState(false)

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const res = await apiClient.get('/locations');
      const racks = res.data.filter((loc: any) => loc.type === "Rack" || loc.type === "Subrack");
      setLocations(racks);
      setParentRacks(racks.filter((loc: any) => loc.type === "Rack"));
      setRooms(res.data.filter((loc: any) => loc.type === "Room"));
    } catch (err) {
      console.error("Failed to fetch", err);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => { fetchData(); }, [])

  const handleSave = async () => {
    if (!formData.name) return alert("Name is required.");
    try {
      if (isEditing && editingId) {
        await apiClient.put(`/locations/${editingId}`, formData);
      } else {
        await apiClient.post('/locations', formData);
      }
      setIsDrawerOpen(false);
      fetchData();
    } catch (err) {
      alert("Failed to save.");
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    try {
      await apiClient.delete(`/locations/${id}`);
      fetchData();
    } catch (err: any) {
      alert(err.response?.data?.error || "Failed to delete.");
    }
  }

  const openCreateDrawer = () => {
    setFormData({ name: "", type: "Rack", parentLoc: "", capacity: "42" });
    setIsEditing(false);
    setEditingId(null);
    setIsDrawerOpen(true);
  }

  const openEditDrawer = (loc: any) => {
    setFormData({ name: loc.name, type: loc.type, parentLoc: loc.parentLoc || "", capacity: loc.capacity?.toString() || "42" });
    setIsEditing(true);
    setEditingId(loc.id);
    setIsDrawerOpen(true);
  }

  const openVisualizer = async (rack: any) => {
    setVisualizingRack(rack);
    setIsVisualizerOpen(true);
    setIsVisualizerLoading(true);
    try {
      const res = await apiClient.get(`/locations/racks/${encodeURIComponent(rack.name)}/visualization`);
      setRackLayout(res.data);
    } catch (err) {
      console.error("Failed to fetch rack layout", err);
      alert("Failed to load rack visualization.");
    } finally {
      setIsVisualizerLoading(false);
    }
  }

  const filtered = useMemo(() => locations.filter(l => l.name.toLowerCase().includes(searchQuery.toLowerCase())), [locations, searchQuery]);

  return (
    <div className="space-y-8 pb-12 mt-2">
      <HeroSection title="Racks Engine" description="Manage and visualize 42U server racks." imageSrc="/images/heroes/racks.png">
        <Button onClick={openCreateDrawer} className="h-12 px-6 rounded-2xl shadow-[inset_2px_2px_4px_rgba(255,255,255,0.4),inset_-2px_-2px_4px_rgba(0,0,0,0.2),0_4px_10px_rgba(108,99,255,0.3)] border border-accent/50 font-bold text-white bg-accent hover:bg-accent-light flex items-center">
          <Plus className="w-5 h-5 mr-2" /> Add Rack
        </Button>
      </HeroSection>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        <Card className="rounded-[24px] border-neu shadow-neu-extruded bg-background">
          <CardContent className="p-5 flex flex-col gap-3">
            <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center text-accent shadow-neu-inset">
              <Server className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-0.5 truncate">Total Racks</p>
              <p className="text-2xl font-display font-bold text-foreground truncate">{locations.length}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="rounded-[24px] border-neu shadow-neu-extruded bg-background">
          <CardContent className="p-5 flex flex-col gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#38B2AC]/10 flex items-center justify-center text-[#38B2AC] shadow-neu-inset">
              <Box className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-0.5 truncate">Total Assets</p>
              <p className="text-2xl font-display font-bold text-foreground truncate">{locations.reduce((sum, s) => sum + (s._count?.assets || 0), 0)}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-[24px] border-neu shadow-neu-extruded bg-background">
          <CardContent className="p-5 flex flex-col gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#F59E0B]/10 flex items-center justify-center text-[#F59E0B] shadow-neu-inset">
              <Activity className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-0.5 truncate">Avg Utilization</p>
              <p className="text-2xl font-display font-bold text-foreground truncate">
                {locations.length ? Math.round((locations.reduce((sum, s) => sum + (s._count?.assets || 0), 0) / locations.reduce((sum, s) => sum + (s.capacity || 42), 0)) * 100) : 0}%
              </p>
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
              placeholder="Search racks..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-12 pl-12 pr-4 bg-background shadow-neu-inset border-t border-l border-[#A3B1C6]/30 border-b border-r border-white/60 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-accent/50 text-foreground" 
            />
          </div>
        </div>
      </div>

      <Card className="rounded-[32px] border-neu shadow-neu-extruded bg-background overflow-hidden">
        <div className="overflow-x-auto pb-4">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr>
                <th className="px-8 py-6 font-bold text-xs uppercase tracking-wider text-muted-foreground border-b border-[#A3B1C6]/20">Rack Info</th>
                <th className="px-6 py-6 font-bold text-xs uppercase tracking-wider text-muted-foreground border-b border-[#A3B1C6]/20">Parent Room</th>
                <th className="px-6 py-6 font-bold text-xs uppercase tracking-wider text-muted-foreground border-b border-[#A3B1C6]/20">Installed Assets</th>
                <th className="px-8 py-6 font-bold text-xs uppercase tracking-wider text-muted-foreground border-b border-[#A3B1C6]/20 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#A3B1C6]/10">
              {isLoading ? (
                <tr><td colSpan={4} className="px-8 py-12 text-center text-muted-foreground font-bold">Loading racks...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={4} className="px-8 py-12 text-center text-muted-foreground">No racks found.</td></tr>
              ) : filtered.map(l => (
                <tr key={l.id} className="group hover:bg-[#A3B1C6]/10 transition-all duration-300 hover:shadow-[inset_4px_0_0_0_#6C63FF]">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center text-accent shadow-neu-inset shrink-0">
                        <Server className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-bold text-foreground">{l.name}</p>
                        <p className="text-xs font-mono text-muted-foreground mt-0.5">{l.capacity || 42}U Capacity</p>
                      </div>
                    </div>
                  </td>
                    <td className="px-6 py-5">
                    <span className="font-medium text-foreground bg-background shadow-neu-inset px-3 py-1.5 rounded-lg text-sm">
                      {l.type === "Subrack" 
                        ? (parentRacks.find(r => r.id === l.parentLoc)?.name || "-") 
                        : (rooms.find(s => s.id === l.parentLoc)?.name || "-")}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex flex-col gap-1.5">
                      <div className="flex justify-between items-center max-w-[120px]">
                        <span className="font-bold text-sm">{l._count?.assets || 0}</span>
                        <span className="text-[10px] font-bold text-muted-foreground">{Math.round(((l._count?.assets || 0) / (l.capacity || 42)) * 100)}%</span>
                      </div>
                      <div className="w-[120px] h-1.5 bg-background shadow-neu-inset rounded-full overflow-hidden">
                        <div className="h-full bg-accent" style={{ width: `${Math.min(((l._count?.assets || 0) / (l.capacity || 42)) * 100, 100)}%` }}></div>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-[#38B2AC] hover:text-[#38B2AC] hover:bg-[#38B2AC]/10" onClick={() => openVisualizer(l)} title="Visualize Rack">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-accent hover:text-accent hover:bg-accent/10" onClick={() => openEditDrawer(l)} title="Edit Rack">
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-red-500 hover:text-red-600 hover:bg-red-50" onClick={() => handleDelete(l.id)} title="Delete Rack">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Slide-Over Drawer for Rack Creation/Editing */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsDrawerOpen(false)}></div>
          <div className="relative w-full max-w-lg h-full bg-background shadow-[-20px_0_40px_rgba(0,0,0,0.2)] border-l border-white/50 flex flex-col animate-in slide-in-from-right duration-300">
            
            {/* Header */}
            <div className="relative h-40 bg-gradient-to-br from-accent/20 to-accent/5 border-b border-[#A3B1C6]/20 overflow-hidden shrink-0">
              <div className="absolute top-0 right-0 p-8 opacity-10">
                <Server className="w-48 h-48 text-accent transform rotate-12 translate-x-12 -translate-y-8" />
              </div>
              <div className="absolute inset-0 flex flex-col justify-end p-8 z-10">
                <Button variant="ghost" size="icon" className="absolute top-6 right-6 h-10 w-10 rounded-xl hover:bg-white/50 hover:text-red-500 shadow-neu-inset bg-background/50 backdrop-blur-md" onClick={() => setIsDrawerOpen(false)}>
                  <X className="w-5 h-5" />
                </Button>
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-background shadow-neu-extruded flex items-center justify-center text-accent">
                    <Server className="w-7 h-7" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-foreground tracking-tight">{isEditing ? 'Edit Rack' : 'Create New Rack'}</h2>
                    <p className="text-sm font-bold text-muted-foreground">Configure physical server housing</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Scrollable Form Content */}
            <div className="flex-1 overflow-y-auto p-8 space-y-8 bg-muted/10">
              
              <div className="bg-background rounded-[24px] p-6 shadow-neu-extruded border border-white/60 space-y-6">
                <div className="space-y-3">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                    <Server className="w-4 h-4 text-accent" /> Rack Identification *
                  </label>
                  <input 
                    type="text" 
                    value={formData.name} 
                    onChange={e => setFormData({...formData, name: e.target.value})} 
                    placeholder="e.g. RACK-A01" 
                    className="w-full h-14 px-5 bg-background shadow-neu-inset border-t border-l border-[#A3B1C6]/30 border-b border-r border-white/60 rounded-xl text-base font-bold focus:outline-none focus:ring-2 focus:ring-accent/50 text-foreground transition-all uppercase placeholder:normal-case" 
                  />
                  <p className="text-[10px] font-bold text-muted-foreground">This name must be unique and will be used as the physical location identifier.</p>
                </div>

                <div className="w-full h-px bg-[#A3B1C6]/20"></div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                      <Server className="w-4 h-4 text-accent" /> Rack Type
                    </label>
                    <div className="relative">
                      <select 
                        value={formData.type} 
                        onChange={e => setFormData({
                          ...formData, 
                          type: e.target.value,
                          parentLoc: "",
                          capacity: e.target.value === "Subrack" ? "14" : "42"
                        })} 
                        className="w-full h-14 px-5 bg-background shadow-neu-inset border-t border-l border-[#A3B1C6]/30 border-b border-r border-white/60 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-accent/50 text-foreground appearance-none transition-all cursor-pointer"
                      >
                        <option value="Rack">Full Rack (Typically 42U)</option>
                        <option value="Subrack">Subrack (Typically 14U)</option>
                      </select>
                      <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none">
                        <div className="w-2 h-2 border-b-2 border-r-2 border-muted-foreground transform rotate-45"></div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                      <Box className="w-4 h-4 text-[#F59E0B]" /> Parent Location
                    </label>
                    <div className="relative">
                      <select 
                        value={formData.parentLoc} 
                        onChange={e => setFormData({...formData, parentLoc: e.target.value})} 
                        className="w-full h-14 px-5 bg-background shadow-neu-inset border-t border-l border-[#A3B1C6]/30 border-b border-r border-white/60 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-accent/50 text-foreground appearance-none transition-all cursor-pointer"
                      >
                        <option value="">-- Standalone --</option>
                        {formData.type === "Subrack" 
                          ? parentRacks.map(r => <option key={r.id} value={r.id}>{r.name} (Rack)</option>)
                          : rooms.map(s => <option key={s.id} value={s.id}>{s.name} (Room)</option>)
                        }
                      </select>
                      <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none">
                        <div className="w-2 h-2 border-b-2 border-r-2 border-muted-foreground transform rotate-45"></div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3 md:col-span-2">
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                      <Activity className="w-4 h-4 text-[#38B2AC]" /> Capacity (U)
                    </label>
                    <input 
                      type="number" 
                      value={formData.capacity} 
                      onChange={e => setFormData({...formData, capacity: e.target.value})} 
                      placeholder="42" 
                      min="1"
                      className="w-full h-14 px-5 bg-background shadow-neu-inset border-t border-l border-[#A3B1C6]/30 border-b border-r border-white/60 rounded-xl text-base font-bold focus:outline-none focus:ring-2 focus:ring-accent/50 text-foreground transition-all" 
                    />
                  </div>
                </div>
              </div>

              <div className="bg-[#38B2AC]/10 rounded-[24px] p-6 border border-[#38B2AC]/20 shadow-neu-inset flex gap-4 items-start">
                <div className="w-10 h-10 rounded-xl bg-background shadow-neu-extruded flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-5 h-5 text-[#38B2AC]" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#38B2AC] mb-1">Dynamic Rack Capacity</h4>
                  <p className="text-xs font-medium text-[#38B2AC]/80">This rack will be configured with {formData.capacity || 42} units of physical space. The visualizer will dynamically adapt to this capacity.</p>
                </div>
              </div>

            </div>

            {/* Footer */}
            <div className="p-6 border-t border-[#A3B1C6]/20 bg-background flex justify-end gap-4 shadow-[0_-10px_20px_rgba(0,0,0,0.02)] shrink-0 z-10">
              <Button variant="outline" className="h-14 px-8 rounded-2xl shadow-neu-extruded border-neu font-bold text-foreground hover:text-accent transition-colors" onClick={() => setIsDrawerOpen(false)}>
                Cancel
              </Button>
              <Button className="h-14 px-10 rounded-2xl shadow-[inset_2px_2px_4px_rgba(255,255,255,0.4),inset_-2px_-2px_4px_rgba(0,0,0,0.2),0_4px_10px_rgba(108,99,255,0.3)] border border-accent/50 font-bold text-white bg-accent hover:bg-accent-light transition-all text-base" onClick={handleSave}>
                {isEditing ? 'Save Details' : 'Create Rack'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Visualizer Drawer */}
      {isVisualizerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsVisualizerOpen(false)}></div>
          <div className="relative w-full max-w-2xl h-full bg-background shadow-[-10px_0_30px_rgba(0,0,0,0.3)] border-l border-white/20 flex flex-col animate-in slide-in-from-right duration-300">
            
            {/* Header */}
            <div className="px-8 py-6 border-b border-[#A3B1C6]/20 bg-background/95 backdrop-blur z-10 flex justify-between items-center shadow-neu-extruded">
              <div>
                <h2 className="text-2xl font-bold flex items-center gap-3 text-foreground">
                  <Server className="w-6 h-6 text-accent" />
                  {visualizingRack?.name}
                </h2>
                <div className="flex items-center gap-3 mt-2">
                  <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{rackLayout?.height_u}U Rack Layout</span>
                  {!isVisualizerLoading && rackLayout && (
                    <span className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border shadow-neu-inset ${rackLayout.utilization_percentage > 80 ? 'bg-red-500/10 text-red-500 border-red-500/20' : 'bg-[#38B2AC]/10 text-[#38B2AC] border-[#38B2AC]/20'}`}>
                      {rackLayout.utilization_percentage}% Utilized
                    </span>
                  )}
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setIsVisualizerOpen(false)} className="h-10 w-10 rounded-xl hover:bg-red-50 hover:text-red-500 hover:shadow-neu-inset">
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Content area: Dark background for rack */}
            <div className="flex-1 overflow-y-auto bg-[#1A202C] p-8 flex justify-center custom-scrollbar">
              {isVisualizerLoading ? (
                <div className="flex flex-col items-center justify-center w-full h-full text-white/50 font-bold space-y-4">
                  <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
                  <p>Initializing Rack Geometry...</p>
                </div>
              ) : rackLayout ? (
                <div className="w-full max-w-md bg-[#2D3748] rounded-[24px] p-6 shadow-2xl border-[6px] border-[#11141C] relative">
                  
                  {/* Top Vent */}
                  <div className="w-full h-4 mb-6 flex justify-between px-2 opacity-50">
                     {[...Array(12)].map((_,i) => <div key={i} className="w-1.5 h-full bg-[#11141C] rounded-full"></div>)}
                  </div>

                  {/* Render U slots */}
                  <div className="flex flex-col gap-[3px]">
                    {Array.from({length: rackLayout.height_u}, (_, i) => rackLayout.height_u - i).map(uPos => {
                      const assetInSlot = rackLayout.assets.find((a: any) => a.u_position === uPos);
                      
                      return (
                        <div key={uPos} className="relative w-full h-[44px] flex items-center group">
                          {/* U Position Label on the left rail */}
                          <div className="absolute -left-12 text-[11px] font-mono font-bold text-white/40 w-10 text-right pr-2 border-r-2 border-white/10 group-hover:text-white/80 transition-colors">
                            {uPos}
                          </div>
                          
                          {/* Slot Content */}
                          <div className={`w-full h-full rounded flex items-center px-4 transition-all duration-300 ${
                            assetInSlot 
                              ? assetInSlot.status === 'Active' ? 'bg-gradient-to-r from-[#2C7A7B] to-[#285E61] border border-[#38B2AC]/40 shadow-[inset_0_0_12px_rgba(56,178,172,0.3)] cursor-pointer hover:shadow-[0_0_15px_rgba(56,178,172,0.4)]'
                              : assetInSlot.status === 'Maintenance' ? 'bg-gradient-to-r from-[#9C4221] to-[#7B341E] border border-[#F59E0B]/40 cursor-pointer'
                              : 'bg-gradient-to-r from-[#9B2C2C] to-[#742A2A] border border-red-500/40 cursor-pointer'
                              : 'bg-[#1A202C]/50 border border-white/5 hover:bg-[#1A202C] hover:border-white/10'
                          }`}>
                            {assetInSlot ? (
                              <Link href={`/assets/${assetInSlot.asset_tag}`} className="flex w-full items-center justify-between" onClick={e => e.stopPropagation()}>
                                <div className="flex items-center gap-4">
                                  <div className={`w-2 h-2 rounded-full shadow-[0_0_8px_currentColor] ${assetInSlot.status === 'Active' ? 'text-[#4FD1C5] bg-[#4FD1C5]' : assetInSlot.status === 'Maintenance' ? 'text-[#F6AD55] bg-[#F6AD55]' : 'text-[#FC8181] bg-[#FC8181]'} animate-pulse`}></div>
                                  <span className="text-white text-xs font-mono font-bold tracking-wider">{assetInSlot.asset_tag}</span>
                                  <span className="text-white/60 text-[10px] hidden sm:block truncate max-w-[140px] uppercase">{assetInSlot.manufacturer} {assetInSlot.model}</span>
                                </div>
                                <div className="flex flex-col items-end gap-1">
                                  <span className="text-white/30 text-[10px] group-hover:text-white/80 transition-colors">
                                    {assetInSlot.status}
                                  </span>
                                  {assetInSlot.is_chassis && (
                                    <span className="text-[#F6AD55] bg-[#F6AD55]/10 px-1.5 rounded text-[8px] font-bold border border-[#F6AD55]/30">CHASSIS</span>
                                  )}
                                </div>
                              </Link>
                            ) : (
                              <div className="flex w-full items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
                                <span className="text-white/30 text-[10px] font-bold tracking-widest uppercase">Available</span>
                                <span className="text-white/30 text-[10px] font-bold"><Plus className="w-3 h-3" /></span>
                              </div>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>

                  {/* Bottom Vent */}
                  <div className="w-full h-4 mt-8 flex justify-between px-2 opacity-50">
                     {[...Array(12)].map((_,i) => <div key={i} className="w-1.5 h-full bg-[#11141C] rounded-full"></div>)}
                  </div>

                </div>
              ) : (
                <div className="flex items-center justify-center w-full h-full text-red-500 font-bold bg-red-500/10 border border-red-500/20 rounded-2xl p-6">
                  Failed to load rack geometry data.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
