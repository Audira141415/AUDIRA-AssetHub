"use client"

import { useState, useEffect, useMemo } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { 
  Layers, CheckCircle2, Package, BarChart2, 
  Search, List, ListTree, Plus, Edit2, Trash2, X,
  Server, HardDrive, Network, ShieldAlert, Zap, Box, Monitor, Smartphone, Cpu, LayoutGrid, ChevronRight, ChevronDown
} from "lucide-react"
import { HeroSection } from "@/components/ui/hero-section"
import { apiClient } from "@/lib/api-client"
import { useRouter } from "next/navigation"

const ICON_OPTIONS = [
  { name: 'Layers', component: Layers },
  { name: 'Server', component: Server },
  { name: 'HardDrive', component: HardDrive },
  { name: 'Network', component: Network },
  { name: 'ShieldAlert', component: ShieldAlert },
  { name: 'Zap', component: Zap },
  { name: 'Box', component: Box },
  { name: 'Monitor', component: Monitor },
  { name: 'Smartphone', component: Smartphone },
  { name: 'Cpu', component: Cpu },
];

const COLOR_OPTIONS = [
  { name: 'Purple', value: '#6C63FF' },
  { name: 'Teal', value: '#38B2AC' },
  { name: 'Amber', value: '#F59E0B' },
  { name: 'Red', value: '#E53E3E' },
  { name: 'Blue', value: '#3B82F6' },
  { name: 'Green', value: '#10B981' },
];

export default function CategoriesPage() {
  const [categories, setCategories] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [viewMode, setViewMode] = useState<"table" | "grid" | "tree">("grid")
  const router = useRouter()
  
  // Drawer states
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  
  // Form states
  const [formData, setFormData] = useState({ name: "", code: "", description: "", icon: "Layers", color: "#6C63FF", parentId: "" })
  const [searchQuery, setSearchQuery] = useState("")

  // Tree states
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set())

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

  const handleDelete = async (id: string, e: any) => {
    e.stopPropagation();
    if (!confirm("Are you sure you want to delete this category?")) return;
    try {
      await apiClient.delete(`/categories/${id}`);
      fetchCategories();
    } catch (err: any) {
      alert(err.response?.data?.error || "Failed to delete category.");
    }
  }

  const openCreateDrawer = () => {
    setFormData({ name: "", code: "", description: "", icon: "Layers", color: "#6C63FF", parentId: "" });
    setIsEditing(false);
    setEditingId(null);
    setIsDrawerOpen(true);
  }

  const handleNameChange = (nameVal: string) => {
    if (isEditing) {
      setFormData(prev => ({ ...prev, name: nameVal }));
    } else {
      const generatedCode = nameVal.toUpperCase().replace(/\s+/g, '_').replace(/[^A-Z0-9_]/g, '');
      setFormData(prev => ({ ...prev, name: nameVal, code: generatedCode }));
    }
  }

  const openEditDrawer = (category: any, e?: any) => {
    if (e) e.stopPropagation();
    setFormData({ 
      name: category.name, 
      code: category.code, 
      description: category.description || "",
      icon: category.icon || "Layers",
      color: category.color || "#6C63FF",
      parentId: category.parentId || ""
    });
    setIsEditing(true);
    setEditingId(category.id);
    setIsDrawerOpen(true);
  }

  const toggleNode = (id: string, e: any) => {
    e.stopPropagation();
    const newExpanded = new Set(expandedNodes);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedNodes(newExpanded);
  }

  const totalCategories = categories.length
  const totalAssets = categories.reduce((acc, c) => acc + (c._count?.assets || 0), 0)
  const topCategory = categories.length > 0 ? categories.reduce((prev, current) => ((prev._count?.assets || 0) > (current._count?.assets || 0)) ? prev : current) : { name: "N/A", icon: "Layers", color: "#6C63FF" }

  const filteredCategories = useMemo(() => {
    return categories.filter(c => {
      const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            c.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            (c.description && c.description.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesSearch;
    });
  }, [categories, searchQuery]);

  const categoryTree = useMemo(() => {
    const map = new Map(categories.map(c => [c.id, { ...c, children: [] }]));
    const tree: any[] = [];
    map.forEach(c => {
      if (c.parentId && map.has(c.parentId)) {
        map.get(c.parentId)?.children.push(c);
      } else {
        tree.push(c);
      }
    });
    return tree;
  }, [categories]);

  const renderIcon = (iconName: string, color: string, className?: string) => {
    const IconComponent = ICON_OPTIONS.find(i => i.name === iconName)?.component || Layers;
    return <IconComponent className={className || "w-5 h-5"} style={{ color }} />;
  }

  const renderTreeNode = (node: any, level: number = 0) => {
    const isExpanded = expandedNodes.has(node.id);
    const hasChildren = node.children && node.children.length > 0;
    
    // Only apply search filter globally if not in tree mode, but in tree mode we want to show all to maintain hierarchy, or filter and open parents.
    // For simplicity, tree view shows all categories.
    
    return (
      <div key={node.id} className="w-full">
        <div 
          onClick={() => router.push(`/categories/${node.id}`)}
          className={`flex items-center p-3 rounded-2xl mb-2 transition-all cursor-pointer group ${level === 0 ? 'bg-background shadow-neu-extruded border-neu' : 'hover:bg-[#A3B1C6]/10'}`}
          style={{ marginLeft: `${level * 2}rem` }}
        >
          {hasChildren ? (
            <button onClick={(e) => toggleNode(node.id, e)} className="w-6 h-6 mr-2 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-[#A3B1C6]/20 rounded-md transition-colors">
              {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </button>
          ) : (
            <div className="w-6 h-6 mr-2"></div>
          )}
          
          <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-neu-inset mr-4 bg-background border border-white/50 shrink-0">
            {renderIcon(node.icon, node.color)}
          </div>
          
          <div className="flex-1 min-w-0">
            <h4 className="font-bold text-foreground text-sm flex items-center gap-2">
              {node.name}
              <span className="px-2 py-0.5 text-[10px] bg-background shadow-neu-inset border border-white/50 rounded-md text-muted-foreground font-mono">{node.code}</span>
            </h4>
            <p className="text-xs text-muted-foreground truncate mt-0.5">{node.description || "No description"}</p>
          </div>
          
          <div className="flex items-center gap-4 shrink-0">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-bold text-foreground">{node._count?.assets || 0} Assets</p>
            </div>
            
            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-background hover:shadow-neu-extruded" onClick={(e) => openEditDrawer(node, e)}>
                <Edit2 className="w-4 h-4 text-accent" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-background hover:shadow-neu-extruded" onClick={(e) => handleDelete(node.id, e)}>
                <Trash2 className="w-4 h-4 text-red-500" />
              </Button>
            </div>
          </div>
        </div>
        
        {isExpanded && hasChildren && (
          <div className="animate-in slide-in-from-top-2 opacity-0 fade-in duration-200 fill-mode-forwards">
            {node.children.map((child: any) => renderTreeNode(child, level + 1))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12 mt-2">
      
      {/* Header */}
      <HeroSection
        title="Category Engine"
        description="Design your asset taxonomy, set colors, and assign icons for quick identification."
        imageSrc="/images/heroes/categories.png"
      >
        <div className="flex gap-4">
          <Button onClick={openCreateDrawer} className="h-12 px-6 rounded-2xl shadow-neu-extruded hover:shadow-neu-hover active:shadow-neu-inset-small font-bold text-white bg-accent border-none transition-all">
            <Plus className="w-5 h-5 mr-2" /> New Category
          </Button>
        </div>
      </HeroSection>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <Card className="rounded-[24px] border-neu shadow-neu-extruded bg-background">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center shadow-neu-inset text-accent shrink-0">
              <Layers className="w-6 h-6" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1 truncate">Total Categories</p>
              <p className="text-3xl font-display font-bold text-foreground leading-none">{totalCategories}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="rounded-[24px] border-neu shadow-neu-extruded bg-background">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#38B2AC]/10 flex items-center justify-center shadow-neu-inset text-[#38B2AC] shrink-0">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1 truncate">Active Categories</p>
              <p className="text-3xl font-display font-bold text-foreground leading-none">{totalCategories}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-[24px] border-neu shadow-neu-extruded bg-background">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#F59E0B]/10 flex items-center justify-center shadow-neu-inset text-[#F59E0B] shrink-0">
              <Package className="w-6 h-6" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1 truncate">Total Assets</p>
              <p className="text-3xl font-display font-bold text-foreground leading-none">{totalAssets.toLocaleString()}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-[24px] border-neu shadow-neu-extruded bg-background">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-neu-inset shrink-0" style={{ backgroundColor: `${topCategory.color}15` }}>
              {renderIcon(topCategory.icon, topCategory.color, "w-6 h-6")}
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1 truncate">Top Category</p>
              <p className="text-xl font-display font-bold text-foreground truncate leading-none mt-2">{topCategory.name}</p>
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
              className="w-full h-12 pl-12 pr-4 bg-background shadow-neu-inset border-neu rounded-2xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-accent/50 text-foreground" 
            />
          </div>
        </div>
        <div className="flex bg-background shadow-neu-inset border-neu rounded-2xl p-1.5 h-12 items-center">
          <button 
            className={`flex items-center px-4 py-2 rounded-xl text-xs font-bold transition-all ${viewMode === 'grid' ? 'bg-background shadow-neu-extruded text-accent' : 'text-muted-foreground hover:text-foreground'}`}
            onClick={() => setViewMode('grid')}
          >
            <LayoutGrid className="w-4 h-4 mr-2" /> Grid
          </button>
          <button 
            className={`flex items-center px-4 py-2 rounded-xl text-xs font-bold transition-all ${viewMode === 'tree' ? 'bg-background shadow-neu-extruded text-accent' : 'text-muted-foreground hover:text-foreground'}`}
            onClick={() => setViewMode('tree')}
          >
            <ListTree className="w-4 h-4 mr-2" /> Hierarchy
          </button>
          <button 
            className={`flex items-center px-4 py-2 rounded-xl text-xs font-bold transition-all ${viewMode === 'table' ? 'bg-background shadow-neu-extruded text-accent' : 'text-muted-foreground hover:text-foreground'}`}
            onClick={() => setViewMode('table')}
          >
            <List className="w-4 h-4 mr-2" /> Table
          </button>
        </div>
      </div>

      {/* Content Area */}
      {isLoading ? (
        <div className="py-24 text-center">
          <div className="w-16 h-16 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="font-bold text-muted-foreground">Loading taxonomy...</p>
        </div>
      ) : filteredCategories.length === 0 ? (
        <div className="py-24 text-center bg-background shadow-neu-extruded border-neu rounded-[32px]">
          <div className="w-20 h-20 bg-background shadow-neu-inset rounded-2xl flex items-center justify-center mx-auto mb-6 text-muted-foreground">
            <Search size={32} />
          </div>
          <h3 className="text-xl font-bold text-foreground mb-2">No categories found</h3>
          <p className="text-muted-foreground font-medium">Try adjusting your search criteria or create a new category.</p>
        </div>
      ) : (
        <>
          {viewMode === 'grid' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredCategories.map(category => (
                <div 
                  key={category.id} 
                  onClick={() => router.push(`/categories/${category.id}`)}
                  className="bg-background shadow-neu-extruded border-neu rounded-3xl p-6 hover:shadow-neu-hover active:shadow-neu-inset-small transition-all cursor-pointer group"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-neu-inset bg-background" style={{ border: `1px solid ${category.color}30` }}>
                      {renderIcon(category.icon, category.color, "w-7 h-7")}
                    </div>
                    <span className="px-3 py-1 text-[10px] bg-background shadow-neu-inset border border-white/50 rounded-lg text-muted-foreground font-mono font-bold">{category.code}</span>
                  </div>

                  {category.parentId && (
                    <div className="mb-2">
                      <span className="inline-block px-2 py-0.5 bg-background shadow-neu-inset-small border border-white/40 text-[9px] font-bold text-muted-foreground rounded uppercase tracking-wider">
                        Sub of {categories.find(c => c.id === category.parentId)?.name || "Parent"}
                      </span>
                    </div>
                  )}

                  <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-accent transition-colors">{category.name}</h3>
                  <p className="text-xs text-muted-foreground font-medium line-clamp-2 mb-6 min-h-[32px]">
                    {category.description || "No description provided."}
                  </p>
                  <div className="flex items-center justify-between border-t border-[#A3B1C6]/30 pt-4">
                    <div className="flex -space-x-2">
                      <div className="w-8 h-8 rounded-full bg-background shadow-neu-extruded border-2 border-[#E4E9F2] flex items-center justify-center z-20">
                        <Package size={12} className="text-accent" />
                      </div>
                      <div className="w-8 h-8 rounded-full bg-[#E4E9F2] shadow-neu-inset border-2 border-[#E4E9F2] flex items-center justify-center z-10 text-[10px] font-bold text-muted-foreground pl-1">
                        +{category._count?.assets || 0}
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" className="w-8 h-8 rounded-lg hover:bg-background hover:shadow-neu-inset-small" onClick={(e) => openEditDrawer(category, e)}>
                        <Edit2 className="w-3.5 h-3.5 text-accent" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {viewMode === 'table' && (
            <Card className="rounded-[32px] border-neu shadow-neu-extruded bg-background overflow-hidden">
              <div className="overflow-x-auto pb-4">
                <table className="w-full text-left border-collapse whitespace-nowrap">
                  <thead>
                    <tr>
                      <th className="px-8 py-6 font-bold text-xs uppercase tracking-wider text-muted-foreground border-b border-[#A3B1C6]/20">Category</th>
                      <th className="px-6 py-6 font-bold text-xs uppercase tracking-wider text-muted-foreground border-b border-[#A3B1C6]/20">Code</th>
                      <th className="px-6 py-6 font-bold text-xs uppercase tracking-wider text-muted-foreground border-b border-[#A3B1C6]/20">Assets</th>
                      <th className="px-6 py-6 font-bold text-xs uppercase tracking-wider text-muted-foreground border-b border-[#A3B1C6]/20">Parent</th>
                      <th className="px-8 py-6 font-bold text-xs uppercase tracking-wider text-muted-foreground border-b border-[#A3B1C6]/20 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#A3B1C6]/10">
                    {filteredCategories.map((category) => {
                      const parentName = categories.find(c => c.id === category.parentId)?.name || "-";
                      return (
                        <tr key={category.id} onClick={() => router.push(`/categories/${category.id}`)} className="group hover:bg-[#A3B1C6]/10 transition-all duration-300 cursor-pointer">
                          <td className="px-8 py-5">
                            <div className="flex items-center gap-4" style={{ paddingLeft: category.parentId ? '24px' : '0px' }}>
                              {category.parentId && (
                                <span className="text-muted-foreground font-mono text-xs mr-1 select-none">↳</span>
                              )}
                              <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-neu-inset bg-background" style={{ border: `1px solid ${category.color}30` }}>
                                {renderIcon(category.icon, category.color)}
                              </div>
                              <div>
                                <p className="font-bold text-foreground group-hover:text-accent transition-colors">{category.name}</p>
                                <p className="text-xs text-muted-foreground mt-0.5 truncate max-w-[200px]">{category.description || "No description"}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-5 font-mono text-xs font-bold text-muted-foreground">
                            <span className="px-2 py-1 bg-background shadow-neu-inset rounded-md border border-white/50">{category.code}</span>
                          </td>
                          <td className="px-6 py-5 text-sm font-bold text-foreground">{category._count?.assets || 0}</td>
                          <td className="px-6 py-5 text-xs font-bold text-muted-foreground">{parentName}</td>
                          <td className="px-8 py-5 text-right">
                            <div className="flex justify-end gap-2" onClick={e => e.stopPropagation()}>
                              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-accent hover:bg-background hover:shadow-neu-extruded" onClick={(e) => openEditDrawer(category, e)}>
                                <Edit2 className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-red-500 hover:bg-background hover:shadow-neu-extruded" onClick={(e) => handleDelete(category.id, e)}>
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </Card>
          )}

          {viewMode === 'tree' && (
            <div className="bg-background shadow-neu-extruded border-neu rounded-[32px] p-8">
              <h3 className="text-lg font-bold text-foreground mb-6 flex items-center gap-2">
                <ListTree className="text-accent" size={20} /> Taxonomy Hierarchy
              </h3>
              <div className="pl-2">
                {categoryTree.map(node => renderTreeNode(node, 0))}
              </div>
            </div>
          )}
        </>
      )}

      {/* Slide-Over Drawer for Category Creation */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsDrawerOpen(false)}></div>
          
          <div className="relative w-full max-w-md h-full bg-background shadow-[-10px_0_30px_rgba(0,0,0,0.2)] flex flex-col animate-in slide-in-from-right duration-300">
            <div className="px-8 py-6 flex justify-between items-center border-b border-[#A3B1C6]/30">
              <div>
                <h2 className="text-2xl font-bold text-foreground">{isEditing ? 'Edit Category' : 'New Category'}</h2>
                <p className="text-sm text-muted-foreground font-medium">Define classification taxonomy</p>
              </div>
              <Button variant="ghost" size="icon" className="h-10 w-10 rounded-2xl hover:bg-red-50 hover:text-red-500 hover:shadow-neu-inset" onClick={() => setIsDrawerOpen(false)}>
                <X className="w-5 h-5" />
              </Button>
            </div>

            <div className="flex-1 overflow-y-auto px-8 py-8 space-y-8">
              
              {/* Icon & Color Selection */}
              <div className="flex items-start gap-6">
                <div className="w-24 h-24 rounded-[32px] bg-background shadow-neu-inset-deep border-neu flex items-center justify-center shrink-0">
                  {renderIcon(formData.icon, formData.color, "w-12 h-12")}
                </div>
                <div className="flex-1 space-y-4">
                  <div>
                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2 block">Category Color</label>
                    <div className="flex gap-2 flex-wrap">
                      {COLOR_OPTIONS.map(c => (
                        <button 
                          key={c.value}
                          onClick={() => setFormData({...formData, color: c.value})}
                          className={`w-8 h-8 rounded-full transition-all ${formData.color === c.value ? 'ring-2 ring-offset-2 ring-background shadow-neu-extruded scale-110' : 'shadow-neu-inset opacity-70 hover:opacity-100'}`}
                          style={{ backgroundColor: c.value }}
                          title={c.name}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-3 block">Category Icon</label>
                <div className="grid grid-cols-5 gap-3">
                  {ICON_OPTIONS.map(icon => (
                    <button
                      key={icon.name}
                      onClick={() => setFormData({...formData, icon: icon.name})}
                      className={`aspect-square rounded-2xl flex items-center justify-center transition-all ${formData.icon === icon.name ? 'bg-background shadow-neu-inset border border-white/50 text-accent' : 'bg-background shadow-neu-extruded text-muted-foreground hover:text-foreground'}`}
                    >
                      <icon.component className="w-5 h-5" />
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-6 pt-4 border-t border-[#A3B1C6]/30">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Category Name *</label>
                  <input type="text" value={formData.name} onChange={e => handleNameChange(e.target.value)} placeholder="e.g. Workstations" className="w-full h-14 px-4 bg-background shadow-neu-inset-deep border-neu rounded-2xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-accent/50 text-foreground" />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Category Code *</label>
                    <input type="text" value={formData.code} onChange={e => setFormData({...formData, code: e.target.value})} placeholder="e.g. WKS" className="w-full h-14 px-4 bg-background shadow-neu-inset-deep border-neu rounded-2xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-accent/50 text-foreground uppercase" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Parent Node</label>
                    <select 
                      value={formData.parentId} 
                      onChange={e => setFormData({...formData, parentId: e.target.value})} 
                      className="w-full h-14 px-4 bg-background shadow-neu-inset-deep border-neu rounded-2xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-accent/50 text-foreground appearance-none"
                    >
                      <option value="">None (Root)</option>
                      {categories.filter(c => c.id !== editingId).map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Description</label>
                  <textarea rows={3} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="Define this category's scope..." className="w-full p-4 bg-background shadow-neu-inset-deep border-neu rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-accent/50 text-foreground resize-none"></textarea>
                </div>
              </div>
            </div>

            <div className="px-8 py-6 border-t border-[#A3B1C6]/30 bg-background flex gap-4">
              <Button variant="outline" className="flex-1 h-14 rounded-2xl shadow-neu-extruded hover:shadow-neu-hover active:shadow-neu-inset-small border-none font-bold text-muted-foreground hover:text-foreground" onClick={() => setIsDrawerOpen(false)}>
                Cancel
              </Button>
              <Button className="flex-1 h-14 rounded-2xl shadow-neu-extruded hover:shadow-neu-hover active:shadow-neu-inset-small border-none font-bold text-white bg-accent transition-all" onClick={handleSave}>
                {isEditing ? 'Save Changes' : 'Create Category'}
              </Button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
