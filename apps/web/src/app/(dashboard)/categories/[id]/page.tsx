"use client"

import { useState, use } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { 
  ArrowLeft, Edit2, Copy, Trash2, CheckCircle2, Box, Layers, Server, 
  HardDrive, Network, Share2, Router, ShieldAlert, Zap, BatteryCharging, 
  Plug, Snowflake, Wind, Shield, Calendar, Activity, AlertTriangle, X
} from "lucide-react"
import { mockCategories, baseAssets } from "@/lib/mock-data"

const iconMap: any = {
  Layers, Server, HardDrive, Network, Share2, Router, ShieldAlert, Zap, BatteryCharging, 
  Plug, Snowflake, Wind, Shield, Box
}

export default function CategoryDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [activeTab, setActiveTab] = useState("Overview")

  const category = mockCategories.find(c => c.id === id)
  
  if (!category) {
    return <div className="p-8 text-center font-bold text-muted-foreground mt-10">Category not found</div>
  }

  const parentCat = mockCategories.find(c => c.id === category.parent)
  const IconComponent = iconMap[category.icon] || Layers

  // Find assets belonging to this category (smart fuzzy match for mock data)
  const relatedAssets = baseAssets.filter(a => {
    const assetCat = a.cat.toLowerCase();
    const catId = category.id;

    const mappings: Record<string, string[]> = {
      'cat-infra': ['server', 'storage', 'mainframe', 'rack'],
      'cat-server': ['server', 'mainframe'],
      'cat-storage': ['storage', 'san'],
      'cat-network': ['switch', 'router', 'firewall', 'transceiver', 'odf', 'access point'],
      'cat-switch': ['switch', 'transceiver', 'odf'],
      'cat-router': ['router'],
      'cat-firewall': ['firewall', 'security'],
      'cat-power': ['ups', 'battery', 'pdu', 'mdp', 'ats', 'generator', 'genset', 'rectifier', 'panel'],
      'cat-ups': ['ups', 'battery', 'rectifier', 'ats'],
      'cat-pdu': ['pdu', 'mdp', 'panel'],
      'cat-cooling': ['pac', 'crac', 'ac', 'chiller', 'cooling', 'humidifier', 'sensor'],
      'cat-crac': ['pac', 'crac', 'ac'],
      'cat-security': ['cctv', 'camera', 'nvr', 'access', 'door', 'alarm', 'turnstile', 'fire'],
      'cat-cctv': ['cctv', 'camera', 'nvr'],
      'cat-access': ['access', 'door', 'turnstile']
    };

    if (mappings[catId]) {
      // Exclude "rack" from "servers" category so Server Rack doesn't fall into Servers
      if (catId === 'cat-server' && assetCat.includes('rack')) return false;
      return mappings[catId].some(k => assetCat.includes(k));
    }
    
    // Fallback
    return assetCat.includes(category.name.toLowerCase()) || category.name.toLowerCase().includes(assetCat);
  });

  const tabs = ["Overview", "Assets", "Templates", "History"]

  return (
    <div className="space-y-8 pb-12 mt-2">
      
      {/* Back Link */}
      <div>
        <Link href="/categories" className="inline-flex items-center text-sm font-bold text-muted-foreground hover:text-accent transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Categories
        </Link>
      </div>

      {/* Header Profile */}
      <div className="bg-background shadow-neu-extruded border-neu rounded-[32px] p-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-2xl flex items-center justify-center shadow-neu-inset" style={{ color: category.color }}>
              <IconComponent className="w-10 h-10" />
            </div>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-3xl font-display font-bold text-foreground">{category.name}</h1>
                <span className={`px-3 py-1 rounded-full text-xs font-bold shadow-neu-inset ${category.status === 'Active' ? 'text-[#38B2AC]' : 'text-muted-foreground'}`}>
                  {category.status}
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-bold shadow-neu-inset bg-accent/5 text-accent font-mono">
                  {category.code}
                </span>
              </div>
              <p className="text-muted-foreground font-medium flex items-center gap-2">
                {parentCat ? (
                  <>
                    <span className="text-foreground">{parentCat.name}</span>
                    <span className="text-[#A3B1C6]">/</span>
                  </>
                ) : null}
                {category.description}
              </p>
            </div>
          </div>
          
          <div className="flex gap-3">
            <Button variant="outline" className="h-12 px-6 rounded-2xl shadow-neu-extruded border-neu font-bold text-foreground hover:text-accent">
              <Edit2 className="w-4 h-4 mr-2" /> Edit
            </Button>
            <Button variant="outline" className="h-12 px-6 rounded-2xl shadow-neu-extruded border-neu font-bold text-foreground hover:text-accent">
              <Copy className="w-4 h-4 mr-2" /> Duplicate
            </Button>
            <Button variant="ghost" size="icon" className="h-12 w-12 rounded-2xl text-red-500 hover:bg-red-50 hover:text-red-600 hover:shadow-neu-inset">
              <Trash2 className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex overflow-x-auto gap-2 mt-8 pt-4 border-t border-[#A3B1C6]/30 px-2 [&::-webkit-scrollbar]:hidden">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all duration-300 ${
                activeTab === tab 
                  ? 'bg-background shadow-neu-extruded text-accent translate-y-[-2px]' 
                  : 'text-muted-foreground hover:text-foreground hover:bg-[#A3B1C6]/10'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Content Area */}
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        
        {/* OVERVIEW TAB */}
        {activeTab === "Overview" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* KPI Column */}
            <div className="space-y-6">
              <Card className="rounded-[32px] border-neu shadow-neu-extruded bg-background">
                <CardContent className="p-8 space-y-8">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center text-accent shadow-neu-inset">
                      <Box className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Total Assets</p>
                      <p className="text-3xl font-display font-bold text-foreground">{relatedAssets.length}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-[#38B2AC]/10 flex items-center justify-center text-[#38B2AC] shadow-neu-inset">
                      <Activity className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Active Assets</p>
                      <p className="text-3xl font-display font-bold text-foreground">{relatedAssets.filter(a => a.status === 'Active').length}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-[#8B5CF6]/10 flex items-center justify-center text-[#8B5CF6] shadow-neu-inset">
                      <Calendar className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Created Date</p>
                      <p className="text-xl font-bold text-foreground mt-1">{category.createdDate}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Rules Column */}
            <div className="md:col-span-2 space-y-6">
              <Card className="rounded-[32px] border-neu shadow-neu-extruded bg-background">
                <CardHeader className="border-b border-[#A3B1C6]/20 px-8 pb-4 pt-8">
                  <CardTitle className="text-xl font-bold text-foreground">Asset Classification Rules</CardTitle>
                </CardHeader>
                <CardContent className="p-8">
                  <p className="text-muted-foreground text-sm font-medium mb-6">These rules are strictly enforced when creating or modifying assets under the <strong>{category.name}</strong> category.</p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className={`flex items-center gap-4 bg-background shadow-neu-inset border border-white/50 rounded-2xl p-4 ${category.rules?.requireSerial ? '' : 'opacity-50'}`}>
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${category.rules?.requireSerial ? 'bg-accent/10 text-accent' : 'bg-[#A3B1C6]/20 text-muted-foreground'}`}>
                        {category.rules?.requireSerial ? <CheckCircle2 className="w-5 h-5" /> : <X className="w-5 h-5" />}
                      </div>
                      <span className="font-bold text-sm text-foreground">Require Serial Number</span>
                    </div>

                    <div className={`flex items-center gap-4 bg-background shadow-neu-inset border border-white/50 rounded-2xl p-4 ${category.rules?.requireWarranty ? '' : 'opacity-50'}`}>
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${category.rules?.requireWarranty ? 'bg-accent/10 text-accent' : 'bg-[#A3B1C6]/20 text-muted-foreground'}`}>
                        {category.rules?.requireWarranty ? <CheckCircle2 className="w-5 h-5" /> : <X className="w-5 h-5" />}
                      </div>
                      <span className="font-bold text-sm text-foreground">Require Warranty Details</span>
                    </div>

                    <div className={`flex items-center gap-4 bg-background shadow-neu-inset border border-white/50 rounded-2xl p-4 ${category.rules?.requireLocation ? '' : 'opacity-50'}`}>
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${category.rules?.requireLocation ? 'bg-accent/10 text-accent' : 'bg-[#A3B1C6]/20 text-muted-foreground'}`}>
                        {category.rules?.requireLocation ? <CheckCircle2 className="w-5 h-5" /> : <X className="w-5 h-5" />}
                      </div>
                      <span className="font-bold text-sm text-foreground">Require Location (Site/Room)</span>
                    </div>

                    <div className={`flex items-center gap-4 bg-background shadow-neu-inset border border-white/50 rounded-2xl p-4 ${category.rules?.requireRackPosition ? '' : 'opacity-50'}`}>
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${category.rules?.requireRackPosition ? 'bg-accent/10 text-accent' : 'bg-[#A3B1C6]/20 text-muted-foreground'}`}>
                        {category.rules?.requireRackPosition ? <CheckCircle2 className="w-5 h-5" /> : <X className="w-5 h-5" />}
                      </div>
                      <span className="font-bold text-sm text-foreground">Require Rack Position (U)</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* ASSETS TAB */}
        {activeTab === "Assets" && (
          <Card className="rounded-[32px] border-neu shadow-neu-extruded bg-background overflow-hidden">
            <div className="px-8 pt-8 pb-4 flex justify-between items-center border-b border-[#A3B1C6]/20">
              <CardTitle className="text-xl font-bold text-foreground">Assigned Assets</CardTitle>
              <span className="px-4 py-1 rounded-full bg-accent/10 text-accent font-bold text-sm shadow-neu-inset">
                {relatedAssets.length} Assets
              </span>
            </div>
            {relatedAssets.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr>
                      <th className="px-8 py-5 font-bold text-xs uppercase tracking-wider text-muted-foreground border-b border-[#A3B1C6]/20">Asset Tag</th>
                      <th className="px-6 py-5 font-bold text-xs uppercase tracking-wider text-muted-foreground border-b border-[#A3B1C6]/20">Hostname</th>
                      <th className="px-6 py-5 font-bold text-xs uppercase tracking-wider text-muted-foreground border-b border-[#A3B1C6]/20">Location</th>
                      <th className="px-6 py-5 font-bold text-xs uppercase tracking-wider text-muted-foreground border-b border-[#A3B1C6]/20">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#A3B1C6]/10">
                    {relatedAssets.map((asset) => (
                      <tr key={asset.id} className="hover:bg-[#A3B1C6]/5 transition-colors">
                        <td className="px-8 py-4 font-bold text-foreground">
                          <Link href={`/assets/${asset.tag}`} className="hover:text-accent transition-colors">{asset.tag}</Link>
                        </td>
                        <td className="px-6 py-4 font-mono text-sm text-muted-foreground">{asset.host}</td>
                        <td className="px-6 py-4 text-sm text-foreground">{asset.loc} • {asset.rack} • U{asset.u}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex px-3 py-1 rounded-full text-xs font-bold shadow-neu-inset ${asset.status === 'Active' ? 'text-[#38B2AC]' : 'text-muted-foreground'}`}>
                            {asset.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-16 text-center">
                <div className="w-20 h-20 mx-auto rounded-2xl bg-background shadow-neu-extruded border border-white/50 flex items-center justify-center mb-6">
                  <Box className="w-10 h-10 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">No Assets Found</h3>
                <p className="text-muted-foreground max-w-md mx-auto">There are currently no assets assigned to this category.</p>
              </div>
            )}
          </Card>
        )}

        {/* TEMPLATES TAB */}
        {activeTab === "Templates" && (
          <Card className="rounded-[32px] border-neu shadow-neu-extruded bg-background">
            <div className="px-8 pt-8 pb-4 border-b border-[#A3B1C6]/20">
              <CardTitle className="text-xl font-bold text-foreground">Template Fields</CardTitle>
              <p className="text-sm text-muted-foreground font-medium mt-1">Custom fields required for {category.name}</p>
            </div>
            <CardContent className="p-8">
              {category.templates && category.templates.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {category.templates.map((template, idx) => (
                    <div key={idx} className="bg-background shadow-neu-inset border border-white/50 rounded-2xl p-6">
                      <div className="w-10 h-10 rounded-xl bg-background shadow-neu-extruded flex items-center justify-center mb-4 text-accent">
                        <span className="font-bold text-sm">{idx + 1}</span>
                      </div>
                      <p className="font-bold text-foreground text-lg">{template}</p>
                      <p className="text-xs text-muted-foreground uppercase tracking-wider mt-2">Text / Number Field</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-12 text-center border-2 border-dashed border-[#A3B1C6]/30 rounded-3xl">
                  <AlertTriangle className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                  <h3 className="text-xl font-bold text-foreground mb-2">No Templates Defined</h3>
                  <p className="text-muted-foreground">This category does not enforce any specific custom technical fields.</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* HISTORY TAB */}
        {activeTab === "History" && (
          <Card className="rounded-[32px] border-neu shadow-neu-extruded bg-background">
            <CardHeader className="border-b border-[#A3B1C6]/20 px-8 pb-4 pt-8">
              <CardTitle className="text-xl font-bold text-foreground">Audit Log</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <table className="w-full text-left">
                <thead className="bg-[#A3B1C6]/5 border-b border-[#A3B1C6]/20">
                  <tr>
                    <th className="px-8 py-4 font-bold text-xs uppercase tracking-wider text-muted-foreground">User</th>
                    <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider text-muted-foreground">Action</th>
                    <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider text-muted-foreground">Timestamp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#A3B1C6]/10">
                  <tr>
                    <td className="px-8 py-5 font-bold border-white/60 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-accent text-white flex items-center justify-center text-xs">ADR</div> Agus Dwi R
                    </td>
                    <td className="px-6 py-5 text-sm text-foreground">Created Category via API</td>
                    <td className="px-6 py-5 font-mono text-xs text-muted-foreground">{category.createdDate} 09:15:22</td>
                  </tr>
                </tbody>
              </table>
            </CardContent>
          </Card>
        )}

      </div>
    </div>
  )
}
