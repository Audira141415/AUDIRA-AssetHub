"use client"

import { useState, useEffect, useMemo } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  Search, ShieldCheck, Shield, Clock, XCircle, 
  CalendarDays, Box, AlertCircle
} from "lucide-react"
import { apiClient } from "@/lib/api-client"
import { HeroSection } from "@/components/ui/hero-section"
import { useRouter } from "next/navigation"

export default function WarrantyPage() {
  const [warranties, setWarranties] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10
  const router = useRouter()

  useEffect(() => {
    const fetchWarranties = async () => {
      try {
        setIsLoading(true);
        const res = await apiClient.get('/warranties');
        const apiAssets = res.data;
        
        const mapped = apiAssets.map((asset: any) => {
          let status = "Active";
          let daysRemaining = 365;

          if (asset.warranty === "Expired") {
            status = "Expired";
            daysRemaining = 0;
          } else if (asset.warranty === "Lifetime") {
            status = "Active";
            daysRemaining = 9999;
          } else if (asset.warranty) {
            // Assume it's a year string like "2029"
            const eYear = parseInt(asset.warranty);
            if (!isNaN(eYear)) {
              const today = new Date();
              const eDate = new Date(eYear, 11, 31);
              daysRemaining = Math.round((eDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
              if (daysRemaining < 0) status = "Expired";
              else if (daysRemaining <= 90) status = "Expiring Soon";
            }
          }

          return {
            id: asset.id,
            assetTag: asset.tag,
            assetName: asset.hostname || asset.category?.name || "Unknown Asset",
            vendor: asset.vendor?.name || "Unknown",
            warrantyStr: asset.warranty,
            purchaseDate: asset.purchaseDate ? new Date(asset.purchaseDate).toLocaleDateString() : "-",
            daysRemaining: daysRemaining,
            status: status
          };
        });

        setWarranties(mapped);
      } catch (err) {
        console.error("Failed to fetch warranties", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchWarranties();
  }, []);

  const filteredWarranties = useMemo(() => {
    return warranties.filter(w => {
      const q = searchQuery.toLowerCase();
      return (
        w.assetTag.toLowerCase().includes(q) || 
        w.assetName.toLowerCase().includes(q) ||
        w.vendor.toLowerCase().includes(q)
      );
    });
  }, [warranties, searchQuery]);

  const totalPages = Math.ceil(filteredWarranties.length / itemsPerPage);
  const currentWarranties = filteredWarranties.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // KPIs
  const totalWarranties = warranties.length;
  const activeCount = warranties.filter(w => w.status === "Active").length;
  const expiringCount = warranties.filter(w => w.status === "Expiring Soon").length;
  const expiredCount = warranties.filter(w => w.status === "Expired").length;

  return (
    <div className="flex w-full gap-6 pb-6 px-6">
      <div className="flex-1 flex flex-col min-w-0 transition-all duration-300">
        
        <HeroSection
          title="Warranty Tracker"
          description="Monitor asset warranties, support contracts, and renewals"
          imageSrc="/images/heroes/warranty.png"
        />

        {/* KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 mt-2">
          <Card className="rounded-[24px] border-neu shadow-neu-extruded bg-background">
            <CardContent className="p-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center text-accent"><Shield className="w-6 h-6" /></div>
              <div><p className="text-[10px] font-bold text-muted-foreground uppercase">Total Tracked</p><p className="text-2xl font-bold">{totalWarranties}</p></div>
            </CardContent>
          </Card>
          <Card className="rounded-[24px] border-neu shadow-neu-extruded bg-background">
            <CardContent className="p-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center text-green-500"><ShieldCheck className="w-6 h-6" /></div>
              <div><p className="text-[10px] font-bold text-muted-foreground uppercase">Active</p><p className="text-2xl font-bold">{activeCount}</p></div>
            </CardContent>
          </Card>
          <Card className="rounded-[24px] border-neu shadow-neu-extruded bg-background">
            <CardContent className="p-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500"><Clock className="w-6 h-6" /></div>
              <div><p className="text-[10px] font-bold text-muted-foreground uppercase">Expiring Soon</p><p className="text-2xl font-bold">{expiringCount}</p></div>
            </CardContent>
          </Card>
          <Card className="rounded-[24px] border-neu shadow-neu-extruded bg-background">
            <CardContent className="p-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center text-red-500"><XCircle className="w-6 h-6" /></div>
              <div><p className="text-[10px] font-bold text-muted-foreground uppercase">Expired</p><p className="text-2xl font-bold">{expiredCount}</p></div>
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
              placeholder="Search by tag, name, or vendor..."
              className="w-full h-12 pl-11 pr-4 bg-background shadow-neu-inset border-neu rounded-2xl text-sm font-bold text-foreground focus:outline-none focus:ring-2 focus:ring-accent/50"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                setCurrentPage(1)
              }}
            />
          </div>
        </div>

        <Card className="rounded-[32px] border-neu shadow-neu-extruded bg-background overflow-hidden">
          <div className="overflow-x-auto pb-4">
            <table className="w-full text-left border-collapse whitespace-nowrap">
              <thead>
                <tr>
                  <th className="px-6 py-6 font-bold text-xs uppercase tracking-wider text-muted-foreground border-b border-[#A3B1C6]/20">Asset</th>
                  <th className="px-6 py-6 font-bold text-xs uppercase tracking-wider text-muted-foreground border-b border-[#A3B1C6]/20">Vendor</th>
                  <th className="px-6 py-6 font-bold text-xs uppercase tracking-wider text-muted-foreground border-b border-[#A3B1C6]/20">Purchase Date</th>
                  <th className="px-6 py-6 font-bold text-xs uppercase tracking-wider text-muted-foreground border-b border-[#A3B1C6]/20">Warranty Info</th>
                  <th className="px-6 py-6 font-bold text-xs uppercase tracking-wider text-muted-foreground border-b border-[#A3B1C6]/20">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#A3B1C6]/10">
                {isLoading ? (
                  <tr><td colSpan={5} className="px-6 py-12 text-center text-muted-foreground font-bold">Loading...</td></tr>
                ) : filteredWarranties.length === 0 ? (
                  <tr><td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">No warranties found.</td></tr>
                ) : (
                  currentWarranties.map((w) => (
                    <tr key={w.id} onClick={() => router.push(`/assets/${w.assetTag}`)} className="hover:bg-[#A3B1C6]/10 transition-all cursor-pointer">
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center text-accent shrink-0 shadow-neu-inset">
                            <Box className="w-5 h-5" />
                          </div>
                          <div className="min-w-0">
                            <p className="font-bold text-sm text-foreground truncate">{w.assetName}</p>
                            <p className="text-[11px] text-muted-foreground font-medium mt-0.5">{w.assetTag}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5 font-bold text-foreground">{w.vendor}</td>
                      <td className="px-6 py-5 text-muted-foreground font-medium">
                        <div className="flex items-center gap-2"><CalendarDays className="w-4 h-4"/>{w.purchaseDate}</div>
                      </td>
                      <td className="px-6 py-5 font-bold text-foreground">{w.warrantyStr}</td>
                      <td className="px-6 py-5">
                        <span className={`px-2.5 py-1 text-[10px] rounded-lg font-bold shadow-neu-inset ${w.status === 'Active' ? 'text-green-500' : w.status === 'Expired' ? 'text-red-500' : 'text-amber-500'}`}>
                          {w.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          {filteredWarranties.length > itemsPerPage && (
            <div className="flex flex-col sm:flex-row items-center justify-between p-4 sm:px-6 bg-background/50 border-t border-[#A3B1C6]/20 gap-4">
              <span className="text-xs font-bold text-muted-foreground">
                Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredWarranties.length)} of {filteredWarranties.length} entries
              </span>
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="shadow-neu-extruded font-bold"
                >
                  Previous
                </Button>
                <div className="text-xs font-bold px-4 py-2 bg-background shadow-neu-inset rounded-lg">
                  Page {currentPage} of {totalPages}
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="shadow-neu-extruded font-bold"
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
