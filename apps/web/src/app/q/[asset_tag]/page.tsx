"use client"

import { useQuery } from"@tanstack/react-query"
import { fetchApi } from"@/lib/api"
import { Card, CardContent, CardHeader, CardTitle } from"@/components/ui/card"
import { useParams } from"next/navigation"
import { Server, ShieldAlert, MapPin, Activity } from"lucide-react"

export default function QRScanPage() {
  const params = useParams()
  // Since this might be public, ideally we wouldn't require Auth.
  // For the sake of the mock, we assume the user is logged in or the API handles public read access.
  const { data: assets, isLoading } = useQuery({
    queryKey: ["assets"],
    queryFn: () => fetchApi("/assets/"), // Fetching all and filtering is inefficient, but okay for mock. A dedicated by-tag endpoint is better.
  })

  if (isLoading) return <div className="p-8 text-muted-foreground text-center">Loading asset details...</div>
  
  const asset = assets?.find((a: any) => a.asset_tag === params.asset_tag)
  
  if (!asset) return <div className="p-8 text-red-500 text-center font-bold text-xl">Asset Not Found</div>

  return (
    <div className="min-h-screen  text-foreground p-4 md:p-8 flex justify-center">
      <Card className="w-full max-w-lg   shadow-2xl">
        <CardHeader className="-b  pb-4 /50">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-600/20 rounded-xl text-blue-500">
              <Server size={24} />
            </div>
            <div>
              <CardTitle className="text-2xl text-white tracking-tight">{asset.asset_tag}</CardTitle>
              <p className="text-muted-foreground text-sm mt-1">{asset.manufacturer} {asset.model}</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          
          {/* Status Badge */}
          <div className="flex justify-between items-center  p-4 rounded-xl">
            <span className="text-muted-foreground font-medium">Current Status</span>
            <span className="flex items-center gap-2 text-green-500 font-bold bg-green-500/10 px-3 py-1 rounded-full">
              <Activity size={16} />
              {asset.status}
            </span>
          </div>

          {/* Location details */}
          <div>
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Physical Location</h3>
            <div className="p-4 rounded-xl   flex gap-4 items-start">
              <MapPin className="text-muted-foreground mt-1" size={20} />
              <div>
                <p className="text-foreground font-medium">Rack ID: {asset.rack_id ||"Unracked"}</p>
                <p className="text-muted-foreground text-sm">Position: {asset.u_position ? `U${asset.u_position}` :"N/A"}</p>
              </div>
            </div>
          </div>

          {/* Warranty details */}
          <div>
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Support & Warranty</h3>
            <div className="p-4 rounded-xl   flex gap-4 items-start">
              <ShieldAlert className="text-muted-foreground mt-1" size={20} />
              <div className="w-full">
                <div className="flex justify-between">
                  <p className="text-muted-foreground text-sm">Expires</p>
                  <p className="text-foreground font-medium">{asset.warranty_end ||"N/A"}</p>
                </div>
              </div>
            </div>
          </div>

        </CardContent>
      </Card>
    </div>
  )
}
