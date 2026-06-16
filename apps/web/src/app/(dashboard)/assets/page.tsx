"use client"
import { useSearchParams } from "next/navigation"

import { useState, useMemo, useEffect, useRef } from "react"
import { Plus, Search, Filter, MoreHorizontal, Server, Activity, Wrench, ShieldAlert, ChevronRight, ArrowUpDown, ChevronDown, CheckCircle2, AlertCircle, WifiOff, Download, Upload, QrCode, Trash2, X } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { apiClient } from "@/lib/api-client"
import { getAssetImage } from "@/lib/utils"
import { HeroSection } from "@/components/ui/hero-section"
import { BulkImportModal } from "@/components/BulkImportModal"
import { QRCodeModal } from "@/components/QRCodeModal"

const CustomSelect = ({ value, onChange, options, placeholder, className }: any) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center justify-between cursor-pointer ${className}`}
      >
        <span className="truncate">{value === 'All' ? placeholder : value}</span>
        <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </div>
      
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 min-w-full z-50 bg-[#E4E9F2] rounded-2xl shadow-neu-extruded border border-white/50 py-2 max-h-60 overflow-y-auto">
          <div 
            onClick={() => { onChange('All'); setIsOpen(false); }}
            className={`px-4 py-3 text-sm font-bold cursor-pointer hover:bg-[#A3B1C6]/20 transition-colors ${value === 'All' ? 'text-accent' : 'text-foreground'}`}
          >
            {placeholder}
          </div>
          {options.length > 0 && typeof options[0] === 'string' ? (
            options.map((opt: string) => (
              <div 
                key={opt}
                onClick={() => { onChange(opt); setIsOpen(false); }}
                className={`px-4 py-3 text-sm font-bold cursor-pointer hover:bg-[#A3B1C6]/20 transition-colors ${value === opt ? 'text-accent' : 'text-foreground'}`}
              >
                {opt}
              </div>
            ))
          ) : (
            options.map((group: any) => (
              <div key={group.group}>
                <div className="px-4 py-2 text-xs font-black text-muted-foreground uppercase tracking-wider bg-black/5 mt-1 border-y border-white/20">
                  {group.group}
                </div>
                {group.items.map((opt: string) => (
                  <div 
                    key={opt}
                    onClick={() => { onChange(opt); setIsOpen(false); }}
                    className={`px-6 py-2.5 text-sm font-bold cursor-pointer hover:bg-[#A3B1C6]/20 transition-colors ${value === opt ? 'text-accent' : 'text-foreground'}`}
                  >
                    {opt}
                  </div>
                ))}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default function AllAssetsPage() {
  const [assets, setAssets] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isOffline, setIsOffline] = useState(false);
  
  // Bulk Actions State
  const [selectedAssetIds, setSelectedAssetIds] = useState<Set<number>>(new Set());
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);

  const fetchAssets = async () => {
      try {
        setIsLoading(true);
        const response = await apiClient.get('/assets');
        const apiAssets = response.data;
        
        // Map API schema to Frontend UI schema
        const mappedAssets = apiAssets.map((apiAsset: any) => ({
          id: apiAsset.id,
          tag: apiAsset.tag,
          host: apiAsset.hostname || "N/A",
          cat: apiAsset.category ? apiAsset.category.name : "N/A",
          loc: apiAsset.location ? apiAsset.location.name : "Batam DC", // Placeholder mapping
          room: "Server Room", // Placeholder mapping
          rack: apiAsset.rack || "Floor",
          u: apiAsset.uPosition || "-",
          status: apiAsset.status || "Active",
          warranty: apiAsset.warranty || "Unknown",
          vendor: apiAsset.vendor ? apiAsset.vendor.name : "Unknown"
        }));
        
        setAssets(mappedAssets);
        setIsOffline(false);
      } catch (error) {
        console.error("Failed to fetch assets from API:", error);
        setAssets([]);
        setIsOffline(true);
      } finally {
        setIsLoading(false);
      }
    };
    
  useEffect(() => {
    fetchAssets();
  }, []);

  const handleExportExcel = () => {
    import('xlsx').then((XLSX) => {
      const dataToExport = filteredAssets.map(a => ({
        "Asset Tag": a.tag,
        "Hostname": a.host,
        "Category": a.cat,
        "Location": a.loc,
        "Room": a.room,
        "Rack": a.rack,
        "U Position": a.u,
        "Status": a.status,
        "Warranty": a.warranty,
        "Vendor": a.vendor
      }));
      
      const worksheet = XLSX.utils.json_to_sheet(dataToExport);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Assets");
      XLSX.writeFile(workbook, "AssetHub_Export.xlsx");
    }).catch(err => {
      console.error("Failed to load xlsx module", err);
      alert("Failed to export Excel. Please try again.");
    });
  };

  const handleExportPDF = () => {
    import('jspdf').then((jspdf) => {
      import('jspdf-autotable').then((autoTable) => {
        const doc = new jspdf.jsPDF();
        
        doc.setFontSize(18);
        doc.text("Asset Inventory Report", 14, 22);
        doc.setFontSize(11);
        doc.setTextColor(100);
        doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);
        
        const tableColumn = ["Tag", "Hostname", "Category", "Location", "Status"];
        const tableRows = filteredAssets.map(a => [
          a.tag,
          a.host,
          a.cat,
          a.loc,
          a.status
        ]);

        autoTable.default(doc, {
          startY: 35,
          head: [tableColumn],
          body: tableRows,
          theme: 'grid',
          headStyles: { fillColor: [108, 99, 255] },
        });

        doc.save("AssetHub_Export.pdf");
      });
    }).catch(err => {
      console.error("Failed to load jspdf module", err);
      alert("Failed to export PDF. Please try again.");
    });
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      const allIds = new Set(currentAssets.map((a: any) => a.id));
      setSelectedAssetIds(allIds);
    } else {
      setSelectedAssetIds(new Set());
    }
  };

  const handleSelectAsset = (id: number) => {
    const newSelected = new Set(selectedAssetIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedAssetIds(newSelected);
  };

  const handleBulkDelete = async () => {
    if (!confirm(`Are you sure you want to delete ${selectedAssetIds.size} assets?`)) return;
    
    setIsLoading(true);
    let errorCount = 0;
    for (const id of selectedAssetIds) {
      try {
        await apiClient.delete(`/assets/${id}`);
      } catch (err) {
        console.error(`Failed to delete asset ${id}`, err);
        errorCount++;
      }
    }
    if (errorCount > 0) alert(`Failed to delete ${errorCount} assets.`);
    setSelectedAssetIds(new Set());
    fetchAssets();
  };
  
  // Dynamic KPI Data
  const kpis = [
    { label: "Total Assets", value: assets.length.toLocaleString(), icon: <Server className="text-accent" />, trend: "+204 this month" },
    { label: "Active Assets", value: assets.filter(a => a.status === 'Active').length.toLocaleString(), icon: <CheckCircle2 className="text-[#38B2AC]" />, trend: `${Math.round((assets.filter(a => a.status === 'Active').length / (assets.length || 1)) * 100)}% utilization` },
    { label: "Maintenance", value: assets.filter(a => a.status === 'Maintenance').length.toLocaleString(), icon: <Wrench className="text-[#8B84FF]" />, trend: "5 scheduled today" },
    { label: "Expired Warranty", value: assets.filter(a => a.warranty === 'Expired').length.toLocaleString(), icon: <ShieldAlert className="text-red-500" />, trend: "Needs renewal" },
  ]

  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("All")
  const [statusFilter, setStatusFilter] = useState("All")
  const [siteFilter, setSiteFilter] = useState("All")
  const [warrantyFilter, setWarrantyFilter] = useState("All")

  const searchParams = useSearchParams()

  useEffect(() => {
    // Read global search parameter from URL
    const q = searchParams?.get('q');
    if (q) setSearchQuery(q);
  }, [searchParams]);

  const categories = useMemo(() => {
    const cats = Array.from(new Set(assets.map(a => a.cat))).sort();
    const groups = [
      { group: "IT & Network", keywords: ["Server", "Mainframe", "Storage", "Switch", "Router", "Access Point", "Firewall", "Transceiver"] },
      { group: "Power & Electrical", keywords: ["UPS", "ATS", "MDP", "Genset", "Rectifier", "Battery", "Panel"] },
      { group: "Cooling (HVAC)", keywords: ["AC ", "Chiller", "PAC", "In-Row", "Humidifier"] },
      { group: "Safety & Security", keywords: ["CCTV", "NVR", "DVR", "Access Door", "Biometric", "Turnstile", "Alarm", "Fire", "FSS", "Detector", "VESDA", "Controller"] },
    ];
    
    const grouped: any[] = [];
    const usedCats = new Set();
    
    groups.forEach(g => {
      const items = cats.filter(c => g.keywords.some(k => c.includes(k)));
      if (items.length > 0) {
        grouped.push({ group: g.group, items });
        items.forEach(i => usedCats.add(i));
      }
    });
    
    const others = cats.filter(c => !usedCats.has(c));
    if (others.length > 0) grouped.push({ group: "Others", items: others });
    
    return grouped;
  }, [assets]);

  const statuses = useMemo(() => Array.from(new Set(assets.map(a => a.status))).sort(), [assets])
  const sites = useMemo(() => Array.from(new Set(assets.map(a => a.loc))).sort(), [assets])
  const warranties = useMemo(() => Array.from(new Set(assets.map(a => a.warranty))).sort(), [assets])

  const filteredAssets = useMemo(() => {
    return assets.filter(asset => {
      const matchesSearch = 
        asset.tag.toLowerCase().includes(searchQuery.toLowerCase()) || 
        asset.host.toLowerCase().includes(searchQuery.toLowerCase()) ||
        asset.vendor.toLowerCase().includes(searchQuery.toLowerCase());
        
      const matchesCategory = categoryFilter === "All" || asset.cat === categoryFilter;
      const matchesStatus = statusFilter === "All" || asset.status === statusFilter;
      const matchesSite = siteFilter === "All" || asset.loc === siteFilter;
      const matchesWarranty = warrantyFilter === "All" || asset.warranty === warrantyFilter;
      
      return matchesSearch && matchesCategory && matchesStatus && matchesSite && matchesWarranty;
    });
  }, [assets, searchQuery, categoryFilter, statusFilter, siteFilter, warrantyFilter])

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, categoryFilter, statusFilter, siteFilter, warrantyFilter]);

  const totalPages = Math.ceil(filteredAssets.length / itemsPerPage);
  const currentAssets = filteredAssets.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="space-y-8 pb-10">
      <BulkImportModal isOpen={isImportModalOpen} onClose={() => setIsImportModalOpen(false)} onSuccess={fetchAssets} />
      <QRCodeModal isOpen={isQRModalOpen} onClose={() => setIsQRModalOpen(false)} assets={Array.from(selectedAssetIds).map(id => assets.find(a => a.id === id))} />
      
      {/* Header */}
      <HeroSection
        title="All Assets"
        description="Manage and track your entire data center inventory."
        imageSrc="/images/heroes/assets.png"
      >
        {isOffline && (
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-yellow-500/10 text-yellow-600 rounded-lg text-xs font-bold shadow-neu-inset-small border border-yellow-500/20">
            <WifiOff className="w-4 h-4" />
            <span>Offline / Mock Mode</span>
          </div>
        )}
        <div className="hidden lg:flex gap-2">
          <Button variant="ghost" onClick={handleExportExcel} className="h-12 px-4 rounded-2xl shadow-neu-extruded border-neu font-bold text-sm text-green-600 hover:text-green-700 bg-background/50 backdrop-blur-md">
            <Download className="w-4 h-4 mr-2" /> Excel
          </Button>
          <Button variant="ghost" onClick={handleExportPDF} className="h-12 px-4 rounded-2xl shadow-neu-extruded border-neu font-bold text-sm text-red-600 hover:text-red-700 bg-background/50 backdrop-blur-md">
            <Download className="w-4 h-4 mr-2" /> PDF
          </Button>
        </div>
        <Button variant="ghost" onClick={() => setIsImportModalOpen(true)} className="h-12 px-4 rounded-2xl shadow-neu-extruded border-neu font-bold text-sm text-foreground hover:text-accent bg-background/50 backdrop-blur-md hidden sm:flex">
          <Upload className="w-4 h-4 mr-2" /> Import
        </Button>
        <Link href="/assets/create">
          <Button className="h-12 px-6 rounded-2xl shadow-neu-extruded border-neu font-bold text-sm bg-accent text-white hover:bg-accent-light">
            <Plus className="w-5 h-5 mr-2" /> Create Asset
          </Button>
        </Link>
      </HeroSection>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {kpis.map((kpi, i) => (
          <Card key={i} className="rounded-3xl shadow-neu-extruded hover:shadow-neu-inset hover:-translate-y-2 transition-all duration-300 cursor-pointer group border-neu">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-2">{kpi.label}</p>
                  <h3 className="text-4xl font-display font-bold text-foreground">{kpi.value}</h3>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-background shadow-neu-extruded border-neu flex items-center justify-center shrink-0">
                  {kpi.icon}
                </div>
              </div>
              <p className="text-xs font-semibold text-muted-foreground mt-4">{kpi.trend}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters & Search */}
      <Card className="rounded-[32px]">
        <CardContent className="p-4 sm:p-6 flex flex-col xl:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Search assets by tag, hostname, serial..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-12 pl-12 pr-4 bg-background shadow-neu-inset border-t border-l border-[#A3B1C6]/30 border-b border-r border-white/60 rounded-2xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-accent/50"
            />
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <CustomSelect 
              value={categoryFilter}
              onChange={setCategoryFilter}
              options={categories}
              placeholder="All Categories"
              className="w-40 md:w-48 lg:w-56 h-12 px-4 rounded-2xl shadow-neu-extruded border-neu font-bold text-sm text-foreground hover:text-accent bg-background"
            />

            <CustomSelect 
              value={statusFilter}
              onChange={setStatusFilter}
              options={statuses}
              placeholder="All Statuses"
              className="w-36 md:w-40 h-12 px-4 rounded-2xl shadow-neu-extruded border-neu font-bold text-sm text-foreground hover:text-accent bg-background"
            />

            <div className="hidden md:block">
              <CustomSelect 
                value={siteFilter}
                onChange={setSiteFilter}
                options={sites}
                placeholder="All Sites"
                className="w-36 lg:w-40 h-12 px-4 rounded-2xl shadow-neu-extruded border-neu font-bold text-sm text-foreground hover:text-accent bg-background"
              />
            </div>

            <div className="hidden lg:block">
              <CustomSelect 
                value={warrantyFilter}
                onChange={setWarrantyFilter}
                options={warranties}
                placeholder="All Warranties"
                className="w-40 lg:w-48 h-12 px-4 rounded-2xl shadow-neu-extruded border-neu font-bold text-sm text-foreground hover:text-accent bg-background"
              />
            </div>

            <Button 
              onClick={() => {
                setCategoryFilter("All");
                setStatusFilter("All");
                setSiteFilter("All");
                setWarrantyFilter("All");
                setSearchQuery("");
              }}
              variant="outline" 
              className="h-12 w-12 px-0 rounded-2xl shadow-neu-extruded border-neu text-muted-foreground hover:text-accent flex items-center justify-center"
              title="Reset all filters"
            >
              <Filter className="w-5 h-5" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Bulk Action Toolbar */}
      {selectedAssetIds.size > 0 && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40 bg-background shadow-neu-extruded border-neu rounded-full px-6 py-3 flex items-center gap-6 animate-in slide-in-from-bottom-10 fade-in duration-300">
          <span className="font-bold text-sm text-foreground"><span className="text-accent">{selectedAssetIds.size}</span> selected</span>
          <div className="h-6 w-px bg-[#A3B1C6]/30"></div>
          <div className="flex gap-2">
            <Button onClick={() => setIsQRModalOpen(true)} variant="ghost" className="h-9 px-4 rounded-xl shadow-neu-inset-small bg-background hover:shadow-neu-hover font-bold text-xs text-foreground hover:text-accent">
              <QrCode size={16} className="mr-2" /> Print QR
            </Button>
            <Button variant="ghost" onClick={handleBulkDelete} className="h-9 px-4 rounded-xl shadow-neu-inset-small bg-background hover:shadow-neu-hover font-bold text-xs text-red-500 hover:text-red-600">
              <Trash2 size={16} className="mr-2" /> Delete
            </Button>
          </div>
          <Button variant="ghost" size="icon" onClick={() => setSelectedAssetIds(new Set())} className="h-8 w-8 ml-2 rounded-full hover:bg-background shadow-neu-inset-small">
            <X size={14} />
          </Button>
        </div>
      )}

      {/* Data Table */}
      <Card className="rounded-[32px] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border-collapse min-w-[1000px]">
            <thead className="text-xs text-muted-foreground uppercase tracking-wider bg-[#E4E9F2]/50 border-b border-[#A3B1C6]/30">
              <tr>
                <th className="px-6 py-4">
                  <input 
                    type="checkbox" 
                    className="rounded border-[#A3B1C6] text-accent focus:ring-accent"
                    checked={currentAssets.length > 0 && selectedAssetIds.size === currentAssets.length}
                    onChange={handleSelectAll}
                  />
                </th>
                <th className="px-6 py-5 font-bold cursor-pointer hover:text-accent group whitespace-nowrap">
                  <div className="flex items-center gap-2">Asset Tag <ArrowUpDown className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" /></div>
                </th>
                <th className="px-6 py-5 font-bold whitespace-nowrap">Hostname</th>
                <th className="px-6 py-5 font-bold whitespace-nowrap">Category</th>
                <th className="px-6 py-5 font-bold whitespace-nowrap">Location</th>
                <th className="px-6 py-5 font-bold whitespace-nowrap">Rack</th>
                <th className="px-6 py-5 font-bold whitespace-nowrap">Status</th>
                <th className="px-6 py-5 font-bold whitespace-nowrap">Warranty</th>
                <th className="px-6 py-5 font-bold text-right whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody className="text-foreground">
              {filteredAssets.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-6 py-12 text-center text-muted-foreground font-bold">
                    <AlertCircle className="w-8 h-8 mx-auto mb-3 opacity-50" />
                    No assets found matching your criteria.
                  </td>
                </tr>
              ) : (
                currentAssets.map((asset) => (
                  <tr 
                    key={asset.id} 
                    className={`border-b border-white/20 transition-all duration-300 cursor-pointer group ${selectedAssetIds.has(asset.id) ? 'bg-accent/5' : 'hover:bg-[#A3B1C6]/10 hover:shadow-neu-inset-small'}`}
                    onClick={() => window.location.href = `/assets/${asset.tag}`}
                  >
                    <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                      <input 
                        type="checkbox" 
                        className="rounded border-[#A3B1C6] text-accent focus:ring-accent"
                        checked={selectedAssetIds.has(asset.id)}
                        onChange={() => handleSelectAsset(asset.id)}
                      />
                    </td>
                    <td className="px-6 py-4 border-b border-white/60 whitespace-nowrap align-middle">
                      <div className="font-bold text-accent group-hover:translate-x-1 transition-transform duration-300 flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-background shadow-neu-extruded border border-white/40 flex items-center justify-center shrink-0 overflow-hidden group-hover:scale-110 transition-transform duration-300">
                          <img src={getAssetImage(asset.cat)} alt={asset.cat} className="w-full h-full object-cover scale-[1.3]" />
                        </div>
                        <span className="truncate group-hover:text-accent-light transition-colors">{asset.tag}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-semibold border-b border-white/60 whitespace-nowrap align-middle">{asset.host}</td>
                    <td className="px-6 py-4 border-b border-white/60 whitespace-nowrap align-middle">
                      <span className="px-3 py-1 bg-background shadow-neu-extruded border-neu text-muted-foreground text-[10px] font-bold rounded-lg uppercase">{asset.cat}</span>
                    </td>
                    <td className="px-6 py-4 font-semibold border-b border-white/60 whitespace-nowrap align-middle">
                      <div className="flex flex-col justify-center">
                        <span>{asset.loc}</span>
                        <span className="text-[10px] text-muted-foreground uppercase tracking-wide mt-0.5">{asset.room}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 border-b border-white/60 whitespace-nowrap align-middle">
                      {['Floor', 'Wall Mount', 'Pad', 'Ceiling', 'Roof Platform'].includes(asset.rack) ? (
                        <span className="px-2.5 py-1 bg-background shadow-neu-inset-small border border-[#A3B1C6]/20 text-muted-foreground text-[10px] font-bold rounded-lg uppercase">{asset.rack}</span>
                      ) : (
                        <span className="font-mono text-xs font-bold text-muted-foreground bg-[#E4E9F2]/50 px-2 py-1 rounded-md">{asset.rack}{asset.u !== '-' ? `-${asset.u}` : ''}</span>
                      )}
                    </td>
                    <td className="px-6 py-4 border-b border-white/60 whitespace-nowrap align-middle">
                      {asset.status === 'Active' && <span className="px-3 py-1 bg-[#38B2AC]/10 text-[#38B2AC] text-[10px] font-bold rounded-lg uppercase whitespace-nowrap">Active</span>}
                      {asset.status === 'Maintenance' && <span className="px-3 py-1 bg-[#8B84FF]/10 text-[#8B84FF] text-[10px] font-bold rounded-lg uppercase whitespace-nowrap">Maint</span>}
                      {asset.status === 'Offline' && <span className="px-3 py-1 bg-red-500/10 text-red-500 text-[10px] font-bold rounded-lg uppercase whitespace-nowrap">Offline</span>}
                    </td>
                    <td className="px-6 py-4 border-b border-white/60 whitespace-nowrap align-middle">
                      <span className={`text-xs font-bold ${asset.warranty === 'Expired' ? 'text-red-500' : 'text-muted-foreground'}`}>{asset.warranty}</span>
                    </td>
                    <td className="px-6 py-4 border-b border-white/60 text-right whitespace-nowrap align-middle">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-accent shadow-none">
                        <MoreHorizontal className="w-5 h-5" />
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination Controls */}
        <div className="p-4 sm:p-6 border-t border-[#A3B1C6]/30 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-sm font-semibold text-muted-foreground">
            Showing {filteredAssets.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredAssets.length)} of {filteredAssets.length} entries
          </span>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              className="h-10 px-4 rounded-xl shadow-neu-extruded border-neu font-bold text-sm text-foreground disabled:text-muted-foreground disabled:opacity-50" 
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            >Previous</Button>
            
            <div className="flex items-center gap-1 hidden sm:flex">
              {(() => {
                const pages = [];
                if (totalPages <= 5) {
                  for (let i = 1; i <= totalPages; i++) pages.push(i);
                } else {
                  if (currentPage <= 3) {
                    pages.push(1, 2, 3, 4, '...', totalPages);
                  } else if (currentPage >= totalPages - 2) {
                    pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
                  } else {
                    pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
                  }
                }
                return pages.map((page, idx) => (
                  page === '...' ? (
                    <span key={`dots-${idx}`} className="h-10 px-2 flex items-center text-muted-foreground font-bold">...</span>
                  ) : (
                    <Button 
                      key={`page-${page}`}
                      onClick={() => setCurrentPage(page as number)}
                      variant={currentPage === page ? "default" : "outline"} 
                      className={`h-10 w-10 px-0 rounded-xl font-bold text-sm ${
                        currentPage === page 
                          ? "shadow-neu-inset-deep bg-accent text-white" 
                          : "shadow-neu-extruded border-neu text-foreground hover:text-accent"
                      }`}
                    >
                      {page}
                    </Button>
                  )
                ));
              })()}
            </div>
            {/* Mobile simplified view */}
            <div className="flex sm:hidden items-center">
              <span className="text-sm font-bold text-muted-foreground">Page {currentPage} of {totalPages}</span>
            </div>

            <Button 
              variant="outline" 
              className="h-10 px-4 rounded-xl shadow-neu-extruded border-neu font-bold text-sm text-foreground hover:text-accent disabled:text-muted-foreground disabled:opacity-50" 
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            >Next</Button>
          </div>
        </div>
      </Card>

      {/* Modals */}
      <BulkImportModal isOpen={isImportModalOpen} onClose={() => setIsImportModalOpen(false)} onImportSuccess={fetchAssets} />
      <QRCodeModal isOpen={isQRModalOpen} onClose={() => setIsQRModalOpen(false)} assets={Array.from(selectedAssetIds).map(id => assets.find(a => a.id === id)).filter(Boolean)} />
      
    </div>
  )
}
