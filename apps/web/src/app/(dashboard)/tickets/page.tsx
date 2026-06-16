"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Search, AlertCircle, CheckCircle2, Clock, Wrench, X, Server } from "lucide-react"
import { apiClient } from "@/lib/api-client"
import { HeroSection } from "@/components/ui/hero-section"
import { useRouter } from "next/navigation"

export default function TicketsPage() {
  const [tickets, setTickets] = useState<any[]>([])
  const [assets, setAssets] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [formData, setFormData] = useState({ 
    title: "", 
    description: "", 
    priority: "Medium", 
    type: "Request", 
    assetId: "" 
  })

  const fetchTickets = async () => {
    try {
      setIsLoading(true)
      const [ticketsRes, assetsRes] = await Promise.all([
        apiClient.get('/tickets'),
        apiClient.get('/assets')
      ])
      setTickets(ticketsRes.data)
      setAssets(assetsRes.data)
    } catch (err) {
      console.error("Failed to fetch data", err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchTickets()
  }, [])

  const handleSave = async () => {
    if (!formData.title || !formData.description) return alert("Title and Description are required.")
    try {
      await apiClient.post('/tickets', formData)
      setIsDrawerOpen(false)
      setFormData({ title: "", description: "", priority: "Medium", type: "Request", assetId: "" })
      fetchTickets()
    } catch (err) {
      alert("Failed to create ticket.")
    }
  }

  const getPriorityColor = (priority: string) => {
    switch(priority) {
      case 'Critical': return 'text-red-500 bg-red-500/10'
      case 'High': return 'text-orange-500 bg-orange-500/10'
      case 'Medium': return 'text-yellow-500 bg-yellow-500/10'
      case 'Low': return 'text-green-500 bg-green-500/10'
      default: return 'text-gray-500 bg-gray-500/10'
    }
  }

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'Open': return <AlertCircle className="w-5 h-5 text-red-500" />
      case 'In Progress': return <Clock className="w-5 h-5 text-yellow-500" />
      case 'Resolved': return <CheckCircle2 className="w-5 h-5 text-green-500" />
      default: return <AlertCircle className="w-5 h-5" />
    }
  }

  const [searchQuery, setSearchQuery] = useState("")

  const filteredTickets = tickets.filter(t => 
    t.title?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    t.id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.asset?.tag?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="relative min-h-[calc(100vh-80px)] overflow-hidden flex flex-col space-y-8 pb-10">
      <div className="flex-1 overflow-y-auto w-full">
        <HeroSection 
          title="Helpdesk & Incident Management" 
          subtitle="Track infrastructure issues, coordinate repairs, and monitor SLA resolution times."
          icon={<Wrench className="w-8 h-8 text-accent" />}
          imageSrc="/images/heroes/tickets.png"
        />

        <div className="max-w-[1400px] mx-auto px-8 mt-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div className="relative w-full md:w-96">
              <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search tickets by title, ID, or Asset tag..." 
                className="w-full h-12 bg-background shadow-neu-inset rounded-2xl pl-12 pr-4 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-accent/50 text-foreground"
              />
            </div>
            <Button onClick={() => setIsDrawerOpen(true)} className="h-12 px-6 rounded-2xl shadow-neu-extruded bg-accent text-white font-bold hover:bg-accent-light">
              <Plus className="w-5 h-5 mr-2" /> New Ticket
            </Button>
          </div>

          {isLoading ? (
            <div className="p-12 text-center text-muted-foreground font-bold">Loading Tickets...</div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Kanban Columns */}
              
              {/* OPEN */}
              <div className="bg-background shadow-neu-inset rounded-3xl p-6">
                <h3 className="text-sm font-black text-muted-foreground uppercase tracking-wider mb-6 flex items-center justify-between">
                  <span>Open</span>
                  <span className="bg-red-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs">{filteredTickets.filter(t => t.status === 'Open').length}</span>
                </h3>
                <div className="space-y-4 max-h-[600px] overflow-y-auto [&::-webkit-scrollbar]:hidden pr-2">
                  {filteredTickets.filter(t => t.status === 'Open').map(ticket => (
                    <Card key={ticket.id} onClick={() => router.push(`/tickets/${ticket.id}`)} className="rounded-2xl border-none shadow-neu-extruded bg-background cursor-pointer hover:scale-[1.02] transition-transform">
                      <CardContent className="p-5">
                        <div className="flex justify-between items-start mb-2">
                          <span className={`text-xs font-bold px-2 py-1 rounded-md uppercase tracking-wider ${getPriorityColor(ticket.priority)}`}>
                            {ticket.priority}
                          </span>
                          {getStatusIcon(ticket.status)}
                        </div>
                        <h4 className="font-bold text-foreground mb-1 line-clamp-2">{ticket.title}</h4>
                        <p className="text-xs text-muted-foreground mb-4 line-clamp-2">{ticket.description}</p>
                        
                        <div className="flex justify-between items-center text-xs font-medium">
                          <span className="text-accent">{ticket.asset?.tag || 'No Asset'}</span>
                          <span className="text-muted-foreground">{new Date(ticket.createdAt).toLocaleDateString()}</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* IN PROGRESS */}
              <div className="bg-background shadow-neu-inset rounded-3xl p-6">
                <h3 className="text-sm font-black text-muted-foreground uppercase tracking-wider mb-6 flex items-center justify-between">
                  <span>In Progress</span>
                  <span className="bg-yellow-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs">{filteredTickets.filter(t => t.status === 'In Progress').length}</span>
                </h3>
                <div className="space-y-4 max-h-[600px] overflow-y-auto [&::-webkit-scrollbar]:hidden pr-2">
                  {filteredTickets.filter(t => t.status === 'In Progress').map(ticket => (
                    <Card key={ticket.id} onClick={() => router.push(`/tickets/${ticket.id}`)} className="rounded-2xl border-none shadow-neu-extruded bg-background cursor-pointer hover:scale-[1.02] transition-transform">
                      <CardContent className="p-5">
                        <div className="flex justify-between items-start mb-2">
                          <span className={`text-xs font-bold px-2 py-1 rounded-md uppercase tracking-wider ${getPriorityColor(ticket.priority)}`}>
                            {ticket.priority}
                          </span>
                          {getStatusIcon(ticket.status)}
                        </div>
                        <h4 className="font-bold text-foreground mb-1 line-clamp-2">{ticket.title}</h4>
                        <div className="flex justify-between items-center mt-4 text-xs font-medium">
                          <span className="text-accent">{ticket.asset?.tag || 'No Asset'}</span>
                          <span className="text-muted-foreground truncate max-w-[120px]">{ticket.assignedTo || 'Unassigned'}</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* RESOLVED */}
              <div className="bg-background shadow-neu-inset rounded-3xl p-6">
                <h3 className="text-sm font-black text-muted-foreground uppercase tracking-wider mb-6 flex items-center justify-between">
                  <span>Resolved</span>
                  <span className="bg-green-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs">{filteredTickets.filter(t => t.status === 'Resolved').length}</span>
                </h3>
                <div className="space-y-4 max-h-[600px] overflow-y-auto [&::-webkit-scrollbar]:hidden pr-2">
                  {filteredTickets.filter(t => t.status === 'Resolved').map(ticket => (
                    <Card key={ticket.id} onClick={() => router.push(`/tickets/${ticket.id}`)} className="rounded-2xl border-none shadow-neu-extruded bg-background cursor-pointer hover:scale-[1.02] transition-transform opacity-75">
                      <CardContent className="p-5">
                        <div className="flex justify-between items-start mb-2">
                          <span className={`text-xs font-bold px-2 py-1 rounded-md uppercase tracking-wider ${getPriorityColor(ticket.priority)}`}>
                            {ticket.priority}
                          </span>
                          {getStatusIcon(ticket.status)}
                        </div>
                        <h4 className="font-bold text-foreground mb-1 line-clamp-2 line-through decoration-muted-foreground/50">{ticket.title}</h4>
                        <p className="text-xs text-green-600 font-bold mt-2 bg-green-500/10 p-2 rounded-lg line-clamp-2">{ticket.resolutionNotes || 'Resolved.'}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

            </div>
          )}
        </div>
      </div>

      {/* Drawer */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setIsDrawerOpen(false)}></div>
          
          <div className="relative w-full max-w-xl h-full bg-background shadow-[-10px_0_30px_rgba(0,0,0,0.1)] border-l border-white/50 flex flex-col animate-in slide-in-from-right duration-300">
            <div className="px-8 py-6 flex justify-between items-center border-b border-[#A3B1C6]/20">
              <div>
                <h2 className="text-2xl font-bold text-foreground">Create New Ticket</h2>
                <p className="text-sm text-muted-foreground font-medium">Report an incident or request service</p>
              </div>
              <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl hover:bg-red-50 hover:text-red-500 hover:shadow-neu-inset transition-all" onClick={() => setIsDrawerOpen(false)}>
                <X className="w-5 h-5" />
              </Button>
            </div>

            <div className="flex-1 overflow-y-auto px-8 py-6 space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Ticket Title *</label>
                <input 
                  type="text" 
                  value={formData.title} 
                  onChange={e => setFormData({...formData, title: e.target.value})} 
                  placeholder="e.g. Server Unreachable, RAM Upgrade..."
                  className="w-full h-12 px-4 bg-background shadow-neu-inset border-none rounded-xl text-sm font-bold text-foreground focus:ring-2 focus:ring-accent/50 outline-none" 
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Description *</label>
                <textarea 
                  value={formData.description} 
                  onChange={e => setFormData({...formData, description: e.target.value})} 
                  placeholder="Provide detailed information about the issue..."
                  className="w-full h-32 p-4 bg-background shadow-neu-inset border-none rounded-xl text-sm font-medium text-foreground focus:ring-2 focus:ring-accent/50 outline-none resize-none" 
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Priority</label>
                  <select 
                    value={formData.priority} 
                    onChange={e => setFormData({...formData, priority: e.target.value})} 
                    className="w-full h-12 px-4 bg-background shadow-neu-inset border-none rounded-xl text-sm font-bold text-foreground focus:ring-2 focus:ring-accent/50 outline-none appearance-none cursor-pointer"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Critical">Critical</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Type</label>
                  <select 
                    value={formData.type} 
                    onChange={e => setFormData({...formData, type: e.target.value})} 
                    className="w-full h-12 px-4 bg-background shadow-neu-inset border-none rounded-xl text-sm font-bold text-foreground focus:ring-2 focus:ring-accent/50 outline-none appearance-none cursor-pointer"
                  >
                    <option value="Request">Request</option>
                    <option value="Repair">Repair</option>
                    <option value="Maintenance">Maintenance</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Affected Asset</label>
                <div className="relative">
                  <Server className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground z-10" />
                  <select 
                    value={formData.assetId} 
                    onChange={e => setFormData({...formData, assetId: e.target.value})} 
                    className="w-full h-12 pl-10 pr-4 bg-background shadow-neu-inset border-none rounded-xl text-sm font-bold text-foreground focus:ring-2 focus:ring-accent/50 outline-none appearance-none cursor-pointer"
                  >
                    <option value="">No specific asset / General</option>
                    {assets.map(a => <option key={a.id} value={a.id}>{a.tag} - {a.hostname}</option>)}
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground">
                    ▼
                  </div>
                </div>
              </div>
            </div>

            <div className="px-8 py-6 border-t border-[#A3B1C6]/20 bg-background flex justify-end gap-4">
              <Button variant="outline" className="h-12 px-8 rounded-2xl shadow-neu-extruded border-none font-bold text-foreground hover:text-accent transition-all" onClick={() => setIsDrawerOpen(false)}>Cancel</Button>
              <Button onClick={handleSave} className="h-12 px-8 rounded-2xl border border-accent/50 font-bold text-white bg-accent shadow-[inset_2px_2px_4px_rgba(255,255,255,0.4),inset_-2px_-2px_4px_rgba(0,0,0,0.2),0_4px_10px_rgba(108,99,255,0.3)] hover:bg-accent-light transition-all">
                Submit Ticket
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
