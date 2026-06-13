"use client"

import { useState, useEffect, useMemo } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { 
  Layers, CheckCircle2, Package, BarChart2, 
  Search, List, ListTree, Plus, Edit2, Trash2, X, Upload
} from "lucide-react"
import { HeroSection } from "@/components/ui/hero-section"
import { apiClient } from "@/lib/api-client"

export default function CategoriesPage() {
  const [categories, setCategories] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [viewMode, setViewMode] = useState<"table" | "tree">("table")
  
  // Drawer states
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [drawerTab, setDrawerTab] = useState("General")
  const [isEditing, setIsEditing] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  
  // Form states
  const [formData, setFormData] = useState({ name: "", code: "", description: "" })

  const [searchQuery, setSearchQuery] = useState("")

  const fetchCategories = async () => {
    try {
      setIsLoading(true);
      const res = await apiClient.get('/categories');
      setCategories(res.data);
    } catch (err) {
      console.error("Failed to fetch categories", err);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchCategories();
  }, [])

  const handleSave = async () => {
    if (!formData.name || !formData.code) return alert("Name and Code are required.");
    try {
      if (isEditing && editingId) {
        await apiClient.put(`/categories/${editingId}`, formData);
      } else {
        await apiClient.post('/categories', formData);
      }
      setIsDrawerOpen(false);
      fetchCategories();
    } catch (err) {
      console.error("Save failed", err);
      alert("Failed to save category.");
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this category?")) return;
    try {
      await apiClient.delete(`/categories/${id}`);
      fetchCategories();
    } catch (err: any) {
      alert(err.response?.data?.error || "Failed to delete category.");
    }
  }

  const openCreateDrawer = () => {
    setFormData({ name: "", code: "", description: "" });
    setIsEditing(false);
    setEditingId(null);
    setIsDrawerOpen(true);
  }

  const openEditDrawer = (category: any) => {
    setFormData({ name: category.name, code: category.code, description: category.description || "" });
    setIsEditing(true);
    setEditingId(category.id);
    setIsDrawerOpen(true);
  }

  const totalCategories = categories.length
  const totalAssets = categories.reduce((acc, c) => acc + (c._count?.assets || 0), 0)
  const topCategory = categories.length > 0 ? categories.reduce((prev, current) => ((prev._count?.assets || 0) > (current._count?.assets || 0)) ? prev : current) : { name: "N/A" }

  const filteredCategories = useMemo(() => {
    return categories.filter(c => {
      const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            c.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            (c.description && c.description.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesSearch;
    });
  }, [categories, searchQuery]);

  return (
    <div className="space-y-8 pb-12 mt-2">
      
      {/* Header */}
      <HeroSection
        title="Categories Engine"
        description="Manage asset classification, templates, and core data structure."
        imageSrc="/images/heroes/categories.png"
      >
        <div className="flex gap-4">
          <Button onClick={openCreateDrawer} className="h-12 px-6 rounded-2xl shadow-[inset_2px_2px_4px_rgba(255,255,255,0.4),inset_-2px_-2px_4px_rgba(0,0,0,0.2),0_4px_10px_rgba(108,99,255,0.3)] border border-accent/50 font-bold text-white bg-accent hover:bg-accent-light">
            <Plus className="w-5 h-5 mr-2" /> Add Category
          </Button>
        </div>
      </HeroSection>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <Card className="rounded-[24px] border-neu shadow-neu-extruded bg-background">
          <CardContent className="p-5 flex flex-col gap-3">
            <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center shadow-neu-inset text-accent">
              <Layers className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-0.5 truncate">Total Categories</p>
              <p className="text-2xl font-display font-bold text-foreground truncate">{totalCategories}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="rounded-[24px] border-neu shadow-neu-extruded bg-background">
          <CardContent className="p-5 flex flex-col gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#38B2AC]/10 flex items-center justify-center shadow-neu-inset text-[#38B2AC]">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-0.5 truncate">Active Categories</p>
              <p className="text-2xl font-display font-bold text-foreground truncate">{totalCategories}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-[24px] border-neu shadow-neu-extruded bg-background">
          <CardContent className="p-5 flex flex-col gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#F59E0B]/10 flex items-center justify-center shadow-neu-inset text-[#F59E0B]">
              <Package className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-0.5 truncate">Assets Assigned</p>
              <p className="text-2xl font-display font-bold text-foreground truncate">{totalAssets.toLocaleString()}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-[24px] border-neu shadow-neu-extruded bg-background">
          <CardContent className="p-5 flex flex-col gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#8B5CF6]/10 flex items-center justify-center shadow-neu-inset text-[#8B5CF6]">
              <BarChart2 className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-0.5 truncate">Most Used</p>
              <p className="text-xl font-display font-bold text-foreground truncate">{topCategory.name}</p>
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
              placeholder="Search categories..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-12 pl-12 pr-4 bg-background shadow-neu-inset border-t border-l border-[#A3B1C6]/30 border-b border-r border-white/60 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-accent/50 text-foreground" 
            />
          </div>
        </div>
        <div className="flex bg-background shadow-neu-inset border-neu rounded-xl p-1">
          <button 
            className={`flex items-center px-6 py-2 rounded-lg text-sm font-bold transition-all ${viewMode === 'table' ? 'bg-background shadow-neu-extruded text-accent' : 'text-muted-foreground hover:text-foreground'}`}
            onClick={() => setViewMode('table')}
          >
            <List className="w-4 h-4 mr-2" /> Table View
          </button>
        </div>
      </div>

      {/* Content Area */}
      <Card className="rounded-[32px] border-neu shadow-neu-extruded bg-background overflow-hidden">
        <div className="overflow-x-auto pb-4">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr>
                <th className="px-8 py-6 font-bold text-xs uppercase tracking-wider text-muted-foreground border-b border-[#A3B1C6]/20">Icon</th>
                <th className="px-6 py-6 font-bold text-xs uppercase tracking-wider text-muted-foreground border-b border-[#A3B1C6]/20">Category Name</th>
                <th className="px-6 py-6 font-bold text-xs uppercase tracking-wider text-muted-foreground border-b border-[#A3B1C6]/20">Code</th>
                <th className="px-6 py-6 font-bold text-xs uppercase tracking-wider text-muted-foreground border-b border-[#A3B1C6]/20">Assets</th>
                <th className="px-8 py-6 font-bold text-xs uppercase tracking-wider text-muted-foreground border-b border-[#A3B1C6]/20 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#A3B1C6]/10">
              {isLoading ? (
                <tr><td colSpan={5} className="px-6 py-12 text-center text-muted-foreground font-bold">Loading categories...</td></tr>
              ) : filteredCategories.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                    No categories found.
                  </td>
                </tr>
              ) : (
                filteredCategories.map((category) => {
                return (
                  <tr key={category.id} className="group hover:bg-[#A3B1C6]/10 transition-all duration-300 hover:shadow-[inset_4px_0_0_0_#6C63FF]">
                    <td className="px-8 py-5">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-neu-inset text-accent">
                        <Layers className="w-5 h-5" />
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <p className="font-bold text-foreground">
                        {category.name}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">{category.description || "-"}</p>
                    </td>
                    <td className="px-6 py-5 font-mono text-xs font-bold text-muted-foreground">{category.code}</td>
                    <td className="px-6 py-5 text-sm font-bold text-foreground">{category._count?.assets || 0}</td>
                    <td className="px-8 py-5 text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-accent hover:text-accent hover:bg-accent/10" onClick={() => openEditDrawer(category)} title="Edit Category">
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-red-500 hover:text-red-600 hover:bg-red-50" onClick={() => handleDelete(category.id)} title="Delete Category">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                )
              }))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Slide-Over Drawer for Category Creation */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setIsDrawerOpen(false)}></div>
          
          {/* Drawer Content */}
          <div className="relative w-full max-w-xl h-full bg-background shadow-[-10px_0_30px_rgba(0,0,0,0.1)] border-l border-white/50 flex flex-col animate-in slide-in-from-right duration-300">
            {/* Header */}
            <div className="px-8 py-6 flex justify-between items-center border-b border-[#A3B1C6]/20">
              <div>
                <h2 className="text-2xl font-bold text-foreground">{isEditing ? 'Edit Category' : 'Add Category'}</h2>
                <p className="text-sm text-muted-foreground font-medium">Manage classification node</p>
              </div>
              <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl hover:bg-red-50 hover:text-red-500 hover:shadow-neu-inset" onClick={() => setIsDrawerOpen(false)}>
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Scrollable Form Content */}
            <div className="flex-1 overflow-y-auto px-8 py-6 space-y-6">
              <div className="space-y-6 animate-in fade-in">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Category Name *</label>
                  <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="e.g. Servers" className="w-full h-12 px-4 bg-background shadow-neu-inset border-neu rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-accent/50 text-foreground" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Category Code *</label>
                  <input type="text" value={formData.code} onChange={e => setFormData({...formData, code: e.target.value})} placeholder="e.g. SRV" className="w-full h-12 px-4 bg-background shadow-neu-inset border-neu rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-accent/50 text-foreground uppercase" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Description</label>
                  <textarea rows={4} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="Describe this category..." className="w-full p-4 bg-background shadow-neu-inset border-neu rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-accent/50 text-foreground resize-none"></textarea>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-8 py-6 border-t border-[#A3B1C6]/20 bg-background flex justify-end gap-4">
              <Button variant="outline" className="h-12 px-8 rounded-2xl shadow-neu-extruded border-neu font-bold text-foreground" onClick={() => setIsDrawerOpen(false)}>
                Cancel
              </Button>
              <Button className="h-12 px-8 rounded-2xl shadow-[inset_2px_2px_4px_rgba(255,255,255,0.4),inset_-2px_-2px_4px_rgba(0,0,0,0.2),0_4px_10px_rgba(108,99,255,0.3)] border border-accent/50 font-bold text-white bg-accent hover:bg-accent-light" onClick={handleSave}>
                {isEditing ? 'Save Changes' : 'Create Category'}
              </Button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
