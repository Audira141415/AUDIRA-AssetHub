"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  ChevronRight, 
  Upload, 
  Search, 
  Filter,
  MoreVertical,
  X,
  ShieldCheck,
  ShieldAlert,
  CalendarDays,
  MapPin,
  AlertTriangle,
  Info,
  ChevronLeft
} from "lucide-react"

import { mockLogs } from "@/lib/mock-data"

// Types
type Log = typeof mockLogs[0]

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<Log[]>(mockLogs)
  const [selectedLog, setSelectedLog] = useState<string | null>("LOG-001")
  
  // Feature States
  const [searchQuery, setSearchQuery] = useState("")
  const [userFilter, setUserFilter] = useState("All Users")
  const [actionFilter, setActionFilter] = useState("All Actions")
  const [moduleFilter, setModuleFilter] = useState("All Modules")
  const [severityFilter, setSeverityFilter] = useState("All Severity")

  // Derived Data (Filtering)
  const filteredLogs = useMemo(() => {
    let result = [...logs]
    
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      result = result.filter(l => 
        l.resource.toLowerCase().includes(q) || 
        l.resourceId.toLowerCase().includes(q) ||
        l.user.toLowerCase().includes(q) ||
        l.ip.toLowerCase().includes(q)
      )
    }
    if (userFilter !== "All Users") result = result.filter(l => l.user === userFilter)
    if (actionFilter !== "All Actions") result = result.filter(l => l.action === actionFilter)
    if (moduleFilter !== "All Modules") result = result.filter(l => l.module === moduleFilter)
    if (severityFilter !== "All Severity") result = result.filter(l => l.severity === severityFilter)

    return result
  }, [logs, searchQuery, userFilter, actionFilter, moduleFilter, severityFilter])

  // Helpers
  const getSeverityColor = (severity: string) => {
    if (severity === "Info") return "text-blue-500 bg-background shadow-neu-inset-small"
    if (severity === "Warning") return "text-amber-500 bg-background shadow-neu-inset-small"
    if (severity === "Critical") return "text-red-500 bg-background shadow-neu-inset-small"
    return "text-gray-500 bg-background shadow-neu-inset-small"
  }

  const getActionColor = (action: string) => {
    if (action === "Updated") return "text-blue-500 bg-background shadow-neu-inset-small"
    if (action === "Created") return "text-green-500 bg-background shadow-neu-inset-small"
    if (action === "Deleted") return "text-red-500 bg-background shadow-neu-inset-small"
    if (action === "Moved") return "text-purple-500 bg-background shadow-neu-inset-small"
    if (action === "Role Changed") return "text-amber-500 bg-background shadow-neu-inset-small"
    if (action === "Login Failed") return "text-red-500 bg-background shadow-neu-inset-small"
    if (action === "Viewed") return "text-gray-500 bg-background shadow-neu-inset-small"
    return "text-gray-500 bg-background shadow-neu-inset-small"
  }

  const activeLogData = logs.find(l => l.id === selectedLog)

  // Dynamic Options for Selects
  const uniqueUsers = ["All Users", ...Array.from(new Set(logs.map(l => l.user)))]
  const uniqueActions = ["All Actions", ...Array.from(new Set(logs.map(l => l.action)))]
  const uniqueModules = ["All Modules", ...Array.from(new Set(logs.map(l => l.module)))]
  const uniqueSeverity = ["All Severity", ...Array.from(new Set(logs.map(l => l.severity)))]

  return (
    <div className="flex w-full gap-6 pb-6 h-full">
      <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${selectedLog ? 'pr-0' : ''}`}>
        
        {/* Breadcrumb & Header */}
        <div className="flex flex-col xl:flex-row xl:items-start justify-between mb-6 gap-4">
          <div>
            <div className="flex flex-wrap items-center text-xs text-muted-foreground mb-2 font-medium">
              <MapPin size={12} className="mr-1" />
              <span>Management</span>
              <ChevronRight size={12} className="mx-1" />
              <span className="text-foreground font-bold">Audit Logs</span>
            </div>
            <h1 className="text-3xl font-bold text-foreground tracking-tight mb-1">Audit Logs</h1>
            <p className="text-sm text-muted-foreground font-medium">Track and review all system activities and changes</p>
          </div>
          <div className="flex gap-4 flex-wrap">
            <Button variant="ghost" className="bg-background shadow-neu-extruded text-foreground hover:text-accent hover:shadow-neu-hover active:shadow-neu-inset-small rounded-2xl flex items-center gap-2 h-12 px-6 transition-all font-bold whitespace-nowrap">
              <Upload size={18} />
              Export
            </Button>
            <Button variant="ghost" className="bg-background shadow-neu-extruded text-foreground hover:text-accent hover:shadow-neu-hover active:shadow-neu-inset-small rounded-2xl flex items-center gap-2 h-12 px-6 transition-all font-bold whitespace-nowrap">
              <Filter size={18} className="text-accent" />
              Filters
              <ChevronRight size={16} className="ml-1 rotate-90" />
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-4 mb-6">
          <div className="bg-background shadow-neu-extruded border-neu rounded-[20px] p-4 flex items-center gap-3 min-w-0">
            <div className="w-12 h-12 rounded-2xl bg-background shadow-neu-inset-small flex items-center justify-center shrink-0">
              <ShieldCheck className="text-blue-500" size={20} />
            </div>
            <div className="min-w-0 overflow-hidden">
              <p className="text-[10px] font-bold text-muted-foreground mb-0.5 uppercase tracking-wider truncate">Total Logs</p>
              <div className="flex items-baseline gap-1 truncate">
                <span className="text-2xl font-black text-foreground">1,248</span>
              </div>
              <p className="text-[9px] font-medium text-muted-foreground mt-0.5 truncate">All time activities</p>
            </div>
          </div>
          <div className="bg-background shadow-neu-extruded border-neu rounded-[20px] p-4 flex items-center gap-3 min-w-0">
            <div className="w-12 h-12 rounded-2xl bg-background shadow-neu-inset-small flex items-center justify-center shrink-0">
              <CalendarDays className="text-green-500" size={20} />
            </div>
            <div className="min-w-0 overflow-hidden">
              <p className="text-[10px] font-bold text-muted-foreground mb-0.5 uppercase tracking-wider truncate">This Month</p>
              <div className="flex items-baseline gap-1 truncate">
                <span className="text-2xl font-black text-foreground">248</span>
              </div>
              <p className="text-[9px] font-medium text-muted-foreground mt-0.5 truncate">Logs this month</p>
            </div>
          </div>
          <div className="bg-background shadow-neu-extruded border-neu rounded-[20px] p-4 flex items-center gap-3 min-w-0">
            <div className="w-12 h-12 rounded-2xl bg-background shadow-neu-inset-small flex items-center justify-center shrink-0">
              <ShieldCheck className="text-purple-500" size={20} />
            </div>
            <div className="min-w-0 overflow-hidden">
              <p className="text-[10px] font-bold text-muted-foreground mb-0.5 uppercase tracking-wider truncate">Today</p>
              <div className="flex items-baseline gap-1 truncate">
                <span className="text-2xl font-black text-foreground">32</span>
              </div>
              <p className="text-[9px] font-medium text-muted-foreground mt-0.5 truncate">Logs today</p>
            </div>
          </div>
          <div className="bg-background shadow-neu-extruded border-neu rounded-[20px] p-4 flex items-center gap-3 min-w-0">
            <div className="w-12 h-12 rounded-2xl bg-background shadow-neu-inset-small flex items-center justify-center shrink-0">
              <AlertTriangle className="text-amber-500" size={20} />
            </div>
            <div className="min-w-0 overflow-hidden">
              <p className="text-[10px] font-bold text-muted-foreground mb-0.5 uppercase tracking-wider truncate">Warnings</p>
              <div className="flex items-baseline gap-1 truncate">
                <span className="text-2xl font-black text-foreground">18</span>
              </div>
              <p className="text-[9px] font-medium text-muted-foreground mt-0.5 truncate">Warning activities</p>
            </div>
          </div>
          <div className="bg-background shadow-neu-extruded border-neu rounded-[20px] p-4 flex items-center gap-3 min-w-0">
            <div className="w-12 h-12 rounded-2xl bg-background shadow-neu-inset-small flex items-center justify-center shrink-0">
              <ShieldAlert className="text-red-500" size={20} />
            </div>
            <div className="min-w-0 overflow-hidden">
              <p className="text-[10px] font-bold text-muted-foreground mb-0.5 uppercase tracking-wider truncate">Critical</p>
              <div className="flex items-baseline gap-1 truncate">
                <span className="text-2xl font-black text-foreground">3</span>
              </div>
              <p className="text-[9px] font-medium text-muted-foreground mt-0.5 truncate">Critical activities</p>
            </div>
          </div>
        </div>

        {/* Filters bar */}
        <div className="flex flex-wrap items-center gap-4 mb-6">
          <div className="relative flex-1 min-w-[150px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input 
              placeholder="Search logs..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 bg-background shadow-neu-inset-deep border-t border-l border-[#A3B1C6]/30 border-b border-r border-white/60 h-10 rounded-xl text-xs font-medium focus-visible:ring-0 focus-visible:border-accent"
            />
            {searchQuery && (
              <X 
                size={16} 
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground cursor-pointer hover:text-foreground"
                onClick={() => setSearchQuery("")}
              />
            )}
          </div>
          
          <select 
            value={userFilter}
            onChange={(e) => setUserFilter(e.target.value)}
            className="h-10 px-3 bg-background shadow-neu-extruded border-neu rounded-xl text-xs font-bold text-foreground outline-none appearance-none pr-8 relative bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%236B7280%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-[length:14px_14px] bg-[right_12px_center] bg-no-repeat min-w-[110px] cursor-pointer hover:shadow-neu-hover transition-all"
          >
            {uniqueUsers.map(u => <option key={u} value={u}>{u}</option>)}
          </select>
          
          <select 
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
            className="h-10 px-3 bg-background shadow-neu-extruded border-neu rounded-xl text-xs font-bold text-foreground outline-none appearance-none pr-8 relative bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%236B7280%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-[length:14px_14px] bg-[right_12px_center] bg-no-repeat min-w-[110px] cursor-pointer hover:shadow-neu-hover transition-all"
          >
            {uniqueActions.map(a => <option key={a} value={a}>{a}</option>)}
          </select>

          <select 
            value={moduleFilter}
            onChange={(e) => setModuleFilter(e.target.value)}
            className="h-10 px-3 bg-background shadow-neu-extruded border-neu rounded-xl text-xs font-bold text-foreground outline-none appearance-none pr-8 relative bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%236B7280%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-[length:14px_14px] bg-[right_12px_center] bg-no-repeat min-w-[110px] cursor-pointer hover:shadow-neu-hover transition-all"
          >
            {uniqueModules.map(m => <option key={m} value={m}>{m}</option>)}
          </select>

          <select 
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className="h-10 px-3 bg-background shadow-neu-extruded border-neu rounded-xl text-xs font-bold text-foreground outline-none appearance-none pr-8 relative bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%236B7280%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-[length:14px_14px] bg-[right_12px_center] bg-no-repeat min-w-[110px] cursor-pointer hover:shadow-neu-hover transition-all"
          >
            {uniqueSeverity.map(s => <option key={s} value={s}>{s}</option>)}
          </select>

          <div className="bg-background shadow-neu-inset-deep border-t border-l border-[#A3B1C6]/30 border-b border-r border-white/60 h-10 rounded-xl px-3 flex items-center justify-between text-xs font-bold text-foreground min-w-[180px]">
            <CalendarDays size={14} className="text-muted-foreground mr-2" />
            <span>01 May 2025</span>
            <ChevronRight size={12} className="text-muted-foreground mx-1" />
            <span>31 May 2025</span>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 flex flex-col">
          {/* Table View */}
          <div className="flex flex-col gap-4 mb-2">
            <div className="bg-background shadow-neu-extruded border-neu rounded-[32px] flex flex-col overflow-hidden">
              <div className="overflow-x-auto w-full">
                <table className="w-full text-sm text-left min-w-[1100px]">
                  <thead className="text-[10px] text-muted-foreground uppercase bg-background shadow-neu-inset-small sticky top-0 z-10">
                    <tr>
                      <th className="px-5 py-4 font-bold whitespace-nowrap tracking-wider">Timestamp</th>
                      <th className="px-5 py-4 font-bold whitespace-nowrap tracking-wider">User</th>
                      <th className="px-5 py-4 font-bold whitespace-nowrap tracking-wider">Action</th>
                      <th className="px-5 py-4 font-bold whitespace-nowrap tracking-wider">Module</th>
                      <th className="px-5 py-4 font-bold whitespace-nowrap tracking-wider">Resource</th>
                      <th className="px-5 py-4 font-bold whitespace-nowrap tracking-wider">Resource ID</th>
                      <th className="px-5 py-4 font-bold whitespace-nowrap tracking-wider">IP Address</th>
                      <th className="px-5 py-4 font-bold whitespace-nowrap tracking-wider">Severity</th>
                      <th className="px-5 py-4 font-bold whitespace-nowrap text-right tracking-wider"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredLogs.map((log) => (
                      <tr 
                        key={log.id} 
                        className={`border-b border-[#A3B1C6]/20 cursor-pointer transition-all duration-300 ${selectedLog === log.id ? 'shadow-neu-inset-small bg-background' : 'hover:shadow-neu-inset-small'}`}
                        onClick={() => setSelectedLog(log.id)}
                      >
                        <td className="px-5 py-4 whitespace-nowrap font-medium text-xs">{log.timestamp}</td>
                        <td className="px-5 py-4 flex items-center gap-2">
                          <img src={log.userAvatar} alt={log.user} className="w-7 h-7 rounded-full border border-background shadow-neu-extruded object-cover" />
                          <div className="min-w-0">
                            <p className="font-bold text-xs text-foreground whitespace-nowrap truncate">{log.user}</p>
                            <p className="text-[9px] text-muted-foreground font-medium mt-0.5 whitespace-nowrap truncate">{log.userRole}</p>
                          </div>
                        </td>
                        <td className="px-5 py-4 whitespace-nowrap">
                          <span className={`px-2 py-0.5 text-[9px] rounded-lg font-bold ${getActionColor(log.action)}`}>
                            {log.action}
                          </span>
                        </td>
                        <td className="px-5 py-4 whitespace-nowrap font-medium text-xs text-foreground">{log.module}</td>
                        <td className="px-5 py-4 whitespace-nowrap font-medium text-xs text-foreground">{log.resource}</td>
                        <td className="px-5 py-4 whitespace-nowrap font-bold text-xs text-muted-foreground">{log.resourceId}</td>
                        <td className="px-5 py-4 whitespace-nowrap font-medium text-xs text-foreground">{log.ip}</td>
                        <td className="px-5 py-4 whitespace-nowrap">
                          <span className={`px-2 py-0.5 text-[9px] rounded-lg font-bold ${getSeverityColor(log.severity)}`}>
                            {log.severity}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-right whitespace-nowrap relative">
                          <Button variant="ghost" size="icon" className="h-6 w-6 rounded-lg text-muted-foreground hover:text-accent hover:shadow-neu-extruded transition-all">
                            <MoreVertical size={14} />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            
            <div className="bg-background shadow-neu-extruded rounded-[24px] p-4 flex flex-wrap gap-4 items-center justify-between text-sm text-muted-foreground font-medium shrink-0">
              <div className="text-xs">Showing 1 to 10 of 1,248 logs</div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg shadow-neu-extruded text-muted-foreground opacity-50 cursor-not-allowed">
                    <ChevronLeft size={14} />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg shadow-neu-extruded bg-accent text-white hover:bg-accent/90 hover:text-white font-bold text-xs">
                    1
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg shadow-neu-extruded text-muted-foreground hover:text-foreground text-xs">
                    2
                  </Button>
                  <span className="px-1 text-xs">...</span>
                  <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg shadow-neu-extruded text-muted-foreground hover:text-foreground text-xs">
                    125
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg shadow-neu-extruded text-muted-foreground hover:text-foreground text-xs">
                    <ChevronRight size={14} />
                  </Button>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl shadow-neu-extruded cursor-pointer hover:shadow-neu-hover text-xs">
                  <span className="font-bold text-foreground">10 / page</span>
                  <ChevronRight size={12} className="rotate-90 text-muted-foreground" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side Panel */}
      {selectedLog && activeLogData && (
        <div className="w-[360px] bg-background shadow-neu-extruded border-neu rounded-[32px] flex flex-col h-full overflow-hidden shrink-0 transition-all mb-2 animate-in slide-in-from-right-8 duration-300">
          
          <div className="p-5 flex justify-between items-center border-b border-[#A3B1C6]/20">
            <h3 className="font-bold text-foreground text-sm">Log Details</h3>
            <Button variant="ghost" size="icon" className="h-6 w-6 rounded-md shadow-neu-extruded bg-background text-foreground hover:text-red-500 hover:shadow-neu-hover active:shadow-neu-inset-small" onClick={() => setSelectedLog(null)}>
              <X size={12} />
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto p-5 relative space-y-6 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            
            <div>
              <span className={`px-2 py-0.5 text-[9px] rounded-lg font-bold mb-2 inline-block ${getSeverityColor(activeLogData.severity)}`}>
                {activeLogData.severity}
              </span>
              <p className="text-xs font-bold text-foreground">{activeLogData.timestamp}</p>
            </div>

            <div className="grid grid-cols-[100px_1fr] gap-y-4 text-xs">
              <div className="text-muted-foreground font-medium">Action</div>
              <div className="text-foreground font-bold">{activeLogData.action}</div>
              
              <div className="text-muted-foreground font-medium">Module</div>
              <div className="text-foreground font-bold">{activeLogData.module}</div>
              
              <div className="text-muted-foreground font-medium">Resource</div>
              <div className="text-foreground font-bold">{activeLogData.resource}</div>
              
              <div className="text-muted-foreground font-medium">Resource ID</div>
              <div className="text-foreground font-bold">{activeLogData.resourceId}</div>
              
              <div className="text-muted-foreground font-medium">User</div>
              <div className="flex items-center gap-2">
                <img src={activeLogData.userAvatar} alt={activeLogData.user} className="w-5 h-5 rounded-full border border-background shadow-neu-extruded" />
                <div>
                  <div className="text-foreground font-bold leading-none">{activeLogData.user}</div>
                  <div className="text-[9px] text-muted-foreground mt-0.5">{activeLogData.userRole}</div>
                </div>
              </div>
              
              <div className="text-muted-foreground font-medium mt-2">IP Address</div>
              <div className="text-foreground font-bold mt-2">{activeLogData.ip}</div>
            </div>

            <div>
              <div className="text-muted-foreground font-medium text-xs mb-1">User Agent</div>
              <div className="text-[10px] text-foreground font-medium leading-relaxed bg-background shadow-neu-inset-small p-3 rounded-xl">
                {activeLogData.userAgent}
              </div>
            </div>

            <div>
              <div className="text-muted-foreground font-medium text-xs mb-1">Description</div>
              <div className="text-xs text-foreground font-bold leading-relaxed">
                {activeLogData.description}
              </div>
            </div>

            {activeLogData.changes && activeLogData.changes.length > 0 && (
              <div>
                <h4 className="font-bold text-foreground text-xs mb-3 flex items-center gap-2"><Info size={14} className="text-accent" /> Changes</h4>
                <div className="space-y-4 bg-background shadow-neu-extruded p-4 rounded-2xl border-neu">
                  {activeLogData.changes.map((change, i) => (
                    <div key={i}>
                      <div className="text-[10px] text-muted-foreground font-bold mb-1.5">{change.field}</div>
                      <div className="flex items-center gap-2 text-[10px]">
                        <span className={`px-2 py-1 rounded-lg font-bold shadow-neu-inset-small bg-background ${change.field === 'Status' && change.from === 'Active' ? 'text-green-500' : 'text-blue-500'}`}>
                          {change.from}
                        </span>
                        <ChevronRight size={10} className="text-muted-foreground" />
                        <span className={`px-2 py-1 rounded-lg font-bold shadow-neu-inset-small bg-background ${change.field === 'Status' && change.to === 'Maintenance' ? 'text-amber-500' : 'text-blue-500'}`}>
                          {change.to}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

          <div className="p-5 border-t border-[#A3B1C6]/20 shrink-0">
            <Button className="w-full h-12 bg-accent hover:bg-accent/90 text-white shadow-neu-extruded hover:shadow-neu-hover active:shadow-neu-inset-small rounded-2xl font-bold text-sm transition-all border-none">
              View Resource
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
