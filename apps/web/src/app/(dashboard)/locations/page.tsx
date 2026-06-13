"use client"

import { useQuery } from"@tanstack/react-query"
import { fetchApi } from"@/lib/api"
import { Card, CardContent, CardHeader, CardTitle } from"@/components/ui/card"
import { HeroSection } from "@/components/ui/hero-section"

export default function LocationsPage() {
  const { data: sites, isLoading } = useQuery({
    queryKey: ["locations-sites"],
    queryFn: () => fetchApi("/locations/sites"),
  })

  return (
    <div className="space-y-6">
      <HeroSection
        title="Locations"
        description="Manage your data center sites and properties."
        imageSrc="/images/heroes/locations.png"
      />
      
      <Card className="">
        <CardHeader>
          <CardTitle>Sites</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-muted-foreground">Loading locations...</div>
          ) : (
            <div className="text-muted-foreground">
              {sites?.length === 0 ?"No sites found." : `${sites?.length} sites loaded.`}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
