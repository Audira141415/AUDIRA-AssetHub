"use client"

import { useState, useEffect, use } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { 
  ChevronRight, ArrowLeft, Mail, Phone, ExternalLink, 
  Box, MapPin, Search, Server, Edit2, AlertTriangle, Star, DollarSign, Users, Calendar, Building2
} from "lucide-react"
import { apiClient } from "@/lib/api-client"
import { getAssetImage } from "@/lib/utils"
import { HeroSection } from "@/components/ui/hero-section"

export default function VendorDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  
  const [vendor, setVendor] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    const fetchVendor = async () => {
      try {
        setIsLoading(true);
        const res = await apiClient.get(`/vendors/${id}`);
        setVendor(res.data);
      } catch (err) {
        console.error("API fetch failed", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchVendor();
  }, [id])

  if (isLoading || !vendor) {
    return <div className="p-8 text-center text-muted-foreground font-bold h-screen flex items-center justify-center">Loading Vendor Details...</div>
  }

  const assets = vendor.assets || [];
  const activeAssets = assets.filter((a: any) => a.status === 'Active').length;
  
  const filteredAssets = assets.filter((a: any) => 
    a.tag.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (a.hostname && a.hostname.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const totalSpent = assets.reduce((sum: number, asset: any) => sum + (asset.purchaseCost || 0), 0);
  
  const isContractExpiring = vendor.contractExpiry ? new Date(vendor.contractExpiry).getTime() - new Date().getTime() < 30 * 24 * 60 * 60 * 1000 : false;
  const isContractExpired = vendor.contractExpiry ? new Date(vendor.contractExpiry).getTime() < new Date().getTime() : false;

  return (
    <div className="relative min-h-[calc(100vh-80px)] flex flex-col p-8">
      {/* Header Profile Section */}
      <div className="max-w-[1400px] mx-auto w-full">
        <div className="flex items-center text-sm text-muted-foreground font-bold tracking-wider mb-4">
          <Link href="/vendors" className="hover:text-accent transition-colors flex items-center gap-1">
            <ArrowLeft className="w-4 h-4" /> Back to Vendors
          </Link>
          <ChevronRight className="w-4 h-4 mx-2 opacity-50" />
          <span className="text-accent">{vendor.name}</span>
        </div>

        <HeroSection 
          compact 
          title={vendor.name} 
          description={`${vendor.type} Vendor`}
          icon={<Building2 className="w-8 h-8 text-accent" />}
        >
          <span className="px-3 py-1.5 bg-accent/10 text-accent text-xs font-bold rounded-lg uppercase tracking-wider border border-accent/20">
            {vendor.type}
          </span>
          <span className={`px-3 py-1.5 text-xs font-bold rounded-lg uppercase tracking-wider border ${vendor.status === 'Active' ? 'bg-[#38B2AC]/10 text-[#38B2AC] border-[#38B2AC]/20' : 'bg-[#E53E3E]/10 text-[#E53E3E] border-[#E53E3E]/20'}`}>
            {vendor.status}
          </span>
          
          <div className="flex gap-4 ml-auto">
            <Button onClick={() => router.push('/vendors')} variant="outline" className="shadow-neu-extruded border-neu text-foreground h-10 px-6 rounded-xl font-bold text-sm hover:text-accent">
              <Edit2 className="w-4 h-4 mr-2" /> Edit Vendor
            </Button>
          </div>
        </HeroSection>
      </div>

      <div className="flex-1 w-full max-w-[1400px] mx-auto overflow-y-auto pb-8">
        <div className="space-y-8">

          {/* Contract Expiry Alert */}
          {(isContractExpiring || isContractExpired) && (
            <div className={`p-4 rounded-2xl border-l-4 shadow-neu-extruded flex items-start gap-4 ${isContractExpired ? 'bg-red-500/10 border-red-500 text-red-600' : 'bg-yellow-500/10 border-yellow-500 text-yellow-600'}`}>
              <AlertTriangle className="w-6 h-6 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-lg mb-1">{isContractExpired ? 'Contract Expired' : 'Contract Expiring Soon'}</h4>
                <p className="text-sm font-medium">The SLA/MSA contract with {vendor.name} {isContractExpired ? 'has expired on' : 'is expiring on'} {new Date(vendor.contractExpiry).toLocaleDateString()}. Please contact the Account Manager to renew.</p>
              </div>
            </div>
          )}
          
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* Contact Info */}
            <Card className="lg:col-span-1 rounded-[32px] border-neu shadow-neu-extruded bg-background">
              <CardHeader className="pb-4 border-b border-[#A3B1C6]/20 px-8">
                <CardTitle className="text-lg font-bold text-foreground">Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="p-8 space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center text-accent shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Support Email</p>
                    <p className="text-sm font-bold text-foreground truncate">{vendor.email || "Not Provided"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center text-accent shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Phone Number</p>
                    <p className="text-sm font-bold text-foreground truncate">{vendor.phone || "Not Provided"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center text-accent shrink-0">
                    <ExternalLink className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Portal / Website</p>
                    <p className="text-sm font-bold text-accent hover:underline cursor-pointer truncate">
                      {vendor.name.toLowerCase().replace(/\s+/g, '')}.com
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* SLA & Summary */}
            <Card className="xl:col-span-2 rounded-[32px] border-neu shadow-neu-extruded bg-background flex flex-col">
              <CardHeader className="pb-4 border-b border-[#A3B1C6]/20 px-8 flex flex-row items-center justify-between">
                <CardTitle className="text-lg font-bold text-foreground">Performance & Financial Summary</CardTitle>
                {vendor.rating && (
                  <div className="flex items-center gap-1 bg-[#F59E0B]/10 text-[#F59E0B] px-3 py-1 rounded-full text-sm font-bold shadow-neu-inset">
                    <Star className="w-4 h-4 fill-current" />
                    {vendor.rating} / 5.0
                  </div>
                )}
              </CardHeader>
              <CardContent className="p-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 flex-1">
                <div className="bg-background shadow-neu-inset rounded-2xl p-6 flex flex-col justify-center items-center text-center">
                  <Box className="w-8 h-8 text-accent mb-3" />
                  <p className="text-3xl font-display font-bold text-foreground mb-1">{assets.length}</p>
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Total Assets</p>
                </div>
                <div className="bg-background shadow-neu-inset rounded-2xl p-6 flex flex-col justify-center items-center text-center">
                  <Server className="w-8 h-8 text-[#38B2AC] mb-3" />
                  <p className="text-3xl font-display font-bold text-foreground mb-1">{activeAssets}</p>
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Active in Prod</p>
                </div>
                <div className="bg-background shadow-neu-inset rounded-2xl p-6 flex flex-col justify-center items-center text-center">
                  <DollarSign className="w-8 h-8 text-[#E53E3E] mb-3" />
                  <p className="text-xl font-display font-bold text-foreground mb-1 line-clamp-1">${totalSpent.toLocaleString()}</p>
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Total CAPEX</p>
                </div>
                <div className="bg-background shadow-neu-inset rounded-2xl p-6 flex flex-col justify-center items-center text-center">
                  <Calendar className="w-8 h-8 text-[#F59E0B] mb-3" />
                  <p className="text-xl font-display font-bold text-foreground mb-1 line-clamp-1">
                    {vendor.contractExpiry ? new Date(vendor.contractExpiry).getFullYear() : 'N/A'}
                  </p>
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Contract Valid</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Escalation Matrix */}
          <Card className="rounded-[32px] border-neu shadow-neu-extruded bg-background">
            <CardHeader className="pb-4 border-b border-[#A3B1C6]/20 px-8">
              <CardTitle className="text-lg font-bold text-foreground">Escalation Matrix (Support Contacts)</CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 rounded-2xl bg-background shadow-neu-inset border-l-4 border-[#38B2AC]">
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Level 1 - Standard Support</p>
                  <p className="font-bold text-foreground mb-1">Helpdesk Team</p>
                  <p className="text-sm text-accent font-medium flex items-center gap-2"><Phone className="w-3 h-3" /> {vendor.techSupportL1Phone || vendor.phone || 'N/A'}</p>
                </div>
                <div className="p-6 rounded-2xl bg-background shadow-neu-inset border-l-4 border-[#F59E0B]">
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Level 2 - Escalation</p>
                  <p className="font-bold text-foreground mb-1">Senior Engineer</p>
                  <p className="text-sm text-accent font-medium flex items-center gap-2"><Phone className="w-3 h-3" /> {vendor.techSupportL2Phone || 'N/A'}</p>
                </div>
                <div className="p-6 rounded-2xl bg-background shadow-neu-inset border-l-4 border-[#E53E3E]">
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Level 3 - Account Manager</p>
                  <p className="font-bold text-foreground mb-1">{vendor.accountManagerName || 'N/A'}</p>
                  <div className="flex flex-col gap-1">
                    <p className="text-sm text-accent font-medium flex items-center gap-2"><Mail className="w-3 h-3" /> {vendor.accountManagerEmail || 'N/A'}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>


          {/* Assets Provided by this Vendor */}
          <Card className="rounded-[32px] border-neu shadow-neu-extruded bg-background">
            <CardHeader className="pb-4 border-b border-[#A3B1C6]/20 px-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <CardTitle className="text-lg font-bold text-foreground">Assets Provided ({filteredAssets.length})</CardTitle>
              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input 
                  type="text"
                  placeholder="Search assets..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-10 bg-background shadow-neu-inset rounded-xl pl-10 pr-4 text-sm font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all border-none"
                />
              </div>
            </CardHeader>
            <div className="overflow-x-auto rounded-b-[32px] p-2">
              <table className="w-full text-sm text-left border-collapse min-w-[800px]">
                <thead className="text-xs text-muted-foreground uppercase tracking-wider border-b border-[#A3B1C6]/30">
                  <tr>
                    <th className="px-6 py-4 font-bold rounded-tl-2xl">Asset Tag</th>
                    <th className="px-6 py-4 font-bold">Category</th>
                    <th className="px-6 py-4 font-bold">Hostname</th>
                    <th className="px-6 py-4 font-bold">Status</th>
                    <th className="px-6 py-4 font-bold">Location</th>
                    <th className="px-6 py-4 font-bold text-right rounded-tr-2xl">Action</th>
                  </tr>
                </thead>
                <tbody className="text-foreground">
                  {filteredAssets.length > 0 ? (
                    filteredAssets.map((asset: any) => (
                      <tr key={asset.id} className="hover:bg-[#A3B1C6]/10 transition-colors cursor-pointer" onClick={() => router.push(`/assets/${asset.tag}`)}>
                        <td className="px-6 py-4 font-bold text-accent border-b border-white/60">
                          {asset.tag}
                        </td>
                        <td className="px-6 py-4 border-b border-white/60">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-background shadow-neu-extruded flex items-center justify-center shrink-0 overflow-hidden p-1">
                              <img src={getAssetImage(asset.category?.name || "")} alt="Cat" className="w-full h-full object-contain" />
                            </div>
                            <span className="font-medium truncate max-w-[120px]">{asset.category?.name || "N/A"}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 font-medium border-b border-white/60">{asset.hostname || "-"}</td>
                        <td className="px-6 py-4 border-b border-white/60">
                          <span className={`px-3 py-1 text-xs font-bold rounded-lg uppercase tracking-wider ${asset.status === 'Active' ? 'bg-[#38B2AC]/10 text-[#38B2AC]' : 'bg-[#E53E3E]/10 text-[#E53E3E]'}`}>
                            {asset.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 border-b border-white/60">
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-muted-foreground shrink-0" />
                            <span className="font-medium truncate max-w-[150px]">{asset.location?.name || "N/A"}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 border-b border-white/60 text-right">
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-accent rounded-lg" onClick={(e) => { e.stopPropagation(); router.push(`/assets/${asset.tag}`); }}>
                            <ChevronRight className="w-4 h-4" />
                          </Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">
                        <div className="flex flex-col items-center justify-center">
                          <Box className="w-12 h-12 mb-4 opacity-20" />
                          <p className="font-bold">No assets found for this vendor.</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>

        </div>
      </div>
    </div>
  )
}
