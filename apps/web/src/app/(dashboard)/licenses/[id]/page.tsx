"use client"

import { useState, useEffect, use } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { 
  ChevronRight, ArrowLeft, Disc, Key, Calendar, 
  DollarSign, CheckCircle2, AlertTriangle, ShieldCheck, Plus, Server
} from "lucide-react"
import { apiClient } from "@/lib/api-client"
import { HeroSection } from "@/components/ui/hero-section"

export default function LicenseDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  
  const [license, setLicense] = useState<any>(null)
  const [assets, setAssets] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isAssigning, setIsAssigning] = useState(false)
  const [selectedAssetId, setSelectedAssetId] = useState("")
  const [error, setError] = useState("")

  const fetchLicense = async () => {
    try {
      const res = await apiClient.get(`/licenses/${id}`);
      setLicense(res.data);
    } catch (err) {
      console.error("API fetch failed", err);
    }
  };

  const fetchAssets = async () => {
    try {
      const res = await apiClient.get('/assets');
      setAssets(res.data);
    } catch (err) {
      console.error("Failed to fetch assets", err);
    }
  }

  useEffect(() => {
    Promise.all([fetchLicense(), fetchAssets()]).then(() => setIsLoading(false));
  }, [id])

  const handleAssign = async () => {
    if (!selectedAssetId) {
      setError("Please select an asset first.");
      return;
    }
    setIsAssigning(true);
    setError("");
    try {
      await apiClient.post(`/licenses/${id}`, { assetId: selectedAssetId });
      await fetchLicense();
      setSelectedAssetId("");
    } catch (err: any) {
      console.error("Failed to assign license", err);
      setError(err.response?.data?.error || "Failed to assign license");
    } finally {
      setIsAssigning(false);
    }
  }

  if (isLoading || !license) {
    return <div className="p-8 text-center text-muted-foreground font-bold h-screen flex items-center justify-center">Loading License Details...</div>
  }

  const usedSeats = license.assets?.length || 0;
  const remainingSeats = license.totalSeats - usedSeats;
  const percentUsed = (usedSeats / license.totalSeats) * 100;
  const isExpired = new Date(license.expiryDate).getTime() < new Date().getTime();
  const isExpiringSoon = new Date(license.expiryDate).getTime() - new Date().getTime() < 30 * 24 * 60 * 60 * 1000;
  
  // Compliance logic
  const isOverProvisioned = percentUsed > 100;

  return (
    <div className="relative min-h-[calc(100vh-80px)] flex flex-col p-8">
      <div className="max-w-[1400px] mx-auto w-full">
        <div className="flex items-center text-sm text-muted-foreground font-bold tracking-wider mb-4">
          <Link href="/licenses" className="hover:text-accent transition-colors flex items-center gap-1">
            <ArrowLeft className="w-4 h-4" /> Back to Licenses
          </Link>
          <ChevronRight className="w-4 h-4 mx-2 opacity-50" />
          <span className="text-accent">{license.name}</span>
        </div>

        <HeroSection 
          compact 
          title={license.name} 
          description={`${license.vendor} • Exp ${isExpired ? 'Expired' : new Date(license.expiryDate).toLocaleDateString()}`}
          icon={<Disc className="w-8 h-8 text-accent" />}
        >
          <div className="flex items-center gap-3">
            {isExpired ? (
              <span className="px-3 py-1.5 bg-red-500/10 text-red-500 text-xs font-bold rounded-lg uppercase tracking-wider flex items-center gap-1 border border-red-500/20">
                <AlertTriangle className="w-3 h-3" /> Expired
              </span>
            ) : isExpiringSoon ? (
              <span className="px-3 py-1.5 bg-yellow-500/10 text-yellow-600 text-xs font-bold rounded-lg uppercase tracking-wider flex items-center gap-1 border border-yellow-500/20">
                <AlertTriangle className="w-3 h-3" /> Expiring Soon
              </span>
            ) : (
              <span className="px-3 py-1.5 bg-[#38B2AC]/10 text-[#38B2AC] text-xs font-bold rounded-lg uppercase tracking-wider flex items-center gap-1 border border-[#38B2AC]/20">
                <CheckCircle2 className="w-3 h-3" /> Active
              </span>
            )}
          </div>
          
          <div className="flex gap-4 ml-auto">
            {isOverProvisioned && (
              <div className="px-4 py-2 bg-red-500/10 text-red-600 border border-red-500/20 rounded-xl flex items-center gap-3 font-bold shadow-neu-extruded text-sm">
                <AlertTriangle className="w-4 h-4" /> COMPLIANCE ALERT
              </div>
            )}
          </div>
        </HeroSection>
      </div>

      <div className="flex-1 w-full max-w-[1400px] mx-auto overflow-y-auto pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content (Left Panel) */}
          <div className="lg:col-span-2 space-y-8">
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <Card className="rounded-[32px] border-neu shadow-neu-extruded bg-background">
                <CardContent className="p-6 flex flex-col justify-center items-center text-center">
                  <Key className="w-8 h-8 text-accent mb-3" />
                  <p className="text-sm font-bold text-foreground mb-1 truncate w-full">{license.productKey || 'Volume License'}</p>
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Product Key</p>
                </CardContent>
              </Card>
              <Card className="rounded-[32px] border-neu shadow-neu-extruded bg-background">
                <CardContent className="p-6 flex flex-col justify-center items-center text-center">
                  <DollarSign className="w-8 h-8 text-[#38B2AC] mb-3" />
                  <p className="text-2xl font-display font-bold text-foreground mb-1">
                    {license.purchaseCost ? `$${license.purchaseCost.toLocaleString()}` : 'N/A'}
                  </p>
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Purchase Cost</p>
                </CardContent>
              </Card>
              <Card className="rounded-[32px] border-neu shadow-neu-extruded bg-background">
                <CardContent className="p-6 flex flex-col justify-center items-center text-center">
                  <Calendar className="w-8 h-8 text-[#F59E0B] mb-3" />
                  <p className="text-lg font-bold text-foreground mb-1">
                    {new Date(license.expiryDate).toLocaleDateString()}
                  </p>
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Expiry Date</p>
                </CardContent>
              </Card>
            </div>

            {/* Asset Installations Table */}
            <Card className="rounded-[32px] border-neu shadow-neu-extruded bg-background">
              <CardHeader className="pb-4 border-b border-[#A3B1C6]/20 px-8">
                <CardTitle className="text-lg font-bold text-foreground flex items-center gap-2">
                  <Server className="w-5 h-5 text-accent" /> Installed On ({usedSeats} Assets)
                </CardTitle>
              </CardHeader>
              <div className="overflow-x-auto rounded-b-[32px] p-2">
                <table className="w-full text-sm text-left border-collapse min-w-[600px]">
                  <thead className="text-xs text-muted-foreground uppercase tracking-wider border-b border-[#A3B1C6]/30">
                    <tr>
                      <th className="px-6 py-4 font-bold rounded-tl-2xl">Asset Tag</th>
                      <th className="px-6 py-4 font-bold">Hostname</th>
                      <th className="px-6 py-4 font-bold">Assigned Date</th>
                      <th className="px-6 py-4 font-bold text-right rounded-tr-2xl">Action</th>
                    </tr>
                  </thead>
                  <tbody className="text-foreground">
                    {license.assets && license.assets.length > 0 ? (
                      license.assets.map((al: any) => (
                        <tr key={al.id} className="hover:bg-[#A3B1C6]/10 transition-colors">
                          <td className="px-6 py-4 font-bold text-accent border-b border-white/60">
                            {al.asset.tag}
                          </td>
                          <td className="px-6 py-4 font-medium border-b border-white/60">{al.asset.hostname || "-"}</td>
                          <td className="px-6 py-4 font-medium border-b border-white/60 text-muted-foreground">
                            {new Date(al.assignedAt).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 border-b border-white/60 text-right">
                            <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600 hover:bg-red-500/10">
                              Revoke
                            </Button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={4} className="px-6 py-12 text-center text-muted-foreground">
                          <p className="font-bold">This license has not been assigned to any assets.</p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </Card>

          </div>

          {/* Allocation Engine (Right Panel) */}
          <div className="lg:col-span-1 space-y-8">
            <Card className="rounded-[32px] border-neu shadow-neu-extruded bg-background">
              <CardHeader className="pb-4 border-b border-[#A3B1C6]/20 px-8 bg-accent/5 rounded-t-[32px]">
                <CardTitle className="text-lg font-bold text-foreground flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-accent" /> Allocation Engine
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8 space-y-8">
                
                {/* Seats Visualizer */}
                <div>
                  <div className="flex justify-between text-sm font-bold mb-3">
                    <span className="text-muted-foreground uppercase tracking-wider">Seats Capacity</span>
                    <span className="text-foreground">{usedSeats} / {license.totalSeats}</span>
                  </div>
                  <div className="h-4 w-full bg-background shadow-neu-inset rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${isOverProvisioned ? 'bg-red-500' : percentUsed > 80 ? 'bg-yellow-500' : 'bg-accent'}`}
                      style={{ width: `${Math.min(percentUsed, 100)}%` }}
                    ></div>
                  </div>
                  <p className={`text-sm font-bold mt-3 text-center ${remainingSeats === 0 ? 'text-red-500' : 'text-muted-foreground'}`}>
                    {remainingSeats > 0 ? `${remainingSeats} seats available for deployment.` : 'No seats remaining!'}
                  </p>
                </div>

                {/* Checkout Form */}
                {remainingSeats > 0 && !isExpired && (
                  <div className="space-y-4 pt-6 border-t border-[#A3B1C6]/20">
                    {error && (
                      <div className="p-3 bg-red-500/10 text-red-500 border border-red-500/20 rounded-xl text-xs font-bold">
                        {error}
                      </div>
                    )}
                    <label className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Deploy to Asset</label>
                    <select 
                      value={selectedAssetId}
                      onChange={(e) => setSelectedAssetId(e.target.value)}
                      className="w-full h-12 px-4 bg-background shadow-neu-inset border-t border-l border-[#A3B1C6]/30 border-b border-r border-white/60 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-accent/50 text-foreground appearance-none"
                    >
                      <option value="">Select an Asset...</option>
                      {assets.map(a => (
                        <option key={a.id} value={a.id}>{a.tag} ({a.hostname || 'No Hostname'})</option>
                      ))}
                    </select>
                    
                    <Button 
                      onClick={handleAssign} 
                      disabled={isAssigning || !selectedAssetId}
                      className="w-full h-12 rounded-xl shadow-neu-extruded bg-accent text-white font-bold hover:bg-accent-light"
                    >
                      <Plus className="w-5 h-5 mr-2" /> Assign License
                    </Button>
                  </div>
                )}

              </CardContent>
            </Card>

          </div>

        </div>
      </div>
    </div>
  )
}
