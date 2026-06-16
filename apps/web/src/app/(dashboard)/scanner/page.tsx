"use client"

import { useEffect, useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { Html5Qrcode } from "html5-qrcode"
import { HeroSection } from "@/components/ui/hero-section"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Scan, Keyboard, Camera, History, ArrowRight, QrCode, X, Search } from "lucide-react"

export default function ScannerPage() {
  const router = useRouter()
  const [scanResult, setScanResult] = useState<string | null>(null)
  const [isScanning, setIsScanning] = useState(false)
  const [manualCode, setManualCode] = useState("")
  const [mode, setMode] = useState<"scan" | "manual">("scan")
  
  const scannerRef = useRef<Html5Qrcode | null>(null)

  useEffect(() => {
    // Cleanup on unmount
    return () => {
      if (scannerRef.current && isScanning) {
        scannerRef.current.stop().catch(console.error)
      }
    }
  }, [isScanning])

  const startScanner = async () => {
    try {
      if (!scannerRef.current) {
        scannerRef.current = new Html5Qrcode("reader")
      }
      setIsScanning(true)
      
      await scannerRef.current.start(
        { facingMode: "environment" },
        { 
          fps: 10, 
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1.0 
        },
        (decodedText) => {
          setScanResult(decodedText)
          scannerRef.current?.stop().catch(console.error)
          setIsScanning(false)
          
          setTimeout(() => {
            router.push(`/assets/${encodeURIComponent(decodedText)}`)
          }, 1500)
        },
        (errorMessage) => {
          // ignore continuous scan errors
        }
      )
    } catch (err) {
      console.error("Failed to start scanner", err)
      setIsScanning(false)
      alert("Failed to access camera. Please ensure permissions are granted.")
    }
  }

  const stopScanner = async () => {
    if (scannerRef.current && isScanning) {
      try {
        await scannerRef.current.stop()
        setIsScanning(false)
      } catch (err) {
        console.error("Failed to stop scanner", err)
      }
    }
  }

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (manualCode.trim()) {
      router.push(`/assets/${encodeURIComponent(manualCode.trim())}`)
    }
  }

  const toggleMode = (newMode: "scan" | "manual") => {
    if (newMode === "manual" && isScanning) {
      stopScanner()
    }
    setMode(newMode)
  }

  return (
    <div className="space-y-8 pb-10">
      <HeroSection
        title="Asset Scanner"
        description="Quickly identify assets using QR codes, Barcodes, or manual entry."
        imageSrc="/images/heroes/scanner.png"
      >
        <div className="flex bg-background shadow-neu-inset-small p-1.5 rounded-2xl gap-1 max-w-sm mt-4">
          <button 
            onClick={() => toggleMode("scan")} 
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold transition-all ${mode === "scan" ? 'bg-background shadow-neu-extruded text-accent' : 'text-muted-foreground hover:text-foreground'}`}
          >
            <QrCode size={16} /> QR / Barcode
          </button>
          <button 
            onClick={() => toggleMode("manual")} 
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold transition-all ${mode === "manual" ? 'bg-background shadow-neu-extruded text-accent' : 'text-muted-foreground hover:text-foreground'}`}
          >
            <Keyboard size={16} /> Manual Entry
          </button>
        </div>
      </HeroSection>
      
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-2">
            <div className="bg-background shadow-neu-extruded border-neu rounded-[32px] p-8 min-h-[500px] flex flex-col items-center justify-center relative overflow-hidden">
              
              {scanResult ? (
                <div className="text-center p-8 animate-in zoom-in duration-300">
                  <div className="w-24 h-24 bg-[#38B2AC]/10 rounded-full flex items-center justify-center mx-auto mb-6 shadow-neu-inset">
                    <Scan className="w-12 h-12 text-[#38B2AC]" />
                  </div>
                  <h2 className="text-3xl font-bold text-foreground mb-4">Code Scanned!</h2>
                  <div className="bg-background shadow-neu-inset-deep border border-white/50 py-4 px-8 rounded-2xl inline-block mb-6">
                    <p className="text-xl font-mono font-bold text-accent tracking-widest">{scanResult}</p>
                  </div>
                  <p className="text-sm font-bold text-muted-foreground animate-pulse flex items-center justify-center gap-2">
                    Redirecting to asset details <ArrowRight size={16} className="animate-bounce-x" />
                  </p>
                </div>
              ) : mode === "scan" ? (
                <div className="w-full max-w-md mx-auto flex flex-col items-center">
                  <div className="relative w-full aspect-square bg-background shadow-neu-inset-deep border-neu rounded-3xl overflow-hidden mb-8 flex items-center justify-center p-2">
                    <div id="reader" className="w-full h-full rounded-2xl overflow-hidden bg-black/5 flex items-center justify-center relative z-10 [&>video]:object-cover [&>video]:w-full [&>video]:h-full">
                      {!isScanning && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground opacity-50 z-20">
                          <Camera size={48} className="mb-4" />
                          <p className="font-bold text-sm">Camera Offline</p>
                        </div>
                      )}
                    </div>
                    
                    {/* Scanner overlay visuals */}
                    {isScanning && (
                      <div className="absolute inset-4 z-20 pointer-events-none">
                        <div className="absolute top-0 left-0 w-12 h-12 border-t-4 border-l-4 border-accent rounded-tl-xl"></div>
                        <div className="absolute top-0 right-0 w-12 h-12 border-t-4 border-r-4 border-accent rounded-tr-xl"></div>
                        <div className="absolute bottom-0 left-0 w-12 h-12 border-b-4 border-l-4 border-accent rounded-bl-xl"></div>
                        <div className="absolute bottom-0 right-0 w-12 h-12 border-b-4 border-r-4 border-accent rounded-br-xl"></div>
                        <div className="absolute top-0 left-0 w-full h-1 bg-accent/50 shadow-[0_0_20px_theme(colors.accent)] animate-scan"></div>
                      </div>
                    )}
                  </div>

                  {!isScanning ? (
                    <Button onClick={startScanner} className="h-14 px-8 rounded-2xl bg-accent hover:bg-accent/90 text-white shadow-neu-extruded hover:shadow-neu-hover active:shadow-neu-inset-small font-bold text-base w-full max-w-xs transition-all flex gap-3">
                      <Scan size={20} /> Start Scanner
                    </Button>
                  ) : (
                    <Button onClick={stopScanner} className="h-14 px-8 rounded-2xl bg-background border-2 border-red-500/20 text-red-500 shadow-neu-extruded hover:shadow-neu-hover active:shadow-neu-inset-small font-bold text-base w-full max-w-xs transition-all flex gap-3">
                      <X size={20} /> Stop Scanner
                    </Button>
                  )}
                </div>
              ) : (
                <div className="w-full max-w-md mx-auto flex flex-col items-center py-12 animate-in fade-in duration-300">
                  <div className="w-24 h-24 bg-background shadow-neu-extruded rounded-full flex items-center justify-center mb-8 text-accent">
                    <Keyboard size={40} />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground mb-2">Manual Entry</h3>
                  <p className="text-muted-foreground font-medium text-center mb-8">Enter the asset tag or serial number directly if the QR code is unreadable.</p>
                  
                  <form onSubmit={handleManualSubmit} className="w-full flex flex-col gap-6">
                    <div className="relative">
                      <Input 
                        value={manualCode}
                        onChange={(e) => setManualCode(e.target.value.toUpperCase())}
                        placeholder="e.g. SVR-2026-001" 
                        className="h-16 pl-6 pr-16 rounded-2xl bg-background shadow-neu-inset-deep border-neu font-bold text-lg text-center uppercase tracking-wider focus-visible:ring-accent" 
                        autoFocus
                      />
                    </div>
                    <Button type="submit" disabled={!manualCode.trim()} className="h-14 px-8 rounded-2xl bg-accent hover:bg-accent/90 text-white shadow-neu-extruded hover:shadow-neu-hover active:shadow-neu-inset-small font-bold text-base transition-all flex gap-3 disabled:opacity-50 disabled:cursor-not-allowed">
                      <Search size={20} /> Find Asset
                    </Button>
                  </form>
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-1 space-y-6">
            <div className="bg-background shadow-neu-extruded border-neu rounded-[32px] p-8">
              <h3 className="text-lg font-bold text-foreground flex items-center gap-2 mb-6">
                <History className="text-accent" size={20} /> Recent Scans
              </h3>
              
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-background shadow-neu-inset-small border border-white/50 rounded-2xl p-4 flex items-center justify-between group cursor-pointer hover:shadow-neu-inset transition-all">
                    <div>
                      <p className="font-bold text-foreground text-sm group-hover:text-accent transition-colors">SVR-2026-00{i}</p>
                      <p className="text-xs text-muted-foreground font-medium mt-1">Today, {10 + i}:30 AM</p>
                    </div>
                    <div className="w-8 h-8 rounded-lg bg-background shadow-neu-extruded flex items-center justify-center text-muted-foreground group-hover:text-accent group-hover:shadow-neu-hover transition-all">
                      <ArrowRight size={14} />
                    </div>
                  </div>
                ))}
              </div>
              
              <Button variant="ghost" className="w-full mt-6 text-xs font-bold text-muted-foreground hover:text-foreground">
                View Full History
              </Button>
            </div>
            
            <div className="bg-accent/10 shadow-neu-inset-small border border-accent/20 rounded-[32px] p-8 text-center">
              <h3 className="text-accent font-bold mb-2">Pro Tip</h3>
              <p className="text-sm font-medium text-muted-foreground">For optimal scanning, ensure the QR code is well-lit and fits within the scanning frame.</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
