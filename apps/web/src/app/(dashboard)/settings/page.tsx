"use client"

import { useState } from "react"
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
  LayoutSidebar,
  AlignJustify,
  Activity,
  UserCheck,
  Bell,
  Database,
  TerminalSquare
} from "lucide-react"

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

  const tabs = ["General", "System", "Notifications", "Security", "Integrations", "Backup & Restore", "Maintenance"]

  return (
    <div className="flex w-full gap-6 pb-6 h-full">
      <div className="flex-1 flex flex-col min-w-0 transition-all duration-300">
        
        {/* Breadcrumb & Header */}
        <div className="flex flex-col mb-6 gap-2">
          <div className="flex flex-wrap items-center text-xs text-muted-foreground font-medium">
            <SettingsIcon size={12} className="mr-1" />
            <span>Management</span>
            <ChevronRight size={12} className="mx-1" />
            <span className="text-foreground font-bold">Settings</span>
          </div>
          <h1 className="text-3xl font-bold text-foreground tracking-tight">Settings</h1>
          <p className="text-sm text-muted-foreground font-medium">Manage your system preferences and configurations</p>
        </div>

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
        <div className="flex-1 overflow-y-auto pr-2 pb-10 space-y-6 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          
          {activeTab === "General" ? (
            <>
              {/* General Settings */}
              <div className="bg-background shadow-neu-extruded border-neu rounded-[32px] p-8">
                <div className="flex justify-between items-center mb-8">
                  <div>
                    <h2 className="text-xl font-bold text-foreground">General Settings</h2>
                    <p className="text-xs text-muted-foreground mt-1">Configure general preferences for the system</p>
                  </div>
                  <Button className="bg-accent hover:bg-accent/90 text-white shadow-neu-extruded hover:shadow-neu-hover active:shadow-neu-inset-small rounded-2xl h-10 px-6 transition-all font-bold border-none text-xs">
                    Save Changes
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
      <div className="w-[320px] flex flex-col gap-6 h-full shrink-0 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        
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
