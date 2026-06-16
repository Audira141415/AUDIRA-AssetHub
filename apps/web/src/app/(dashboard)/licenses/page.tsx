"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Search, Disc, CheckCircle2, AlertTriangle, Key, Users, X } from "lucide-react"
import { apiClient } from "@/lib/api-client"
import { HeroSection } from "@/components/ui/hero-section"
import { useRouter } from "next/navigation"

export default function LicensesPage() {
  const [licenses, setLicenses] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  
  // Drawer states
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [formData, setFormData] = useState({ 
    name: "", productKey: "", vendor: "", totalSeats: 1, 
    purchaseCost: "", purchaseDate: "", expiryDate: "" 
  })

  const router = useRouter()

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

  useEffect(() => {
    fetchLicenses()
  }, [])

  const handleSave = async () => {
    if (!formData.name) return alert("License Name is required.");
    
    try {
      await apiClient.post('/licenses', formData);
      setIsDrawerOpen(false);
      fetchLicenses();
    } catch (err: any) {
      console.error("Save failed", err);
      alert(err.response?.data?.error || "Failed to save license.");
    }
  }

  const openCreateDrawer = () => {
    setFormData({ 
      name: "", productKey: "", vendor: "", totalSeats: 1, 
      purchaseCost: "", purchaseDate: "", expiryDate: "" 
    });
    setIsDrawerOpen(true);
  }

  const filteredLicenses = licenses.filter(l => 
    l.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (l.vendor && l.vendor.toLowerCase().includes(searchQuery.toLowerCase()))
  );



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
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-12 bg-background shadow-neu-inset rounded-2xl pl-12 pr-4 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-accent/50 text-foreground"
            />
          </div>
          <Button onClick={openCreateDrawer} className="h-12 px-6 rounded-2xl shadow-neu-extruded bg-accent text-white font-bold hover:bg-accent-light">
            <Plus className="w-5 h-5 mr-2" /> Add License
          </Button>
        </div>

        {isLoading ? (
          <div className="p-12 text-center text-muted-foreground font-bold">Loading Licenses...</div>
        ) : filteredLicenses.length === 0 ? (
          <div className="p-12 text-center text-muted-foreground font-medium">No licenses found.</div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredLicenses.map(license => {
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
                        <Button 
                          onClick={(e) => { e.stopPropagation(); router.push(`/licenses/${license.id}`) }}
                          className="w-full h-10 rounded-xl shadow-neu-extruded bg-background text-foreground font-bold hover:text-accent border-none"
                        >
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

      {/* Add License Drawer */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setIsDrawerOpen(false)}></div>
          
          <div className="relative w-full max-w-xl h-full bg-background shadow-[-10px_0_30px_rgba(0,0,0,0.1)] border-l border-white/50 flex flex-col animate-in slide-in-from-right duration-300">
            <div className="px-8 py-6 flex justify-between items-center border-b border-[#A3B1C6]/20">
              <div>
                <h2 className="text-2xl font-bold text-foreground">Add New License</h2>
                <p className="text-sm text-muted-foreground font-medium">Register a software or product license</p>
              </div>
              <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl hover:bg-red-50 hover:text-red-500 hover:shadow-neu-inset transition-all" onClick={() => setIsDrawerOpen(false)}>
                <X className="w-5 h-5" />
              </Button>
            </div>

            <div className="flex-1 overflow-y-auto px-8 py-6 space-y-6">
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-muted-foreground uppercase">License Name *</label>
                  <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="e.g. Microsoft Office 365" className="w-full h-12 px-4 bg-background shadow-neu-inset border-none rounded-xl text-sm font-bold text-foreground focus:ring-2 focus:ring-accent/50 outline-none" />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-muted-foreground uppercase">Vendor</label>
                    <input type="text" value={formData.vendor} onChange={e => setFormData({...formData, vendor: e.target.value})} placeholder="e.g. Microsoft" className="w-full h-12 px-4 bg-background shadow-neu-inset border-none rounded-xl text-sm font-bold text-foreground focus:ring-2 focus:ring-accent/50 outline-none" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-muted-foreground uppercase">Total Seats *</label>
                    <input type="number" min="1" value={formData.totalSeats} onChange={e => setFormData({...formData, totalSeats: parseInt(e.target.value) || 1})} className="w-full h-12 px-4 bg-background shadow-neu-inset border-none rounded-xl text-sm font-bold text-foreground focus:ring-2 focus:ring-accent/50 outline-none" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-muted-foreground uppercase">Product Key</label>
                  <input type="text" value={formData.productKey} onChange={e => setFormData({...formData, productKey: e.target.value})} placeholder="XXXXX-XXXXX-XXXXX-XXXXX" className="w-full h-12 px-4 bg-background shadow-neu-inset border-none rounded-xl text-sm font-bold text-foreground focus:ring-2 focus:ring-accent/50 outline-none font-mono" />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-muted-foreground uppercase">Purchase Cost ($)</label>
                  <input type="number" step="0.01" value={formData.purchaseCost} onChange={e => setFormData({...formData, purchaseCost: e.target.value})} placeholder="0.00" className="w-full h-12 px-4 bg-background shadow-neu-inset border-none rounded-xl text-sm font-bold text-foreground focus:ring-2 focus:ring-accent/50 outline-none" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-muted-foreground uppercase">Purchase Date</label>
                    <input type="date" value={formData.purchaseDate} onChange={e => setFormData({...formData, purchaseDate: e.target.value})} className="w-full h-12 px-4 bg-background shadow-neu-inset border-none rounded-xl text-sm font-bold text-foreground focus:ring-2 focus:ring-accent/50 outline-none" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-muted-foreground uppercase">Expiry Date</label>
                    <input type="date" value={formData.expiryDate} onChange={e => setFormData({...formData, expiryDate: e.target.value})} className="w-full h-12 px-4 bg-background shadow-neu-inset border-none rounded-xl text-sm font-bold text-foreground focus:ring-2 focus:ring-accent/50 outline-none" />
                  </div>
                </div>
              </div>
            </div>

            <div className="px-8 py-6 border-t border-[#A3B1C6]/20 bg-background flex justify-end gap-4">
              <Button variant="outline" className="h-12 px-8 rounded-2xl shadow-neu-extruded border-none font-bold text-foreground hover:text-accent transition-all" onClick={() => setIsDrawerOpen(false)}>Cancel</Button>
              <Button className="h-12 px-8 rounded-2xl border border-accent/50 font-bold text-white bg-accent shadow-[inset_2px_2px_4px_rgba(255,255,255,0.4),inset_-2px_-2px_4px_rgba(0,0,0,0.2),0_4px_10px_rgba(108,99,255,0.3)] hover:bg-accent-light transition-all" onClick={handleSave}>
                Save License
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
