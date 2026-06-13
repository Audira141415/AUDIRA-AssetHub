"use client"

import { useState, useEffect, use } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  ChevronRight, Edit2, ArrowRightLeft, Copy, Printer, Download, QrCode, Trash2, 
  Server, MapPin, Layers, Cpu, HardDrive, Network, Zap, Settings, ShieldAlert, 
  Clock, CheckCircle2, Pen, Plus, Minus, FilePlus, MoreHorizontal, AlertTriangle, FileText, Phone, Mail, FileDown, Copy as CopyIcon,
  Info, Shield, Paperclip, History, ListChecks, Eye, UploadCloud, Image as ImageIcon, FileSpreadsheet
} from "lucide-react"
import { getFullAssetDetails, getAssetImage, deleteAsset, cloneAsset, updateAssetLocation } from "@/lib/mock-data"
import { apiClient } from "@/lib/api-client"
import { motion } from "framer-motion"

export default function EnterpriseAssetDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  
  const [asset, setAsset] = useState<any>(null)
  const [specs, setSpecs] = useState<any>({})
  const [history, setHistory] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const [isMounted, setIsMounted] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isMoveDialogOpen, setIsMoveDialogOpen] = useState(false)
  const [moveData, setMoveData] = useState({ site: "", building: "", room: "", rack: "", uPosition: "1" })

  const tabs = ["Overview", "Specifications", "Location", "Warranty", "Attachments", "Movements", "History", "QR Code", "Audit Log"]
  const [activeTab, setActiveTab] = useState("Overview")

  useEffect(() => {
    setIsMounted(true)
    const hash = window.location.hash.replace('#', '')
    if (hash) {
      const matchedTab = tabs.find(t => t.toLowerCase().replace(' ', '-') === hash)
      if (matchedTab) setActiveTab(matchedTab)
    }

    // Fetch data
    const fetchAsset = async () => {
      try {
        setIsLoading(true);
        const res = await apiClient.get(`/assets/${id}`);
        const apiData = res.data;
        
        // Merge API data with mock UI format
        const mockBase = getFullAssetDetails(apiData.asset_tag || id);
        
        const mappedAsset = {
          ...mockBase.details,
          id: apiData.id,
          tag: apiData.asset_tag,
          hostname: apiData.hostname || mockBase.details.hostname,
          serial: apiData.serial_number || mockBase.details.serial,
          manufacturer: apiData.manufacturer || mockBase.details.manufacturer,
          model: apiData.model || mockBase.details.model,
          status: apiData.status || mockBase.details.status,
          vendor: apiData.vendor ? apiData.vendor.name : mockBase.details.vendor,
          purchaseDate: apiData.purchase_date || mockBase.details.purchaseDate,
          warrantyStart: apiData.warranty_start || mockBase.details.warrantyStart,
          warrantyEnd: apiData.warranty_end || mockBase.details.warrantyEnd,
          category: apiData.category ? apiData.category.name : mockBase.details.category,
          name: apiData.model || mockBase.details.name,
          modelDesc: apiData.manufacturer && apiData.model ? `${apiData.manufacturer} ${apiData.model}` : mockBase.details.modelDesc,
          locationQuick: "Batam DC • Floor • No U-Position", // Default for Racks or update dynamically
        };

        setAsset(mappedAsset);
        
        if (mappedAsset.category === 'Rack') {
          setSpecs({
            "Height": "42U",
            "Dimensions": "600mm x 1070mm x 2050mm",
            "Weight Capacity": "1,360 kg (Static), 1,022 kg (Dynamic)",
            "Material": "Cold-Rolled Steel",
            "Cooling Type": "Perforated Doors (80% Open)",
            "Color": "Black (RAL 9005)"
          });
        } else {
          setSpecs(mockBase.specs);
        }
        
        setMoveData({
          site: mappedAsset.site,
          building: mappedAsset.building,
          room: mappedAsset.room,
          rack: mappedAsset.rack,
          uPosition: mappedAsset.uPosition.toString()
        });

        try {
          const historyRes = await apiClient.get(`/assets/${apiData.id}/movements`);
          setHistory(historyRes.data);
        } catch (hErr) {
          console.warn("Could not fetch history", hErr);
        }

      } catch (err: any) {
        console.warn("API fetch failed, using fallback mock", err);
        const mockFallback = getFullAssetDetails(id);
        setAsset(mockFallback.details);
        setSpecs(mockFallback.specs);
        setMoveData({
          site: mockFallback.details.site,
          building: mockFallback.details.building,
          room: mockFallback.details.room,
          rack: mockFallback.details.rack,
          uPosition: mockFallback.details.uPosition.toString()
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchAsset();
  }, [id])

  const handleTabClick = (tab: string) => {
    setActiveTab(tab)
    window.history.replaceState(null, '', `#${tab.toLowerCase().replace(' ', '-')}`)
  }

  const handleDelete = async () => {
    try {
      if (asset.id) {
        await apiClient.delete(`/assets/${asset.id}`)
      }
      router.push("/assets")
    } catch (err) {
      console.error("Delete failed via API, falling back to mock", err)
      if (deleteAsset(asset.tag)) {
        router.push("/assets")
      }
    }
  }

  const handleClone = () => {
    const newTag = cloneAsset(asset.tag)
    if (newTag) {
      router.push(`/assets/${newTag}`)
    }
  }

  const handleMove = async () => {
    try {
      const payload = {
        notes: `Relocated. Site: ${moveData.site}, Building: ${moveData.building}, Room: ${moveData.room}, Rack: ${moveData.rack}, U: ${moveData.uPosition}`
      };
      
      await apiClient.post(`/assets/${asset.id}/move`, payload);
      
      setIsMoveDialogOpen(false);
      window.location.reload();
    } catch (err) {
      console.error("Move failed via API, falling back to mock", err);
      if (updateAssetLocation(asset.tag, moveData.site, moveData.building, moveData.room, moveData.rack, moveData.uPosition)) {
        setIsMoveDialogOpen(false)
        window.location.reload()
      }
    }
  }

  // --- TAB RENDERING FUNCTIONS ---

  if (isLoading || !asset) return <div className="p-8 text-center text-muted-foreground font-bold h-screen flex items-center justify-center">Loading Asset Details...</div>

  const renderOverview = () => (
    <div className="flex flex-col xl:flex-row gap-8">
      <div className="w-full xl:w-[320px] shrink-0">
        <div className="bg-background shadow-neu-inset border-t border-l border-[#A3B1C6]/30 border-b border-r border-white/60 rounded-[32px] aspect-[3/4] flex items-center justify-center overflow-hidden sticky top-8">
          <img src={getAssetImage(asset.category)} alt={asset.category} className="w-full h-full object-cover" />
        </div>
      </div>
      
      <div className="flex-1 space-y-8">
        <Card>
          <CardHeader className="pb-4 border-b border-[#A3B1C6]/20 px-8">
            <CardTitle className="text-lg font-bold text-foreground">General Information</CardTitle>
          </CardHeader>
          <CardContent className="p-8 grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
            <DataRow label="Asset Number (NIB)" value={<Badge text={asset.assetNumber || "-"} color="accent" />} />
            <DataRow label="Asset Tag (IT)" value={asset.tag} bold />
            <DataRow label="Hostname" value={asset.hostname} />
            <DataRow label="Category" value={<Badge text={asset.category} color="purple" />} />
            <DataRow label="Manufacturer" value={asset.manufacturer} />
            <DataRow label="Model" value={asset.model} />
            <DataRow label="Serial Number" value={asset.serial} />
            <DataRow label="Status" value={<Badge text={asset.status} color="green" />} />
            <DataRow label="Lifecycle" value={asset.lifecycle} />
            <DataRow label="Criticality" value={<Badge text={asset.criticality} color="red" />} />
            <DataRow label="Department" value={asset.dept} />
            <DataRow label="Owner" value={asset.owner} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-4 border-b border-[#A3B1C6]/20 px-8">
            <CardTitle className="text-lg font-bold text-foreground">Financial Information</CardTitle>
          </CardHeader>
          <CardContent className="p-8 grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
            <DataRow label="Purchase Date" value={asset.purchaseDate} />
            <DataRow label="Purchase Cost" value={`${asset.currency} ${asset.purchaseCost}`} />
            <DataRow label="Vendor" value={asset.vendor} />
            <DataRow label="PO Number" value={asset.poNumber} link />
            <DataRow label="Invoice Number" value={asset.invoiceNumber} link />
            <DataRow label="Depreciation" value={asset.depreciation} />
            <DataRow label="Current Value" value={`${asset.currency} ${asset.currentValue}`} bold textClass="text-accent" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-4 border-b border-[#A3B1C6]/20 px-8">
            <CardTitle className="text-lg font-bold text-foreground">Business Information</CardTitle>
          </CardHeader>
          <CardContent className="p-8 grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
            <DataRow label="Business Service" value={asset.businessService} />
            <DataRow label="Application Owner" value={asset.appOwner} />
            <DataRow label="Technical Owner" value={asset.techOwner} />
            <DataRow label="Environment" value={<Badge text={asset.env} color="accent" />} />
          </CardContent>
        </Card>
      </div>
    </div>
  )

  const renderSpecifications = () => (
    <Card>
      <CardHeader className="pb-4 border-b border-[#A3B1C6]/20 px-8">
        <CardTitle className="text-lg font-bold text-foreground">Technical Specifications</CardTitle>
      </CardHeader>
      <CardContent className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
        {Object.entries(specs).map(([key, value], idx) => {
          let icon = <Settings />;
          if (key.includes("CPU") || key.includes("Processor")) icon = <Cpu />;
          else if (key.includes("RAM") || key.includes("Memory")) icon = <Server />;
          else if (key.includes("Storage") || key.includes("Capacity")) icon = <HardDrive />;
          else if (key.includes("Network") || key.includes("Port")) icon = <Network />;
          else if (key.includes("Power") || key.includes("Voltage")) icon = <Zap />;
          else if (key.includes("Battery") || key.includes("Runtime")) icon = <Clock />;
          else if (key.includes("OS") || key.includes("Firmware")) icon = <Layers />;
          
          return <SpecItem key={idx} icon={icon} label={key} value={value as string} />;
        })}
      </CardContent>
    </Card>
  )

  const renderLocation = () => {
    const isRack = asset.category?.toLowerCase() === 'rack'
    const units = Array.from({length: 42}, (_, i) => 42 - i)
    
    return (
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-1 space-y-8">
          <Card>
            <CardHeader className="pb-4 border-b border-[#A3B1C6]/20 px-8">
              <CardTitle className="text-lg font-bold text-foreground">Location Hierarchy</CardTitle>
            </CardHeader>
            <CardContent className="p-8 space-y-6">
              <HierarchyItem level={0} label="Site" value={asset.site} />
              <HierarchyItem level={1} label="Building" value={asset.building} />
              <HierarchyItem level={2} label="Floor" value={asset.floor} />
              <HierarchyItem level={3} label="Room" value={asset.room} />
              {!isRack && <HierarchyItem level={4} label="Rack" value={asset.rack} />}
              {!isRack && <HierarchyItem level={5} label="U Position" value={asset.uPosition?.toString() || '-'} highlight />}
              {isRack && <HierarchyItem level={4} label="Grid Row" value={asset.tag.split('-')[2] || 'A'} />}
              {isRack && <HierarchyItem level={5} label="Grid Pos" value={asset.tag.split('-')[3] || '1'} highlight />}
            </CardContent>
          </Card>
        </div>
        
        {!isRack ? (
          <div className="xl:col-span-2">
            <Card>
              <CardHeader className="pb-4 border-b border-[#A3B1C6]/20 px-8 flex flex-row items-center justify-between">
                <CardTitle className="text-lg font-bold text-foreground">42U Rack Visualization</CardTitle>
                <Button variant="outline" className="shadow-neu-extruded border-neu">Open Rack View</Button>
              </CardHeader>
              <CardContent className="p-8">
                <div className="max-w-md mx-auto bg-background shadow-neu-inset border-t border-l border-[#A3B1C6]/30 border-b border-r border-white/60 rounded-[32px] p-4 flex flex-col gap-1 max-h-[800px] overflow-y-auto scrollbar-hide">
                  <div className="text-center font-bold text-foreground mb-4 pt-2">RACK {asset.rack}</div>
                  {units.map(u => {
                    const isActive = u === parseInt(asset.uPosition || '0')
                    return (
                      <div key={u} className={`flex items-center gap-4 py-1.5 px-3 rounded-xl transition-all ${isActive ? 'bg-accent shadow-neu-inset-deep' : 'hover:bg-[#A3B1C6]/10'}`}>
                        <span className={`text-xs font-bold w-6 text-right ${isActive ? 'text-white' : 'text-muted-foreground'}`}>{u}</span>
                        <div className={`flex-1 rounded-lg p-2 flex items-center gap-3 ${isActive ? 'bg-accent border border-white/20 shadow-neu-extruded' : 'bg-background shadow-neu-extruded border border-white/40'}`}>
                          <div className={`w-2 h-2 rounded-full shadow-sm ${isActive ? 'bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]' : 'bg-[#A3B1C6]'}`}></div>
                          <span className={`text-xs font-bold ${isActive ? 'text-white' : 'text-muted-foreground'}`}>
                            {isActive ? asset.tag : 'Blank Panel'}
                          </span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="xl:col-span-2">
            <Card className="h-full">
              <CardHeader className="pb-4 border-b border-[#A3B1C6]/20 px-8">
                <CardTitle className="text-lg font-bold text-foreground">Floor Plan Placement</CardTitle>
              </CardHeader>
              <CardContent className="p-8 flex items-center justify-center min-h-[400px]">
                <div className="w-full h-full min-h-[400px] rounded-[32px] bg-background shadow-neu-inset border-t border-l border-[#A3B1C6]/30 border-b border-r border-white/60 flex flex-col items-center justify-center gap-4 p-8 text-center">
                  <div className="w-20 h-20 rounded-full bg-[#E4E9F2]/50 shadow-neu-inset flex items-center justify-center mb-2">
                    <MapPin className="w-8 h-8 text-muted-foreground opacity-50" />
                  </div>
                  <h3 className="text-lg font-bold text-foreground">Floor plan for {asset.room}</h3>
                  <p className="text-sm font-semibold text-muted-foreground max-w-sm">No floor plan has been uploaded for this room yet. Upload a blueprint to visualize rack placements.</p>
                  <Button variant="outline" className="shadow-neu-extruded border-neu rounded-xl mt-4 font-bold text-sm h-12 px-6">Upload Blueprint</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    )
  }

  const renderWarranty = () => (
    <Card>
      <CardHeader className="pb-4 border-b border-[#A3B1C6]/20 px-8 flex flex-row justify-between items-center">
        <CardTitle className="text-lg font-bold text-foreground">Warranty & Support</CardTitle>
        <span className="px-4 py-1.5 bg-[#38B2AC]/10 text-[#38B2AC] shadow-neu-extruded border-neu font-bold rounded-xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" /> Active Warranty
        </span>
      </CardHeader>
      <CardContent className="p-8 grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-12">
        <DataRow label="Warranty Start" value={asset.warrantyStart} />
        <DataRow label="Warranty End" value={asset.warrantyEnd} />
        <DataRow label="Days Remaining" value={asset.warrantyRemaining} bold textClass="text-accent" />
        <DataRow label="Contract Number" value={asset.contractNum} link />
        <DataRow label="Vendor Support" value={asset.supportVendor} bold />
        <DataRow label="Support Email" value={asset.supportEmail} link />
        <DataRow label="Support Phone" value={asset.supportPhone} />
      </CardContent>
    </Card>
  )

  const renderAttachments = () => (
    <Card>
      <CardHeader className="pb-4 border-b border-[#A3B1C6]/20 px-8 flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-bold text-foreground">Attachments & Documents</CardTitle>
        <span className="px-3 py-1 bg-accent/10 text-accent text-xs font-bold rounded-lg uppercase tracking-wider">5 Files</span>
      </CardHeader>
      <CardContent className="p-8 space-y-8">
        
        {/* Drag and Drop Zone */}
        <div className="w-full border-2 border-dashed border-[#A3B1C6]/50 rounded-[32px] p-10 flex flex-col items-center justify-center text-center bg-[#A3B1C6]/5 hover:bg-[#A3B1C6]/10 transition-colors cursor-pointer group">
          <div className="w-16 h-16 rounded-full bg-background shadow-neu-extruded flex items-center justify-center mb-4 text-accent group-hover:-translate-y-1 transition-transform">
            <UploadCloud className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-foreground mb-1">Upload New Document</h3>
          <p className="text-sm font-medium text-muted-foreground max-w-md">Drag and drop your files here, or click to browse. Supported formats: PDF, JPG, PNG, XLS.</p>
        </div>

        {/* File Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          <DocCard title="Invoice Document" type="PDF" date="12 May 2025" size="2.4 MB" />
          <DocCard title="Purchase Order" type="PDF" date="10 May 2025" size="1.1 MB" />
          <DocCard title="Vendor Contract" type="PDF" date="10 May 2025" size="5.8 MB" />
          <DocCard title="Server Photo Front" type="JPG" date="11 May 2025" size="4.2 MB" />
          <DocCard title="Server Photo Back" type="JPG" date="11 May 2025" size="3.9 MB" />
        </div>
      </CardContent>
    </Card>
  )

  const renderMovements = () => (
    <Card>
      <CardHeader className="pb-4 border-b border-[#A3B1C6]/20 px-8">
        <CardTitle className="text-lg font-bold text-foreground">Movement History</CardTitle>
      </CardHeader>
      <div className="overflow-x-auto rounded-b-[32px] p-2">
        <table className="w-full text-sm text-left border-collapse">
          <thead className="text-xs text-muted-foreground uppercase tracking-wider border-b border-[#A3B1C6]/30">
            <tr>
              <th className="px-6 py-4 font-bold">Date</th>
              <th className="px-6 py-4 font-bold">Type</th>
              <th className="px-6 py-4 font-bold">From</th>
              <th className="px-6 py-4 font-bold">To</th>
              <th className="px-6 py-4 font-bold">Reason</th>
              <th className="px-6 py-4 font-bold">User</th>
            </tr>
          </thead>
          <tbody className="text-foreground">
            {history.length > 0 ? (
              history.map((h, i) => (
                <tr key={h.id || i} className="hover:bg-[#A3B1C6]/10 transition-colors">
                  <td className="px-6 py-4 font-medium border-b border-white/60">
                    {new Date(h.date).toLocaleDateString()} {new Date(h.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </td>
                  <td className="px-6 py-4 border-b border-white/60"><Badge text="Move" color="accent" /></td>
                  <td className="px-6 py-4 font-medium border-b border-white/60 text-muted-foreground">{h.fromLoc || "-"}</td>
                  <td className="px-6 py-4 font-bold border-b border-white/60 text-accent">{h.toLoc || "-"}</td>
                  <td className="px-6 py-4 border-b border-white/60 text-xs max-w-[200px] truncate" title={h.notes || "-"}>{h.notes || "-"}</td>
                  <td className="px-6 py-4 font-medium border-b border-white/60">{h.user}</td>
                </tr>
              ))
            ) : (
              <tr className="hover:bg-[#A3B1C6]/10 transition-colors">
                <td colSpan={6} className="px-6 py-8 text-center font-bold text-muted-foreground">
                  No movement history recorded.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Card>
  )

  const renderHistory = () => (
    <Card>
      <CardHeader className="pb-4 border-b border-[#A3B1C6]/20 px-8">
        <CardTitle className="text-lg font-bold text-foreground">Asset History (Timeline)</CardTitle>
      </CardHeader>
      <CardContent className="p-10 relative">
        <div className="absolute left-14 top-10 bottom-10 w-0.5 bg-[#A3B1C6]/40"></div>
        <div className="space-y-10 relative">
          <TimelineItem icon={<Edit2 className="w-4 h-4 text-accent"/>} title="Location Changed" date="10 May 2026 14:00" desc="Asset moved to Rack R01-U24" />
          <TimelineItem icon={<ShieldAlert className="w-4 h-4 text-[#38B2AC]"/>} title="Warranty Registered" date="10 May 2025 11:30" desc="Warranty extended to 2028 via Dell ProSupport" />
          <TimelineItem icon={<Plus className="w-4 h-4 text-green-500"/>} title="Asset Created" date="10 May 2025 09:15" desc="Imported via Bulk Import by Agus Dwi R" />
        </div>
      </CardContent>
    </Card>
  )

  const renderQRCode = () => (
    <Card>
      <CardHeader className="pb-4 border-b border-[#A3B1C6]/20 px-8">
        <CardTitle className="text-lg font-bold text-foreground">Asset QR Code</CardTitle>
      </CardHeader>
      <CardContent className="p-12 flex flex-col items-center text-center">
        <div className="w-64 h-64 bg-white shadow-neu-extruded border-neu rounded-3xl p-4 flex items-center justify-center mb-8">
          <QrCode className="w-full h-full text-foreground" strokeWidth={1} />
        </div>
        <h3 className="text-2xl font-bold text-foreground mb-2">{asset.tag}</h3>
        <p className="text-muted-foreground font-medium mb-6">Scan to view complete asset information on mobile device.</p>
        
        <div className="flex items-center gap-4 bg-background shadow-neu-inset rounded-xl p-4 w-full max-w-md">
          <span className="flex-1 text-sm font-mono text-muted-foreground truncate">https://assets.audira.local/asset/{asset.tag}</span>
          <Button variant="outline" size="icon" className="shadow-neu-extruded border-neu h-8 w-8 rounded-lg"><Copy className="w-4 h-4" /></Button>
        </div>
      </CardContent>
    </Card>
  )

  const renderAuditLog = () => (
    <Card>
      <CardHeader className="pb-4 border-b border-[#A3B1C6]/20 px-8 flex justify-between flex-row items-center">
        <CardTitle className="text-lg font-bold text-foreground">Security & Audit Log</CardTitle>
        <Button variant="outline" className="shadow-neu-extruded border-neu text-xs h-8"><Download className="w-3 h-3 mr-2" /> Export Logs</Button>
      </CardHeader>
      <div className="overflow-x-auto rounded-b-[32px] p-2">
        <table className="w-full text-sm text-left border-collapse">
          <thead className="text-xs text-muted-foreground uppercase tracking-wider border-b border-[#A3B1C6]/30">
            <tr>
              <th className="px-6 py-4 font-bold">User</th>
              <th className="px-6 py-4 font-bold">Action</th>
              <th className="px-6 py-4 font-bold">Timestamp</th>
              <th className="px-6 py-4 font-bold">IP Address</th>
            </tr>
          </thead>
          <tbody className="text-foreground">
            <tr className="hover:bg-[#A3B1C6]/10 transition-colors">
              <td className="px-6 py-4 font-bold border-b border-white/60 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-accent text-white flex items-center justify-center text-xs">ADR</div> Agus Dwi R
              </td>
              <td className="px-6 py-4 border-b border-white/60">Updated Location to R01-U24</td>
              <td className="px-6 py-4 font-mono text-xs border-b border-white/60 text-muted-foreground">2026-06-10 14:10:05</td>
              <td className="px-6 py-4 font-mono text-xs border-b border-white/60">10.1.1.10</td>
            </tr>
          </tbody>
        </table>
      </div>
    </Card>
  )

  const renderActiveTabContent = () => {
    switch(activeTab) {
      case "Overview": return renderOverview();
      case "Specifications": return renderSpecifications();
      case "Location": return renderLocation();
      case "Warranty": return renderWarranty();
      case "Attachments": return renderAttachments();
      case "Movements": return renderMovements();
      case "History": return renderHistory();
      case "QR Code": return renderQRCode();
      case "Audit Log": return renderAuditLog();
      default: return renderOverview();
    }
  }

  const tabData = [
    { id: "Overview", label: "Overview", icon: <Info className="w-4 h-4" /> },
    { id: "Specifications", label: "Specifications", icon: <Settings className="w-4 h-4" /> },
    { id: "Location", label: "Location", icon: <MapPin className="w-4 h-4" /> },
    { id: "Warranty", label: "Warranty", icon: <Shield className="w-4 h-4" />, badge: asset?.warrantyEnd && new Date(asset.warrantyEnd) < new Date() ? '🔴' : null },
    { id: "Attachments", label: "Attachments", icon: <Paperclip className="w-4 h-4" />, badge: "5" },
    { id: "Movements", label: "Movements", icon: <ArrowRightLeft className="w-4 h-4" />, badge: history?.length > 0 ? history.length.toString() : null },
    { id: "History", label: "History", icon: <History className="w-4 h-4" /> },
    { id: "QR Code", label: "QR Code", icon: <QrCode className="w-4 h-4" /> },
    { id: "Audit Log", label: "Audit Log", icon: <ListChecks className="w-4 h-4" /> }
  ];

  return (
    <div className="space-y-8 pb-12">
      <div className="bg-background shadow-neu-extruded border-neu rounded-[32px] p-8 mt-2">
        <div className="flex flex-col xl:flex-row justify-between xl:items-center gap-6">
          <div className="flex gap-6 items-center">
            <div className="w-16 h-16 rounded-2xl bg-background shadow-neu-inset flex items-center justify-center shrink-0 border-t border-l border-[#A3B1C6]/30 border-b border-r border-white/60 overflow-hidden">
              <img src={getAssetImage(asset.category)} alt={asset.category} className="w-full h-full object-cover scale-[1.3]" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-3 mb-1">
                <h1 className="text-3xl font-display font-bold text-foreground whitespace-nowrap truncate">{asset.tag}</h1>
                <span className="px-3 py-1 bg-accent/10 text-accent text-xs font-bold rounded-lg uppercase tracking-wider shadow-sm whitespace-nowrap">
                  NIB: {asset.assetNumber || "-"}
                </span>
                <span className="px-3 py-1 bg-[#38B2AC]/10 text-[#38B2AC] text-xs font-bold rounded-lg uppercase tracking-wider shadow-sm whitespace-nowrap">
                  {asset.status}
                </span>
              </div>
              <p className="text-lg font-semibold text-muted-foreground truncate">{asset.modelDesc}</p>
              <div className="flex items-center gap-2 mt-3 text-sm font-semibold text-foreground/70 truncate">
                <MapPin className="w-4 h-4 text-accent shrink-0" /> {asset.locationQuick}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-start xl:justify-end gap-3 mt-6 xl:mt-0">
            <Button variant="outline" onClick={() => router.push(`/assets/create?edit=${asset.tag}`)} className="h-10 px-4 rounded-xl shadow-neu-extruded border-neu font-bold text-sm text-foreground hover:text-accent">
              <Edit2 className="h-4 w-4 mr-2" /> Edit
            </Button>
            <Button variant="outline" onClick={() => setIsMoveDialogOpen(true)} className="h-10 px-4 rounded-xl shadow-neu-extruded border-neu font-bold text-sm text-foreground hover:text-accent">
              <ArrowRightLeft className="h-4 w-4 mr-2" /> Move
            </Button>
            <Button variant="outline" onClick={handleClone} className="h-10 px-4 rounded-xl shadow-neu-extruded border-neu font-bold text-sm text-foreground hover:text-accent">
              <CopyIcon className="h-4 w-4 mr-2" /> Clone
            </Button>
            <Button variant="outline" onClick={() => window.print()} className="h-10 px-4 rounded-xl shadow-neu-extruded border-neu font-bold text-sm text-foreground hover:text-accent hidden sm:flex">
              <Printer className="h-4 w-4 mr-2" /> Print
            </Button>
            <Button variant="outline" onClick={() => window.print()} className="h-10 px-4 rounded-xl shadow-neu-extruded border-neu font-bold text-sm text-foreground hover:text-accent hidden sm:flex">
              <FileDown className="h-4 w-4 mr-2" /> Export PDF
            </Button>
            <Button variant="default" className="h-10 px-5 rounded-xl shadow-neu-extruded border-neu font-bold text-sm bg-accent text-white hover:bg-accent-light" onClick={() => setActiveTab("QR Code")}>
              <QrCode className="h-4 w-4 mr-2" /> Generate QR
            </Button>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(true)} className="h-10 px-4 rounded-xl shadow-neu-extruded border-neu font-bold text-sm text-red-500 hover:text-red-600 ml-2">
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {isDeleteDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-background shadow-neu-extruded border-neu rounded-[32px] p-8 max-w-md w-full">
            <div className="w-16 h-16 rounded-full bg-red-100/50 flex items-center justify-center mb-6 mx-auto shadow-neu-inset">
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>
            <h2 className="text-2xl font-bold text-center text-foreground mb-4">Delete Asset?</h2>
            <p className="text-center text-muted-foreground mb-8">Are you sure you want to permanently delete <strong className="text-foreground">{asset.tag}</strong>? This action cannot be undone.</p>
            <div className="flex gap-4 justify-center">
              <Button variant="outline" className="shadow-neu-extruded h-12 px-6 rounded-xl font-bold" onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
              <Button className="bg-red-500 hover:bg-red-600 text-white shadow-neu-extruded h-12 px-6 rounded-xl font-bold" onClick={handleDelete}>Yes, Delete</Button>
            </div>
          </div>
        </div>
      )}

      {/* Move Asset Modal */}
      {isMoveDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-background shadow-neu-extruded border-neu rounded-[32px] p-8 max-w-md w-full">
            <h2 className="text-2xl font-bold text-foreground mb-6">Move Asset</h2>
            <div className="space-y-4 mb-8">
              <div>
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2 block">Site / Building</label>
                <input type="text" value={moveData.site} onChange={e => setMoveData({...moveData, site: e.target.value})} className="w-full h-12 px-4 rounded-xl bg-background shadow-neu-inset border-neu focus:outline-none font-medium text-sm text-foreground" placeholder="e.g. Batam DC" />
              </div>
              <div>
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2 block">Room</label>
                <input type="text" value={moveData.room} onChange={e => setMoveData({...moveData, room: e.target.value})} className="w-full h-12 px-4 rounded-xl bg-background shadow-neu-inset border-neu focus:outline-none font-medium text-sm text-foreground" placeholder="e.g. Server Room A" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2 block">Rack</label>
                  <input type="text" value={moveData.rack} onChange={e => setMoveData({...moveData, rack: e.target.value})} className="w-full h-12 px-4 rounded-xl bg-background shadow-neu-inset border-neu focus:outline-none font-medium text-sm text-foreground" placeholder="e.g. R01" />
                </div>
                <div>
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2 block">U Position</label>
                  <input type="text" value={moveData.uPosition} onChange={e => setMoveData({...moveData, uPosition: e.target.value})} className="w-full h-12 px-4 rounded-xl bg-background shadow-neu-inset border-neu focus:outline-none font-medium text-sm text-foreground" placeholder="e.g. 24" />
                </div>
              </div>
            </div>
            <div className="flex gap-4 justify-end">
              <Button variant="outline" className="shadow-neu-extruded h-12 px-6 rounded-xl font-bold" onClick={() => setIsMoveDialogOpen(false)}>Cancel</Button>
              <Button className="shadow-neu-extruded h-12 px-6 rounded-xl font-bold" onClick={handleMove}>Save Location</Button>
            </div>
          </div>
        </div>
      )}

      {/* TABS NAVIGATION (ENHANCED) */}
      <div className="sticky top-0 z-30 pt-4 pb-2 bg-[#E4E9F2]/80 backdrop-blur-md border-b border-[#A3B1C6]/30 px-2 -mx-2 mb-4">
        <div className="flex overflow-x-auto gap-2 no-scrollbar">
          {tabData.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab.id)}
              className={`relative px-4 lg:px-6 py-3 flex items-center gap-2 text-xs lg:text-sm font-bold whitespace-nowrap rounded-2xl transition-colors outline-none ${
                activeTab === tab.id 
                  ? "text-accent" 
                  : "text-muted-foreground hover:text-foreground hover:bg-black/5"
              }`}
            >
              {activeTab === tab.id && (
                <motion.div
                  layoutId="activeTabBackground"
                  className="absolute inset-0 bg-background shadow-neu-inset-deep border-t border-l border-[#A3B1C6]/30 border-r border-white/60 rounded-2xl pointer-events-none"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <span className="relative z-10 flex items-center gap-2">
                {tab.icon}
                {tab.label}
                {tab.badge && (
                  <span className="ml-1.5 px-2 py-0.5 rounded-full bg-accent text-white text-[10px] font-black leading-none flex items-center justify-center">
                    {tab.badge}
                  </span>
                )}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* 3. Tab Content Area */}
      <div className="pt-2 min-h-[500px]">
        {renderActiveTabContent()}
      </div>
    </div>
  )
}

// --- HELPER COMPONENTS ---

const DataRow = ({ label, value, bold = false, link = false, textClass = "text-foreground" }: any) => (
  <div className="grid grid-cols-5 gap-4 items-start">
    <span className="text-sm font-semibold text-muted-foreground col-span-2">{label}</span>
    <span className={`text-sm col-span-3 ${bold ? 'font-bold' : 'font-medium'} ${link ? 'text-accent hover:underline cursor-pointer' : textClass}`}>
      {value}
    </span>
  </div>
)

const Badge = ({ text, color }: { text: string, color: 'accent' | 'green' | 'purple' | 'red' }) => {
  const colors = {
    accent: "bg-accent/10 text-accent",
    green: "bg-[#38B2AC]/10 text-[#38B2AC]",
    purple: "bg-[#8B84FF]/10 text-[#8B84FF]",
    red: "bg-red-500/10 text-red-500"
  }
  return <span className={`px-3 py-1 ${colors[color]} text-xs font-bold rounded-lg uppercase tracking-wider`}>{text}</span>
}

const SpecItem = ({ icon, label, value }: any) => (
  <div className="flex items-center gap-5 p-4 bg-background shadow-neu-extruded border-neu rounded-2xl">
    <div className="p-3 bg-background shadow-neu-inset rounded-xl text-accent shrink-0">{icon}</div>
    <div>
      <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">{label}</p>
      <p className="text-sm font-bold text-foreground">{value}</p>
    </div>
  </div>
)

const HierarchyItem = ({ level, label, value, highlight = false }: any) => {
  // Calculate indent: level 0 = 0px, level 1 = 24px, level 2 = 48px...
  const indent = level * 24;
  
  return (
    <div className="flex items-center relative w-full h-8" style={{ paddingLeft: `${indent}px` }}>
      {/* Vertical line connecting to parent */}
      {level > 0 && (
        <div 
          className="absolute w-px bg-[#A3B1C6]/80" 
          style={{ 
            left: `${indent - 24 + 11.5}px`, 
            top: '-40px', // Goes up through space-y-6 (24px) + half of h-8 (16px) = 40px
            bottom: '50%' 
          }}
        ></div>
      )}
      
      {/* Horizontal line connecting from vertical line to current dot */}
      {level > 0 && (
        <div 
          className="absolute h-px bg-[#A3B1C6]/80" 
          style={{ 
            left: `${indent - 24 + 11.5}px`, 
            top: '50%', 
            width: '12.5px' 
          }}
        ></div>
      )}
      
      <div className="flex items-center gap-3 w-full min-w-0">
        {/* The Dot */}
        <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 z-10 ${highlight ? 'bg-accent shadow-[0_0_10px_rgba(108,99,255,0.5)]' : 'bg-[#E4E9F2] shadow-neu-inset border border-white/50'}`}>
          <div className={`w-2 h-2 rounded-full ${highlight ? 'bg-white' : 'bg-accent'}`}></div>
        </div>
        
        {/* Simple Text with flex-wrap so it doesn't get squished */}
        <div className="flex flex-wrap items-baseline gap-1.5 min-w-0">
          <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">{label}:</span>
          <span className={`text-sm font-extrabold truncate ${highlight ? 'text-accent drop-shadow-sm' : 'text-foreground'}`}>{value}</span>
        </div>
      </div>
    </div>
  )
}

const DocCard = ({ title, type, date, size }: any) => {
  const isImage = type === 'JPG' || type === 'PNG';
  const Icon = isImage ? ImageIcon : (type === 'XLS' ? FileSpreadsheet : FileText);
  const colorClass = isImage ? 'text-green-500' : (type === 'XLS' ? 'text-emerald-500' : 'text-accent');

  return (
    <div className="p-5 bg-background shadow-neu-extruded border-neu rounded-[24px] flex flex-col group transition-all hover:shadow-neu-inset hover:-translate-y-1">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-12 h-12 bg-background shadow-neu-extruded border-neu rounded-2xl flex items-center justify-center ${colorClass}`}>
          <Icon className="w-6 h-6" />
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" size="icon" className="w-8 h-8 rounded-lg hover:bg-black/5 hover:text-accent"><Eye className="w-4 h-4" /></Button>
          <Button variant="ghost" size="icon" className="w-8 h-8 rounded-lg hover:bg-black/5 hover:text-accent"><Download className="w-4 h-4" /></Button>
        </div>
      </div>
      
      <div className="flex-1">
        <h4 className="font-bold text-foreground text-sm mb-1 line-clamp-1" title={title}>{title}</h4>
        <div className="flex items-center gap-2 mb-4">
          <span className="px-2 py-0.5 bg-[#A3B1C6]/10 text-muted-foreground text-[10px] font-bold rounded uppercase tracking-wider">{type}</span>
          <span className="text-xs font-semibold text-muted-foreground">{size}</span>
        </div>
      </div>
      
      <div className="pt-4 border-t border-[#A3B1C6]/20 flex items-center justify-between">
        <span className="text-xs font-semibold text-muted-foreground">{date}</span>
        <Button variant="ghost" size="icon" className="w-8 h-8 rounded-lg text-red-500 hover:text-red-600 hover:bg-red-500/10"><Trash2 className="w-4 h-4" /></Button>
      </div>
    </div>
  )
}

const TimelineItem = ({ icon, title, date, desc }: any) => (
  <div className="flex gap-6">
    <div className="w-12 h-12 rounded-full bg-background shadow-neu-extruded border-neu flex items-center justify-center shrink-0 z-10">
      {icon}
    </div>
    <div className="pt-2 bg-background shadow-neu-extruded border-neu rounded-2xl p-5 flex-1">
      <div className="flex justify-between items-start mb-2">
        <p className="text-base font-bold text-foreground">{title}</p>
        <span className="text-xs font-mono font-bold text-muted-foreground bg-background shadow-neu-inset px-3 py-1 rounded-lg">{date}</span>
      </div>
      <p className="text-sm font-medium text-muted-foreground leading-relaxed">{desc}</p>
    </div>
  </div>
)
