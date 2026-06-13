"use client"

import { useState, useRef } from "react"
import { X, UploadCloud, FileType, CheckCircle2, AlertCircle, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { apiClient } from "@/lib/api-client"

interface BulkImportModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export function BulkImportModal({ isOpen, onClose, onSuccess }: BulkImportModalProps) {
  const [file, setFile] = useState<File | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [result, setResult] = useState<{message: string, errors: string[]} | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  if (!isOpen) return null

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0]
      if (droppedFile.name.endsWith('.csv')) {
        setFile(droppedFile)
      } else {
        alert("Please upload a CSV file.")
      }
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0])
    }
  }

  const handleUpload = async () => {
    if (!file) return

    setIsUploading(true)
    setResult(null)

    const formData = new FormData()
    formData.append("file", file)

    try {
      const response = await apiClient.post('/assets/import', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      setResult(response.data)
      if (response.data.errors && response.data.errors.length === 0) {
        setTimeout(() => {
          onSuccess()
          onClose()
        }, 2000)
      } else {
        onSuccess() // Refresh anyway to show the successfully imported ones
      }
    } catch (error: any) {
      setResult({
        message: "Failed to upload file",
        errors: [error.response?.data?.detail || error.message || "Unknown error occurred"]
      })
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
      <div className="w-full max-w-xl bg-background shadow-neu-extruded border-neu rounded-[32px] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-[#A3B1C6]/20 bg-background shadow-neu-inset-small">
          <div>
            <h2 className="text-xl font-bold text-foreground">Bulk Import Assets</h2>
            <p className="text-xs text-muted-foreground font-medium mt-1">Upload a CSV file to add multiple assets at once.</p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} disabled={isUploading} className="h-8 w-8 rounded-lg shadow-neu-extruded hover:text-red-500 hover:shadow-neu-hover active:shadow-neu-inset-small">
            <X size={18} />
          </Button>
        </div>

        <div className="p-8">
          {!result ? (
            <>
              <div 
                className={`border-2 border-dashed rounded-[32px] p-10 flex flex-col items-center justify-center transition-all ${isDragging ? 'border-accent bg-accent/5' : 'border-[#A3B1C6]/50 bg-background shadow-neu-inset-deep'} ${file ? 'border-green-500/50 bg-green-500/5' : ''}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <input 
                  type="file" 
                  accept=".csv" 
                  className="hidden" 
                  ref={fileInputRef}
                  onChange={handleFileChange}
                />
                
                {file ? (
                  <>
                    <div className="w-16 h-16 rounded-2xl bg-green-500/20 text-green-600 flex items-center justify-center mb-4">
                      <FileType size={32} />
                    </div>
                    <p className="font-bold text-foreground text-lg mb-1">{file.name}</p>
                    <p className="text-xs text-muted-foreground font-medium mb-6">{(file.size / 1024).toFixed(2)} KB</p>
                    <Button variant="outline" onClick={() => setFile(null)} disabled={isUploading} className="rounded-xl font-bold text-xs h-8">
                      Remove File
                    </Button>
                  </>
                ) : (
                  <>
                    <div className="w-16 h-16 rounded-2xl bg-background shadow-neu-extruded text-accent flex items-center justify-center mb-4">
                      <UploadCloud size={32} />
                    </div>
                    <p className="font-bold text-foreground text-lg mb-2">Drag & Drop your CSV here</p>
                    <p className="text-xs text-muted-foreground font-medium mb-6">or click to browse from your computer</p>
                    <Button onClick={() => fileInputRef.current?.click()} className="bg-background text-foreground shadow-neu-extruded hover:text-accent rounded-xl font-bold h-10 px-6">
                      Browse Files
                    </Button>
                  </>
                )}
              </div>

              <div className="mt-6 flex justify-between items-center">
                <a 
                  href="data:text/csv;charset=utf-8,tag,hostname,category,location,rack,uPosition,status,purchaseCost,purchaseDate,salvageValue,usefulLifeYears%0ASRV-2026-001,web-server-1,Server,Jakarta DC,R01,12,Active,5000,2026-01-01,500,5%0A" 
                  download="AssetHub_Template.csv" 
                  className="text-xs font-bold text-accent hover:underline"
                >
                  Download CSV Template
                </a>
                <Button 
                  onClick={handleUpload} 
                  disabled={!file || isUploading}
                  className="bg-accent hover:bg-accent/90 text-white rounded-xl shadow-neu-extruded font-bold border-none px-8 h-12"
                >
                  {isUploading ? (
                    <><Loader2 size={18} className="mr-2 animate-spin" /> Uploading...</>
                  ) : "Import Assets"}
                </Button>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center text-center py-6">
              {result.errors.length === 0 ? (
                <>
                  <div className="w-20 h-20 rounded-full bg-green-500/20 text-green-500 flex items-center justify-center mb-6">
                    <CheckCircle2 size={40} />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground mb-2">Import Successful</h3>
                  <p className="text-muted-foreground font-medium mb-8">{result.message}</p>
                  <Button onClick={() => { onSuccess(); onClose(); }} className="bg-accent text-white shadow-neu-extruded rounded-xl font-bold px-8 h-12 border-none">
                    View Assets
                  </Button>
                </>
              ) : (
                <>
                  <div className="w-20 h-20 rounded-full bg-amber-500/20 text-amber-500 flex items-center justify-center mb-6">
                    <AlertCircle size={40} />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground mb-2">Import Completed with Errors</h3>
                  <p className="text-muted-foreground font-medium mb-6">{result.message}</p>
                  
                  <div className="w-full bg-background shadow-neu-inset-deep rounded-2xl p-4 max-h-40 overflow-y-auto text-left mb-8">
                    <p className="text-xs font-bold text-red-500 mb-2">Errors Encountered:</p>
                    <ul className="text-[11px] font-mono text-muted-foreground space-y-1">
                      {result.errors.map((err, i) => (
                        <li key={i}>• {err}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex gap-4">
                    <Button variant="outline" onClick={() => setResult(null)} className="rounded-xl font-bold shadow-neu-extruded bg-background h-12 px-6">
                      Try Again
                    </Button>
                    <Button onClick={() => { onSuccess(); onClose(); }} className="bg-accent text-white shadow-neu-extruded rounded-xl font-bold px-6 h-12 border-none">
                      Continue Anyway
                    </Button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
