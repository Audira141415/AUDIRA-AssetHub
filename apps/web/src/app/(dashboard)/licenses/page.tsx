"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Search, Disc, CheckCircle2, AlertTriangle, Key, Users } from "lucide-react"
import { apiClient } from "@/lib/api-client"
import { HeroSection } from "@/components/ui/hero-section"
import { useRouter } from "next/navigation"

export default function LicensesPage() {
  const [licenses, setLicenses] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchLicenses = async () => {
      try {
        setIsLoading(true)
        const res = await apiClient.get('/licenses')
        setLicenses(res.data)
      } catch (err) {
        console.error("Failed to fetch licenses", err)
      } finally {
        setIsLoading(false)
      }
    }
    fetchLicenses()
  }, [])

  return (
    <div className="space-y-8 pb-10">
      <HeroSection 
        title="Software License Management" 
        subtitle="Track product keys, seats, expirations, and allocate licenses to physical hardware."
        icon={<Disc className="w-8 h-8 text-accent" />}
        imageSrc="/images/heroes/licenses.png"
      />

      <div className="max-w-[1400px] mx-auto px-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div className="relative w-full md:w-96">
            <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Search software or vendor..." 
              className="w-full h-12 bg-background shadow-neu-inset rounded-2xl pl-12 pr-4 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-accent/50 text-foreground"
            />
          </div>
          <Button className="h-12 px-6 rounded-2xl shadow-neu-extruded bg-accent text-white font-bold hover:bg-accent-light">
            <Plus className="w-5 h-5 mr-2" /> Add License
          </Button>
        </div>

        {isLoading ? (
          <div className="p-12 text-center text-muted-foreground font-bold">Loading Licenses...</div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {licenses.map(license => {
              const usedSeats = license.assets?.length || 0;
              const remainingSeats = license.totalSeats - usedSeats;
              const percentUsed = (usedSeats / license.totalSeats) * 100;
              
              const isExpired = new Date(license.expiryDate).getTime() < new Date().getTime();
              const isExpiringSoon = new Date(license.expiryDate).getTime() - new Date().getTime() < 30 * 24 * 60 * 60 * 1000;

              return (
                <Card key={license.id} onClick={() => router.push(`/licenses/${license.id}`)} className={`rounded-3xl border-none shadow-neu-extruded bg-background overflow-hidden cursor-pointer hover:scale-[1.02] transition-transform`}>
                  <CardHeader className="pb-4 border-b border-[#A3B1C6]/20 px-6 pt-6">
                    <div className="flex justify-between items-start">
                      <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center text-accent mb-4 shadow-neu-inset">
                        <Disc className="w-6 h-6" />
                      </div>
                      {isExpired ? (
                        <span className="px-3 py-1 bg-red-500/10 text-red-500 text-xs font-bold rounded-lg uppercase tracking-wider flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" /> Expired
                        </span>
                      ) : isExpiringSoon ? (
                        <span className="px-3 py-1 bg-yellow-500/10 text-yellow-600 text-xs font-bold rounded-lg uppercase tracking-wider flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" /> Expiring
                        </span>
                      ) : (
                        <span className="px-3 py-1 bg-[#38B2AC]/10 text-[#38B2AC] text-xs font-bold rounded-lg uppercase tracking-wider flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Active
                        </span>
                      )}
                    </div>
                    <CardTitle className="text-xl font-bold text-foreground line-clamp-1">{license.name}</CardTitle>
                    <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider">{license.vendor}</p>
                  </CardHeader>
                  <CardContent className="p-6">
                    
                    <div className="space-y-6">
                      <div>
                        <div className="flex justify-between text-xs font-bold mb-2">
                          <span className="text-muted-foreground uppercase tracking-wider">Seats Allocation</span>
                          <span className="text-foreground">{usedSeats} / {license.totalSeats} Used</span>
                        </div>
                        <div className="h-3 w-full bg-background shadow-neu-inset rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full transition-all duration-500 ${percentUsed > 90 ? 'bg-red-500' : percentUsed > 75 ? 'bg-yellow-500' : 'bg-accent'}`}
                            style={{ width: `${percentUsed}%` }}
                          ></div>
                        </div>
                        <p className="text-xs font-medium text-muted-foreground mt-2 text-right">{remainingSeats} seats remaining</p>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-background shadow-neu-inset p-3 rounded-xl flex items-center gap-3">
                          <Key className="w-4 h-4 text-muted-foreground shrink-0" />
                          <div className="overflow-hidden">
                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Product Key</p>
                            <p className="text-sm font-medium text-foreground truncate">{license.productKey || 'N/A'}</p>
                          </div>
                        </div>
                        <div className="bg-background shadow-neu-inset p-3 rounded-xl flex items-center gap-3">
                          <AlertTriangle className="w-4 h-4 text-muted-foreground shrink-0" />
                          <div className="overflow-hidden">
                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Expires On</p>
                            <p className="text-sm font-medium text-foreground truncate">{new Date(license.expiryDate).toLocaleDateString()}</p>
                          </div>
                        </div>
                      </div>

                      <div className="pt-2">
                        <Button className="w-full h-10 rounded-xl shadow-neu-extruded bg-background text-foreground font-bold hover:text-accent border-none">
                          <Users className="w-4 h-4 mr-2" /> Assign to Asset
                        </Button>
                      </div>
                    </div>

                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
