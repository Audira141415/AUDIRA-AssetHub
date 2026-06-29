"use client"

import { useState, useEffect, useMemo } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  Globe, CheckCircle2, Box, Zap, MapPin, Search, 
  Plus, Edit2, Trash2, X, FileSpreadsheet, Layers, ShieldCheck, AlertTriangle, TrendingUp, Clock, FileDown
} from "lucide-react"
import { apiClient } from "@/lib/api-client"
import { HeroSection } from "@/components/ui/hero-section"

export default function SitesPage() {
  const [locations, setLocations] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")

  // Edit/Create Drawer states
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  
  // Detail Drawer state
  const [selectedSiteDetail, setSelectedSiteDetail] = useState<any | null>(null)
  const [isExporting, setIsExporting] = useState(false)
  
  // Form states
  const [formData, setFormData] = useState({ name: "", type: "Site" })

  const fetchLocations = async () => {
    try {
      setIsLoading(true);
      const res = await apiClient.get('/locations');
      setLocations(res.data);
    } catch (err) {
      console.error("Failed to fetch locations", err);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchLocations();
  }, [])

  // Filter only sites
  const sites = useMemo(() => {
    return locations.filter((loc: any) => loc.type === "Site");
  }, [locations]);

  const handleSave = async () => {
    if (!formData.name) return alert("Name is required.");
    try {
      if (isEditing && editingId) {
        await apiClient.put(`/locations/${editingId}`, formData);
      } else {
        await apiClient.post('/locations', formData);
      }
      setIsDrawerOpen(false);
      // Close detail view if editing the current one
      if (selectedSiteDetail?.id === editingId) {
        setSelectedSiteDetail(null);
      }
      fetchLocations();
    } catch (err) {
      console.error("Save failed", err);
      alert("Failed to save site.");
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this site?")) return;
    try {
      await apiClient.delete(`/locations/${id}`);
      if (selectedSiteDetail?.id === id) {
        setSelectedSiteDetail(null);
      }
      fetchLocations();
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

  const openEditDrawer = (site: any, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setFormData({ name: site.name, type: site.type });
    setIsEditing(true);
    setEditingId(site.id);
    setIsDrawerOpen(true);
  }

  const totalSites = sites.length
  const totalAssets = sites.reduce((sum, s) => sum + (s.assetsCount || 0), 0)
  const totalValuation = sites.reduce((sum, s) => sum + (s.valuation || 0), 0)

  const filteredSites = useMemo(() => {
    return sites.filter(s => {
      return s.name.toLowerCase().includes(searchQuery.toLowerCase());
    });
  }, [sites, searchQuery]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(value);
  };

  const getAuditStatus = (lastAuditDateStr: string | null) => {
    if (!lastAuditDateStr) {
      return { label: "Never Audited", color: "text-amber-600 bg-amber-500/10 border-amber-500/20", icon: AlertTriangle };
    }
    const lastAudit = new Date(lastAuditDateStr);
    const ninetyDaysAgo = new Date();
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

    if (lastAudit < ninetyDaysAgo) {
      return { label: "Needs Audit", color: "text-red-500 bg-red-500/10 border-red-500/20", icon: AlertTriangle };
    }
    return { label: "Verified", color: "text-emerald-600 bg-emerald-500/10 border-emerald-500/20", icon: ShieldCheck };
  };

  const handleExportCSV = async (site: any) => {
    try {
      setIsExporting(true);
      // Fetch all assets
      const res = await apiClient.get('/assets');
      const allAssets = res.data;

      // Map location ID to parent site ID
      const locationMap = new Map();
      locations.forEach(loc => locationMap.set(loc.id, loc));

      const getRootSiteId = (locationId: string | null): string | null => {
        if (!locationId) return null;
        let current = locationMap.get(locationId);
        let visited = new Set();
        while (current) {
          if (visited.has(current.id)) break;
          visited.add(current.id);
          if (current.type === 'Site') return current.id;
          if (!current.parentLoc) break;
          current = locationMap.get(current.parentLoc);
        }
        return null;
      };

      // Filter assets by current site
      const siteAssets = allAssets.filter((asset: any) => getRootSiteId(asset.locationId) === site.id);

      // Create CSV content
      const headers = ["Asset Tag", "Hostname", "Category", "Status", "Lifecycle State", "Purchase Cost", "Purchase Date", "Last Audit"];
      const rows = siteAssets.map((a: any) => [
        a.tag,
        a.hostname || "N/A",
        a.category?.name || "N/A",
        a.status || "Active",
        a.lifecycleState || "Production",
        a.purchaseCost ? `$${a.purchaseCost}` : "0",
        a.purchaseDate ? new Date(a.purchaseDate).toLocaleDateString() : "N/A",
        a.lastAuditDate ? new Date(a.lastAuditDate).toLocaleDateString() : "N/A"
      ]);

      const csvContent = "data:text/csv;charset=utf-8," 
        + [headers.join(","), ...rows.map((row: string[]) => row.map((val: string) => `"${val}"`).join(","))].join("\n");
      
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `audira_assets_${site.name.toLowerCase().replace(/[^a-z0-9]/g, '_')}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error("Export failed", err);
      alert("Failed to export asset records.");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-80px)] overflow-hidden flex bg-[#E0E5EC]">
      <div className="flex-1 transition-all duration-500 ease-in-out p-6 md:p-8 overflow-y-auto">
        <div className="space-y-8 pb-12 mt-2">
          {/* Header */}
          <HeroSection
            title="Sites"
            description="Enterprise Assets Location & Infrastructure Node Center"
            imageSrc="/images/heroes/sites.png"
          >
            <div className="flex gap-4 flex-wrap">
              <Button onClick={openCreateDrawer} className="h-12 px-6 rounded-2xl shadow-neu-extruded hover:shadow-neu-hover border border-white/60 font-bold text-white bg-accent hover:bg-accent-light flex items-center transition-all">
                <Plus className="w-5 h-5 mr-2" /> Add Site
              </Button>
            </div>
          </HeroSection>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
            <Card className="rounded-[24px] border-neu shadow-neu-extruded bg-background">
              <CardContent className="p-5 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#007DB8]/10 flex items-center justify-center shadow-neu-inset text-[#007DB8]">
                  <Globe className="w-6 h-6 animate-pulse" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-bold text-[#007DB8] uppercase tracking-wider mb-0.5 truncate">Total Active Sites</p>
                  <p className="text-2xl font-display font-bold text-foreground truncate leading-none">{totalSites}</p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="rounded-[24px] border-neu shadow-neu-extruded bg-background">
              <CardContent className="p-5 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#38B2AC]/10 flex items-center justify-center shadow-neu-inset text-[#38B2AC]">
                  <Box className="w-6 h-6" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-bold text-[#38B2AC] uppercase tracking-wider mb-0.5 truncate">Total Registered Assets</p>
                  <p className="text-2xl font-display font-bold text-foreground truncate leading-none">{totalAssets}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-[24px] border-neu shadow-neu-extruded bg-background">
              <CardContent className="p-5 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#F59E0B]/10 flex items-center justify-center shadow-neu-inset text-[#F59E0B]">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-bold text-[#F59E0B] uppercase tracking-wider mb-0.5 truncate">Total Asset Capital Value</p>
                  <p className="text-2xl font-display font-bold text-foreground truncate leading-none">{formatCurrency(totalValuation)}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Search bar */}
          <div className="flex flex-col md:flex-row justify-between gap-4">
            <div className="flex flex-1 max-w-md gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input 
                  type="text" 
                  placeholder="Search sites by name..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-12 pl-12 pr-4 bg-background shadow-neu-inset border-neu rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-accent/50 text-foreground" 
                />
              </div>
            </div>
          </div>

          {/* Sites Grid Cards instead of table */}
          {isLoading ? (
            <div className="text-center py-12 font-bold text-muted-foreground">Loading sites...</div>
          ) : filteredSites.length === 0 ? (
            <div className="text-center py-12 font-bold text-muted-foreground">No sites found.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredSites.map((site) => {
                const audit = getAuditStatus(site.lastAuditDate);
                const AuditIcon = audit.icon;
                
                // Calculate percentages for status distribution
                const totalState = (site.statusBreakdown?.Active || 0) + 
                                   (site.statusBreakdown?.InStorage || 0) + 
                                   (site.statusBreakdown?.UnderRepair || 0) + 
                                   (site.statusBreakdown?.Retired || 0);

                const activePercent = totalState > 0 ? ((site.statusBreakdown?.Active || 0) / totalState) * 100 : 0;
                const storagePercent = totalState > 0 ? ((site.statusBreakdown?.InStorage || 0) / totalState) * 100 : 0;
                const repairPercent = totalState > 0 ? ((site.statusBreakdown?.UnderRepair || 0) / totalState) * 100 : 0;

                return (
                  <Card 
                    key={site.id} 
                    onClick={() => setSelectedSiteDetail(site)}
                    className="rounded-[32px] border-neu shadow-neu-extruded hover:shadow-neu-hover bg-background transition-all duration-300 cursor-pointer overflow-hidden group flex flex-col justify-between"
                  >
                    <div className="p-6 space-y-6">
                      {/* Top Row: Name + Icons */}
                      <div className="flex justify-between items-start gap-2">
                        <div>
                          <h3 className="font-display font-black text-xl text-foreground group-hover:text-accent transition-colors truncate max-w-[200px]" title={site.name}>
                            {site.name}
                          </h3>
                          <div className="flex items-center gap-1.5 mt-1 text-[11px] font-bold text-muted-foreground">
                            <MapPin size={12} className="text-accent" />
                            <span>{site.buildingsCount} Building • {site.roomsCount} Room • {site.racksCount} Rack</span>
                          </div>
                        </div>

                        {/* Actions Quick Trigger */}
                        <div className="flex items-center gap-1 opacity-40 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={(e) => openEditDrawer(site, e)} 
                            className="p-2 rounded-lg bg-background text-accent hover:text-accent-light hover:shadow-neu-inset transition-all"
                            title="Edit Site"
                          >
                            <Edit2 size={13} />
                          </button>
                          <button 
                            onClick={(e) => { e.stopPropagation(); handleDelete(site.id); }} 
                            className="p-2 rounded-lg bg-background text-red-500 hover:text-red-600 hover:shadow-neu-inset transition-all"
                            title="Delete Site"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>

                      {/* Middle Section: Valuation and Audit Badge */}
                      <div className="grid grid-cols-2 gap-2 bg-background shadow-neu-inset-small rounded-2xl p-4 border border-white/40">
                        <div>
                          <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider mb-0.5">Valuation</p>
                          <p className="text-lg font-bold text-foreground font-display truncate">{formatCurrency(site.valuation || 0)}</p>
                        </div>
                        <div>
                          <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider mb-0.5">Audit Compliance</p>
                          <div className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-extrabold border uppercase tracking-wider ${audit.color}`}>
                            <AuditIcon size={10} />
                            <span>{audit.label}</span>
                          </div>
                        </div>
                      </div>

                      {/* Lower Section: Asset Counts & Progress bar */}
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs font-bold text-muted-foreground">
                          <span>Assets: {site.assetsCount || 0} items</span>
                          <span className="text-[10px] text-accent">Status Split</span>
                        </div>

                        {/* Status Distribution Progress Bar */}
                        {totalState > 0 ? (
                          <div className="w-full h-2.5 bg-background shadow-neu-inset rounded-full overflow-hidden flex border border-white/20">
                            <div className="bg-accent h-full shadow-[0_0_8px_rgba(108,99,255,0.4)]" style={{ width: `${activePercent}%` }} title={`Active: ${site.statusBreakdown?.Active}`} />
                            <div className="bg-[#38B2AC] h-full" style={{ width: `${storagePercent}%` }} title={`In Storage: ${site.statusBreakdown?.InStorage}`} />
                            <div className="bg-[#F59E0B] h-full" style={{ width: `${repairPercent}%` }} title={`Under Repair: ${site.statusBreakdown?.UnderRepair}`} />
                          </div>
                        ) : (
                          <div className="w-full h-2.5 bg-background shadow-neu-inset rounded-full border border-white/20 flex items-center justify-center text-[8px] font-bold text-muted-foreground">
                            No Asset Deployed
                          </div>
                        )}

                        {/* Legend */}
                        {totalState > 0 && (
                          <div className="flex flex-wrap gap-x-3 gap-y-1 text-[9px] font-bold text-muted-foreground mt-1">
                            <div className="flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                              <span>Active ({site.statusBreakdown?.Active || 0})</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#38B2AC]" />
                              <span>Storage ({site.statusBreakdown?.InStorage || 0})</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#F59E0B]" />
                              <span>Repair ({site.statusBreakdown?.UnderRepair || 0})</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Bottom Action Footer */}
                    <div className="px-6 py-4 bg-background border-t border-[#A3B1C6]/10 flex items-center justify-between">
                      <span className="text-[10px] font-bold text-muted-foreground">
                        Last Audit: {site.lastAuditDate ? new Date(site.lastAuditDate).toLocaleDateString() : "Never"}
                      </span>
                      <span className="text-xs font-bold text-accent group-hover:underline flex items-center gap-0.5">
                        Details & Metrics <Zap size={12} className="fill-accent animate-pulse" />
                      </span>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* CRUD/Edit Drawer */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/25 backdrop-blur-sm" onClick={() => setIsDrawerOpen(false)}></div>
          
          <div className="relative w-full max-w-xl h-full bg-background shadow-[-10px_0_30px_rgba(0,0,0,0.15)] border-l border-white/50 flex flex-col animate-in slide-in-from-right duration-300">
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
                <input 
                  type="text" 
                  value={formData.name} 
                  onChange={e => setFormData({...formData, name: e.target.value})} 
                  className="w-full h-12 px-4 bg-background shadow-neu-inset border-neu rounded-xl text-sm font-bold text-foreground focus:ring-2 focus:ring-accent/50 outline-none" 
                  placeholder="e.g. Jakarta Data Center"
                />
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

      {/* Detail view Drawer */}
      {selectedSiteDetail && (
        <div className="fixed inset-0 z-40 flex justify-end">
          <div className="absolute inset-0 bg-black/25 backdrop-blur-sm" onClick={() => setSelectedSiteDetail(null)}></div>
          
          <div className="relative w-full max-w-xl h-full bg-[#E0E5EC] shadow-[-10px_0_30px_rgba(0,0,0,0.15)] border-l border-white/60 flex flex-col animate-in slide-in-from-right duration-300">
            {/* Header */}
            <div className="px-8 py-6 flex justify-between items-center border-b border-[#A3B1C6]/20 bg-background">
              <div>
                <span className="text-[10px] font-bold text-accent uppercase tracking-wider">Site Dashboard</span>
                <h2 className="text-2xl font-black text-foreground mt-0.5 leading-none">{selectedSiteDetail.name}</h2>
              </div>
              <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl hover:bg-red-50 hover:text-red-500 hover:shadow-neu-inset" onClick={() => setSelectedSiteDetail(null)}>
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Content Body */}
            <div className="flex-1 overflow-y-auto px-8 py-6 space-y-6">
              {/* Financial & Hierarchy Card */}
              <div className="grid grid-cols-2 gap-4">
                <Card className="rounded-2xl border-neu shadow-neu-extruded bg-background p-4 flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase">CapEx Valuation</span>
                    <TrendingUp size={16} className="text-accent" />
                  </div>
                  <p className="text-2xl font-display font-extrabold text-foreground mt-4">{formatCurrency(selectedSiteDetail.valuation || 0)}</p>
                </Card>

                <Card className="rounded-2xl border-neu shadow-neu-extruded bg-background p-4 flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase">Sub-Nodes</span>
                    <MapPin size={16} className="text-accent" />
                  </div>
                  <div className="mt-2 text-xs font-semibold text-foreground space-y-0.5">
                    <p>{selectedSiteDetail.buildingsCount || 0} Buildings</p>
                    <p>{selectedSiteDetail.roomsCount || 0} Rooms</p>
                    <p>{selectedSiteDetail.racksCount || 0} Racks</p>
                  </div>
                </Card>
              </div>

              {/* Audit Compliance Status Card */}
              <Card className="rounded-[24px] border-neu shadow-neu-extruded bg-background p-5 space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-bold text-sm text-foreground uppercase tracking-wide">Audit & Security</h3>
                  <Clock size={16} className="text-muted-foreground" />
                </div>

                <div className="flex items-center justify-between p-3.5 bg-background shadow-neu-inset border-neu rounded-2xl">
                  <div>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase">Last Audit Date</p>
                    <p className="text-sm font-bold text-foreground mt-1">
                      {selectedSiteDetail.lastAuditDate 
                        ? new Date(selectedSiteDetail.lastAuditDate).toLocaleDateString(undefined, { dateStyle: 'long' }) 
                        : "Never Audited"
                      }
                    </p>
                  </div>
                  
                  {(() => {
                    const audit = getAuditStatus(selectedSiteDetail.lastAuditDate);
                    const AuditIcon = audit.icon;
                    return (
                      <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-black border uppercase tracking-wider ${audit.color}`}>
                        <AuditIcon size={12} />
                        <span>{audit.label}</span>
                      </div>
                    );
                  })()}
                </div>
              </Card>

              {/* Status Lifecyle Split */}
              <Card className="rounded-[24px] border-neu shadow-neu-extruded bg-background p-5 space-y-4">
                <h3 className="font-bold text-sm text-foreground uppercase tracking-wide">Lifecycle State Breakdown</h3>
                
                <div className="space-y-3.5">
                  {[
                    { label: "Production / Active", count: selectedSiteDetail.statusBreakdown?.Active || 0, color: "bg-accent" },
                    { label: "In Storage", count: selectedSiteDetail.statusBreakdown?.InStorage || 0, color: "bg-[#38B2AC]" },
                    { label: "Under Repair / RMA", count: selectedSiteDetail.statusBreakdown?.UnderRepair || 0, color: "bg-[#F59E0B]" },
                    { label: "Retired / Disposed", count: selectedSiteDetail.statusBreakdown?.Retired || 0, color: "bg-red-500" },
                    { label: "Other", count: selectedSiteDetail.statusBreakdown?.Other || 0, color: "bg-gray-400" }
                  ].map((state, idx) => {
                    const total = selectedSiteDetail.assetsCount || 0;
                    const pct = total > 0 ? (state.count / total) * 100 : 0;
                    
                    return (
                      <div key={idx} className="space-y-1">
                        <div className="flex justify-between text-xs font-bold text-muted-foreground">
                          <span>{state.label}</span>
                          <span>{state.count} ({pct.toFixed(0)}%)</span>
                        </div>
                        <div className="w-full h-2 bg-background shadow-neu-inset rounded-full overflow-hidden border border-white/20">
                          <div className={`h-full ${state.color}`} style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Card>

              {/* Category Breakdown list */}
              <Card className="rounded-[24px] border-neu shadow-neu-extruded bg-background p-5 space-y-4">
                <h3 className="font-bold text-sm text-foreground uppercase tracking-wide">Hardware Categories</h3>

                <div className="divide-y divide-[#A3B1C6]/10 max-h-[250px] overflow-y-auto pr-1">
                  {Object.keys(selectedSiteDetail.categoryDistribution || {}).length > 0 ? (
                    Object.entries(selectedSiteDetail.categoryDistribution).map(([name, count]: any) => (
                      <div key={name} className="flex justify-between items-center py-2.5">
                        <div className="flex items-center gap-2">
                          <Layers size={14} className="text-accent" />
                          <span className="text-sm font-bold text-foreground">{name}</span>
                        </div>
                        <span className="px-2.5 py-0.5 rounded-full bg-background shadow-neu-extruded border-neu text-xs font-black text-accent">{count} items</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs font-bold text-muted-foreground text-center py-6">No categorised assets.</p>
                  )}
                </div>
              </Card>
            </div>

            {/* Footer buttons */}
            <div className="px-8 py-6 border-t border-[#A3B1C6]/20 bg-background flex flex-col sm:flex-row justify-between gap-4">
              <Button 
                onClick={() => handleExportCSV(selectedSiteDetail)}
                disabled={isExporting || (selectedSiteDetail.assetsCount || 0) === 0} 
                className="h-12 px-6 rounded-2xl border-neu bg-[#E0E5EC] shadow-neu-extruded hover:shadow-neu-hover active:shadow-neu-inset-small font-bold text-accent text-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <FileSpreadsheet size={16} /> 
                {isExporting ? "Exporting..." : "Export Site Inventory (CSV)"}
              </Button>

              <div className="flex gap-3 justify-end">
                <Button 
                  onClick={(e) => openEditDrawer(selectedSiteDetail, e)} 
                  className="h-12 px-6 rounded-2xl border-neu bg-[#E0E5EC] shadow-neu-extruded hover:shadow-neu-hover active:shadow-neu-inset-small font-bold text-foreground text-sm flex items-center justify-center gap-2 transition-all"
                >
                  <Edit2 size={14} /> Edit
                </Button>
                <Button 
                  onClick={() => handleDelete(selectedSiteDetail.id)} 
                  className="h-12 px-6 rounded-2xl bg-red-50 text-red-500 hover:bg-red-100 font-bold text-sm flex items-center justify-center gap-2 transition-all"
                >
                  <Trash2 size={14} /> Delete
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
