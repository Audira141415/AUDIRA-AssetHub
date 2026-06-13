"use client"

import { useState, useEffect, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { 
  Upload, Plus, Search, ArrowRightLeft,
  CalendarDays, MapPin, CheckCircle2
} from "lucide-react"
import { apiClient } from "@/lib/api-client"
import { HeroSection } from "@/components/ui/hero-section"
import { Card, CardContent } from "@/components/ui/card"

export default function MovementsPage() {
  const [movements, setMovements] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")

  const fetchMovements = async () => {
    try {
      setIsLoading(true);
      const res = await apiClient.get('/movements');
      setMovements(res.data);
    } catch (err) {
      console.error("Failed to fetch movements", err);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchMovements();
  }, [])

  const filteredMovements = useMemo(() => {
    return movements.filter(m => {
      const q = searchQuery.toLowerCase();
      return (
        m.id.toLowerCase().includes(q) || 
        m.asset?.tag.toLowerCase().includes(q) ||
        m.asset?.hostname?.toLowerCase().includes(q) ||
        m.user.toLowerCase().includes(q) ||
        m.fromLoc?.toLowerCase().includes(q) ||
        m.toLoc?.toLowerCase().includes(q)
      );
    });
  }, [movements, searchQuery]);

  return (
    <div className="flex w-full gap-6 pb-6 h-full px-6">
      <div className="flex-1 flex flex-col min-w-0 transition-all duration-300">
        
        <HeroSection
          title="Asset Movements"
          description="Track and manage all asset relocation and movement activities"
          imageSrc="/images/heroes/movements.png"
        >
          <div className="flex gap-4 flex-wrap">
            <Button className="h-12 px-6 rounded-2xl shadow-[inset_2px_2px_4px_rgba(255,255,255,0.4),inset_-2px_-2px_4px_rgba(0,0,0,0.2),0_4px_10px_rgba(108,99,255,0.3)] border border-accent/50 font-bold text-white bg-accent hover:bg-accent-light flex items-center gap-2">
              <Plus size={18} /> New Movement
            </Button>
          </div>
        </HeroSection>

        {/* Filters & Actions */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-muted-foreground" />
            </div>
            <input
              type="text"
              placeholder="Search movements, assets, users..."
              className="w-full h-12 pl-11 pr-4 bg-background shadow-neu-inset border-neu rounded-2xl text-sm font-bold text-foreground focus:outline-none focus:ring-2 focus:ring-accent/50 placeholder:text-muted-foreground transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Content Area */}
        <Card className="rounded-[32px] border-neu shadow-neu-extruded bg-background overflow-hidden">
          <div className="overflow-x-auto pb-4">
            <table className="w-full text-left border-collapse whitespace-nowrap">
              <thead>
                <tr>
                  <th className="px-6 py-6 font-bold text-xs uppercase tracking-wider text-muted-foreground border-b border-[#A3B1C6]/20">Asset</th>
                  <th className="px-6 py-6 font-bold text-xs uppercase tracking-wider text-muted-foreground border-b border-[#A3B1C6]/20">From Location</th>
                  <th className="px-6 py-6 font-bold text-xs uppercase tracking-wider text-muted-foreground border-b border-[#A3B1C6]/20">To Location</th>
                  <th className="px-6 py-6 font-bold text-xs uppercase tracking-wider text-muted-foreground border-b border-[#A3B1C6]/20">Date</th>
                  <th className="px-6 py-6 font-bold text-xs uppercase tracking-wider text-muted-foreground border-b border-[#A3B1C6]/20">User</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#A3B1C6]/10">
                {isLoading ? (
                  <tr><td colSpan={5} className="px-6 py-12 text-center text-muted-foreground font-bold">Loading...</td></tr>
                ) : filteredMovements.length === 0 ? (
                  <tr><td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">No movements found.</td></tr>
                ) : (
                  filteredMovements.map((movement) => (
                    <tr key={movement.id} className="hover:bg-[#A3B1C6]/10 transition-all">
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center text-accent shrink-0 shadow-neu-inset">
                            <ArrowRightLeft className="w-5 h-5" />
                          </div>
                          <div className="min-w-0">
                            <p className="font-bold text-sm text-foreground truncate">{movement.asset?.hostname || movement.asset?.tag || "Unknown Asset"}</p>
                            <p className="text-[11px] text-muted-foreground font-medium mt-0.5">{movement.asset?.tag}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                          <MapPin className="w-4 h-4" /> {movement.fromLoc || "-"}
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                          <MapPin className="w-4 h-4 text-accent" /> {movement.toLoc || "-"}
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                          <CalendarDays className="w-4 h-4 text-muted-foreground" />
                          {new Date(movement.date).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <span className="font-bold text-sm text-foreground">{movement.user}</span>
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
