"use client"

import { useState, useRef, useEffect, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { HeroSection } from "@/components/ui/hero-section"
import { 
  Printer, Scan, CheckCircle2, AlertCircle,
  Search, Box, MapPin, ChevronDown
} from "lucide-react"
import QRCode from "react-qr-code"
import { Html5QrcodeScanner } from "html5-qrcode"
import { apiClient } from "@/lib/api-client"

export default function AuditingPage() {
  const [activeTab, setActiveTab] = useState("Asset Labels")
  
  const [assets, setAssets] = useState<any[]>([])
  const [locations, setLocations] = useState<any[]>([])
  
  // Tab: Asset Labels
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedAssets, setSelectedAssets] = useState<string[]>([])
  
  // Tab: Audit Mode
  const [auditLocation, setAuditLocation] = useState("")
  const [scanInput, setScanInput] = useState("")
  const [scannedTags, setScannedTags] = useState<string[]>([])
  const [misplacedTags, setMisplacedTags] = useState<string[]>([])
  const [isScannerActive, setIsScannerActive] = useState(false)
  
  const scanInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [assetRes, locRes] = await Promise.all([
          apiClient.get('/auditing'),
          apiClient.get('/locations')
        ]);
        setAssets(assetRes.data);
        
        const locs = locRes.data.map((l: any) => l.name);
        setLocations(Array.from(new Set(locs)));
        if (locs.length > 0) setAuditLocation(locs[0]);
      } catch (err) {
        console.error("Failed to fetch data for auditing", err);
      }
    };
    fetchData();
  }, []);

  const filteredAssets = useMemo(() => {
    return assets.filter(asset => 
      asset.assetTag.toLowerCase().includes(searchQuery.toLowerCase()) || 
      asset.assetName.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [assets, searchQuery]);

  const toggleAssetSelection = (id: string) => {
    setSelectedAssets(prev => 
      prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]
    )
  }

  const toggleAllAssets = () => {
    if (selectedAssets.length === filteredAssets.length) {
      setSelectedAssets([])
    } else {
      setSelectedAssets(filteredAssets.map(a => a.id))
    }
  }

  const handlePrint = () => {
    window.print()
  }

  // Audit Logic
  const expectedAssets = assets.filter(a => a.location === auditLocation)
  const foundAssets = expectedAssets.filter(a => scannedTags.includes(a.assetTag))
  const missingAssets = expectedAssets.filter(a => !scannedTags.includes(a.assetTag))
  
  const handleScanSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const tag = scanInput.trim().toUpperCase()
    if (!tag) return

    const isExpected = expectedAssets.some(a => a.assetTag.toUpperCase() === tag)
    
    if (isExpected) {
      if (!scannedTags.includes(tag)) {
        setScannedTags(prev => [...prev, tag])
      }
    } else {
      const assetExists = assets.some(a => a.assetTag.toUpperCase() === tag)
      if (assetExists && !misplacedTags.includes(tag)) {
        setMisplacedTags(prev => [...prev, tag])
      } else if (!assetExists && !misplacedTags.includes(tag)) {
        setMisplacedTags(prev => [...prev, `${tag} (Unknown)`])
      }
    }
    setScanInput("")
    setTimeout(() => scanInputRef.current?.focus(), 10)
  }

  const handleResetAudit = () => {
    setScannedTags([])
    setMisplacedTags([])
    setScanInput("")
    setTimeout(() => scanInputRef.current?.focus(), 100)
  }

  // HTML5 QR Code Scanner Setup
  useEffect(() => {
    if (activeTab === "Audit Mode" && isScannerActive) {
      const scanner = new Html5QrcodeScanner(
        "reader",
        { fps: 10, qrbox: { width: 250, height: 250 } },
        false
      );

      scanner.render((decodedText) => {
        // Automatically submit the scanned text
        const tag = decodedText.trim().toUpperCase();
        if (tag) {
          const isExpected = expectedAssets.some(a => a.assetTag.toUpperCase() === tag)
          if (isExpected) {
            if (!scannedTags.includes(tag)) setScannedTags(prev => [...prev, tag])
          } else {
            const assetExists = assets.some(a => a.assetTag.toUpperCase() === tag)
            if (assetExists && !misplacedTags.includes(tag)) setMisplacedTags(prev => [...prev, tag])
            else if (!assetExists && !misplacedTags.includes(tag)) setMisplacedTags(prev => [...prev, `${tag} (Unknown)`])
          }
        }
        scanner.clear();
        setIsScannerActive(false);
      }, (error) => {
        // ignore errors (expected when no QR code in frame)
      });

      return () => {
        scanner.clear().catch(e => console.error("Failed to clear scanner", e));
      }
    }
  }, [activeTab, isScannerActive, expectedAssets, assets, scannedTags, misplacedTags]);

  useEffect(() => {
    if (activeTab === "Audit Mode") {
      handleResetAudit()
    } else {
      setIsScannerActive(false)
    }
  }, [auditLocation, activeTab])

  return (
    <div className="flex w-full gap-6 pb-6 px-6 print:bg-white print:p-0">
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          body * { visibility: hidden; }
          #printable-labels, #printable-labels * { visibility: visible; }
          #printable-labels { position: absolute; left: 0; top: 0; width: 100%; }
        }
      `}} />

      <div className="flex-1 flex flex-col min-w-0 transition-all duration-300">
        
        <div className="print:hidden">
          <HeroSection
            title="Auditing & Labels"
            description="Generate asset QR code labels and conduct physical reconciliation audits."
            imageSrc="/images/heroes/auditing.png" 
          >
            <div className="flex gap-4 flex-wrap">
              <Button variant="ghost" className="bg-background/50 backdrop-blur-md shadow-neu-extruded text-foreground hover:text-accent hover:shadow-neu-hover active:shadow-neu-inset-small rounded-2xl flex items-center gap-2 h-12 px-6 transition-all font-bold whitespace-nowrap">
                <Box size={18} /> Asset History
              </Button>
            </div>
          </HeroSection>
        </div>

        <div className="flex border-b border-[#A3B1C6]/30 mb-6 overflow-x-auto [&::-webkit-scrollbar]:hidden print:hidden mt-2">
          {["Asset Labels", "Audit Mode"].map(tab => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 text-sm font-bold whitespace-nowrap transition-colors border-b-2 ${activeTab === tab ? 'text-accent border-accent' : 'text-muted-foreground hover:text-foreground border-transparent'}`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="flex-1 pr-2 pb-10 space-y-6 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          
          {activeTab === "Asset Labels" && (
            <div className="flex flex-col xl:flex-row gap-6 print:block">
              <div className="flex-1 flex flex-col gap-4 print:hidden">
                <div className="bg-background shadow-neu-extruded border-neu rounded-[32px] p-6 flex flex-col h-[600px]">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-foreground">Select Assets</h2>
                    <span className="text-sm font-bold text-accent px-3 py-1 bg-accent/10 rounded-lg">{selectedAssets.length} Selected</span>
                  </div>
                  
                  <div className="relative mb-4">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input 
                      placeholder="Search assets..." 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full h-12 pl-12 pr-4 bg-background shadow-neu-inset border-t border-l border-[#A3B1C6]/30 border-b border-r border-white/60 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-accent/50 text-foreground" 
                    />
                  </div>

                  <div className="flex-1 overflow-y-auto rounded-xl border border-[#A3B1C6]/20 divide-y divide-[#A3B1C6]/10">
                    <div className="flex items-center p-3 bg-background shadow-neu-inset-small sticky top-0 z-10">
                      <input 
                        type="checkbox" 
                        className="w-4 h-4 rounded border-gray-300 mr-4 accent-accent"
                        checked={selectedAssets.length > 0 && selectedAssets.length === filteredAssets.length}
                        onChange={toggleAllAssets}
                      />
                      <span className="text-xs font-bold text-muted-foreground uppercase">Select All</span>
                    </div>
                    {filteredAssets.map(asset => (
                      <label key={asset.id} className="flex items-center p-3 hover:bg-[#A3B1C6]/5 cursor-pointer transition-colors">
                        <input 
                          type="checkbox" 
                          className="w-4 h-4 rounded border-gray-300 mr-4 accent-accent"
                          checked={selectedAssets.includes(asset.id)}
                          onChange={() => toggleAssetSelection(asset.id)}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-foreground truncate">{asset.assetTag}</p>
                          <p className="text-xs text-muted-foreground truncate">{asset.assetName}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <div className="w-full xl:w-[400px] shrink-0 print:w-full print:block">
                <div className="bg-background shadow-neu-extruded border-neu rounded-[32px] p-6 h-[600px] flex flex-col print:shadow-none print:border-none print:p-0 print:h-auto print:bg-white print:rounded-none">
                  <div className="flex items-center justify-between mb-6 print:hidden">
                    <h2 className="text-xl font-bold text-foreground">Label Preview</h2>
                    <Button 
                      onClick={handlePrint}
                      disabled={selectedAssets.length === 0}
                      className="bg-accent hover:bg-accent/90 text-white shadow-neu-extruded hover:shadow-neu-hover active:shadow-neu-inset-small rounded-xl h-10 px-4 transition-all font-bold border-none"
                    >
                      <Printer size={16} className="mr-2" /> Print Labels
                    </Button>
                  </div>

                  {selectedAssets.length === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center text-center p-6 border-2 border-dashed border-[#A3B1C6]/30 rounded-2xl print:hidden">
                      <Printer size={32} className="text-muted-foreground opacity-50 mb-4" />
                      <p className="text-sm font-bold text-muted-foreground">No assets selected</p>
                    </div>
                  ) : (
                    <div id="printable-labels" className="flex-1 overflow-y-auto space-y-4 pr-2 [&::-webkit-scrollbar]:hidden print:overflow-visible print:pr-0 print:grid print:grid-cols-2 print:gap-4 print:space-y-0">
                      {selectedAssets.map(id => {
                        const asset = assets.find(a => a.id === id)
                        if (!asset) return null;
                        return (
                          <div key={id} className="bg-white p-4 rounded-2xl border-2 border-gray-200 flex gap-4 break-inside-avoid print:border-gray-300 print:rounded-lg print:shadow-none">
                            <div className="bg-white p-1 rounded-lg border border-gray-200 shrink-0">
                              <QRCode value={asset.assetTag} size={80} level="M" />
                            </div>
                            <div className="flex-1 min-w-0 flex flex-col justify-center">
                              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-0.5">Audira AssetHub</p>
                              <p className="text-lg font-black text-black truncate leading-tight mb-1">{asset.assetTag}</p>
                              <p className="text-xs font-medium text-gray-700 truncate">{asset.assetName}</p>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === "Audit Mode" && (
            <div className="flex flex-col xl:flex-row gap-6">
              <div className="w-full xl:w-[350px] flex flex-col gap-6 shrink-0">
                <div className="bg-background shadow-neu-extruded border-neu rounded-[32px] p-6">
                  <h2 className="text-xl font-bold text-foreground mb-4">Audit Setup</h2>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs font-bold text-muted-foreground mb-2 block">Target Location</label>
                      <div className="relative">
                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <select 
                          value={auditLocation}
                          onChange={(e) => setAuditLocation(e.target.value)}
                          className="w-full appearance-none h-12 pl-10 pr-10 bg-background shadow-neu-inset border-t border-l border-[#A3B1C6]/30 border-b border-r border-white/60 rounded-xl text-sm font-bold cursor-pointer text-foreground focus:outline-none focus:ring-2 focus:ring-accent/50"
                        >
                          {locations.map((loc: string) => (
                            <option key={loc} value={loc}>{loc}</option>
                          ))}
                        </select>
                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                      </div>
                    </div>

                    <div className="pt-2">
                      <div className="flex justify-between items-center mb-2">
                        <label className="text-xs font-bold text-muted-foreground block">Scanner Input</label>
                        <Button variant="ghost" size="sm" className="h-6 text-[10px] bg-accent/10 text-accent font-bold px-2 rounded-md hover:bg-accent hover:text-white" onClick={() => setIsScannerActive(!isScannerActive)}>
                          {isScannerActive ? 'Stop Camera' : 'Use Camera'}
                        </Button>
                      </div>
                      
                      {isScannerActive && (
                        <div id="reader" className="w-full overflow-hidden rounded-xl border border-accent/30 mb-4 bg-black/5"></div>
                      )}

                      <form onSubmit={handleScanSubmit} className="relative">
                        <Scan className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-accent" />
                        <Input 
                          ref={scanInputRef}
                          placeholder="Scan or type Asset Tag..." 
                          value={scanInput}
                          onChange={(e) => setScanInput(e.target.value)}
                          className="w-full h-12 pl-10 pr-4 bg-background shadow-neu-inset-deep border border-accent/50 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-accent text-foreground uppercase placeholder:normal-case" 
                          autoFocus={!isScannerActive}
                        />
                        <button type="submit" className="hidden">Submit</button>
                      </form>
                    </div>
                  </div>
                </div>

                <div className="bg-background shadow-neu-extruded border-neu rounded-[32px] p-6">
                  <h2 className="text-lg font-bold text-foreground mb-4">Progress Summary</h2>
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="font-bold text-muted-foreground">Completion</span>
                        <span className="font-black text-foreground">{Math.round((foundAssets.length / (expectedAssets.length || 1)) * 100) || 0}%</span>
                      </div>
                      <div className="w-full bg-[#A3B1C6]/20 rounded-full h-2 shadow-neu-inset overflow-hidden">
                        <div className="bg-accent h-2 rounded-full transition-all duration-500" style={{ width: `${(foundAssets.length / (expectedAssets.length || 1)) * 100 || 0}%` }}></div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 pt-2">
                      <div className="bg-background shadow-neu-inset-small rounded-xl p-3 text-center border border-white/50">
                        <p className="text-2xl font-black text-foreground">{expectedAssets.length}</p>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase">Expected</p>
                      </div>
                      <div className="bg-background shadow-neu-inset-small rounded-xl p-3 text-center border border-white/50">
                        <p className="text-2xl font-black text-green-500">{foundAssets.length}</p>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase">Found</p>
                      </div>
                      <div className="bg-background shadow-neu-inset-small rounded-xl p-3 text-center border border-white/50">
                        <p className="text-2xl font-black text-red-500">{missingAssets.length}</p>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase">Missing</p>
                      </div>
                      <div className="bg-background shadow-neu-inset-small rounded-xl p-3 text-center border border-white/50">
                        <p className="text-2xl font-black text-amber-500">{misplacedTags.length}</p>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase">Misplaced</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex-1 flex flex-col gap-6">
                <div className="bg-background shadow-neu-extruded border-neu rounded-[32px] p-6 flex flex-col min-h-[300px]">
                  <div className="flex items-center justify-between mb-4 pb-4 border-b border-[#A3B1C6]/20">
                    <h2 className="text-lg font-bold text-foreground">Expected in {auditLocation}</h2>
                    <Button variant="ghost" onClick={handleResetAudit} className="text-xs h-8 px-3 rounded-lg shadow-neu-extruded hover:text-red-500 hover:shadow-neu-hover active:shadow-neu-inset-small">
                      Reset Audit
                    </Button>
                  </div>
                  
                  <div className="flex-1 overflow-y-auto space-y-2 pr-2 [&::-webkit-scrollbar]:hidden">
                    {expectedAssets.map(asset => {
                      const isFound = scannedTags.includes(asset.assetTag)
                      return (
                        <div key={asset.id} className={`p-3 rounded-xl flex items-center justify-between border transition-all ${isFound ? 'bg-green-500/10 border-green-500/30 shadow-[inset_4px_0_0_0_#22c55e]' : 'bg-background shadow-neu-extruded border-white/50'}`}>
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${isFound ? 'bg-green-500 text-white shadow-md' : 'bg-background shadow-neu-inset text-muted-foreground'}`}>
                              {isFound ? <CheckCircle2 size={16} /> : <Box size={16} />}
                            </div>
                            <div>
                              <p className={`font-bold text-sm ${isFound ? 'text-green-700 dark:text-green-400' : 'text-foreground'}`}>{asset.assetTag}</p>
                              <p className="text-xs text-muted-foreground">{asset.assetName}</p>
                            </div>
                          </div>
                          <span className={`text-[10px] font-bold px-2 py-1 rounded-md ${isFound ? 'text-green-700 bg-green-500/20' : 'text-red-500 bg-red-500/10'}`}>
                            {isFound ? 'Found' : 'Missing'}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {misplacedTags.length > 0 && (
                  <div className="bg-background shadow-neu-extruded border-neu rounded-[32px] p-6 border-l-4 border-l-amber-500">
                    <div className="flex items-center gap-2 mb-4">
                      <AlertCircle className="text-amber-500 w-5 h-5" />
                      <h2 className="text-lg font-bold text-foreground">Misplaced Assets</h2>
                    </div>
                    
                    <div className="space-y-2">
                      {misplacedTags.map(tag => {
                        const actualAsset = assets.find(a => a.assetTag.toUpperCase() === tag)
                        return (
                          <div key={tag} className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl flex justify-between items-center">
                            <div>
                              <p className="font-bold text-amber-700 dark:text-amber-400 text-sm">{tag}</p>
                              <p className="text-xs text-muted-foreground">
                                {actualAsset ? `Expected in: ${actualAsset.location}` : 'Asset not found in database'}
                              </p>
                            </div>
                            <Button variant="ghost" size="sm" className="h-8 text-xs font-bold text-amber-700 hover:bg-amber-500/20" onClick={() => setMisplacedTags(prev => prev.filter(t => t !== tag))}>
                              Remove
                            </Button>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}
                
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}
