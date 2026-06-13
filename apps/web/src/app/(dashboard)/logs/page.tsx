"use client"

import { useState, useEffect, useMemo } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { 
  Search, ShieldAlert, CalendarDays,
  ShieldCheck, Info, FileText
} from "lucide-react"
import { apiClient } from "@/lib/api-client"
import { HeroSection } from "@/components/ui/hero-section"

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        setIsLoading(true);
        const res = await apiClient.get('/logs');
        setLogs(res.data);
      } catch (err) {
        console.error("Failed to fetch logs", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchLogs();
  }, []);

  const filteredLogs = useMemo(() => {
    return logs.filter(l => {
      const q = searchQuery.toLowerCase();
      return (
        l.target.toLowerCase().includes(q) || 
        l.user.toLowerCase().includes(q) ||
        l.action.toLowerCase().includes(q) ||
        l.details?.toLowerCase().includes(q)
      );
    });
  }, [logs, searchQuery]);

  return (
    <div className="flex w-full gap-6 pb-6 h-full px-6">
      <div className="flex-1 flex flex-col min-w-0 transition-all duration-300">
        
        <HeroSection
          title="Audit Logs"
          description="Track and review all system activities and changes"
          imageSrc="/images/heroes/logs.png"
        />

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 mt-2">
          <Card className="rounded-[24px] border-neu shadow-neu-extruded bg-background">
            <CardContent className="p-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500"><FileText className="w-6 h-6" /></div>
              <div><p className="text-[10px] font-bold text-muted-foreground uppercase">Total Logs</p><p className="text-2xl font-bold">{logs.length}</p></div>
            </CardContent>
          </Card>
          <Card className="rounded-[24px] border-neu shadow-neu-extruded bg-background">
            <CardContent className="p-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center text-accent"><ShieldCheck className="w-6 h-6" /></div>
              <div><p className="text-[10px] font-bold text-muted-foreground uppercase">System</p><p className="text-2xl font-bold">{logs.filter(l => l.user === "System").length}</p></div>
            </CardContent>
          </Card>
          <Card className="rounded-[24px] border-neu shadow-neu-extruded bg-background">
            <CardContent className="p-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center text-green-500"><Info className="w-6 h-6" /></div>
              <div><p className="text-[10px] font-bold text-muted-foreground uppercase">Assets</p><p className="text-2xl font-bold">{logs.filter(l => l.module === "Assets").length}</p></div>
            </CardContent>
          </Card>
          <Card className="rounded-[24px] border-neu shadow-neu-extruded bg-background">
            <CardContent className="p-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500"><ShieldAlert className="w-6 h-6" /></div>
              <div><p className="text-[10px] font-bold text-muted-foreground uppercase">Movements</p><p className="text-2xl font-bold">{logs.filter(l => l.module === "Movements").length}</p></div>
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-muted-foreground" />
            </div>
            <input
              type="text"
              placeholder="Search by action, user, or target..."
              className="w-full h-12 pl-11 pr-4 bg-background shadow-neu-inset border-neu rounded-2xl text-sm font-bold text-foreground focus:outline-none focus:ring-2 focus:ring-accent/50"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <Card className="rounded-[32px] border-neu shadow-neu-extruded bg-background overflow-hidden">
          <div className="overflow-x-auto pb-4">
            <table className="w-full text-left border-collapse whitespace-nowrap">
              <thead>
                <tr>
                  <th className="px-6 py-6 font-bold text-xs uppercase tracking-wider text-muted-foreground border-b border-[#A3B1C6]/20">Action</th>
                  <th className="px-6 py-6 font-bold text-xs uppercase tracking-wider text-muted-foreground border-b border-[#A3B1C6]/20">Target</th>
                  <th className="px-6 py-6 font-bold text-xs uppercase tracking-wider text-muted-foreground border-b border-[#A3B1C6]/20">Details</th>
                  <th className="px-6 py-6 font-bold text-xs uppercase tracking-wider text-muted-foreground border-b border-[#A3B1C6]/20">User</th>
                  <th className="px-6 py-6 font-bold text-xs uppercase tracking-wider text-muted-foreground border-b border-[#A3B1C6]/20 text-right">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#A3B1C6]/10">
                {isLoading ? (
                  <tr><td colSpan={5} className="px-6 py-12 text-center text-muted-foreground font-bold">Loading...</td></tr>
                ) : filteredLogs.length === 0 ? (
                  <tr><td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">No logs found.</td></tr>
                ) : (
                  filteredLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-[#A3B1C6]/10 transition-all">
                      <td className="px-6 py-5">
                        <span className={`px-2.5 py-1 text-[10px] rounded-lg font-bold shadow-neu-inset ${log.action.includes('Created') ? 'text-green-500' : log.action.includes('Updated') ? 'text-blue-500' : 'text-accent'}`}>
                          {log.action}
                        </span>
                      </td>
                      <td className="px-6 py-5 font-bold text-foreground">{log.target}</td>
                      <td className="px-6 py-5 text-muted-foreground font-medium truncate max-w-xs" title={log.details}>
                        {log.details}
                      </td>
                      <td className="px-6 py-5 font-bold text-foreground">{log.user}</td>
                      <td className="px-6 py-5 text-right text-muted-foreground font-medium">
                        <div className="flex items-center justify-end gap-2"><CalendarDays className="w-4 h-4"/>{new Date(log.date).toLocaleString()}</div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  )
}
