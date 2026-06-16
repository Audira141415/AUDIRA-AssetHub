"use client"

import { useState, useEffect, useMemo } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  DoorOpen, Box, Search, Plus, Edit2, Trash2, X, Layers
} from "lucide-react"
import { apiClient } from "@/lib/api-client"
import { HeroSection } from "@/components/ui/hero-section"

export default function RoomsPage() {
  const [locations, setLocations] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")

  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  
  const [formData, setFormData] = useState({ name: "", type: "Room", parentLoc: "" })
  const [floors, setFloors] = useState<any[]>([])

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const res = await apiClient.get('/locations');
      setLocations(res.data.filter((loc: any) => loc.type === "Room"));
      setFloors(res.data.filter((loc: any) => loc.type === "Floor"));
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
    if (!confirm("Are you sure you want to delete this room?")) return;
    try {
      await apiClient.delete(`/locations/${id}`);
      fetchData();
    } catch (err: any) {
      alert(err.response?.data?.error || "Failed to delete.");
    }
  }

  const openCreateDrawer = () => {
    setFormData({ name: "", type: "Room", parentLoc: "" });
    setIsEditing(false);
    setEditingId(null);
    setIsDrawerOpen(true);
  }

  const openEditDrawer = (loc: any) => {
    setFormData({ name: loc.name, type: loc.type, parentLoc: loc.parentLoc || "" });
    setIsEditing(true);
    setEditingId(loc.id);
    setIsDrawerOpen(true);
  }

  const totalRooms = locations.length;
  const totalAssets = locations.reduce((sum, s) => sum + (s._count?.assets || 0), 0);

  const filtered = useMemo(() => {
    return locations.filter(l => 
      l.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [locations, searchQuery]);

  return (
    <div className="relative min-h-[calc(100vh-80px)] overflow-hidden flex">
      <div className="flex-1 transition-all duration-500 ease-in-out p-6 md:p-8 overflow-y-auto">
        
        <div className="space-y-8 pb-12 mt-2">
          {/* Header */}
          <HeroSection 
            title="Rooms" 
            description="Manage rooms and specialized areas within floors" 
            imageSrc="/images/heroes/rooms.png"
          >
            <div className="flex gap-4 flex-wrap">
              <Button onClick={openCreateDrawer} className="h-12 px-6 rounded-2xl shadow-[inset_2px_2px_4px_rgba(255,255,255,0.4),inset_-2px_-2px_4px_rgba(0,0,0,0.2),0_4px_10px_rgba(108,99,255,0.3)] border border-accent/50 font-bold text-white bg-accent hover:bg-accent-light flex items-center">
                <Plus className="w-5 h-5 mr-2" /> Add Room
              </Button>
            </div>
          </HeroSection>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5">
            <Card className="rounded-[24px] border-neu shadow-neu-extruded bg-background">
              <CardContent className="p-5 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#3B82F6]/10 flex items-center justify-center shadow-neu-inset text-[#3B82F6]">
                  <DoorOpen className="w-6 h-6" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-bold text-[#3B82F6] uppercase tracking-wider mb-0.5 truncate">Total Rooms</p>
                  <p className="text-2xl font-display font-bold text-foreground truncate leading-none">{totalRooms}</p>
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

          {/* Search Bar */}
          <div className="flex flex-col md:flex-row justify-between gap-4">
            <div className="flex flex-1 max-w-md gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input 
                  type="text" 
                  placeholder="Search rooms..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-12 pl-12 pr-4 bg-background shadow-neu-inset border-t border-l border-[#A3B1C6]/30 border-b border-r border-white/60 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-accent/50 text-foreground" 
                />
              </div>
            </div>
          </div>

          {/* Rooms Table */}
          <Card className="rounded-[32px] border-neu shadow-neu-extruded bg-background overflow-hidden">
            <div className="overflow-x-auto pb-4">
              <table className="w-full text-left border-collapse whitespace-nowrap">
                <thead>
                  <tr>
                    <th className="px-6 py-6 font-bold text-xs uppercase tracking-wider text-muted-foreground border-b border-[#A3B1C6]/20">Room Name</th>
                    <th className="px-6 py-6 font-bold text-xs uppercase tracking-wider text-muted-foreground border-b border-[#A3B1C6]/20">Parent Floor</th>
                    <th className="px-6 py-6 font-bold text-xs uppercase tracking-wider text-muted-foreground border-b border-[#A3B1C6]/20">Assets</th>
                    <th className="px-6 py-6 font-bold text-xs uppercase tracking-wider text-muted-foreground border-b border-[#A3B1C6]/20 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#A3B1C6]/10">
                  {isLoading ? (
                    <tr><td colSpan={4} className="px-6 py-12 text-center text-muted-foreground font-bold">Loading rooms...</td></tr>
                  ) : filtered.length === 0 ? (
                    <tr><td colSpan={4} className="px-6 py-12 text-center text-muted-foreground">No rooms found.</td></tr>
                  ) : (
                    filtered.map(l => (
                      <tr key={l.id} className="group hover:bg-[#A3B1C6]/10 transition-all duration-300">
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-[#3B82F6]/10 text-[#3B82F6] flex items-center justify-center shrink-0">
                              <DoorOpen className="w-4 h-4" />
                            </div>
                            <p className="font-bold text-foreground text-base">{l.name}</p>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          {l.parentLoc ? (
                            <div className="flex items-center gap-2 text-muted-foreground font-medium">
                              <DoorOpen className="w-4 h-4 text-[#3B82F6]" />
                              <span>{floors.find(s => s.id === l.parentLoc)?.name || "Unknown Floor"}</span>
                            </div>
                          ) : (
                            <span className="text-muted-foreground italic">-</span>
                          )}
                        </td>
                        <td className="px-6 py-5 font-bold text-foreground">
                          {l._count?.assets || 0}
                        </td>
                        <td className="px-6 py-5 text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-accent hover:text-accent hover:bg-accent/10" onClick={() => openEditDrawer(l)}>
                              <Edit2 className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-red-500 hover:text-red-600 hover:bg-red-50" onClick={() => handleDelete(l.id)}>
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
                <h2 className="text-2xl font-bold text-foreground">{isEditing ? 'Edit Room' : 'Add Room'}</h2>
                <p className="text-sm text-muted-foreground font-medium">Configure room details and floor hierarchy</p>
              </div>
              <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl hover:bg-red-50 hover:text-red-500 hover:shadow-neu-inset transition-all" onClick={() => setIsDrawerOpen(false)}>
                <X className="w-5 h-5" />
              </Button>
            </div>

            <div className="flex-1 overflow-y-auto px-8 py-6 space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-muted-foreground uppercase">Room Name *</label>
                <input 
                  type="text" 
                  value={formData.name} 
                  onChange={e => setFormData({...formData, name: e.target.value})} 
                  placeholder="e.g. Server Room A, Meeting Room..."
                  className="w-full h-12 px-4 bg-background shadow-neu-inset border-none rounded-xl text-sm font-bold text-foreground focus:ring-2 focus:ring-accent/50 outline-none" 
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-xs font-bold text-muted-foreground uppercase">Parent Floor</label>
                <div className="relative">
                  <DoorOpen className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground z-10" />
                  <select 
                    value={formData.parentLoc} 
                    onChange={e => setFormData({...formData, parentLoc: e.target.value})} 
                    className="w-full h-12 pl-10 pr-4 bg-background shadow-neu-inset border-none rounded-xl text-sm font-bold text-foreground focus:ring-2 focus:ring-accent/50 outline-none appearance-none cursor-pointer"
                  >
                    <option value="">Select a Floor...</option>
                    {floors.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground">
                    ▼
                  </div>
                </div>
              </div>
            </div>

            <div className="px-8 py-6 border-t border-[#A3B1C6]/20 bg-background flex justify-end gap-4">
              <Button variant="outline" className="h-12 px-8 rounded-2xl shadow-neu-extruded border-none font-bold text-foreground hover:text-accent transition-all" onClick={() => setIsDrawerOpen(false)}>Cancel</Button>
              <Button className="h-12 px-8 rounded-2xl border border-accent/50 font-bold text-white bg-accent shadow-[inset_2px_2px_4px_rgba(255,255,255,0.4),inset_-2px_-2px_4px_rgba(0,0,0,0.2),0_4px_10px_rgba(108,99,255,0.3)] hover:bg-accent-light transition-all" onClick={handleSave}>
                {isEditing ? 'Save Changes' : 'Create Room'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
