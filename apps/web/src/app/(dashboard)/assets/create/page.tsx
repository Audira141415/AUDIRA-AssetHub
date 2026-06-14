"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { 
  ChevronRight, CheckCircle2, Server, Settings, MapPin, DollarSign, ArrowLeft, Loader2
} from "lucide-react"
import { apiClient } from "@/lib/api-client"
import { useRouter } from "next/navigation"
import { HeroSection } from "@/components/ui/hero-section"

export default function CreateAssetPage() {
  const [step, setStep] = useState(1)
  const [editId, setEditId] = useState<string | null>(null)
  const [asset, setAsset] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState("")
  const [categories, setCategories] = useState<any[]>([])
  const [vendors, setVendors] = useState<any[]>([])
  const [locations, setLocations] = useState<any[]>([])
  const router = useRouter()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catsRes, vendsRes, locsRes] = await Promise.all([
          apiClient.get('/categories'),
          apiClient.get('/vendors'),
          apiClient.get('/locations')
        ]);
        setCategories(catsRes.data);
        setVendors(vendsRes.data);
        setLocations(locsRes.data);
      } catch (err) {
        console.error("Failed to fetch references:", err);
      }

      const searchParams = new URLSearchParams(window.location.search)
      const id = searchParams.get("edit")
      if (id) {
        setEditId(id)
        try {
          const assetRes = await apiClient.get(`/assets/${id}`);
          setAsset(assetRes.data);
        } catch(err) {
          console.error("Failed to fetch asset", err);
        }
      }
      setIsLoading(false)
    };
    fetchData();
  }, [])

  const steps = [
    { num: 1, label: "General", icon: <Server className="w-5 h-5" /> },
    { num: 2, label: "Technical", icon: <Settings className="w-5 h-5" /> },
    { num: 3, label: "Location", icon: <MapPin className="w-5 h-5" /> },
    { num: 4, label: "Business & Financial", icon: <DollarSign className="w-5 h-5" /> },
  ]

  const nextStep = () => setStep(prev => Math.min(prev + 1, 4))
  const prevStep = () => setStep(prev => Math.max(prev - 1, 1))

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Only submit on the last step
    if (step < 4) {
      nextStep();
      return;
    }

    setIsSaving(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    
    // Construct payload for backend schema
    const payload = {
      tag: formData.get("asset_tag") || `TAG-${Date.now()}`,
      hostname: formData.get("hostname") || null,
      status: formData.get("status") || "Active",
      vendorId: formData.get("vendor_id") || vendors[0]?.id || null,
      categoryId: formData.get("category_id") || categories[0]?.id || null,
      locationId: formData.get("location_id") || locations[0]?.id || null,
      rack: formData.get("rack") || null,
      uPosition: formData.get("u_position") || null,
      warranty: formData.get("warranty_end") || null,
    };

    try {
      if (editId) {
        // Mock PUT for now
        console.log("Updating:", payload);
        await apiClient.put(`/assets/${editId}`, payload);
        router.push(`/assets/${editId}`);
      } else {
        const res = await apiClient.post('/assets', payload);
        router.push(`/assets/${res.data.id || res.data.asset_tag}`);
      }
    } catch (err: any) {
      console.error(err);
      if (err.code === "ERR_NETWORK" || err.message === "Network Error") {
        console.warn("Offline mock save");
        router.push(editId ? `/assets/${editId}` : "/assets/MOCK-123");
      } else {
        setError(err.response?.data?.detail || "Failed to save asset");
      }
    } finally {
      setIsSaving(false);
    }
  }

  if (isLoading) return <div className="p-8 text-center text-muted-foreground font-bold">Loading...</div>

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-10 mt-2">
      
      {/* Header */}
      <div>
        <div className="flex items-center text-sm text-muted-foreground font-bold tracking-wider mb-4">
          <Link href="/assets" className="hover:text-accent transition-colors flex items-center gap-1">
            <ArrowLeft className="w-4 h-4" /> Back to Assets
          </Link>
        </div>
        <HeroSection 
          compact 
          title={editId ? `Edit Asset: ${editId}` : "Create New Asset"}
          description={editId ? "Update equipment details in your data center inventory." : "Add a new equipment to your data center inventory using this wizard."}
          icon={<Server className="w-8 h-8 text-accent" />}
        />
      </div>

      {/* Wizard Indicator */}
      <div className="relative flex justify-between">
        {/* Connecting Line */}
        <div className="absolute top-7 left-0 w-full h-1 bg-background shadow-neu-inset rounded-full overflow-hidden">
          <div 
            className="h-full bg-accent transition-all duration-500 ease-out" 
            style={{ width: `${((step - 1) / 3) * 100}%` }}
          ></div>
        </div>

        {/* Step Nodes */}
        {steps.map((s) => {
          const isActive = step === s.num
          const isPast = step > s.num
          return (
            <div key={s.num} className="relative z-10 flex flex-col items-center gap-3 w-24">
              <div 
                className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                  isActive ? 'bg-accent text-white shadow-neu-extruded border border-white/20 scale-110' :
                  isPast ? 'bg-[#38B2AC] text-white shadow-neu-extruded border border-white/20' :
                  'bg-background shadow-neu-extruded border-neu text-muted-foreground'
                }`}
              >
                {isPast ? <CheckCircle2 className="w-6 h-6" /> : s.icon}
              </div>
              <span className={`text-xs font-bold uppercase tracking-wider ${isActive ? 'text-accent' : isPast ? 'text-[#38B2AC]' : 'text-muted-foreground'}`}>
                {s.label}
              </span>
            </div>
          )
        })}
      </div>

      {/* Form Card */}
      <Card className="rounded-[32px] mt-8">
        <CardHeader className="border-b border-[#A3B1C6]/20 px-8 pb-4 pt-8">
          <CardTitle className="text-xl font-bold text-foreground flex items-center gap-3">
            <span className="w-8 h-8 rounded-lg bg-accent/10 text-accent flex items-center justify-center text-sm">
              {step}
            </span>
            {steps[step - 1].label} Details
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8">
          <form onSubmit={handleSubmit}>
          
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-xl text-red-500 text-sm font-bold">
              {error}
            </div>
          )}

          {/* Step 1: General */}
          <div className={step === 1 ? "space-y-6 block animate-in fade-in" : "hidden"}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Asset Tag</label>
                <input type="text" name="asset_tag" defaultValue={asset?.tag || ""} placeholder="e.g. SRV-2026-001" required className="w-full h-14 px-5 bg-background shadow-neu-inset border-t border-l border-[#A3B1C6]/30 border-b border-r border-white/60 rounded-2xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-accent/50 text-foreground" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Hostname / Serial</label>
                <input type="text" name="hostname" defaultValue={asset?.hostname || ""} placeholder="e.g. SRV-PROD-01" className="w-full h-14 px-5 bg-background shadow-neu-inset border-t border-l border-[#A3B1C6]/30 border-b border-r border-white/60 rounded-2xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-accent/50 text-foreground" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Category</label>
                <select name="category_id" defaultValue={asset?.categoryId || ""} className="w-full h-14 px-5 bg-background shadow-neu-inset border-t border-l border-[#A3B1C6]/30 border-b border-r border-white/60 rounded-2xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-accent/50 text-foreground appearance-none">
                  <option value="">Select Category</option>
                  {categories.map((cat: any) => (
                    <option key={cat.id} value={cat.id}>{cat.name} ({cat.code})</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Status</label>
                <select name="status" defaultValue={asset?.status || "Active"} className="w-full h-14 px-5 bg-background shadow-neu-inset border-t border-l border-[#A3B1C6]/30 border-b border-r border-white/60 rounded-2xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-accent/50 text-foreground appearance-none">
                  <option value="Active">Active</option>
                  <option value="Maintenance">Maintenance</option>
                  <option value="Offline">Offline</option>
                  <option value="Retired">Retired</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Manufacturer</label>
                <input type="text" name="manufacturer" defaultValue={asset?.manufacturer || ""} placeholder="e.g. Dell" className="w-full h-14 px-5 bg-background shadow-neu-inset border-t border-l border-[#A3B1C6]/30 border-b border-r border-white/60 rounded-2xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-accent/50 text-foreground" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Model</label>
                <input type="text" name="model" defaultValue={asset?.model || ""} placeholder="e.g. PowerEdge R750" className="w-full h-14 px-5 bg-background shadow-neu-inset border-t border-l border-[#A3B1C6]/30 border-b border-r border-white/60 rounded-2xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-accent/50 text-foreground" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Lifecycle</label>
                <select defaultValue={asset?.lifecycle || "Production"} className="w-full h-14 px-5 bg-background shadow-neu-inset border-t border-l border-[#A3B1C6]/30 border-b border-r border-white/60 rounded-2xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-accent/50 text-foreground appearance-none">
                  <option value="Production">Production</option>
                  <option value="Testing">Testing</option>
                  <option value="Development">Development</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Criticality</label>
                <select className="w-full h-14 px-5 bg-background shadow-neu-inset border-t border-l border-[#A3B1C6]/30 border-b border-r border-white/60 rounded-2xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-accent/50 text-foreground appearance-none">
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-muted-foreground uppercase tracking-wider">MAC Address</label>
                <input type="text" placeholder="e.g. 00:1A:2B:3C:4D:5E" className="w-full h-14 px-5 bg-background shadow-neu-inset border-t border-l border-[#A3B1C6]/30 border-b border-r border-white/60 rounded-2xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-accent/50 text-foreground" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-muted-foreground uppercase tracking-wider">IP Address (Management)</label>
                <input type="text" placeholder="e.g. 10.1.1.50" className="w-full h-14 px-5 bg-background shadow-neu-inset border-t border-l border-[#A3B1C6]/30 border-b border-r border-white/60 rounded-2xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-accent/50 text-foreground" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Firmware / OS Version</label>
                <input type="text" placeholder="e.g. v2.1.4 / Ubuntu 22.04" className="w-full h-14 px-5 bg-background shadow-neu-inset border-t border-l border-[#A3B1C6]/30 border-b border-r border-white/60 rounded-2xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-accent/50 text-foreground" />
              </div>
            </div>
          </div>

          {/* Step 2: Technical */}
          <div className={step === 2 ? "space-y-6 block animate-in fade-in slide-in-from-right-4" : "hidden"}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-sm font-bold text-muted-foreground uppercase tracking-wider">CPU</label>
                <input type="text" placeholder="e.g. 2x Intel Xeon Gold" className="w-full h-14 px-5 bg-background shadow-neu-inset border-t border-l border-[#A3B1C6]/30 border-b border-r border-white/60 rounded-2xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-accent/50 text-foreground" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-muted-foreground uppercase tracking-wider">RAM</label>
                <input type="text" placeholder="e.g. 512 GB DDR5" className="w-full h-14 px-5 bg-background shadow-neu-inset border-t border-l border-[#A3B1C6]/30 border-b border-r border-white/60 rounded-2xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-accent/50 text-foreground" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Storage</label>
                <input type="text" placeholder="e.g. 4x 3.84TB SSD" className="w-full h-14 px-5 bg-background shadow-neu-inset border-t border-l border-[#A3B1C6]/30 border-b border-r border-white/60 rounded-2xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-accent/50 text-foreground" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Network</label>
                <input type="text" placeholder="e.g. 4x 25GbE" className="w-full h-14 px-5 bg-background shadow-neu-inset border-t border-l border-[#A3B1C6]/30 border-b border-r border-white/60 rounded-2xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-accent/50 text-foreground" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Dimensions (W x D x H)</label>
                <input type="text" placeholder="e.g. 600x1000x2000 mm" className="w-full h-14 px-5 bg-background shadow-neu-inset border-t border-l border-[#A3B1C6]/30 border-b border-r border-white/60 rounded-2xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-accent/50 text-foreground" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Rack Capacity (U)</label>
                <input type="number" placeholder="e.g. 42" className="w-full h-14 px-5 bg-background shadow-neu-inset border-t border-l border-[#A3B1C6]/30 border-b border-r border-white/60 rounded-2xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-accent/50 text-foreground" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Power Consumption (Watt)</label>
                <input type="number" placeholder="e.g. 1400" className="w-full h-14 px-5 bg-background shadow-neu-inset border-t border-l border-[#A3B1C6]/30 border-b border-r border-white/60 rounded-2xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-accent/50 text-foreground" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Voltage & Phase</label>
                <select className="w-full h-14 px-5 bg-background shadow-neu-inset border-t border-l border-[#A3B1C6]/30 border-b border-r border-white/60 rounded-2xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-accent/50 text-foreground appearance-none">
                  <option value="">Select Electrical Spec</option>
                  <option value="220V Single-Phase">220V Single-Phase</option>
                  <option value="380V Three-Phase">380V Three-Phase</option>
                  <option value="48V DC">48V DC (Telecom)</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Weight (kg)</label>
                <input type="number" placeholder="e.g. 25" className="w-full h-14 px-5 bg-background shadow-neu-inset border-t border-l border-[#A3B1C6]/30 border-b border-r border-white/60 rounded-2xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-accent/50 text-foreground" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Cooling Capacity (BTU/kW)</label>
                <input type="text" placeholder="e.g. 50 kW (Only for Cooling Units)" className="w-full h-14 px-5 bg-background shadow-neu-inset border-t border-l border-[#A3B1C6]/30 border-b border-r border-white/60 rounded-2xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-accent/50 text-foreground" />
              </div>
            </div>
          </div>

          {/* Step 3: Location */}
          <div className={step === 3 ? "space-y-6 block animate-in fade-in slide-in-from-right-4" : "hidden"}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Site / Building</label>
                <select name="location_id" defaultValue={asset?.locationId || ""} className="w-full h-14 px-5 bg-background shadow-neu-inset border-t border-l border-[#A3B1C6]/30 border-b border-r border-white/60 rounded-2xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-accent/50 text-foreground appearance-none">
                  <option value="">Select Data Center Site</option>
                  {locations.map((loc: any) => (
                    <option key={loc.id} value={loc.id}>{loc.name} - {loc.parentLoc}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Room</label>
                <input type="text" placeholder="e.g. Server Room A" className="w-full h-14 px-5 bg-background shadow-neu-inset border-t border-l border-[#A3B1C6]/30 border-b border-r border-white/60 rounded-2xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-accent/50 text-foreground" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Rack ID</label>
                <input type="text" name="rack" defaultValue={asset?.rack || ""} placeholder="e.g. R01" className="w-full h-14 px-5 bg-background shadow-neu-inset border-t border-l border-[#A3B1C6]/30 border-b border-r border-white/60 rounded-2xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-accent/50 text-foreground" />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-bold text-muted-foreground uppercase tracking-wider">U Position</label>
                <div className="flex items-center gap-4">
                  <input type="text" name="u_position" defaultValue={asset?.uPosition || ""} placeholder="e.g. 24" className="w-32 h-14 px-5 bg-background shadow-neu-inset border-t border-l border-[#A3B1C6]/30 border-b border-r border-white/60 rounded-2xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-accent/50 text-foreground" />
                  <span className="text-sm font-bold text-muted-foreground">Select the starting Rack Unit (1-42)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Step 4: Business & Financial */}
          <div className={step === 4 ? "space-y-6 block animate-in fade-in slide-in-from-right-4" : "hidden"}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Owner</label>
                <input type="text" name="owner" placeholder="e.g. Infrastructure Team" className="w-full h-14 px-5 bg-background shadow-neu-inset border-t border-l border-[#A3B1C6]/30 border-b border-r border-white/60 rounded-2xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-accent/50 text-foreground" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Department</label>
                <input type="text" name="department" placeholder="e.g. IT Operations" className="w-full h-14 px-5 bg-background shadow-neu-inset border-t border-l border-[#A3B1C6]/30 border-b border-r border-white/60 rounded-2xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-accent/50 text-foreground" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Vendor</label>
                <select name="vendor_id" defaultValue={asset?.vendorId || ""} className="w-full h-14 px-5 bg-background shadow-neu-inset border-t border-l border-[#A3B1C6]/30 border-b border-r border-white/60 rounded-2xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-accent/50 text-foreground appearance-none">
                  <option value="">Select Vendor</option>
                  {vendors.map((v: any) => (
                    <option key={v.id} value={v.id}>{v.name}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Cost (IDR)</label>
                <input type="text" placeholder="e.g. 155000000" className="w-full h-14 px-5 bg-background shadow-neu-inset border-t border-l border-[#A3B1C6]/30 border-b border-r border-white/60 rounded-2xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-accent/50 text-foreground" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Implementation Year</label>
                <input type="number" min="2000" max="2100" placeholder="e.g. 2025" className="w-full h-14 px-5 bg-background shadow-neu-inset border-t border-l border-[#A3B1C6]/30 border-b border-r border-white/60 rounded-2xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-accent/50 text-foreground" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Purchase Date</label>
                <input type="date" name="purchase_date" className="w-full h-14 px-5 bg-background shadow-neu-inset border-t border-l border-[#A3B1C6]/30 border-b border-r border-white/60 rounded-2xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-accent/50 text-foreground uppercase" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Warranty Info</label>
                <input type="text" name="warranty_end" defaultValue={asset?.warranty || ""} placeholder="e.g. 2029 or Expired" className="w-full h-14 px-5 bg-background shadow-neu-inset border-t border-l border-[#A3B1C6]/30 border-b border-r border-white/60 rounded-2xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-accent/50 text-foreground uppercase" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Installation Date</label>
                <input type="date" className="w-full h-14 px-5 bg-background shadow-neu-inset border-t border-l border-[#A3B1C6]/30 border-b border-r border-white/60 rounded-2xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-accent/50 text-foreground uppercase" />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-bold text-muted-foreground uppercase tracking-wider">SLA / Support Level</label>
                <select className="w-full h-14 px-5 bg-background shadow-neu-inset border-t border-l border-[#A3B1C6]/30 border-b border-r border-white/60 rounded-2xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-accent/50 text-foreground appearance-none">
                  <option value="">Select SLA</option>
                  <option value="24x7x4">24x7x4 (4-Hour Response)</option>
                  <option value="NBD">NBD (Next Business Day)</option>
                  <option value="8x5">8x5 Standard Support</option>
                  <option value="No SLA">No SLA (Best Effort)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center mt-12 pt-6 border-t border-[#A3B1C6]/20">
            <Button type="button" variant="ghost" onClick={prevStep} disabled={step === 1 || isSaving} className="h-12 px-6 font-bold text-muted-foreground hover:text-foreground">
              {step > 1 ? "Previous Step" : "Cancel"}
            </Button>
            
            {step < 4 ? (
              <Button type="button" onClick={nextStep} className="h-12 px-8 rounded-2xl shadow-neu-extruded border-neu font-bold text-sm bg-accent text-white hover:bg-accent-light">
                Next Step <ChevronRight className="w-5 h-5 ml-2" />
              </Button>
            ) : (
              <Button type="submit" disabled={isSaving} className="h-12 px-8 rounded-2xl shadow-[inset_2px_2px_4px_rgba(255,255,255,0.4),inset_-2px_-2px_4px_rgba(0,0,0,0.2),0_4px_10px_rgba(56,178,172,0.3)] border border-[#38B2AC]/50 font-bold text-sm bg-[#38B2AC] text-white hover:bg-[#319792] flex items-center gap-2">
                {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle2 className="w-5 h-5" />} 
                {isSaving ? "Saving..." : (editId ? "Update Asset" : "Save Asset")}
              </Button>
            )}
          </div>
          </form>

        </CardContent>
      </Card>

    </div>
  )
}
