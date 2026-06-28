"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  ChevronRight, 
  Settings as SettingsIcon,
  Download,
  RefreshCw,
  Trash2,
  Monitor,
  Moon,
  Sun,
  LayoutGrid,
  AlignJustify,
  Activity,
  UserCheck,
  Bell,
  Database,
  TerminalSquare,
  Shield,
  Cloud,
  Key,
  Server,
  Cpu,
  HardDrive,
  Wifi,
  Link,
  Check,
  AlertTriangle,
  Eye,
  EyeOff,
  Save,
  Play,
  UploadCloud,
  Layers,
  Lock,
  Mail,
  Webhook,
  MessageSquare,
  Smartphone
} from "lucide-react"
import { HeroSection } from "@/components/ui/hero-section"

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("General")
  
  // Mock states for toggles and radios
  const [timeFormat, setTimeFormat] = useState("12h")
  const [measurementUnit, setMeasurementUnit] = useState("metric")
  const [themePreference, setThemePreference] = useState("light")
  const [sidebarMode, setSidebarMode] = useState("expanded")
  const [tableDensity, setTableDensity] = useState("comfortable")
  
  const [toggles, setToggles] = useState({
    thumbnails: true,
    serialNumbers: true,
    gridView: false,
    rememberPrefs: true,
    systemTips: true
  })

  const handleToggle = (key: keyof typeof toggles) => {
    setToggles(prev => ({ ...prev, [key]: !prev[key] }))
  }

  const [notificationSettings, setNotificationSettings] = useState({
    TELEGRAM_BOT_TOKEN: '',
    TELEGRAM_DEFAULT_CHAT_ID: '',
    WA_PROVIDER_URL: '',
    WA_API_KEY: '',
    WA_DEFAULT_PHONE: ''
  })
  
  const [isSavingNotifications, setIsSavingNotifications] = useState(false)

  const [globalSettings, setGlobalSettings] = useState<Record<string, string>>({})
  const [isSaving, setIsSaving] = useState(false)

  // Fetch settings on mount
  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        if (!data.error) {
          setGlobalSettings(data)
          
          if (data.timeFormat) setTimeFormat(data.timeFormat)
          if (data.measurementUnit) setMeasurementUnit(data.measurementUnit)
          if (data.themePreference) setThemePreference(data.themePreference)
          if (data.sidebarMode) setSidebarMode(data.sidebarMode)
          if (data.tableDensity) setTableDensity(data.tableDensity)
          
          setNotificationSettings(prev => ({
            TELEGRAM_BOT_TOKEN: data.TELEGRAM_BOT_TOKEN || '',
            TELEGRAM_DEFAULT_CHAT_ID: data.TELEGRAM_DEFAULT_CHAT_ID || '',
            WA_PROVIDER_URL: data.WA_PROVIDER_URL || '',
            WA_API_KEY: data.WA_API_KEY || '',
            WA_DEFAULT_PHONE: data.WA_DEFAULT_PHONE || ''
          }))
          
          setToggles(prev => ({
            thumbnails: data.thumbnails === 'false' ? false : true,
            serialNumbers: data.serialNumbers === 'false' ? false : true,
            gridView: data.gridView === 'true' ? true : false,
            rememberPrefs: data.rememberPrefs === 'false' ? false : true,
            systemTips: data.systemTips === 'false' ? false : true,
          }))
        }
      })
      .catch(console.error)
  }, [])

  const saveGenericSettings = async (category: string, additionalSettings: any = {}) => {
    setIsSaving(true)
    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category, settings: additionalSettings })
      })
      if (res.ok) {
        alert(`${category} settings saved successfully!`)
      } else {
        alert('Failed to save settings.')
      }
    } catch (e) {
      console.error(e)
      alert('Error saving settings.')
    }
    setIsSaving(false)
  }

  const saveNotificationSettings = async () => {
    await saveGenericSettings('Notifications', notificationSettings);
  }
  const tabs = ["General", "System", "Notifications", "Security", "Integrations", "Backup & Restore", "Maintenance"]

  return (
    <div className="flex flex-col lg:flex-row w-full gap-6 pb-6">
      <div className="flex-1 flex flex-col min-w-0 transition-all duration-300">
        
        {/* Breadcrumb & Header */}
        <HeroSection
          title="Settings"
          description="Manage your system preferences and configurations"
          imageSrc="/images/heroes/settings.png"
        />

        {/* Tabs */}
        <div className="flex border-b border-[#A3B1C6]/30 mb-6 overflow-x-auto [&::-webkit-scrollbar]:hidden">
          {tabs.map(tab => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 text-sm font-bold whitespace-nowrap transition-colors border-b-2 ${activeTab === tab ? 'text-accent border-accent' : 'text-muted-foreground hover:text-foreground border-transparent'}`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="flex-1 pr-2 pb-10 space-y-6">
          
          {activeTab === "General" ? (
            <>
              {/* General Settings */}
              <div className="bg-background shadow-neu-extruded border-neu rounded-[32px] p-8">
                <div className="flex justify-between items-center mb-8">
                  <div>
                    <h2 className="text-xl font-bold text-foreground">General Settings</h2>
                    <p className="text-xs text-muted-foreground mt-1">Configure general preferences for the system</p>
                  </div>
                  <Button disabled={isSaving} onClick={() => saveGenericSettings("General", { timeFormat, measurementUnit, themePreference, sidebarMode, tableDensity, thumbnails: toggles.thumbnails, serialNumbers: toggles.serialNumbers, gridView: toggles.gridView })} className="bg-accent hover:bg-accent/90 text-white shadow-neu-extruded hover:shadow-neu-hover active:shadow-neu-inset-small rounded-2xl h-10 px-6 transition-all font-bold border-none text-xs">
                    {isSaving ? "Saving..." : "Save Changes"}
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                  <div>
                    <label className="text-xs font-bold text-muted-foreground mb-2 block">System Name</label>
                    <Input defaultValue="Audira AssetHub" className="h-12 rounded-2xl bg-background shadow-neu-inset-deep border-t border-l border-[#A3B1C6]/30 border-b border-r border-white/60 font-bold text-sm px-4 focus-visible:ring-accent" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-muted-foreground mb-2 block">Default Language</label>
                    <select className="w-full h-12 px-4 bg-background shadow-neu-inset-deep border-t border-l border-[#A3B1C6]/30 border-b border-r border-white/60 rounded-2xl text-sm font-bold text-foreground outline-none appearance-none relative cursor-pointer">
                      <option>English</option>
                      <option>Indonesian</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-muted-foreground mb-2 block">Company Name</label>
                    <Input defaultValue="Audira Technologies" className="h-12 rounded-2xl bg-background shadow-neu-inset-deep border-t border-l border-[#A3B1C6]/30 border-b border-r border-white/60 font-bold text-sm px-4 focus-visible:ring-accent" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-muted-foreground mb-2 block">Items Per Page</label>
                    <select className="w-full h-12 px-4 bg-background shadow-neu-inset-deep border-t border-l border-[#A3B1C6]/30 border-b border-r border-white/60 rounded-2xl text-sm font-bold text-foreground outline-none appearance-none relative cursor-pointer">
                      <option>10</option>
                      <option>25</option>
                      <option>50</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-muted-foreground mb-2 block">Default Time Zone</label>
                    <select className="w-full h-12 px-4 bg-background shadow-neu-inset-deep border-t border-l border-[#A3B1C6]/30 border-b border-r border-white/60 rounded-2xl text-sm font-bold text-foreground outline-none appearance-none relative cursor-pointer">
                      <option>(UTC+07:00) Jakarta</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-muted-foreground mb-2 block">Default Dashboard</label>
                    <select className="w-full h-12 px-4 bg-background shadow-neu-inset-deep border-t border-l border-[#A3B1C6]/30 border-b border-r border-white/60 rounded-2xl text-sm font-bold text-foreground outline-none appearance-none relative cursor-pointer">
                      <option>Overview</option>
                      <option>Assets</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-muted-foreground mb-2 block">Date Format</label>
                    <select className="w-full h-12 px-4 bg-background shadow-neu-inset-deep border-t border-l border-[#A3B1C6]/30 border-b border-r border-white/60 rounded-2xl text-sm font-bold text-foreground outline-none appearance-none relative cursor-pointer">
                      <option>31 May 2025 (DD MMM YYYY)</option>
                      <option>05/31/2025 (MM/DD/YYYY)</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-muted-foreground mb-2 block">Currency</label>
                    <select className="w-full h-12 px-4 bg-background shadow-neu-inset-deep border-t border-l border-[#A3B1C6]/30 border-b border-r border-white/60 rounded-2xl text-sm font-bold text-foreground outline-none appearance-none relative cursor-pointer">
                      <option>IDR (Rp) - Indonesian Rupiah</option>
                      <option>USD ($) - US Dollar</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-muted-foreground mb-3 block">Time Format</label>
                    <div className="flex gap-6 items-center">
                      <label className="flex items-center gap-2 cursor-pointer group">
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center transition-all ${timeFormat === '12h' ? 'bg-background shadow-neu-inset-deep border-2 border-accent' : 'bg-background shadow-neu-extruded group-hover:shadow-neu-hover'}`}>
                          {timeFormat === '12h' && <div className="w-2 h-2 rounded-full bg-accent"></div>}
                        </div>
                        <span className="text-sm font-bold text-foreground">12 Hours (AM/PM)</span>
                        <input type="radio" className="hidden" checked={timeFormat === '12h'} onChange={() => setTimeFormat('12h')} />
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer group">
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center transition-all ${timeFormat === '24h' ? 'bg-background shadow-neu-inset-deep border-2 border-accent' : 'bg-background shadow-neu-extruded group-hover:shadow-neu-hover'}`}>
                          {timeFormat === '24h' && <div className="w-2 h-2 rounded-full bg-accent"></div>}
                        </div>
                        <span className="text-sm font-bold text-foreground">24 Hours</span>
                        <input type="radio" className="hidden" checked={timeFormat === '24h'} onChange={() => setTimeFormat('24h')} />
                      </label>
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-muted-foreground mb-3 block">Measurement Unit</label>
                    <div className="flex gap-6 items-center">
                      <label className="flex items-center gap-2 cursor-pointer group">
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center transition-all ${measurementUnit === 'metric' ? 'bg-background shadow-neu-inset-deep border-2 border-accent' : 'bg-background shadow-neu-extruded group-hover:shadow-neu-hover'}`}>
                          {measurementUnit === 'metric' && <div className="w-2 h-2 rounded-full bg-accent"></div>}
                        </div>
                        <span className="text-sm font-bold text-foreground">Metric (m, kg)</span>
                        <input type="radio" className="hidden" checked={measurementUnit === 'metric'} onChange={() => setMeasurementUnit('metric')} />
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer group">
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center transition-all ${measurementUnit === 'imperial' ? 'bg-background shadow-neu-inset-deep border-2 border-accent' : 'bg-background shadow-neu-extruded group-hover:shadow-neu-hover'}`}>
                          {measurementUnit === 'imperial' && <div className="w-2 h-2 rounded-full bg-accent"></div>}
                        </div>
                        <span className="text-sm font-bold text-foreground">Imperial (ft, lb)</span>
                        <input type="radio" className="hidden" checked={measurementUnit === 'imperial'} onChange={() => setMeasurementUnit('imperial')} />
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Display Preferences */}
              <div className="bg-background shadow-neu-extruded border-neu rounded-[32px] p-8">
                <div className="mb-8">
                  <h2 className="text-xl font-bold text-foreground">Display Preferences</h2>
                  <p className="text-xs text-muted-foreground mt-1">Customize the appearance of the application</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-8">
                  <div className="space-y-6">
                    <div>
                      <label className="text-xs font-bold text-muted-foreground mb-3 block">Theme</label>
                      <div className="flex bg-background shadow-neu-inset-small p-1.5 rounded-2xl gap-1">
                        <button onClick={() => setThemePreference('light')} className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold transition-all ${themePreference === 'light' ? 'bg-background shadow-neu-extruded text-accent' : 'text-muted-foreground hover:text-foreground'}`}>
                          <Sun size={14} /> Light
                        </button>
                        <button onClick={() => setThemePreference('dark')} className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold transition-all ${themePreference === 'dark' ? 'bg-background shadow-neu-extruded text-accent' : 'text-muted-foreground hover:text-foreground'}`}>
                          <Moon size={14} /> Dark
                        </button>
                        <button onClick={() => setThemePreference('system')} className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold transition-all ${themePreference === 'system' ? 'bg-background shadow-neu-extruded text-accent' : 'text-muted-foreground hover:text-foreground'}`}>
                          <Monitor size={14} /> System
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-muted-foreground mb-3 block">Sidebar Mode</label>
                      <div className="flex bg-background shadow-neu-inset-small p-1.5 rounded-2xl gap-1">
                        <button onClick={() => setSidebarMode('expanded')} className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${sidebarMode === 'expanded' ? 'bg-background shadow-neu-extruded text-accent' : 'text-muted-foreground hover:text-foreground'}`}>
                          Expanded
                        </button>
                        <button onClick={() => setSidebarMode('compact')} className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${sidebarMode === 'compact' ? 'bg-background shadow-neu-extruded text-accent' : 'text-muted-foreground hover:text-foreground'}`}>
                          Compact
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-muted-foreground mb-3 block">Table Density</label>
                      <div className="flex bg-background shadow-neu-inset-small p-1.5 rounded-2xl gap-1">
                        <button onClick={() => setTableDensity('comfortable')} className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${tableDensity === 'comfortable' ? 'bg-background shadow-neu-extruded text-accent' : 'text-muted-foreground hover:text-foreground'}`}>
                          Comfortable
                        </button>
                        <button onClick={() => setTableDensity('compact')} className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${tableDensity === 'compact' ? 'bg-background shadow-neu-extruded text-accent' : 'text-muted-foreground hover:text-foreground'}`}>
                          Compact
                        </button>
                        <button onClick={() => setTableDensity('spacious')} className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${tableDensity === 'spacious' ? 'bg-background shadow-neu-extruded text-accent' : 'text-muted-foreground hover:text-foreground'}`}>
                          Spacious
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6 pt-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-foreground">Show asset thumbnails in tables</span>
                      <div className="w-12 h-6 bg-background shadow-neu-inset-deep rounded-full relative cursor-pointer" onClick={() => handleToggle('thumbnails')}>
                        <div className={`absolute top-1 bottom-1 w-4 rounded-full shadow-md transition-all duration-300 ${toggles.thumbnails ? 'bg-accent left-7' : 'bg-[#A3B1C6]/50 left-1'}`}></div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-foreground">Show serial numbers by default</span>
                      <div className="w-12 h-6 bg-background shadow-neu-inset-deep rounded-full relative cursor-pointer" onClick={() => handleToggle('serialNumbers')}>
                        <div className={`absolute top-1 bottom-1 w-4 rounded-full shadow-md transition-all duration-300 ${toggles.serialNumbers ? 'bg-accent left-7' : 'bg-[#A3B1C6]/50 left-1'}`}></div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-foreground">Enable grid view for assets</span>
                      <div className="w-12 h-6 bg-background shadow-neu-inset-deep rounded-full relative cursor-pointer" onClick={() => handleToggle('gridView')}>
                        <div className={`absolute top-1 bottom-1 w-4 rounded-full shadow-md transition-all duration-300 ${toggles.gridView ? 'bg-accent left-7' : 'bg-[#A3B1C6]/50 left-1'}`}></div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-foreground">Remember table preferences</span>
                      <div className="w-12 h-6 bg-background shadow-neu-inset-deep rounded-full relative cursor-pointer" onClick={() => handleToggle('rememberPrefs')}>
                        <div className={`absolute top-1 bottom-1 w-4 rounded-full shadow-md transition-all duration-300 ${toggles.rememberPrefs ? 'bg-accent left-7' : 'bg-[#A3B1C6]/50 left-1'}`}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Other Preferences */}
              <div className="bg-background shadow-neu-extruded border-neu rounded-[32px] p-8">
                <div className="mb-8">
                  <h2 className="text-xl font-bold text-foreground">Other Preferences</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                  <div>
                    <label className="text-xs font-bold text-muted-foreground mb-2 block">Default Asset Status</label>
                    <select className="w-full h-12 px-4 bg-background shadow-neu-inset-deep border-t border-l border-[#A3B1C6]/30 border-b border-r border-white/60 rounded-2xl text-sm font-bold text-foreground outline-none appearance-none relative cursor-pointer">
                      <option>Active</option>
                      <option>In Storage</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-muted-foreground mb-2 block">Auto refresh dashboard</label>
                    <select className="w-full h-12 px-4 bg-background shadow-neu-inset-deep border-t border-l border-[#A3B1C6]/30 border-b border-r border-white/60 rounded-2xl text-sm font-bold text-foreground outline-none appearance-none relative cursor-pointer">
                      <option>5 minutes</option>
                      <option>10 minutes</option>
                      <option>Off</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-muted-foreground mb-2 block">Default Asset Category</label>
                    <select className="w-full h-12 px-4 bg-background shadow-neu-inset-deep border-t border-l border-[#A3B1C6]/30 border-b border-r border-white/60 rounded-2xl text-sm font-bold text-foreground outline-none appearance-none relative cursor-pointer">
                      <option>All Categories</option>
                    </select>
                  </div>
                  <div className="flex items-center justify-between h-12">
                    <span className="text-sm font-bold text-foreground">Enable system tips</span>
                    <div className="w-12 h-6 bg-background shadow-neu-inset-deep rounded-full relative cursor-pointer" onClick={() => handleToggle('systemTips')}>
                      <div className={`absolute top-1 bottom-1 w-4 rounded-full shadow-md transition-all duration-300 ${toggles.systemTips ? 'bg-accent left-7' : 'bg-[#A3B1C6]/50 left-1'}`}></div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : activeTab === "System" ? (
            <div className="space-y-6 animate-in fade-in zoom-in-95 duration-200">
              <div className="bg-background shadow-neu-extruded border-neu rounded-[32px] p-8">
                <div className="flex justify-between items-center mb-8">
                  <div>
                    <h2 className="text-xl font-bold text-foreground">Advanced System Settings</h2>
                    <p className="text-xs text-muted-foreground mt-1">Core infrastructure and runtime environments</p>
                  </div>
                  <Button className="bg-accent hover:bg-accent/90 text-white shadow-neu-extruded hover:shadow-neu-hover active:shadow-neu-inset-small rounded-2xl h-10 px-6 transition-all font-bold border-none text-xs flex items-center gap-2">
                    <Save size={16} /> Save Changes
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Environment Panel */}
                  <div className="bg-background shadow-neu-inset-small p-6 rounded-3xl space-y-5 border border-[#A3B1C6]/10">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500 shadow-neu-inset-small"><Server size={20} /></div>
                      <div><h4 className="font-bold text-sm">Server Node</h4><p className="text-[10px] text-muted-foreground">Active processing cluster</p></div>
                    </div>
                    <div>
                      <select className="w-full h-12 px-4 bg-background shadow-neu-inset-deep border-t border-l border-[#A3B1C6]/30 border-b border-r border-white/60 rounded-2xl text-sm font-bold text-foreground outline-none appearance-none relative cursor-pointer">
                        <option>us-east-1a (Primary)</option>
                        <option>us-east-1b (Failover)</option>
                        <option>eu-central-1 (Edge)</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-muted-foreground mb-2 block">JVM Memory Allocation</label>
                      <div className="flex gap-4">
                        <div className="flex-1 h-12 rounded-2xl bg-background shadow-neu-inset-deep flex items-center px-4"><span className="text-sm font-bold">4096</span><span className="text-xs text-muted-foreground ml-auto">MB</span></div>
                        <Button className="h-12 w-12 rounded-2xl bg-background shadow-neu-extruded hover:shadow-neu-hover text-accent"><RefreshCw size={16} /></Button>
                      </div>
                    </div>
                  </div>

                  {/* Cache & DB Panel */}
                  <div className="bg-background shadow-neu-inset-small p-6 rounded-3xl space-y-5 border border-[#A3B1C6]/10">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center text-green-500 shadow-neu-inset-small"><Database size={20} /></div>
                      <div><h4 className="font-bold text-sm">Cache & Persistence</h4><p className="text-[10px] text-muted-foreground">Redis and DB polling</p></div>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-muted-foreground mb-2 block">Cache Strategy</label>
                      <select className="w-full h-12 px-4 bg-background shadow-neu-inset-deep border-t border-l border-[#A3B1C6]/30 border-b border-r border-white/60 rounded-2xl text-sm font-bold text-foreground outline-none appearance-none relative cursor-pointer">
                        <option>Aggressive (Redis Distributed)</option>
                        <option>Standard (Memory)</option>
                        <option>Bypass (Direct DB)</option>
                      </select>
                    </div>
                    <div className="flex items-center justify-between h-12 bg-background shadow-neu-extruded rounded-2xl px-4">
                      <span className="text-xs font-bold text-foreground flex items-center gap-2"><Activity size={14} className="text-green-500"/> Connection Pooling</span>
                      <div className="w-10 h-5 bg-background shadow-neu-inset-deep rounded-full relative cursor-pointer"><div className="absolute top-1 bottom-1 w-3 rounded-full shadow-md transition-all duration-300 bg-green-500 left-6"></div></div>
                    </div>
                  </div>
                </div>

                <hr className="my-8 border-[#A3B1C6]/20 shadow-neu-inset-small" />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                  <div>
                    <label className="text-xs font-bold text-muted-foreground mb-2 block">Audit Log Retention</label>
                    <select className="w-full h-12 px-4 bg-background shadow-neu-inset-deep border-t border-l border-[#A3B1C6]/30 border-b border-r border-white/60 rounded-2xl text-sm font-bold text-foreground outline-none appearance-none relative cursor-pointer">
                      <option>90 Days (Compliance)</option>
                      <option>30 Days</option>
                      <option>Keep Forever</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-muted-foreground mb-2 block">Global API Rate Limit (req/min)</label>
                    <Input defaultValue="5000" className="h-12 rounded-2xl bg-background shadow-neu-inset-deep border-t border-l border-[#A3B1C6]/30 border-b border-r border-white/60 font-bold text-sm px-4 focus-visible:ring-accent" />
                  </div>
                </div>
              </div>
            </div>
          ) : activeTab === "Notifications" ? (
            <div className="space-y-6 animate-in fade-in zoom-in-95 duration-200">
              <div className="bg-background shadow-neu-extruded border-neu rounded-[32px] p-8">
                <div className="flex justify-between items-center mb-8">
                  <div>
                    <h2 className="text-xl font-bold text-foreground">Enterprise Notification Routing</h2>
                    <p className="text-xs text-muted-foreground mt-1">Multi-channel alerts and webhook integrations</p>
                  </div>
                  <Button 
                    onClick={saveNotificationSettings}
                    disabled={isSavingNotifications}
                    className="bg-accent hover:bg-accent/90 text-white shadow-neu-extruded hover:shadow-neu-hover active:shadow-neu-inset-small rounded-2xl h-10 px-6 transition-all font-bold border-none text-xs flex items-center gap-2"
                  >
                    <Save size={16} /> {isSavingNotifications ? 'Saving...' : 'Save Changes'}
                  </Button>
                </div>

                {/* Webhooks Config */}
                <div className="mb-8 p-6 bg-background shadow-neu-inset-small rounded-3xl border border-[#A3B1C6]/10">
                  <h4 className="text-sm font-bold flex items-center gap-2 mb-4"><Webhook size={18} className="text-purple-500"/> Outbound Webhooks (Slack/Teams)</h4>
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                      <Link size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                      <Input defaultValue="https://hooks.slack.com/services/T000/B000/XXX" className="h-12 w-full rounded-2xl bg-background shadow-neu-inset-deep border-none font-bold text-sm pl-12 pr-4 focus-visible:ring-accent" />
                    </div>
                    <Button variant="outline" className="h-12 rounded-2xl shadow-neu-extruded hover:text-accent font-bold px-6 flex items-center gap-2"><Play size={16}/> Test Payload</Button>
                  </div>
                  <div className="flex gap-4 mt-4 text-xs font-bold">
                    <label className="flex items-center gap-2"><input type="checkbox" defaultChecked className="accent-accent w-4 h-4 rounded" /> Critical Errors</label>
                    <label className="flex items-center gap-2"><input type="checkbox" defaultChecked className="accent-accent w-4 h-4 rounded" /> Asset Movements</label>
                    <label className="flex items-center gap-2"><input type="checkbox" className="accent-accent w-4 h-4 rounded" /> Ticket Updates</label>
                  </div>
                </div>

                {/* Telegram Config */}
                <div className="mb-8 p-6 bg-background shadow-neu-inset-small rounded-3xl border border-[#A3B1C6]/10">
                  <h4 className="text-sm font-bold flex items-center gap-2 mb-4"><MessageSquare size={18} className="text-blue-500"/> Telegram Integration</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="text-xs font-bold text-muted-foreground mb-2 block">Bot Token</label>
                      <Input 
                        value={notificationSettings.TELEGRAM_BOT_TOKEN}
                        onChange={(e) => setNotificationSettings(p => ({ ...p, TELEGRAM_BOT_TOKEN: e.target.value }))}
                        placeholder="1234567890:ABCdefGHIjklMNOpqrsTUVwxyz" 
                        className="h-12 rounded-2xl bg-background shadow-neu-inset-deep border-none font-bold text-sm px-4 focus-visible:ring-accent" 
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-muted-foreground mb-2 block">Default Chat ID</label>
                      <Input 
                        value={notificationSettings.TELEGRAM_DEFAULT_CHAT_ID}
                        onChange={(e) => setNotificationSettings(p => ({ ...p, TELEGRAM_DEFAULT_CHAT_ID: e.target.value }))}
                        placeholder="-1001234567890" 
                        className="h-12 rounded-2xl bg-background shadow-neu-inset-deep border-none font-bold text-sm px-4 focus-visible:ring-accent" 
                      />
                    </div>
                  </div>
                </div>

                {/* WhatsApp Config */}
                <div className="mb-8 p-6 bg-background shadow-neu-inset-small rounded-3xl border border-[#A3B1C6]/10">
                  <h4 className="text-sm font-bold flex items-center gap-2 mb-4"><Smartphone size={18} className="text-green-500"/> WhatsApp Integration</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="md:col-span-2">
                      <label className="text-xs font-bold text-muted-foreground mb-2 block">Provider API URL (e.g. Fonnte, Wablas)</label>
                      <Input 
                        value={notificationSettings.WA_PROVIDER_URL}
                        onChange={(e) => setNotificationSettings(p => ({ ...p, WA_PROVIDER_URL: e.target.value }))}
                        placeholder="https://api.fonnte.com/send" 
                        className="h-12 rounded-2xl bg-background shadow-neu-inset-deep border-none font-bold text-sm px-4 focus-visible:ring-accent" 
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-muted-foreground mb-2 block">API Key / Authorization</label>
                      <Input 
                        value={notificationSettings.WA_API_KEY}
                        onChange={(e) => setNotificationSettings(p => ({ ...p, WA_API_KEY: e.target.value }))}
                        placeholder="Your API Key" 
                        type="password"
                        className="h-12 rounded-2xl bg-background shadow-neu-inset-deep border-none font-bold text-sm px-4 focus-visible:ring-accent" 
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-muted-foreground mb-2 block">Default Target Phone</label>
                      <Input 
                        value={notificationSettings.WA_DEFAULT_PHONE}
                        onChange={(e) => setNotificationSettings(p => ({ ...p, WA_DEFAULT_PHONE: e.target.value }))}
                        placeholder="6281234567890" 
                        className="h-12 rounded-2xl bg-background shadow-neu-inset-deep border-none font-bold text-sm px-4 focus-visible:ring-accent" 
                      />
                    </div>
                  </div>
                </div>

                {/* Email Alerts Grid */}
                <h4 className="text-sm font-bold flex items-center gap-2 mb-4 px-2"><Mail size={18} className="text-blue-500"/> Event Matrix (Email)</h4>
                <div className="bg-background shadow-neu-extruded rounded-3xl overflow-hidden border border-[#A3B1C6]/20">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-background shadow-neu-inset-small">
                        <th className="p-4 text-xs font-black uppercase text-muted-foreground tracking-wider">Event Type</th>
                        <th className="p-4 text-xs font-black uppercase text-muted-foreground tracking-wider text-center">Admin</th>
                        <th className="p-4 text-xs font-black uppercase text-muted-foreground tracking-wider text-center">Technician</th>
                        <th className="p-4 text-xs font-black uppercase text-muted-foreground tracking-wider text-center">Manager</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm font-medium">
                      <tr className="border-b border-[#A3B1C6]/10">
                        <td className="p-4 font-bold flex items-center gap-2"><AlertTriangle size={16} className="text-red-500"/> Server Offline</td>
                        <td className="p-4 text-center"><input type="checkbox" defaultChecked className="accent-accent w-5 h-5 rounded cursor-pointer" /></td>
                        <td className="p-4 text-center"><input type="checkbox" defaultChecked className="accent-accent w-5 h-5 rounded cursor-pointer" /></td>
                        <td className="p-4 text-center"><input type="checkbox" className="accent-accent w-5 h-5 rounded cursor-pointer" /></td>
                      </tr>
                      <tr className="border-b border-[#A3B1C6]/10">
                        <td className="p-4 font-bold flex items-center gap-2"><Check size={16} className="text-green-500"/> Warranty Expiring</td>
                        <td className="p-4 text-center"><input type="checkbox" defaultChecked className="accent-accent w-5 h-5 rounded cursor-pointer" /></td>
                        <td className="p-4 text-center"><input type="checkbox" className="accent-accent w-5 h-5 rounded cursor-pointer" /></td>
                        <td className="p-4 text-center"><input type="checkbox" defaultChecked className="accent-accent w-5 h-5 rounded cursor-pointer" /></td>
                      </tr>
                      <tr>
                        <td className="p-4 font-bold flex items-center gap-2"><Layers size={16} className="text-blue-500"/> Daily Digest</td>
                        <td className="p-4 text-center"><input type="checkbox" defaultChecked className="accent-accent w-5 h-5 rounded cursor-pointer" /></td>
                        <td className="p-4 text-center"><input type="checkbox" className="accent-accent w-5 h-5 rounded cursor-pointer" /></td>
                        <td className="p-4 text-center"><input type="checkbox" defaultChecked className="accent-accent w-5 h-5 rounded cursor-pointer" /></td>
                      </tr>
                    </tbody>
                  </table>
                </div>

              </div>
            </div>
          ) : activeTab === "Security" ? (
            <div className="space-y-6 animate-in fade-in zoom-in-95 duration-200">
              <div className="bg-background shadow-neu-extruded border-neu rounded-[32px] p-8">
                <div className="flex justify-between items-center mb-8">
                  <div>
                    <h2 className="text-xl font-bold text-foreground">Identity & Access Management</h2>
                    <p className="text-xs text-muted-foreground mt-1">Authentication, 2FA, SSO, and session controls</p>
                  </div>
                  <Button className="bg-accent hover:bg-accent/90 text-white shadow-neu-extruded hover:shadow-neu-hover active:shadow-neu-inset-small rounded-2xl h-10 px-6 transition-all font-bold border-none text-xs flex items-center gap-2">
                    <Save size={16} /> Save Changes
                  </Button>
                </div>
                
                {/* Auth Controls */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                  <div className="bg-background shadow-neu-inset-small p-6 rounded-3xl space-y-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-500 shadow-neu-inset-small"><Lock size={20} /></div>
                      <h4 className="font-bold text-sm">Authentication Rules</h4>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-muted-foreground mb-2 block">Session Timeout</label>
                      <select className="w-full h-12 px-4 bg-background shadow-neu-inset-deep border-t border-l border-[#A3B1C6]/30 border-b border-r border-white/60 rounded-2xl text-sm font-bold text-foreground outline-none appearance-none relative cursor-pointer">
                        <option>15 Minutes (High Security)</option>
                        <option>1 Hour</option>
                        <option>8 Hours (Standard)</option>
                      </select>
                    </div>
                    <div className="flex items-center justify-between h-12 bg-background shadow-neu-extruded rounded-2xl px-4 border border-red-500/10">
                      <div>
                        <span className="text-xs font-bold text-foreground block">Enforce 2FA</span>
                        <span className="text-[9px] text-muted-foreground block">Require Authenticator App</span>
                      </div>
                      <div className="w-10 h-5 bg-background shadow-neu-inset-deep rounded-full relative cursor-pointer"><div className="absolute top-1 bottom-1 w-3 rounded-full shadow-md transition-all duration-300 bg-red-500 left-6"></div></div>
                    </div>
                  </div>

                  {/* SSO */}
                  <div className="bg-background shadow-neu-inset-small p-6 rounded-3xl space-y-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500 shadow-neu-inset-small"><Shield size={20} /></div>
                      <div>
                        <h4 className="font-bold text-sm">Enterprise SSO</h4>
                        <span className="px-2 py-0.5 bg-green-500/10 text-green-500 text-[9px] font-bold rounded uppercase">Active</span>
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-muted-foreground mb-2 block">SSO Provider</label>
                      <select className="w-full h-12 px-4 bg-background shadow-neu-inset-deep border-t border-l border-[#A3B1C6]/30 border-b border-r border-white/60 rounded-2xl text-sm font-bold text-foreground outline-none appearance-none relative cursor-pointer">
                        <option>Azure Active Directory (OIDC)</option>
                        <option>Okta (SAML 2.0)</option>
                        <option>Google Workspace</option>
                      </select>
                    </div>
                    <Button variant="outline" className="w-full h-12 rounded-2xl shadow-neu-extruded font-bold text-xs">Configure Identity Provider</Button>
                  </div>
                </div>

                {/* API Keys */}
                <h4 className="text-sm font-bold flex items-center gap-2 mb-4 px-2"><Key size={18} className="text-accent"/> Service Accounts & API Keys</h4>
                <div className="bg-background shadow-neu-inset-small p-4 rounded-3xl">
                  <div className="bg-background shadow-neu-extruded p-4 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div>
                      <h5 className="font-bold text-sm">Audira Scanner Agent</h5>
                      <p className="text-[10px] font-mono text-muted-foreground mt-1">Key: sk_live_8f92...a1b2</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] font-bold text-muted-foreground bg-background shadow-neu-inset px-3 py-1 rounded-lg">Last used: 2 mins ago</span>
                      <Button variant="ghost" className="h-8 w-8 p-0 rounded-lg text-red-500 shadow-neu-extruded hover:shadow-neu-hover"><Trash2 size={14}/></Button>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          ) : activeTab === "Integrations" ? (
            <div className="space-y-6 animate-in fade-in zoom-in-95 duration-200">
              <div className="bg-background shadow-neu-extruded border-neu rounded-[32px] p-8">
                <div className="flex justify-between items-center mb-8">
                  <div>
                    <h2 className="text-xl font-bold text-foreground">Integration Ecosystem</h2>
                    <p className="text-xs text-muted-foreground mt-1">Connect with external ITSM, discovery, and monitoring tools</p>
                  </div>
                  <Button className="bg-accent hover:bg-accent/90 text-white shadow-neu-extruded hover:shadow-neu-hover active:shadow-neu-inset-small rounded-2xl h-10 px-6 transition-all font-bold border-none text-xs flex items-center gap-2">
                    <LayoutGrid size={16} /> Browse Plugin Store
                  </Button>
                </div>
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                  {/* Plugin 1 */}
                  <div className="flex flex-col sm:flex-row gap-5 items-start sm:items-center bg-background p-6 rounded-3xl shadow-neu-inset-small border border-[#A3B1C6]/10">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-500 to-green-700 flex items-center justify-center text-white font-black text-xl shadow-lg shrink-0">SN</div>
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-1">
                        <h4 className="text-sm font-bold text-foreground">ServiceNow ITSM</h4>
                        <span className="px-2 py-0.5 bg-green-500/10 text-green-500 text-[9px] font-bold rounded uppercase flex items-center gap-1"><Check size={10}/> Connected</span>
                      </div>
                      <p className="text-[11px] text-muted-foreground line-clamp-2 mb-2">Two-way sync for incidents and CMDB assets.</p>
                      <p className="text-[9px] font-bold text-muted-foreground">Last Sync: 4 mins ago (Auto)</p>
                    </div>
                    <Button variant="outline" className="h-10 rounded-xl shadow-neu-extruded border-none font-bold text-xs shrink-0"><SettingsIcon size={14} className="mr-2"/> Manage</Button>
                  </div>
                  
                  {/* Plugin 2 */}
                  <div className="flex flex-col sm:flex-row gap-5 items-start sm:items-center bg-background p-6 rounded-3xl shadow-neu-inset-small border border-[#A3B1C6]/10">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-black text-xl shadow-lg shrink-0">VM</div>
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-1">
                        <h4 className="text-sm font-bold text-foreground">VMware vCenter</h4>
                        <span className="px-2 py-0.5 bg-[#A3B1C6]/20 text-muted-foreground text-[9px] font-bold rounded uppercase">Not Configured</span>
                      </div>
                      <p className="text-[11px] text-muted-foreground line-clamp-2 mb-2">Auto-discover virtual machines and hypervisors.</p>
                    </div>
                    <Button className="h-10 rounded-xl bg-background shadow-neu-extruded border-none font-bold text-xs shrink-0 text-accent"><Link size={14} className="mr-2"/> Connect</Button>
                  </div>

                  {/* Plugin 3 */}
                  <div className="flex flex-col sm:flex-row gap-5 items-start sm:items-center bg-background p-6 rounded-3xl shadow-neu-inset-small border border-[#A3B1C6]/10">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center text-white font-black text-xl shadow-lg shrink-0"><Monitor size={24}/></div>
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-1">
                        <h4 className="text-sm font-bold text-foreground">SolarWinds</h4>
                        <span className="px-2 py-0.5 bg-red-500/10 text-red-500 text-[9px] font-bold rounded uppercase flex items-center gap-1"><AlertTriangle size={10}/> Error</span>
                      </div>
                      <p className="text-[11px] text-muted-foreground line-clamp-2 mb-2">Network monitoring and switch port mapping.</p>
                      <p className="text-[9px] font-bold text-red-500">Connection timeout. Check credentials.</p>
                    </div>
                    <Button variant="outline" className="h-10 rounded-xl shadow-neu-extruded border-none font-bold text-xs shrink-0"><RefreshCw size={14} className="mr-2"/> Reconnect</Button>
                  </div>
                </div>
              </div>
            </div>
          ) : activeTab === "Backup & Restore" ? (
            <div className="space-y-6 animate-in fade-in zoom-in-95 duration-200">
              <div className="bg-background shadow-neu-extruded border-neu rounded-[32px] p-8">
                <div className="flex justify-between items-center mb-8">
                  <div>
                    <h2 className="text-xl font-bold text-foreground">Disaster Recovery Strategy</h2>
                    <p className="text-xs text-muted-foreground mt-1">Manage snapshots, storage targets, and retention rules</p>
                  </div>
                  <Button className="bg-accent hover:bg-accent/90 text-white shadow-neu-extruded hover:shadow-neu-hover active:shadow-neu-inset-small rounded-2xl h-10 px-6 transition-all font-bold border-none text-xs flex items-center gap-2">
                    <UploadCloud size={16} /> Run Manual Backup
                  </Button>
                </div>
                
                {/* Storage Metrics */}
                <div className="mb-8">
                  <div className="flex justify-between text-xs font-bold mb-2">
                    <span className="text-muted-foreground uppercase tracking-wider flex items-center gap-2"><Cloud size={14}/> S3 Bucket Storage</span>
                    <span className="text-foreground">8.4 GB / 50 GB Used</span>
                  </div>
                  <div className="h-4 w-full bg-background shadow-neu-inset-deep rounded-full overflow-hidden p-1">
                    <div className="h-full rounded-full transition-all duration-500 bg-gradient-to-r from-accent to-purple-500" style={{ width: '16.8%' }}></div>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                  <div className="lg:col-span-2 space-y-6 bg-background shadow-neu-inset-small p-6 rounded-3xl">
                    <h4 className="font-bold text-sm mb-4">Backup Policy</h4>
                    <div>
                      <label className="text-xs font-bold text-muted-foreground mb-2 block">Automated Schedule</label>
                      <select className="w-full h-12 px-4 bg-background shadow-neu-inset-deep border-t border-l border-[#A3B1C6]/30 border-b border-r border-white/60 rounded-2xl text-sm font-bold text-foreground outline-none appearance-none relative cursor-pointer">
                        <option>Daily at 02:00 UTC</option>
                        <option>Every 6 Hours</option>
                        <option>Weekly (Sunday)</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-muted-foreground mb-2 block">Storage Target</label>
                      <select className="w-full h-12 px-4 bg-background shadow-neu-inset-deep border-t border-l border-[#A3B1C6]/30 border-b border-r border-white/60 rounded-2xl text-sm font-bold text-foreground outline-none appearance-none relative cursor-pointer">
                        <option>AWS S3 (us-east-1)</option>
                        <option>Azure Blob Storage</option>
                        <option>Local NAS (/mnt/backup)</option>
                      </select>
                    </div>
                    <div className="flex items-center justify-between h-12 bg-background shadow-neu-extruded rounded-2xl px-4 mt-2">
                      <span className="text-xs font-bold text-foreground flex items-center gap-2">Encrypt Archives (AES-256)</span>
                      <div className="w-10 h-5 bg-background shadow-neu-inset-deep rounded-full relative cursor-pointer"><div className="absolute top-1 bottom-1 w-3 rounded-full shadow-md transition-all duration-300 bg-accent left-6"></div></div>
                    </div>
                  </div>
                  
                  <div className="lg:col-span-3">
                    <h4 className="text-sm font-bold flex items-center gap-2 mb-4 px-2"><HardDrive size={18} className="text-accent"/> Recent Snapshots</h4>
                    <div className="bg-background shadow-neu-extruded rounded-3xl overflow-hidden border border-[#A3B1C6]/20">
                      <table className="w-full text-left border-collapse">
                        <tbody className="text-xs font-medium">
                          <tr className="border-b border-[#A3B1C6]/10 hover:bg-[#A3B1C6]/5 transition-colors">
                            <td className="p-4 font-bold">backup_core_20250530_0200.enc</td>
                            <td className="p-4 text-muted-foreground">30 May, 02:00 AM</td>
                            <td className="p-4 font-mono text-right">1.2 GB</td>
                            <td className="p-4 text-right"><Button variant="ghost" className="h-8 text-accent font-bold">Restore</Button></td>
                          </tr>
                          <tr className="border-b border-[#A3B1C6]/10 hover:bg-[#A3B1C6]/5 transition-colors">
                            <td className="p-4 font-bold">backup_core_20250529_0200.enc</td>
                            <td className="p-4 text-muted-foreground">29 May, 02:00 AM</td>
                            <td className="p-4 font-mono text-right">1.1 GB</td>
                            <td className="p-4 text-right"><Button variant="ghost" className="h-8 text-accent font-bold">Restore</Button></td>
                          </tr>
                          <tr className="hover:bg-[#A3B1C6]/5 transition-colors">
                            <td className="p-4 font-bold">backup_core_20250528_0200.enc</td>
                            <td className="p-4 text-muted-foreground">28 May, 02:00 AM</td>
                            <td className="p-4 font-mono text-right">1.1 GB</td>
                            <td className="p-4 text-right"><Button variant="ghost" className="h-8 text-accent font-bold">Restore</Button></td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
            </div>
          </div>
          ) : activeTab === "Maintenance" ? (
            <div className="space-y-6 animate-in fade-in zoom-in-95 duration-200">
              <div className="bg-background shadow-neu-extruded border-neu rounded-[32px] p-8">
                <div className="mb-8">
                  <h2 className="text-xl font-bold text-foreground">Maintenance Operations</h2>
                  <p className="text-xs text-muted-foreground mt-1">System health, index rebuilding, and dangerous actions</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                  {/* Health */}
                  <div className="bg-background shadow-neu-inset-small p-6 rounded-3xl space-y-4">
                    <h4 className="font-bold text-sm mb-4">Live Resources</h4>
                    <div>
                      <div className="flex justify-between text-[10px] font-bold mb-1 uppercase text-muted-foreground"><span>CPU Load</span><span>32%</span></div>
                      <div className="h-2 w-full bg-background shadow-neu-inset-deep rounded-full overflow-hidden p-0.5"><div className="h-full rounded-full bg-green-500" style={{ width: '32%' }}></div></div>
                    </div>
                    <div>
                      <div className="flex justify-between text-[10px] font-bold mb-1 uppercase text-muted-foreground"><span>Memory (RAM)</span><span>78%</span></div>
                      <div className="h-2 w-full bg-background shadow-neu-inset-deep rounded-full overflow-hidden p-0.5"><div className="h-full rounded-full bg-yellow-500" style={{ width: '78%' }}></div></div>
                    </div>
                    <div>
                      <div className="flex justify-between text-[10px] font-bold mb-1 uppercase text-muted-foreground"><span>Database Connections</span><span>142 / 500</span></div>
                      <div className="h-2 w-full bg-background shadow-neu-inset-deep rounded-full overflow-hidden p-0.5"><div className="h-full rounded-full bg-accent" style={{ width: '28%' }}></div></div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="space-y-4 flex flex-col justify-center">
                    <div className="flex items-center justify-between bg-yellow-500/10 border border-yellow-500/20 p-5 rounded-2xl">
                      <div>
                        <h4 className="text-yellow-600 font-bold text-sm">Enter Maintenance Mode</h4>
                        <p className="text-[10px] text-muted-foreground mt-1">Blocks non-admins. Displays 503 Maintenance page.</p>
                      </div>
                      <div className="w-12 h-6 bg-background shadow-neu-inset-deep rounded-full relative cursor-pointer"><div className="absolute top-1 bottom-1 w-4 rounded-full shadow-md transition-all duration-300 bg-[#A3B1C6]/50 left-1"></div></div>
                    </div>
                    <Button variant="outline" className="w-full h-12 rounded-2xl shadow-neu-extruded border-none font-bold flex items-center justify-start px-6 gap-3">
                      <RefreshCw size={16} className="text-blue-500" /> Re-index Search Engine (Elasticsearch)
                    </Button>
                    <Button variant="outline" className="w-full h-12 rounded-2xl shadow-neu-extruded border-none font-bold flex items-center justify-start px-6 gap-3">
                      <Trash2 size={16} className="text-orange-500" /> Prune Orphaned Attachments
                    </Button>
                  </div>
                </div>

                {/* Danger Zone */}
                <div className="border border-red-500/20 rounded-3xl p-6 bg-red-500/5">
                  <h4 className="text-red-500 font-black flex items-center gap-2 mb-2"><AlertTriangle size={18}/> Danger Zone</h4>
                  <p className="text-xs text-muted-foreground mb-6">These actions are irreversible. Proceed with extreme caution.</p>
                  
                  <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-background shadow-neu-extruded p-4 rounded-2xl">
                    <div>
                      <h5 className="font-bold text-sm">Factory Reset</h5>
                      <p className="text-[10px] text-muted-foreground">Wipes all databases, assets, tickets, and configurations.</p>
                    </div>
                    <Button variant="destructive" className="rounded-xl shadow-md font-bold h-10 px-6 shrink-0 bg-red-500 hover:bg-red-600">Wipe Data</Button>
                  </div>
                </div>
            </div>
          </div>
          ) : (
            <div className="flex items-center justify-center h-64 bg-background shadow-neu-extruded rounded-[32px] p-8 border-neu text-center">
              <div>
                <div className="w-16 h-16 rounded-2xl bg-background shadow-neu-inset-deep mx-auto flex items-center justify-center mb-4">
                  <SettingsIcon size={24} className="text-muted-foreground" />
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2">{activeTab} Settings</h3>
                <p className="text-sm text-muted-foreground">Configuration options for {activeTab.toLowerCase()} are currently under development.</p>
              </div>
            </div>
          )}
          
        </div>
      </div>

      {/* Right Side Panel */}
      <div className="w-full lg:w-[320px] flex flex-col gap-6 lg:shrink-0">
        
        {/* System Information Card */}
        <div className="bg-background shadow-neu-extruded border-neu rounded-[32px] p-6">
          <h3 className="font-bold text-foreground tracking-tight mb-5">System Information</h3>
          
          <div className="space-y-4 text-xs">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground font-medium">Version</span>
              <span className="font-bold text-foreground">v2.4.0</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground font-medium">Environment</span>
              <span className="px-2.5 py-1 text-[9px] rounded-lg font-bold text-green-500 shadow-neu-inset-small bg-background">Production</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground font-medium">Database</span>
              <span className="font-bold text-foreground">PostgreSQL 14.8</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground font-medium">Server Time</span>
              <span className="font-bold text-foreground">31 May 2025, 09:15 AM</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground font-medium">Uptime</span>
              <span className="font-bold text-foreground">15 days, 4 hours</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground font-medium">Last Updated</span>
              <span className="font-bold text-foreground">30 May 2025, 11:30 PM</span>
            </div>
          </div>
        </div>

        {/* Recent Activity Card */}
        <div className="bg-background shadow-neu-extruded border-neu rounded-[32px] p-6">
          <h3 className="font-bold text-foreground tracking-tight mb-5">Recent Activity</h3>
          
          <div className="space-y-5">
            <div className="flex gap-3">
              <div className="w-7 h-7 rounded-lg bg-background shadow-neu-inset-small flex items-center justify-center text-blue-500 shrink-0 mt-0.5">
                <SettingsIcon size={12} />
              </div>
              <div>
                <p className="text-xs font-bold text-foreground">System settings updated</p>
                <div className="flex justify-between items-center mt-1 w-[220px]">
                  <span className="text-[10px] font-medium text-muted-foreground">Agus Setiawan</span>
                  <span className="text-[9px] font-bold text-muted-foreground">31 May 2025, 09:15 AM</span>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="w-7 h-7 rounded-lg bg-background shadow-neu-inset-small flex items-center justify-center text-blue-500 shrink-0 mt-0.5">
                <UserCheck size={12} />
              </div>
              <div>
                <p className="text-xs font-bold text-foreground">User role permissions changed</p>
                <div className="flex justify-between items-center mt-1 w-[220px]">
                  <span className="text-[10px] font-medium text-muted-foreground">Rudi Hermawan</span>
                  <span className="text-[9px] font-bold text-muted-foreground">31 May 2025, 08:42 AM</span>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="w-7 h-7 rounded-lg bg-background shadow-neu-inset-small flex items-center justify-center text-green-500 shrink-0 mt-0.5">
                <Bell size={12} />
              </div>
              <div>
                <p className="text-xs font-bold text-foreground">Notification settings updated</p>
                <div className="flex justify-between items-center mt-1 w-[220px]">
                  <span className="text-[10px] font-medium text-muted-foreground">Dewi Kartika</span>
                  <span className="text-[9px] font-bold text-muted-foreground">31 May 2025, 07:30 AM</span>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="w-7 h-7 rounded-lg bg-background shadow-neu-inset-small flex items-center justify-center text-gray-500 shrink-0 mt-0.5">
                <TerminalSquare size={12} />
              </div>
              <div>
                <p className="text-xs font-bold text-foreground">API integration configured</p>
                <div className="flex justify-between items-center mt-1 w-[220px]">
                  <span className="text-[10px] font-medium text-muted-foreground">Budi Santoso</span>
                  <span className="text-[9px] font-bold text-muted-foreground">30 May 2025, 05:20 PM</span>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="w-7 h-7 rounded-lg bg-background shadow-neu-inset-small flex items-center justify-center text-green-500 shrink-0 mt-0.5">
                <Database size={12} />
              </div>
              <div>
                <p className="text-xs font-bold text-foreground">Backup completed</p>
                <div className="flex justify-between items-center mt-1 w-[220px]">
                  <span className="text-[10px] font-medium text-muted-foreground">System</span>
                  <span className="text-[9px] font-bold text-muted-foreground">30 May 2025, 02:10 AM</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions Card */}
        <div className="bg-background shadow-neu-extruded border-neu rounded-[32px] p-6 mb-2">
          <h3 className="font-bold text-foreground tracking-tight mb-5">Quick Actions</h3>
          
          <div className="space-y-3">
            <button className="w-full p-4 rounded-2xl bg-background shadow-neu-extruded hover:shadow-neu-hover active:shadow-neu-inset-small transition-all flex items-center gap-3 text-left group">
              <div className="w-8 h-8 rounded-xl bg-background shadow-neu-inset-small flex items-center justify-center text-blue-500 shrink-0 group-hover:text-accent transition-colors">
                <Download size={14} />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-foreground">Export System Settings</p>
                <p className="text-[9px] font-medium text-muted-foreground mt-0.5 truncate">Download current settings as a file</p>
              </div>
            </button>

            <button className="w-full p-4 rounded-2xl bg-background shadow-neu-extruded hover:shadow-neu-hover active:shadow-neu-inset-small transition-all flex items-center gap-3 text-left group">
              <div className="w-8 h-8 rounded-xl bg-background shadow-neu-inset-small flex items-center justify-center text-amber-500 shrink-0 group-hover:text-accent transition-colors">
                <RefreshCw size={14} />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-foreground">Reset to Defaults</p>
                <p className="text-[9px] font-medium text-muted-foreground mt-0.5 truncate">Restore system settings to default</p>
              </div>
            </button>

            <button className="w-full p-4 rounded-2xl bg-background shadow-neu-extruded hover:shadow-neu-hover active:shadow-neu-inset-small transition-all flex items-center gap-3 text-left group">
              <div className="w-8 h-8 rounded-xl bg-background shadow-neu-inset-small flex items-center justify-center text-red-500 shrink-0 group-hover:text-red-400 transition-colors">
                <Trash2 size={14} />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-foreground">Clear Cache</p>
                <p className="text-[9px] font-medium text-muted-foreground mt-0.5 truncate">Clear application cache data</p>
              </div>
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}
