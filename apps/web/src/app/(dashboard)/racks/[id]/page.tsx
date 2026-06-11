"use client"

import { useQuery } from"@tanstack/react-query"
import { fetchApi } from"@/lib/api"
import { Card, CardContent, CardHeader, CardTitle } from"@/components/ui/card"
import { useParams } from"next/navigation"

export default function RackVisualizationPage() {
  const params = useParams()
  const { data: rack, isLoading } = useQuery({
    queryKey: ["rack", params.id],
    queryFn: () => fetchApi(`/locations/racks/${params.id}/visualization`),
  })

  if (isLoading) return <div className="text-muted-foreground">Loading visualizer...</div>
  if (!rack) return <div className="text-muted-foreground">Rack not found</div>

  // Create an array of 42 Us (from 42 down to 1)
  const uSlots = Array.from({ length: rack.height_u }, (_, i) => rack.height_u - i)
  
  // Create a map of occupied Us
  const occupiedMap = new Map()
  rack.assets.forEach((asset: any) => {
    if (asset.u_position) {
      occupiedMap.set(asset.u_position, asset)
    }
  })

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">{rack.name}</h1>
          <p className="text-muted-foreground mt-1">Utilization: {rack.utilization_percentage}%</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Visual Renderer */}
        <div className="lg:col-span-1  p-4 rounded-xl -4  shadow-2xl relative flex flex-col items-center">
          <div className="w-full  -2  rounded-sm p-2 space-y-1">
            {uSlots.map((u) => {
              const asset = occupiedMap.get(u)
              const isOccupied = !!asset
              return (
                <div 
                  key={u} 
                  className={`flex items-center w-full h-8  ${
                    isOccupied 
                      ?"bg-blue-600/20 -blue-500/50 hover:bg-blue-600/30" 
                      :"  hover:"
                  } rounded-sm transition-colors cursor-pointer group relative`}
                  title={isOccupied ? `${asset.manufacturer} ${asset.model} (${asset.asset_tag})` : `Empty U${u}`}
                >
                  <div className="w-8 text-center text-[10px] text-muted-foreground font-mono -r /50">
                    U{u}
                  </div>
                  <div className="flex-1 px-3 text-xs font-medium text-foreground truncate">
                    {isOccupied ? (
                      <span className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.8)]"></span>
                        {asset.asset_tag} - {asset.model || 'Unknown'}
                      </span>
                    ) : (
                      <span className="text-zinc-700 opacity-0 group-hover:opacity-100">Empty</span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Details Panel */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="">
            <CardHeader>
              <CardTitle className="text-white">Installed Assets</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {rack.assets.length === 0 ? (
                  <p className="text-muted-foreground">No assets installed in this rack.</p>
                ) : (
                  rack.assets.map((asset: any) => (
                    <div key={asset.id} className="p-3    rounded-lg flex justify-between items-center">
                      <div>
                        <div className="font-bold text-blue-400">{asset.asset_tag}</div>
                        <div className="text-sm text-muted-foreground">{asset.manufacturer} {asset.model}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-mono  text-foreground px-2 py-1 rounded">U{asset.u_position}</div>
                        <div className="text-xs text-green-500 mt-1">{asset.status}</div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
