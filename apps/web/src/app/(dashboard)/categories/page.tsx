"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { 
  Layers, Server, HardDrive, Network, Share2, Router, ShieldAlert, Zap, BatteryCharging, 
  Plug, Snowflake, Wind, Shield, Box, LayoutGrid, CheckCircle2, Package, BarChart2, 
  Search, Filter, List, ListTree, Plus, Edit2, Eye, MoreHorizontal, X, Upload, Copy, Trash2
} from "lucide-react"
import { mockCategories } from "@/lib/mock-data"

const iconMap: any = {
  Layers, Server, HardDrive, Network, Share2, Router, ShieldAlert, Zap, BatteryCharging, 
  Plug, Snowflake, Wind, Shield, Box
}

export default function CategoriesPage() {
  const [viewMode, setViewMode] = useState<"table" | "tree">("table")
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [drawerTab, setDrawerTab] = useState("General")
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("All")

  const totalCategories = mockCategories.length
  const activeCategories = mockCategories.filter(c => c.status === "Active").length
  const totalAssets = mockCategories.reduce((acc, c) => acc + c.assetCount, 0)
  const topCategory = mockCategories.reduce((prev, current) => (prev.assetCount > current.assetCount) ? prev : current)

  const parents = mockCategories.filter(c => c.parent === null)

  const filteredCategories = mockCategories.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          c.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          c.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "All" ? true : c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const renderTreeNodes = (parentId: string | null, depth = 0) => {
    const children = mockCategories.filter(c => c.parent === parentId)
    if (children.length === 0) return null

    return (
      <div className="space-y-4">
        {children.map(child => {
          const IconComponent = iconMap[child.icon] || Layers
          return (
            <div key={child.id} className="relative group">
              {depth > 0 && (
                <div className="absolute left-[-24px] top-6 w-4 h-px bg-[#A3B1C6]/30 group-hover:bg-accent group-hover:shadow-[0_0_8px_rgba(108,99,255,0.8)] transition-all duration-300"></div>
              )}
              {depth > 0 && (
                <div className="absolute left-[-24px] -top-8 bottom-6 w-px bg-[#A3B1C6]/30 group-hover:bg-accent group-hover:shadow-[0_0_8px_rgba(108,99,255,0.8)] transition-all duration-300"></div>
              )}
              
              <div className="flex items-center gap-4 bg-background shadow-neu-extruded border-neu rounded-2xl p-4 ml-6 transition-all duration-300 group-hover:shadow-neu-hover group-hover:-translate-y-1 z-10 relative">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center shadow-neu-inset" style={{ color: child.color }}>
                  <IconComponent className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-foreground flex items-center gap-2">
                    <Link href={`/categories/${child.id}`} className="hover:text-accent transition-colors">{child.name}</Link>
                    <span className="px-2 py-0.5 rounded-full bg-background shadow-neu-inset text-[10px] uppercase tracking-wider text-muted-foreground">{child.code}</span>
                  </h3>
                  <p className="text-sm text-muted-foreground">{child.description}</p>
                </div>
                <div className="text-right mr-8">
                  <p className="text-xl font-bold text-foreground">{child.assetCount}</p>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">Assets</p>
                </div>
                <div className="flex gap-2 mr-2">
                  <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl text-blue-500 hover:text-blue-600 hover:bg-blue-50" onClick={() => alert('Add Sub-category coming soon!')} title="Add Sub-category">
                    <Plus className="w-5 h-5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl text-amber-500 hover:text-amber-600 hover:bg-amber-50" onClick={() => alert('Copy category coming soon!')} title="Duplicate Category">
                    <Copy className="w-5 h-5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl text-accent hover:text-accent hover:bg-accent/10" onClick={() => alert('Edit category coming soon!')} title="Edit Category">
                    <Edit2 className="w-5 h-5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl text-red-500 hover:text-red-600 hover:bg-red-50" onClick={() => { if(confirm('Are you sure you want to delete this category?')) alert('Category deleted! (Simulation)') }} title="Delete Category">
                    <Trash2 className="w-5 h-5" />
                  </Button>
                </div>
              </div>
              
              <div className="mt-4">
                {renderTreeNodes(child.id, depth + 1)}
              </div>
            </div>
          )
        })}
      </div>
    )
  }

  return (
    <div className="space-y-8 pb-12 mt-2">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground">Categories Engine</h1>
          <p className="text-muted-foreground font-medium mt-1">Manage asset classification, templates, and core data structure.</p>
        </div>
        <div className="flex gap-4">
          <Button variant="outline" className="h-12 px-6 rounded-2xl shadow-neu-extruded border-neu font-bold text-foreground hover:text-accent">
            <Upload className="w-5 h-5 mr-2" /> Import Categories
          </Button>
          <Button onClick={() => setIsDrawerOpen(true)} className="h-12 px-6 rounded-2xl shadow-[inset_2px_2px_4px_rgba(255,255,255,0.4),inset_-2px_-2px_4px_rgba(0,0,0,0.2),0_4px_10px_rgba(108,99,255,0.3)] border border-accent/50 font-bold text-white bg-accent hover:bg-accent-light">
            <Plus className="w-5 h-5 mr-2" /> Add Category
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <Card className="rounded-[24px] border-neu shadow-neu-extruded bg-background">
          <CardContent className="p-5 flex flex-col gap-3">
            <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center shadow-neu-inset text-accent">
              <LayoutGrid className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-0.5 truncate" title="Total Categories">Total Categories</p>
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
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-0.5 truncate" title="Active Categories">Active Categories</p>
              <p className="text-2xl font-display font-bold text-foreground truncate">{activeCategories}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-[24px] border-neu shadow-neu-extruded bg-background">
          <CardContent className="p-5 flex flex-col gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#F59E0B]/10 flex items-center justify-center shadow-neu-inset text-[#F59E0B]">
              <Package className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-0.5 truncate" title="Assets Assigned">Assets Assigned</p>
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
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-0.5 truncate" title="Most Used">Most Used</p>
              <p className="text-xl font-display font-bold text-foreground truncate" title={topCategory.name}>{topCategory.name}</p>
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
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-12 px-6 bg-background shadow-neu-extruded rounded-xl border-neu font-bold text-foreground focus:outline-none focus:ring-2 focus:ring-accent/50 cursor-pointer"
          >
            <option value="All">All Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
            <option value="Deprecated">Deprecated</option>
          </select>
        </div>
        <div className="flex bg-background shadow-neu-inset border-neu rounded-xl p-1">
          <button 
            className={`flex items-center px-6 py-2 rounded-lg text-sm font-bold transition-all ${viewMode === 'table' ? 'bg-background shadow-neu-extruded text-accent' : 'text-muted-foreground hover:text-foreground'}`}
            onClick={() => setViewMode('table')}
          >
            <List className="w-4 h-4 mr-2" /> Table View
          </button>
          <button 
            className={`flex items-center px-6 py-2 rounded-lg text-sm font-bold transition-all ${viewMode === 'tree' ? 'bg-background shadow-neu-extruded text-accent' : 'text-muted-foreground hover:text-foreground'}`}
            onClick={() => setViewMode('tree')}
          >
            <ListTree className="w-4 h-4 mr-2" /> Tree View
          </button>
        </div>
      </div>

      {/* Content Area */}
      {viewMode === 'table' ? (
        <Card className="rounded-[32px] border-neu shadow-neu-extruded bg-background overflow-hidden">
          <div className="overflow-x-auto pb-4">
            <table className="w-full text-left border-collapse whitespace-nowrap">
              <thead>
                <tr>
                  <th className="px-8 py-6 font-bold text-xs uppercase tracking-wider text-muted-foreground border-b border-[#A3B1C6]/20">Icon</th>
                  <th className="px-6 py-6 font-bold text-xs uppercase tracking-wider text-muted-foreground border-b border-[#A3B1C6]/20">Category Name</th>
                  <th className="px-6 py-6 font-bold text-xs uppercase tracking-wider text-muted-foreground border-b border-[#A3B1C6]/20">Code</th>
                  <th className="px-6 py-6 font-bold text-xs uppercase tracking-wider text-muted-foreground border-b border-[#A3B1C6]/20">Parent</th>
                  <th className="px-6 py-6 font-bold text-xs uppercase tracking-wider text-muted-foreground border-b border-[#A3B1C6]/20">Assets</th>
                  <th className="px-6 py-6 font-bold text-xs uppercase tracking-wider text-muted-foreground border-b border-[#A3B1C6]/20">Status</th>
                  <th className="px-8 py-6 font-bold text-xs uppercase tracking-wider text-muted-foreground border-b border-[#A3B1C6]/20 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#A3B1C6]/10">
                {filteredCategories.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-muted-foreground">
                      No categories found matching your filters.
                    </td>
                  </tr>
                ) : (
                  filteredCategories.map((category) => {
                    const IconComponent = iconMap[category.icon] || Layers;
                  const parentCat = mockCategories.find(c => c.id === category.parent);
                  return (
                    <tr key={category.id} className="group hover:bg-[#A3B1C6]/10 transition-all duration-300 hover:shadow-[inset_4px_0_0_0_#6C63FF]">
                      <td className="px-8 py-5">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-neu-inset" style={{ color: category.color }}>
                          <IconComponent className="w-5 h-5" />
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <p className="font-bold text-foreground">
                          <Link href={`/categories/${category.id}`} className="hover:text-accent transition-colors">{category.name}</Link>
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">{category.description}</p>
                      </td>
                      <td className="px-6 py-5 font-mono text-xs font-bold text-muted-foreground">{category.code}</td>
                      <td className="px-6 py-5 text-sm font-medium text-foreground">{parentCat ? parentCat.name : "-"}</td>
                      <td className="px-6 py-5 text-sm font-bold text-foreground">{category.assetCount}</td>
                      <td className="px-6 py-5">
                        <span className={`inline-flex px-3 py-1 rounded-full text-xs font-bold shadow-neu-inset ${category.status === 'Active' ? 'text-[#38B2AC]' : 'text-muted-foreground'}`}>
                          {category.status}
                        </span>
                      </td>
                      <td className="px-8 py-5 text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-blue-500 hover:text-blue-600 hover:bg-blue-50" onClick={() => alert('Add Sub-category coming soon!')} title="Add Sub-category">
                            <Plus className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-amber-500 hover:text-amber-600 hover:bg-amber-50" onClick={() => alert('Copy category coming soon!')} title="Duplicate Category">
                            <Copy className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-accent hover:text-accent hover:bg-accent/10" onClick={() => alert('Edit category coming soon!')} title="Edit Category">
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-red-500 hover:text-red-600 hover:bg-red-50" onClick={() => { if(confirm('Are you sure you want to delete this category?')) alert('Category deleted! (Simulation)') }} title="Delete Category">
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
      ) : (
        <Card className="rounded-[32px] border-neu shadow-neu-extruded bg-background overflow-hidden p-8">
          <div className="max-w-4xl">
            {renderTreeNodes(null)}
          </div>
        </Card>
      )}

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
                <h2 className="text-2xl font-bold text-foreground">Add Category</h2>
                <p className="text-sm text-muted-foreground font-medium">Create a new classification node</p>
              </div>
              <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl hover:bg-red-50 hover:text-red-500 hover:shadow-neu-inset" onClick={() => setIsDrawerOpen(false)}>
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Drawer Tabs */}
            <div className="flex gap-2 px-8 pt-6 pb-2 border-b border-[#A3B1C6]/20 overflow-x-auto [&::-webkit-scrollbar]:hidden">
              {['General', 'Visual', 'Asset Rules', 'Templates'].map(tab => (
                <button 
                  key={tab}
                  className={`px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-all ${drawerTab === tab ? 'bg-background shadow-neu-extruded text-accent' : 'text-muted-foreground hover:text-foreground hover:bg-[#A3B1C6]/10'}`}
                  onClick={() => setDrawerTab(tab)}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Scrollable Form Content */}
            <div className="flex-1 overflow-y-auto px-8 py-6 space-y-6">
              {drawerTab === 'General' && (
                <div className="space-y-6 animate-in fade-in">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Category Name</label>
                    <input type="text" placeholder="e.g. Servers" className="w-full h-12 px-4 bg-background shadow-neu-inset border-neu rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-accent/50 text-foreground" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Category Code</label>
                    <input type="text" placeholder="e.g. SRV" className="w-full h-12 px-4 bg-background shadow-neu-inset border-neu rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-accent/50 text-foreground uppercase" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Parent Category</label>
                    <select className="w-full h-12 px-4 bg-background shadow-neu-inset border-neu rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-accent/50 text-foreground appearance-none">
                      <option value="">None (Root Category)</option>
                      {parents.map(p => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Description</label>
                    <textarea rows={4} placeholder="Describe this category..." className="w-full p-4 bg-background shadow-neu-inset border-neu rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-accent/50 text-foreground resize-none"></textarea>
                  </div>
                </div>
              )}

              {drawerTab === 'Visual' && (
                <div className="space-y-6 animate-in fade-in">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-4 block">Select Icon</label>
                    <div className="grid grid-cols-6 gap-4">
                      {Object.keys(iconMap).map(iconName => {
                        const IconComponent = iconMap[iconName]
                        return (
                          <div key={iconName} className="aspect-square rounded-xl bg-background shadow-neu-extruded hover:shadow-neu-inset border-neu flex items-center justify-center cursor-pointer transition-all hover:text-accent text-muted-foreground">
                            <IconComponent className="w-6 h-6" />
                          </div>
                        )
                      })}
                    </div>
                  </div>
                  <div className="space-y-2 pt-4">
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-4 block">Select Color</label>
                    <div className="flex gap-4">
                      {['#3B82F6', '#8B5CF6', '#10B981', '#F59E0B', '#06B6D4', '#EF4444', '#64748B'].map(color => (
                        <div key={color} className="w-10 h-10 rounded-full cursor-pointer shadow-neu-extruded border-2 border-white/50 hover:scale-110 transition-transform" style={{ backgroundColor: color }}></div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {drawerTab === 'Asset Rules' && (
                <div className="space-y-6 animate-in fade-in">
                  <p className="text-sm text-muted-foreground font-medium mb-6">Select which fields are mandatory when users create an asset under this category.</p>
                  
                  <div className="space-y-4">
                    {[
                      { id: 'rule1', label: 'Require Serial Number', desc: 'Asset must have a unique serial number.' },
                      { id: 'rule2', label: 'Require Warranty Details', desc: 'Asset must have warranty expiration and vendor.' },
                      { id: 'rule3', label: 'Require Location', desc: 'Asset must be assigned to a Site and Room.' },
                      { id: 'rule4', label: 'Require Rack Position', desc: 'Asset must have specific Rack ID and U Position.' },
                    ].map(rule => (
                      <div key={rule.id} className="flex items-center gap-4 bg-background shadow-neu-extruded border-neu rounded-2xl p-4 cursor-pointer hover:shadow-neu-hover transition-all">
                        <div className="w-6 h-6 rounded bg-background shadow-neu-inset flex items-center justify-center text-accent">
                          <CheckCircle2 className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="font-bold text-sm text-foreground">{rule.label}</p>
                          <p className="text-xs text-muted-foreground">{rule.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {drawerTab === 'Templates' && (
                <div className="space-y-6 animate-in fade-in">
                  <p className="text-sm text-muted-foreground font-medium mb-6">Define custom technical fields that will automatically appear for assets in this category.</p>
                  
                  <div className="space-y-4">
                    <div className="flex gap-2">
                      <input type="text" placeholder="e.g. CPU Core Count" className="flex-1 h-12 px-4 bg-background shadow-neu-inset border-neu rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-accent/50 text-foreground" />
                      <Button className="h-12 px-6 rounded-xl shadow-neu-extruded font-bold bg-accent text-white hover:bg-accent-light">Add</Button>
                    </div>

                    <div className="space-y-2 mt-6">
                      {['Processor (CPU)', 'Total RAM (GB)', 'Storage Capacity', 'Network Interface'].map(field => (
                        <div key={field} className="flex justify-between items-center bg-background shadow-neu-extruded border-neu rounded-xl p-4">
                          <p className="font-bold text-sm text-foreground">{field}</p>
                          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-red-500 hover:text-red-600 hover:bg-red-50 hover:shadow-neu-inset">
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-8 py-6 border-t border-[#A3B1C6]/20 bg-background flex justify-end gap-4">
              <Button variant="outline" className="h-12 px-8 rounded-2xl shadow-neu-extruded border-neu font-bold text-foreground" onClick={() => setIsDrawerOpen(false)}>
                Cancel
              </Button>
              <Button className="h-12 px-8 rounded-2xl shadow-[inset_2px_2px_4px_rgba(255,255,255,0.4),inset_-2px_-2px_4px_rgba(0,0,0,0.2),0_4px_10px_rgba(108,99,255,0.3)] border border-accent/50 font-bold text-white bg-accent hover:bg-accent-light" onClick={() => setIsDrawerOpen(false)}>
                Save Category
              </Button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
