"use client"

import { useState, useEffect, useMemo } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Server, Box, Search, Plus, Edit2, Trash2, X } from "lucide-react"
import { apiClient } from "@/lib/api-client"
import { HeroSection } from "@/components/ui/hero-section"

export default function RacksPage() {
  const [locations, setLocations] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")

  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  
  const [formData, setFormData] = useState({ name: "", type: "Rack", parentLoc: "" })
  const [rooms, setRooms] = useState<any[]>([])

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const res = await apiClient.get('/locations');
      setLocations(res.data.filter((loc: any) => loc.type === "Rack"));
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
    setFormData({ name: "", type: "Rack", parentLoc: "" });
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

  const filtered = useMemo(() => locations.filter(l => l.name.toLowerCase().includes(searchQuery.toLowerCase())), [locations, searchQuery]);

  return (
    <div className="relative min-h-[calc(100vh-80px)] overflow-hidden flex">
      <div className="flex-1 p-6 md:p-8 overflow-y-auto">
        <HeroSection title="Racks" description="Manage server racks" imageSrc="/images/heroes/racks.png">
          <Button onClick={openCreateDrawer} className="h-12 px-6 rounded-2xl shadow-[inset_2px_2px_4px_rgba(255,255,255,0.4),inset_-2px_-2px_4px_rgba(0,0,0,0.2),0_4px_10px_rgba(108,99,255,0.3)] border border-accent/50 font-bold text-white bg-accent hover:bg-accent-light flex items-center">
            <Plus className="w-5 h-5 mr-2" /> Add Rack
          </Button>
        </HeroSection>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          <Card className="rounded-[24px] border-neu shadow-neu-extruded bg-background">
            <CardContent className="p-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#007DB8]/10 flex items-center justify-center text-[#007DB8]"><Server className="w-6 h-6" /></div>
              <div><p className="text-[10px] font-bold text-muted-foreground uppercase">Total Racks</p><p className="text-2xl font-bold">{locations.length}</p></div>
            </CardContent>
          </Card>
          <Card className="rounded-[24px] border-neu shadow-neu-extruded bg-background">
            <CardContent className="p-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#F59E0B]/10 flex items-center justify-center text-[#F59E0B]"><Box className="w-6 h-6" /></div>
              <div><p className="text-[10px] font-bold text-muted-foreground uppercase">Total Assets</p><p className="text-2xl font-bold">{locations.reduce((sum, s) => sum + (s._count?.assets || 0), 0)}</p></div>
            </CardContent>
          </Card>
        </div>

        <Card className="rounded-[32px] border-neu shadow-neu-extruded bg-background overflow-hidden">
          <div className="overflow-x-auto pb-4">
            <table className="w-full text-left border-collapse whitespace-nowrap">
              <thead>
                <tr>
                  <th className="px-6 py-6 font-bold text-xs uppercase text-muted-foreground border-b border-[#A3B1C6]/20">Rack Name</th>
                  <th className="px-6 py-6 font-bold text-xs uppercase text-muted-foreground border-b border-[#A3B1C6]/20">Parent Room</th>
                  <th className="px-6 py-6 font-bold text-xs uppercase text-muted-foreground border-b border-[#A3B1C6]/20">Assets</th>
                  <th className="px-6 py-6 font-bold text-xs uppercase text-muted-foreground border-b border-[#A3B1C6]/20 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#A3B1C6]/10">
                {filtered.map(l => (
                  <tr key={l.id} className="hover:bg-[#A3B1C6]/10 transition-all">
                    <td className="px-6 py-5 font-bold">{l.name}</td>
                    <td className="px-6 py-5">{rooms.find(s => s.id === l.parentLoc)?.name || "-"}</td>
                    <td className="px-6 py-5 font-bold">{l._count?.assets || 0}</td>
                    <td className="px-6 py-5 text-right">
                      <Button variant="ghost" size="icon" className="text-accent" onClick={() => openEditDrawer(l)}><Edit2 className="w-4 h-4" /></Button>
                      <Button variant="ghost" size="icon" className="text-red-500" onClick={() => handleDelete(l.id)}><Trash2 className="w-4 h-4" /></Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setIsDrawerOpen(false)}></div>
          <div className="relative w-full max-w-xl h-full bg-background shadow-[-10px_0_30px_rgba(0,0,0,0.1)] flex flex-col">
            <div className="px-8 py-6 flex justify-between items-center border-b border-[#A3B1C6]/20">
              <h2 className="text-2xl font-bold">{isEditing ? 'Edit Rack' : 'Add Rack'}</h2>
              <Button variant="ghost" size="icon" onClick={() => setIsDrawerOpen(false)}><X className="w-5 h-5" /></Button>
            </div>
            <div className="flex-1 px-8 py-6 space-y-6">
              <div>
                <label className="text-xs font-bold text-muted-foreground">Rack Name</label>
                <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full h-12 px-4 bg-background shadow-neu-inset rounded-xl" />
              </div>
              <div>
                <label className="text-xs font-bold text-muted-foreground">Parent Room</label>
                <select value={formData.parentLoc} onChange={e => setFormData({...formData, parentLoc: e.target.value})} className="w-full h-12 px-4 bg-background shadow-neu-inset rounded-xl">
                  <option value="">Select Room</option>
                  {rooms.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>
            </div>
            <div className="px-8 py-6 border-t border-[#A3B1C6]/20 flex justify-end gap-4">
              <Button variant="outline" className="h-12 px-8 rounded-2xl shadow-neu-extruded" onClick={() => setIsDrawerOpen(false)}>Cancel</Button>
              <Button className="h-12 px-8 rounded-2xl bg-accent text-white" onClick={handleSave}>Save</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
