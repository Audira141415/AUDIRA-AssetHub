"use client"

import { useState, useEffect } from "react"
import { HeroSection } from "@/components/ui/hero-section"
import { Button } from "@/components/ui/button"
import { Plus, Network, Server, Globe, Search } from "lucide-react"
import { apiClient } from "@/lib/api-client"

export default function NetworkPage() {
  const [subnets, setSubnets] = useState<any[]>([])
  const [ips, setIps] = useState<any[]>([])
  const [assets, setAssets] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const [activeTab, setActiveTab] = useState("Subnets")
  const [isSubnetModalOpen, setIsSubnetModalOpen] = useState(false)
  const [isIpModalOpen, setIsIpModalOpen] = useState(false)

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [subnetRes, ipRes, assetRes] = await Promise.all([
        apiClient.get('/network/subnets'),
        apiClient.get('/network/ips'),
        apiClient.get('/assets')
      ]);
      setSubnets(subnetRes.data);
      setIps(ipRes.data);
      setAssets(assetRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, [])

  return (
    <div className="flex flex-col w-full gap-6 pb-6 h-full">
      <HeroSection
        title="Network & IPAM"
        description="Manage IP address allocations, subnets, and VLANs for your infrastructure."
        imageSrc="/images/heroes/settings.png" /* Fallback image */
      >
        <div className="flex gap-4">
          <Button onClick={() => setIsSubnetModalOpen(true)} className="bg-accent hover:bg-accent/90 text-white shadow-neu-extruded rounded-2xl flex items-center gap-2 h-12 px-6 font-bold border-none">
            <Globe size={18} /> New Subnet
          </Button>
          <Button onClick={() => setIsIpModalOpen(true)} className="bg-[#38B2AC] hover:bg-[#319B96] text-white shadow-neu-extruded rounded-2xl flex items-center gap-2 h-12 px-6 font-bold border-none">
            <Plus size={18} /> Allocate IP
          </Button>
        </div>
      </HeroSection>

      <div className="flex border-b border-[#A3B1C6]/30 mb-2 overflow-x-auto">
        {["Subnets", "Allocated IPs"].map(tab => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-3 text-sm font-bold whitespace-nowrap transition-colors border-b-2 flex items-center gap-2 ${activeTab === tab ? 'text-accent border-accent' : 'text-muted-foreground hover:text-foreground border-transparent'}`}
          >
            {tab === "Subnets" ? <Network size={16} /> : <Server size={16} />}
            {tab}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto pr-2 pb-10">
        {isLoading ? (
          <div className="p-8 text-center font-bold text-muted-foreground">Loading Network Data...</div>
        ) : (
          <>
            {activeTab === "Subnets" && (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {subnets.map(subnet => (
                  <div key={subnet.id} className="bg-background shadow-neu-extruded border-neu rounded-2xl p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="w-12 h-12 bg-accent/10 text-accent rounded-xl flex items-center justify-center">
                        <Globe size={24} />
                      </div>
                      <span className="px-3 py-1 bg-[#A3B1C6]/20 text-foreground text-xs font-bold rounded-lg">VLAN {subnet.vlan || '-'}</span>
                    </div>
                    <h3 className="text-xl font-bold text-foreground mb-1">{subnet.name}</h3>
                    <p className="text-sm font-bold text-accent mb-4">{subnet.cidr}</p>
                    <p className="text-xs text-muted-foreground mb-4 line-clamp-2">{subnet.description || "No description"}</p>
                    
                    <div className="pt-4 border-t border-[#A3B1C6]/20 flex justify-between items-center text-xs font-bold text-muted-foreground">
                      <span>{subnet.ips?.length || 0} IPs Allocated</span>
                    </div>
                  </div>
                ))}
                {subnets.length === 0 && (
                  <div className="col-span-full p-8 text-center font-bold text-muted-foreground border-2 border-dashed border-[#A3B1C6]/30 rounded-2xl">
                    No subnets configured. Click "New Subnet" to create one.
                  </div>
                )}
              </div>
            )}

            {activeTab === "Allocated IPs" && (
              <div className="bg-background shadow-neu-extruded border-neu rounded-[32px] overflow-hidden">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-muted-foreground uppercase bg-background shadow-neu-inset-small">
                    <tr>
                      <th className="px-6 py-4 font-bold">IP Address</th>
                      <th className="px-6 py-4 font-bold">Subnet</th>
                      <th className="px-6 py-4 font-bold">Status</th>
                      <th className="px-6 py-4 font-bold">Linked Asset</th>
                      <th className="px-6 py-4 font-bold">Notes</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#A3B1C6]/20">
                    {ips.map(ip => (
                      <tr key={ip.id} className="hover:bg-background hover:shadow-neu-inset-small transition-all">
                        <td className="px-6 py-4 font-bold text-foreground">{ip.address}</td>
                        <td className="px-6 py-4 font-medium text-muted-foreground">{ip.subnet?.name || "-"}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 text-[10px] font-bold rounded-md uppercase tracking-wider ${ip.status === 'Active' ? 'bg-green-500/10 text-green-500' : 'bg-amber-500/10 text-amber-500'}`}>
                            {ip.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 font-bold text-accent">{ip.asset?.tag || ip.asset?.hostname || "Unassigned"}</td>
                        <td className="px-6 py-4 text-xs text-muted-foreground">{ip.notes || "-"}</td>
                      </tr>
                    ))}
                    {ips.length === 0 && (
                      <tr>
                        <td colSpan={5} className="px-6 py-8 text-center font-bold text-muted-foreground">
                          No IP addresses allocated yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>

      {isSubnetModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-background shadow-neu-extruded border-neu rounded-[32px] p-8 max-w-md w-full">
            <h2 className="text-2xl font-bold text-foreground mb-6">Create New Subnet</h2>
            <form onSubmit={async (e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              try {
                await apiClient.post('/network/subnets', {
                  name: formData.get('name'),
                  cidr: formData.get('cidr'),
                  vlan: formData.get('vlan'),
                  description: formData.get('description')
                });
                setIsSubnetModalOpen(false);
                fetchData();
              } catch (err) { console.error(err); }
            }}>
              <div className="space-y-4 mb-8">
                <div>
                  <label className="text-xs font-bold text-muted-foreground uppercase mb-2 block">Subnet Name</label>
                  <input type="text" name="name" required className="w-full h-12 px-4 rounded-xl bg-background shadow-neu-inset border-neu focus:outline-none font-medium text-sm text-foreground" placeholder="e.g. Server Mgmt Network" />
                </div>
                <div>
                  <label className="text-xs font-bold text-muted-foreground uppercase mb-2 block">CIDR Block</label>
                  <input type="text" name="cidr" required className="w-full h-12 px-4 rounded-xl bg-background shadow-neu-inset border-neu focus:outline-none font-medium text-sm text-foreground" placeholder="e.g. 192.168.10.0/24" />
                </div>
                <div>
                  <label className="text-xs font-bold text-muted-foreground uppercase mb-2 block">VLAN ID (Optional)</label>
                  <input type="number" name="vlan" className="w-full h-12 px-4 rounded-xl bg-background shadow-neu-inset border-neu focus:outline-none font-medium text-sm text-foreground" placeholder="e.g. 10" />
                </div>
                <div>
                  <label className="text-xs font-bold text-muted-foreground uppercase mb-2 block">Description</label>
                  <input type="text" name="description" className="w-full h-12 px-4 rounded-xl bg-background shadow-neu-inset border-neu focus:outline-none font-medium text-sm text-foreground" />
                </div>
              </div>
              <div className="flex gap-4 justify-end">
                <Button type="button" variant="outline" className="shadow-neu-extruded h-12 px-6 rounded-xl font-bold" onClick={() => setIsSubnetModalOpen(false)}>Cancel</Button>
                <Button type="submit" className="shadow-neu-extruded h-12 px-6 rounded-xl font-bold bg-accent text-white">Create Subnet</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isIpModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-background shadow-neu-extruded border-neu rounded-[32px] p-8 max-w-md w-full">
            <h2 className="text-2xl font-bold text-foreground mb-6">Allocate IP Address</h2>
            <form onSubmit={async (e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              try {
                await apiClient.post('/network/ips', {
                  address: formData.get('address'),
                  subnetId: formData.get('subnetId'),
                  assetId: formData.get('assetId') || null,
                  status: formData.get('status'),
                  notes: formData.get('notes')
                });
                setIsIpModalOpen(false);
                fetchData();
              } catch (err) { console.error(err); }
            }}>
              <div className="space-y-4 mb-8">
                <div>
                  <label className="text-xs font-bold text-muted-foreground uppercase mb-2 block">IP Address</label>
                  <input type="text" name="address" required className="w-full h-12 px-4 rounded-xl bg-background shadow-neu-inset border-neu focus:outline-none font-medium text-sm text-foreground" placeholder="e.g. 192.168.10.50" />
                </div>
                <div>
                  <label className="text-xs font-bold text-muted-foreground uppercase mb-2 block">Parent Subnet</label>
                  <select name="subnetId" required className="w-full h-12 px-4 rounded-xl bg-background shadow-neu-inset border-neu focus:outline-none font-medium text-sm text-foreground appearance-none">
                    <option value="">Select Subnet...</option>
                    {subnets.map(s => <option key={s.id} value={s.id}>{s.name} ({s.cidr})</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-muted-foreground uppercase mb-2 block">Linked Asset (Optional)</label>
                  <select name="assetId" className="w-full h-12 px-4 rounded-xl bg-background shadow-neu-inset border-neu focus:outline-none font-medium text-sm text-foreground appearance-none">
                    <option value="">None</option>
                    {assets.map(a => <option key={a.id} value={a.id}>{a.tag} - {a.hostname}</option>)}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-muted-foreground uppercase mb-2 block">Status</label>
                    <select name="status" className="w-full h-12 px-4 rounded-xl bg-background shadow-neu-inset border-neu focus:outline-none font-medium text-sm text-foreground appearance-none">
                      <option value="Active">Active</option>
                      <option value="Reserved">Reserved</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-muted-foreground uppercase mb-2 block">Notes</label>
                    <input type="text" name="notes" className="w-full h-12 px-4 rounded-xl bg-background shadow-neu-inset border-neu focus:outline-none font-medium text-sm text-foreground" />
                  </div>
                </div>
              </div>
              <div className="flex gap-4 justify-end">
                <Button type="button" variant="outline" className="shadow-neu-extruded h-12 px-6 rounded-xl font-bold" onClick={() => setIsIpModalOpen(false)}>Cancel</Button>
                <Button type="submit" className="shadow-neu-extruded h-12 px-6 rounded-xl font-bold bg-[#38B2AC] text-white">Allocate IP</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
