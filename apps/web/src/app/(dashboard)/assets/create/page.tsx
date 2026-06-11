"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { 
  ChevronRight, CheckCircle2, Server, Settings, MapPin, DollarSign, ArrowLeft
} from "lucide-react"
import { getFullAssetDetails } from "@/lib/mock-data"

export default function CreateAssetPage() {
  const [step, setStep] = useState(1)
  const [editId, setEditId] = useState<string | null>(null)
  const [asset, setAsset] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search)
    const id = searchParams.get("edit")
    if (id) {
      setEditId(id)
      const { details } = getFullAssetDetails(id)
      if (details) setAsset(details)
    }
    setIsLoading(false)
  }, [])

  const steps = [
    { num: 1, label: "General", icon: <Server className="w-5 h-5" /> },
    { num: 2, label: "Technical", icon: <Settings className="w-5 h-5" /> },
    { num: 3, label: "Location", icon: <MapPin className="w-5 h-5" /> },
    { num: 4, label: "Business & Financial", icon: <DollarSign className="w-5 h-5" /> },
  ]

  const nextStep = () => setStep(prev => Math.min(prev + 1, 4))
  const prevStep = () => setStep(prev => Math.max(prev - 1, 1))

  if (isLoading) return <div className="p-8 text-center text-muted-foreground font-bold">Loading...</div>

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-10 mt-2">
      
      {/* Header */}
      <div>
        <Link href="/assets" className="inline-flex items-center text-sm font-bold text-muted-foreground hover:text-accent mb-4 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Assets
        </Link>
        <h1 className="text-3xl font-display font-bold text-foreground">
          {editId ? `Edit Asset: ${editId}` : "Create New Asset"}
        </h1>
        <p className="text-muted-foreground font-medium mt-1">
          {editId ? "Update equipment details in your data center inventory." : "Add a new equipment to your data center inventory using this wizard."}
        </p>
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
          
          {/* Step 1: General */}
          <div className={step === 1 ? "space-y-6 block animate-in fade-in" : "hidden"}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Asset Tag</label>
                <input type="text" defaultValue={asset?.tag || ""} placeholder="e.g. SRV-2026-001" className="w-full h-14 px-5 bg-background shadow-neu-inset border-t border-l border-[#A3B1C6]/30 border-b border-r border-white/60 rounded-2xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-accent/50 text-foreground" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Serial Number</label>
                <input type="text" defaultValue={asset?.serialNumber || ""} placeholder="e.g. ABC123456789" className="w-full h-14 px-5 bg-background shadow-neu-inset border-t border-l border-[#A3B1C6]/30 border-b border-r border-white/60 rounded-2xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-accent/50 text-foreground" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Category</label>
                <select defaultValue={asset?.category || ""} className="w-full h-14 px-5 bg-background shadow-neu-inset border-t border-l border-[#A3B1C6]/30 border-b border-r border-white/60 rounded-2xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-accent/50 text-foreground appearance-none">
                  <option value="">Select Category</option>
                  <optgroup label="IT Equipment & Enclosures">
                    <option value="Server">Server</option>
                    <option value="Storage">Storage Array</option>
                    <option value="Mainframe">Mainframe</option>
                    <option value="Server Rack">Server Rack</option>
                    <option value="Network Rack">Network Rack</option>
                  </optgroup>
                  <optgroup label="Network">
                    <option value="Switch">Network Switch</option>
                    <option value="Router">Router</option>
                    <option value="Firewall">Firewall / Security</option>
                    <option value="SAN Switch">SAN Switch</option>
                    <option value="Access Point">Wireless Access Point</option>
                    <option value="SFP">Transceiver / SFP</option>
                    <option value="ODF">Optical Distribution Frame (ODF)</option>
                  </optgroup>
                  <optgroup label="Power Infrastructure">
                    <option value="UPS">UPS (Main Unit)</option>
                    <option value="UPS Battery">UPS Battery Bank</option>
                    <option value="PDU">PDU (Rack / Floor)</option>
                    <option value="MDP">MDP (Main Distribution Panel)</option>
                    <option value="Input Output Panel">Input / Output Panel</option>
                    <option value="ATS">ATS / STS</option>
                    <option value="Generator">Generator Set (Genset)</option>
                    <option value="Rectifier">Rectifier / Inverter</option>
                  </optgroup>
                  <optgroup label="Cooling & Environment">
                    <option value="PAC">PAC / CRAC Unit</option>
                    <option value="AC Standing">AC Standing (Precision/Comfort)</option>
                    <option value="AC Wall">AC Split Wall</option>
                    <option value="In-Row Cooling">In-Row Cooling</option>
                    <option value="Chiller">Chiller</option>
                    <option value="Sensor">Environmental Sensor</option>
                    <option value="Humidifier">Humidifier / Dehumidifier</option>
                  </optgroup>
                  <optgroup label="Security, Safety & Access">
                    <option value="CCTV">CCTV Camera</option>
                    <option value="NVR">NVR / DVR System</option>
                    <option value="Access Door">Access Door / Biometric</option>
                    <option value="Access Controller">Access Controller Board</option>
                    <option value="Alarm System">Alarm System</option>
                    <option value="FSS">Fire Suppression System (FM200/Novec/Argonite)</option>
                    <option value="Turnstile">Turnstile / Flap Barrier</option>
                  </optgroup>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Status</label>
                <select defaultValue={asset?.status || "Active"} className="w-full h-14 px-5 bg-background shadow-neu-inset border-t border-l border-[#A3B1C6]/30 border-b border-r border-white/60 rounded-2xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-accent/50 text-foreground appearance-none">
                  <option value="Active">Active</option>
                  <option value="Maintenance">Maintenance</option>
                  <option value="Offline">Offline</option>
                  <option value="Retired">Retired</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Manufacturer</label>
                <input type="text" defaultValue={asset?.manufacturer || ""} placeholder="e.g. Dell" className="w-full h-14 px-5 bg-background shadow-neu-inset border-t border-l border-[#A3B1C6]/30 border-b border-r border-white/60 rounded-2xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-accent/50 text-foreground" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Model</label>
                <input type="text" defaultValue={asset?.model || ""} placeholder="e.g. PowerEdge R750" className="w-full h-14 px-5 bg-background shadow-neu-inset border-t border-l border-[#A3B1C6]/30 border-b border-r border-white/60 rounded-2xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-accent/50 text-foreground" />
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
                <select className="w-full h-14 px-5 bg-background shadow-neu-inset border-t border-l border-[#A3B1C6]/30 border-b border-r border-white/60 rounded-2xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-accent/50 text-foreground appearance-none">
                  <option value="">Select Data Center Site</option>
                  <option value="Batam">Batam DC - Building A</option>
                  <option value="Jakarta">Jakarta DC - Main Facility</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Room</label>
                <input type="text" placeholder="e.g. Server Room A" className="w-full h-14 px-5 bg-background shadow-neu-inset border-t border-l border-[#A3B1C6]/30 border-b border-r border-white/60 rounded-2xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-accent/50 text-foreground" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Rack ID</label>
                <input type="text" placeholder="e.g. R01" className="w-full h-14 px-5 bg-background shadow-neu-inset border-t border-l border-[#A3B1C6]/30 border-b border-r border-white/60 rounded-2xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-accent/50 text-foreground" />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-bold text-muted-foreground uppercase tracking-wider">U Position</label>
                <div className="flex items-center gap-4">
                  <input type="number" min="1" max="42" placeholder="e.g. 24" className="w-32 h-14 px-5 bg-background shadow-neu-inset border-t border-l border-[#A3B1C6]/30 border-b border-r border-white/60 rounded-2xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-accent/50 text-foreground" />
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
                <input type="text" placeholder="e.g. Infrastructure Team" className="w-full h-14 px-5 bg-background shadow-neu-inset border-t border-l border-[#A3B1C6]/30 border-b border-r border-white/60 rounded-2xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-accent/50 text-foreground" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Department</label>
                <input type="text" placeholder="e.g. IT Operations" className="w-full h-14 px-5 bg-background shadow-neu-inset border-t border-l border-[#A3B1C6]/30 border-b border-r border-white/60 rounded-2xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-accent/50 text-foreground" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Vendor</label>
                <input type="text" placeholder="e.g. Dell Technologies" className="w-full h-14 px-5 bg-background shadow-neu-inset border-t border-l border-[#A3B1C6]/30 border-b border-r border-white/60 rounded-2xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-accent/50 text-foreground" />
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
                <input type="date" className="w-full h-14 px-5 bg-background shadow-neu-inset border-t border-l border-[#A3B1C6]/30 border-b border-r border-white/60 rounded-2xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-accent/50 text-foreground uppercase" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Warranty Expiry Date</label>
                <input type="date" className="w-full h-14 px-5 bg-background shadow-neu-inset border-t border-l border-[#A3B1C6]/30 border-b border-r border-white/60 rounded-2xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-accent/50 text-foreground uppercase" />
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
            <Button variant="ghost" onClick={prevStep} disabled={step === 1} className="h-12 px-6 font-bold text-muted-foreground hover:text-foreground">
              {step > 1 ? "Previous Step" : "Cancel"}
            </Button>
            
            {step < 4 ? (
              <Button onClick={nextStep} className="h-12 px-8 rounded-2xl shadow-neu-extruded border-neu font-bold text-sm bg-accent text-white hover:bg-accent-light">
                Next Step <ChevronRight className="w-5 h-5 ml-2" />
              </Button>
            ) : (
              <Link href={editId ? `/assets/${editId}` : "/assets/1"}>
                <Button className="h-12 px-8 rounded-2xl shadow-[inset_2px_2px_4px_rgba(255,255,255,0.4),inset_-2px_-2px_4px_rgba(0,0,0,0.2),0_4px_10px_rgba(56,178,172,0.3)] border border-[#38B2AC]/50 font-bold text-sm bg-[#38B2AC] text-white hover:bg-[#319792] flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5" /> {editId ? "Update Asset" : "Save Asset"}
                </Button>
              </Link>
            )}
          </div>

        </CardContent>
      </Card>

    </div>
  )
}
