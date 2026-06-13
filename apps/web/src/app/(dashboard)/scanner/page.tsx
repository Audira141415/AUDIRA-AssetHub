"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Html5QrcodeScanner } from "html5-qrcode"
import { HeroSection } from "@/components/ui/hero-section"

export default function ScannerPage() {
  const router = useRouter()
  const [scanResult, setScanResult] = useState<string | null>(null)
  
  useEffect(() => {
    // We only want to initialize this once
    const scanner = new Html5QrcodeScanner(
      "reader",
      { fps: 10, qrbox: { width: 250, height: 250 } },
      false
    )

    scanner.render(
      (decodedText) => {
        setScanResult(decodedText)
        scanner.clear()
        
        // Let's assume the QR code is an asset tag (e.g. SVR-2026-001) or asset ID
        // Redirect to the asset detail page
        router.push(`/assets/${encodeURIComponent(decodedText)}`)
      },
      (error) => {
        // We can ignore continuous scan errors as it keeps looking for a QR
        // console.warn(error)
      }
    )

    return () => {
      // Cleanup
      scanner.clear().catch(error => {
        console.error("Failed to clear html5-qrcode scanner", error)
      })
    }
  }, [router])

  return (
    <div className="flex flex-col w-full gap-6 pb-6 h-full">
      <HeroSection
        title="QR / Barcode Scanner"
        description="Scan an asset's QR code to instantly pull up its details and maintenance history."
        imageSrc="/images/heroes/movements.png"
      />
      
      <div className="flex flex-col items-center justify-center p-8 bg-background shadow-neu-extruded border-neu rounded-[32px] max-w-2xl mx-auto w-full">
        {scanResult ? (
          <div className="text-center p-8">
            <h2 className="text-2xl font-bold text-accent mb-4">Code Scanned!</h2>
            <p className="text-lg font-medium text-foreground mb-4">{scanResult}</p>
            <p className="text-sm text-muted-foreground animate-pulse">Redirecting to asset details...</p>
          </div>
        ) : (
          <div className="w-full">
            <div id="reader" className="w-full bg-black/5 rounded-2xl overflow-hidden shadow-neu-inset"></div>
            <p className="text-center text-sm font-bold text-muted-foreground mt-6">
              Please point your camera at the Asset QR Code.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
