"use client"

import { useState } from "react"
import { X, Printer, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import QRCode from "react-qr-code"

interface QRCodeModalProps {
  isOpen: boolean
  onClose: () => void
  assets: any[]
}

export function QRCodeModal({ isOpen, onClose, assets }: QRCodeModalProps) {
  if (!isOpen) return null

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
      <div className="w-full max-w-4xl bg-background shadow-neu-extruded border-neu rounded-[32px] overflow-hidden flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between p-6 border-b border-[#A3B1C6]/20 bg-background shadow-neu-inset-small">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Asset QR Codes</h2>
            <p className="text-sm text-muted-foreground font-medium mt-1">
              Generated {assets.length} QR codes for selected assets.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button onClick={handlePrint} className="bg-accent hover:bg-accent/90 text-white rounded-xl shadow-neu-extruded font-bold border-none px-6">
              <Printer size={18} className="mr-2" />
              Print Labels
            </Button>
            <Button variant="ghost" size="icon" onClick={onClose} className="h-10 w-10 rounded-xl shadow-neu-extruded hover:text-red-500 hover:shadow-neu-hover active:shadow-neu-inset-small">
              <X size={20} />
            </Button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto bg-[#E4E9F2]">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 print:grid-cols-3 print:gap-4 print:bg-white">
            {assets.map((asset) => (
              <div key={asset.id} className="bg-background shadow-neu-extruded rounded-2xl p-4 flex flex-col items-center text-center print:shadow-none print:border print:border-gray-300">
                <div className="bg-white p-3 rounded-xl shadow-neu-inset-small mb-4 print:shadow-none print:p-0">
                  <QRCode
                    value={`https://audira.app/assets/${asset.id}`}
                    size={120}
                    level="M"
                  />
                </div>
                <h3 className="font-bold text-foreground text-sm truncate w-full mb-1">{asset.host || asset.tag}</h3>
                <p className="text-xs text-muted-foreground font-bold font-mono">{asset.tag}</p>
                <div className="mt-3 flex flex-wrap gap-2 justify-center">
                   <span className="px-2 py-0.5 text-[9px] font-bold rounded-md bg-background shadow-neu-inset-small text-accent uppercase">{asset.cat}</span>
                   <span className="px-2 py-0.5 text-[9px] font-bold rounded-md bg-background shadow-neu-inset-small text-muted-foreground uppercase">{asset.loc}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Print Styles */}
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          body * {
            visibility: hidden;
          }
          .fixed, .fixed * {
            visibility: visible;
          }
          .fixed {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            background: white !important;
          }
          .shadow-neu-extruded, .shadow-neu-inset-small {
            box-shadow: none !important;
          }
          button {
            display: none !important;
          }
        }
      `}} />
    </div>
  )
}
