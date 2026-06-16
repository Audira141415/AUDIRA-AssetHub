"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Search, AlertCircle, CheckCircle2, Clock, Wrench } from "lucide-react"
import { apiClient } from "@/lib/api-client"
import { HeroSection } from "@/components/ui/hero-section"
import { useRouter } from "next/navigation"

export default function TicketsPage() {
  const [tickets, setTickets] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        setIsLoading(true)
        const res = await apiClient.get('/tickets')
        setTickets(res.data)
      } catch (err) {
        console.error("Failed to fetch tickets", err)
      } finally {
        setIsLoading(false)
      }
    }
    fetchTickets()
  }, [])

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
    <div className="space-y-8 pb-10">
      <HeroSection 
        title="Helpdesk & Incident Management" 
        subtitle="Track infrastructure issues, coordinate repairs, and monitor SLA resolution times."
        icon={<Wrench className="w-8 h-8 text-accent" />}
        imageSrc="/images/heroes/tickets.png"
      />

      <div className="max-w-[1400px] mx-auto px-8">
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
          <Button className="h-12 px-6 rounded-2xl shadow-neu-extruded bg-accent text-white font-bold hover:bg-accent-light">
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
  )
}
