"use client"

import { useState, useEffect } from "react"
import { HeroSection } from "@/components/ui/hero-section"
import { Button } from "@/components/ui/button"
import { 
  Plus, 
  Wrench, 
  CalendarDays, 
  CheckCircle2, 
  AlertTriangle, 
  MoreVertical,
  Clock,
  User
} from "lucide-react"

import { apiClient } from "@/lib/api-client"

export default function MaintenancePage() {
  const [activeTab, setActiveTab] = useState("Helpdesk Tickets")
  
  const [tickets, setTickets] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [assets, setAssets] = useState<any[]>([])
  
  const fetchTickets = async () => {
    try {
      const res = await apiClient.get('/tickets');
      setTickets(res.data);
    } catch (err) {
      console.error("Failed to fetch tickets", err);
    } finally {
      setIsLoading(false);
    }
  }

  const fetchAssets = async () => {
    try {
      const res = await apiClient.get('/assets');
      setAssets(res.data);
    } catch (err) {
      console.error("Failed to fetch assets", err);
    }
  }

  useEffect(() => {
    fetchTickets();
    fetchAssets();
  }, []);

  const uniqueStatuses = Array.from(new Set(tickets.map(t => t.status)));
  const columns = Array.from(new Set(["Open", "In Progress", "Closed", ...uniqueStatuses]));

  const getPriorityColor = (priority: string) => {
    switch(priority) {
      case "High": return "text-red-500 bg-red-500/10 border-red-500/20";
      case "Medium": return "text-amber-500 bg-amber-500/10 border-amber-500/20";
      case "Low": return "text-green-500 bg-green-500/10 border-green-500/20";
      default: return "text-muted-foreground bg-secondary";
    }
  }

  return (
    <div className="flex w-full gap-6 pb-6">
      <div className="flex-1 flex flex-col min-w-0 transition-all duration-300">
        
        {/* Header */}
        <HeroSection
          title="Maintenance & Work Orders"
          description="Manage helpdesk tickets, repairs, and preventative maintenance schedules."
          imageSrc="/images/heroes/maintenance.png"
        >
          <div className="flex gap-4 flex-wrap">
            <Button variant="ghost" className="bg-background/50 backdrop-blur-md shadow-neu-extruded text-foreground hover:text-accent hover:shadow-neu-hover active:shadow-neu-inset-small rounded-2xl flex items-center gap-2 h-12 px-6 transition-all font-bold whitespace-nowrap">
              <CalendarDays size={18} />
              Calendar View
            </Button>
            <Button onClick={() => setIsModalOpen(true)} className="bg-accent hover:bg-accent/90 text-white shadow-neu-extruded hover:shadow-neu-hover active:shadow-neu-inset-small rounded-2xl flex items-center gap-2 h-12 px-6 transition-all font-bold border-none whitespace-nowrap">
              <Plus size={18} />
              New Ticket
            </Button>
          </div>
        </HeroSection>

        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            <div className="bg-background shadow-neu-extruded border-neu rounded-[32px] p-8 max-w-lg w-full max-h-[90vh] overflow-y-auto">
              <h2 className="text-2xl font-bold text-foreground mb-6">Create New Ticket</h2>
              <form onSubmit={async (e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                try {
                  await apiClient.post('/tickets', {
                    title: formData.get('title'),
                    description: formData.get('description'),
                    priority: formData.get('priority'),
                    assetId: formData.get('assetId') || null,
                    assignedTo: formData.get('assignedTo')
                  });
                  setIsModalOpen(false);
                  fetchTickets();
                } catch (err) {
                  console.error(err);
                }
              }}>
                <div className="space-y-4 mb-8">
                  <div>
                    <label className="text-xs font-bold text-muted-foreground uppercase mb-2 block">Title</label>
                    <input type="text" name="title" required className="w-full h-12 px-4 rounded-xl bg-background shadow-neu-inset border-neu focus:outline-none font-medium text-sm text-foreground" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-muted-foreground uppercase mb-2 block">Description</label>
                    <textarea name="description" required className="w-full h-24 p-4 rounded-xl bg-background shadow-neu-inset border-neu focus:outline-none font-medium text-sm text-foreground" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-muted-foreground uppercase mb-2 block">Priority</label>
                      <select name="priority" className="w-full h-12 px-4 rounded-xl bg-background shadow-neu-inset border-neu focus:outline-none font-medium text-sm text-foreground appearance-none">
                        <option value="High">High</option>
                        <option value="Medium">Medium</option>
                        <option value="Low">Low</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-muted-foreground uppercase mb-2 block">Assign To</label>
                      <input type="text" name="assignedTo" className="w-full h-12 px-4 rounded-xl bg-background shadow-neu-inset border-neu focus:outline-none font-medium text-sm text-foreground" />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-muted-foreground uppercase mb-2 block">Linked Asset (Optional)</label>
                    <select name="assetId" className="w-full h-12 px-4 rounded-xl bg-background shadow-neu-inset border-neu focus:outline-none font-medium text-sm text-foreground appearance-none">
                      <option value="">No Asset</option>
                      {assets.map(a => <option key={a.id} value={a.id}>{a.tag} - {a.hostname}</option>)}
                    </select>
                  </div>
                </div>
                <div className="flex gap-4 justify-end">
                  <Button type="button" variant="outline" className="shadow-neu-extruded h-12 px-6 rounded-xl font-bold" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                  <Button type="submit" className="shadow-neu-extruded h-12 px-6 rounded-xl font-bold">Create Ticket</Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="flex border-b border-[#A3B1C6]/30 mb-6 overflow-x-auto [&::-webkit-scrollbar]:hidden">
          {["Helpdesk Tickets", "Preventative Schedule"].map(tab => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 text-sm font-bold whitespace-nowrap transition-colors border-b-2 flex items-center gap-2 ${activeTab === tab ? 'text-accent border-accent' : 'text-muted-foreground hover:text-foreground border-transparent'}`}
            >
              {tab === "Helpdesk Tickets" ? <Wrench size={16} /> : <CalendarDays size={16} />}
              {tab}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="flex-1 pr-2 pb-10 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          
          {activeTab === "Helpdesk Tickets" && (
            <div className="min-h-[600px]">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {columns.map(status => {
                  const colTickets = tickets.filter(t => t.status === status)
                  return (
                    <div key={status} className="flex flex-col bg-[#A3B1C6]/5 rounded-[32px] border-2 border-dashed border-[#A3B1C6]/20 p-4">
                      <div className="flex items-center justify-between mb-4 px-2">
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-foreground">{status}</h3>
                          <span className="text-xs font-bold bg-background shadow-neu-inset-small px-2 py-0.5 rounded-full text-muted-foreground border border-white/50">{colTickets.length}</span>
                        </div>
                        <Button variant="ghost" size="icon" className="w-8 h-8 rounded-xl">
                          <Plus size={16} />
                        </Button>
                      </div>

                      <div className="flex-1 space-y-4 max-h-[600px] overflow-y-auto [&::-webkit-scrollbar]:hidden pb-4">
                        {colTickets.map(ticket => (
                          <div key={ticket.id} className="bg-background shadow-neu-extruded border-neu rounded-2xl p-4 transition-all relative group">
                            <div className="flex justify-between items-start mb-3">
                              <span className={`text-[10px] font-bold px-2 py-1 rounded-md border ${getPriorityColor(ticket.priority)} uppercase tracking-wider`}>
                                {ticket.priority}
                              </span>
                              
                              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                {status !== "Open" && (
                                  <button onClick={async () => {
                                    const prev = status === "Closed" ? "In Progress" : "Open";
                                    await apiClient.put(`/tickets/${ticket.id}`, { status: prev });
                                    fetchTickets();
                                  }} className="text-xs font-bold text-muted-foreground hover:text-foreground px-2 py-1 bg-background shadow-neu-extruded rounded">
                                    ←
                                  </button>
                                )}
                                {status !== "Closed" && (
                                  <button onClick={async () => {
                                    const next = status === "Open" ? "In Progress" : "Closed";
                                    await apiClient.put(`/tickets/${ticket.id}`, { status: next });
                                    fetchTickets();
                                  }} className="text-xs font-bold text-accent hover:text-accent-light px-2 py-1 bg-background shadow-neu-extruded rounded">
                                    →
                                  </button>
                                )}
                              </div>
                            </div>
                            
                            <h4 className="font-bold text-foreground text-sm leading-snug mb-1">{ticket.title}</h4>
                            <p className="text-xs text-muted-foreground line-clamp-2 mb-4">{ticket.description}</p>
                            
                            {ticket.asset && (
                              <div className="bg-background shadow-neu-inset-small rounded-xl p-2 mb-4 border border-white/50 flex items-center gap-2">
                                <div className="w-6 h-6 rounded-md bg-accent/10 flex items-center justify-center text-accent shrink-0">
                                  <AlertTriangle size={12} />
                                </div>
                                <div className="min-w-0">
                                  <p className="text-[10px] text-muted-foreground font-bold uppercase leading-none mb-0.5">Affected Asset</p>
                                  <p className="text-xs font-bold text-foreground truncate leading-none">{ticket.asset.tag}</p>
                                </div>
                              </div>
                            )}
                            
                            <div className="flex items-center justify-between text-[11px] text-muted-foreground font-medium pt-3 border-t border-[#A3B1C6]/20">
                              <div className="flex items-center gap-1">
                                <Clock size={12} />
                                <span>{new Date(ticket.createdAt).toLocaleDateString()}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <User size={12} />
                                <span>{ticket.assignedTo || "Unassigned"}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                        
                        {isLoading && colTickets.length === 0 && (
                          <div className="h-32 flex items-center justify-center border-2 border-dashed border-[#A3B1C6]/20 rounded-2xl">
                            <p className="text-xs font-bold text-muted-foreground animate-pulse">Loading...</p>
                          </div>
                        )}
                        
                        {!isLoading && colTickets.length === 0 && (
                          <div className="h-32 flex items-center justify-center border-2 border-dashed border-[#A3B1C6]/20 rounded-2xl">
                            <p className="text-xs font-bold text-muted-foreground">No tickets in this column</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}

              </div>
            </div>
          )}

          {activeTab === "Preventative Schedule" && (
            <div className="bg-background shadow-neu-extruded border-neu rounded-[32px] overflow-hidden">
              <div className="p-8 text-center text-muted-foreground font-bold">
                Coming soon in Phase 3
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}
