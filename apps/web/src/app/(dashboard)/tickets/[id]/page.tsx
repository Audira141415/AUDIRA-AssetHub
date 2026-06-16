"use client"

import { useState, useEffect, use } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { 
  ChevronRight, ArrowLeft, Clock, Server, MapPin, 
  AlertCircle, CheckCircle2, User, Wrench, ShieldAlert,
  MessageSquare, FileText, LifeBuoy, Trash2
} from "lucide-react"
import { apiClient } from "@/lib/api-client"
import { HeroSection } from "@/components/ui/hero-section"

export default function TicketDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  
  const [ticket, setTicket] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isUpdating, setIsUpdating] = useState(false)
  const [resolutionNote, setResolutionNote] = useState("")

  const fetchTicket = async () => {
    try {
      setIsLoading(true);
      const res = await apiClient.get(`/tickets/${id}`);
      setTicket(res.data);
      if (res.data.resolutionNotes) {
        setResolutionNote(res.data.resolutionNotes);
      }
    } catch (err) {
      console.error("API fetch failed", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTicket();
  }, [id])

  const handleUpdateStatus = async (newStatus: string) => {
    setIsUpdating(true);
    try {
      const payload: any = { status: newStatus };
      if (newStatus === 'Resolved') {
        payload.resolvedAt = new Date().toISOString();
        payload.resolutionNotes = resolutionNote || "Resolved by technician.";
      }
      await apiClient.put(`/tickets/${id}`, payload);
      await fetchTicket();
    } catch (err) {
      console.error("Failed to update status", err);
    } finally {
      setIsUpdating(false);
    }
  }

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this ticket?")) return;
    setIsUpdating(true);
    try {
      await apiClient.delete(`/tickets/${id}`);
      router.push('/tickets');
    } catch (err) {
      console.error("Failed to delete", err);
      alert("Failed to delete ticket.");
      setIsUpdating(false);
    }
  }

  if (isLoading || !ticket) {
    return <div className="p-8 text-center text-muted-foreground font-bold h-screen flex items-center justify-center">Loading Ticket Details...</div>
  }

  const getPriorityColor = (priority: string) => {
    switch(priority) {
      case 'Critical': return 'text-red-500 bg-red-500/10 border-red-500/20'
      case 'High': return 'text-orange-500 bg-orange-500/10 border-orange-500/20'
      case 'Medium': return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20'
      case 'Low': return 'text-green-500 bg-green-500/10 border-green-500/20'
      default: return 'text-gray-500 bg-gray-500/10 border-gray-500/20'
    }
  }

  // Fake SLA countdown logic
  const isResolved = ticket.status === 'Resolved';
  const hoursSinceCreated = Math.floor((new Date().getTime() - new Date(ticket.createdAt).getTime()) / (1000 * 60 * 60));
  const slaTarget = ticket.priority === 'Critical' ? 4 : ticket.priority === 'High' ? 8 : 24;
  const slaRemaining = Math.max(0, slaTarget - hoursSinceCreated);
  const slaBreached = !isResolved && slaRemaining === 0;

  return (
    <div className="relative min-h-[calc(100vh-80px)] flex flex-col p-8">
      <div className="max-w-[1400px] mx-auto w-full">
        <div className="flex items-center text-sm text-muted-foreground font-bold tracking-wider mb-4">
          <Link href="/tickets" className="hover:text-accent transition-colors flex items-center gap-1">
            <ArrowLeft className="w-4 h-4" /> Back to Tickets
          </Link>
          <ChevronRight className="w-4 h-4 mx-2 opacity-50" />
          <span className="text-accent">{ticket.id.substring(0, 8).toUpperCase()}</span>
        </div>

        <HeroSection 
          compact 
          title={ticket.title} 
          description={`Reported on ${new Date(ticket.createdAt).toLocaleString()} by ${ticket.reportedBy || 'System'}`}
          icon={<LifeBuoy className="w-8 h-8 text-accent" />}
        >
          <span className={`px-3 py-1.5 text-xs font-bold rounded-lg uppercase tracking-wider border ${getPriorityColor(ticket.priority)}`}>
            {ticket.priority} Priority
          </span>
          <span className={`px-3 py-1.5 text-xs font-bold rounded-lg uppercase tracking-wider border ${isResolved ? 'bg-green-500/10 text-green-500 border-green-500/20' : 'bg-accent/10 text-accent border-accent/20'}`}>
            {ticket.status}
          </span>
          
          <div className="flex gap-4 ml-auto">
            <Button onClick={handleDelete} disabled={isUpdating} variant="ghost" className="h-10 w-10 p-0 rounded-xl shadow-neu-extruded bg-background text-red-500 hover:text-red-600 hover:bg-red-50">
              <Trash2 className="w-5 h-5" />
            </Button>
            {!isResolved && ticket.status === 'Open' && (
              <Button onClick={() => handleUpdateStatus('In Progress')} disabled={isUpdating} className="h-10 px-6 rounded-xl shadow-neu-extruded bg-yellow-500 text-white font-bold hover:bg-yellow-600">
                Start Work
              </Button>
            )}
            {!isResolved && ticket.status === 'In Progress' && (
              <Button onClick={() => handleUpdateStatus('Resolved')} disabled={isUpdating} className="h-10 px-6 rounded-xl shadow-neu-extruded bg-green-500 text-white font-bold hover:bg-green-600">
                <CheckCircle2 className="w-5 h-5 mr-2" /> Mark Resolved
              </Button>
            )}
          </div>
        </HeroSection>
      </div>

      <div className="flex-1 w-full max-w-[1400px] mx-auto overflow-y-auto pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content (Left Panel) */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* SLA Alert */}
            {!isResolved && (
              <div className={`p-4 rounded-2xl border-l-4 shadow-neu-extruded flex items-start gap-4 ${slaBreached ? 'bg-red-500/10 border-red-500 text-red-600' : 'bg-yellow-500/10 border-yellow-500 text-yellow-600'}`}>
                {slaBreached ? <ShieldAlert className="w-6 h-6 shrink-0 mt-0.5" /> : <Clock className="w-6 h-6 shrink-0 mt-0.5" />}
                <div>
                  <h4 className="font-bold text-lg mb-1">{slaBreached ? 'SLA Breached!' : 'SLA Target Active'}</h4>
                  <p className="text-sm font-medium">
                    {slaBreached 
                      ? `This ticket has exceeded its ${slaTarget}-hour resolution target.` 
                      : `You have ${slaRemaining} hours remaining to resolve this incident before breaching the SLA.`}
                  </p>
                </div>
              </div>
            )}

            {/* Description */}
            <Card className="rounded-[32px] border-neu shadow-neu-extruded bg-background">
              <CardHeader className="pb-4 border-b border-[#A3B1C6]/20 px-8">
                <CardTitle className="text-lg font-bold text-foreground flex items-center gap-2">
                  <FileText className="w-5 h-5 text-accent" /> Incident Description
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <p className="text-foreground font-medium leading-relaxed">
                  {ticket.description}
                </p>
              </CardContent>
            </Card>

            {/* Resolution Panel */}
            <Card className="rounded-[32px] border-neu shadow-neu-extruded bg-background">
              <CardHeader className="pb-4 border-b border-[#A3B1C6]/20 px-8">
                <CardTitle className="text-lg font-bold text-foreground flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-accent" /> Resolution & Activity
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                {isResolved ? (
                  <div className="bg-green-500/10 p-6 rounded-2xl border border-green-500/20">
                    <h4 className="font-bold text-green-600 mb-2 flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5" /> Resolved on {new Date(ticket.resolvedAt).toLocaleString()}
                    </h4>
                    <p className="text-sm font-medium text-foreground">{ticket.resolutionNotes}</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <label className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Resolution Notes (Required for closing)</label>
                    <textarea 
                      className="w-full h-32 bg-background shadow-neu-inset border-t border-l border-[#A3B1C6]/30 border-b border-r border-white/60 rounded-2xl p-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-accent/50 text-foreground resize-none"
                      placeholder="Describe how this issue was fixed..."
                      value={resolutionNote}
                      onChange={(e) => setResolutionNote(e.target.value)}
                    ></textarea>
                    {ticket.status === 'In Progress' && (
                       <Button 
                        onClick={() => handleUpdateStatus('Resolved')} 
                        disabled={isUpdating || !resolutionNote.trim()} 
                        className="w-full h-12 rounded-2xl shadow-neu-extruded bg-green-500 text-white font-bold hover:bg-green-600"
                      >
                        <CheckCircle2 className="w-5 h-5 mr-2" /> Mark as Resolved
                      </Button>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

          </div>

          {/* Asset Context (Right Panel) */}
          <div className="lg:col-span-1 space-y-8">
            <Card className="rounded-[32px] border-neu shadow-neu-extruded bg-background">
              <CardHeader className="pb-4 border-b border-[#A3B1C6]/20 px-8 bg-accent/5 rounded-t-[32px]">
                <CardTitle className="text-lg font-bold text-foreground flex items-center gap-2">
                  <Server className="w-5 h-5 text-accent" /> Affected Asset
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {ticket.asset ? (
                  <div className="flex flex-col">
                    <div className="p-8 border-b border-[#A3B1C6]/20 flex flex-col items-center text-center">
                      <div className="w-16 h-16 rounded-2xl bg-background shadow-neu-extruded flex items-center justify-center text-accent mb-4">
                        <Server className="w-8 h-8" />
                      </div>
                      <h3 className="font-display font-bold text-xl text-foreground">{ticket.asset.tag}</h3>
                      <p className="text-sm font-bold text-muted-foreground">{ticket.asset.hostname || "No Hostname"}</p>
                      
                      <Link href={`/assets/${ticket.asset.tag}`} className="mt-4">
                        <Button variant="outline" className="h-10 px-6 rounded-xl shadow-neu-extruded border-neu text-xs font-bold text-accent hover:text-accent-light">
                          View Full Asset Details
                        </Button>
                      </Link>
                    </div>
                    
                    <div className="p-8 space-y-6">
                      <div className="flex items-start gap-4">
                        <MapPin className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
                        <div>
                          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">Location</p>
                          <p className="text-sm font-bold text-foreground">{ticket.asset.location?.name || 'Unknown'}</p>
                          <p className="text-xs text-muted-foreground mt-1">Rack: {ticket.asset.rack || 'N/A'}, U: {ticket.asset.uPosition || 'N/A'}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-4">
                        <Wrench className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
                        <div>
                          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">Vendor & Contract</p>
                          <p className="text-sm font-bold text-foreground">{ticket.asset.vendor?.name || 'Unknown Vendor'}</p>
                          <p className="text-xs text-muted-foreground mt-1">{ticket.asset.slaLevel || 'Standard SLA'}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-4">
                        <User className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
                        <div>
                          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">Tech Owner</p>
                          <p className="text-sm font-bold text-foreground">{ticket.asset.techOwner || 'Unassigned'}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-8 text-center text-muted-foreground">
                    <p className="font-bold">No specific asset linked to this ticket.</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="rounded-[32px] border-neu shadow-neu-extruded bg-background">
              <CardHeader className="pb-4 border-b border-[#A3B1C6]/20 px-8">
                <CardTitle className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Assignment</CardTitle>
              </CardHeader>
              <CardContent className="p-8 space-y-6">
                 <div>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2">Assigned Technician</p>
                    <div className="flex items-center gap-3 p-3 bg-background shadow-neu-inset rounded-xl">
                      <div className="w-8 h-8 rounded-full bg-accent/20 text-accent flex items-center justify-center font-bold text-xs">
                        {ticket.assignedTo ? ticket.assignedTo.substring(0,2).toUpperCase() : '??'}
                      </div>
                      <span className="font-bold text-sm text-foreground">{ticket.assignedTo || 'Unassigned'}</span>
                    </div>
                 </div>
              </CardContent>
            </Card>

          </div>

        </div>
      </div>
    </div>
  )
}
