"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from"@/components/ui/card"
import { Button } from"@/components/ui/button"
import { FileDown, Database, ActivitySquare } from"lucide-react"

export default function ReportsPage() {
  const handleDownload = (endpoint: string, filename: string) => {
    // In a real app with strict auth, we might need to handle token injection here.
    // Since this is a direct GET stream, we'll use window.location or fetch + blob.
    // Fetch + Blob is safer for injecting Authorization headers.
    
    // Quick mock for now without auth header logic in browser download:
    window.location.href = `http://localhost:3413/api/v1/reports/${endpoint}`
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <FileDown className="text-blue-500" size={32} />
        <h1 className="text-3xl font-bold tracking-tight text-white">Reports & Exports</h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="hover: transition-colors">
          <CardHeader>
            <div className="p-3 w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center mb-4">
              <Database className="text-blue-500" size={24} />
            </div>
            <CardTitle className="text-white text-xl">Full Asset Inventory</CardTitle>
            <CardDescription className="text-muted-foreground">
              Download a complete CSV list of all hardware assets currently tracked in the system, including warranty and location data.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={() => handleDownload('assets/csv', 'assets_inventory.csv')}
              className="bg-zinc-100 hover:bg-white text-zinc-900 font-medium w-full"
            >
              <FileDown size={16} className="mr-2" />
              Download Inventory (CSV)
            </Button>
          </CardContent>
        </Card>

        <Card className="hover: transition-colors">
          <CardHeader>
            <div className="p-3 w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center mb-4">
              <ActivitySquare className="text-purple-500" size={24} />
            </div>
            <CardTitle className="text-white text-xl">Audit Log Ledger</CardTitle>
            <CardDescription className="text-muted-foreground">
              Export the immutable Asset Movement ledger. Contains all historical relocations and status changes for compliance auditing.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={() => handleDownload('movements/csv', 'asset_movements.csv')}
              className="bg-purple-600 hover:bg-purple-700 text-white font-medium w-full"
            >
              <FileDown size={16} className="mr-2" />
              Download Audit Ledger (CSV)
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
