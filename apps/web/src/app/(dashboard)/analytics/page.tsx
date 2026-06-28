"use client"

import { useState, useEffect, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign, TrendingDown, PiggyBank, Briefcase } from "lucide-react"
import { apiClient } from "@/lib/api-client"
import { HeroSection } from "@/components/ui/hero-section"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from "recharts"

export default function AnalyticsPage() {
  const [assets, setAssets] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchAssets = async () => {
      try {
        const res = await apiClient.get('/assets')
        setAssets(res.data)
      } catch (err) {
        console.error("Failed to fetch assets", err)
      } finally {
        setIsLoading(false)
      }
    }
    fetchAssets()
  }, [])

  const currentYear = new Date().getFullYear()

  // Compute Financial Metrics
  const { totalInvestment, currentBookValue, depreciationExpense, costByCategory, yearlyDepreciation } = useMemo(() => {
    let totalInv = 0
    let currentBV = 0
    let depExp = 0
    const catMap: Record<string, number> = {}
    const yearMap: Record<string, number> = {}

    assets.forEach(asset => {
      if (asset.purchaseCost) {
        totalInv += asset.purchaseCost
        const cost = asset.purchaseCost
        const salvage = asset.salvageValue || 0
        const lifeYears = asset.usefulLifeYears || 5
        const pDate = asset.purchaseDate ? new Date(asset.purchaseDate) : new Date(2025, 0, 1)
        
        // Straight line depreciation
        const annualDep = (cost - salvage) / lifeYears
        const ageInYears = (new Date().getTime() - pDate.getTime()) / (1000 * 3600 * 24 * 365.25)
        
        let accDep = annualDep * ageInYears
        if (accDep > (cost - salvage)) accDep = cost - salvage
        if (accDep < 0) accDep = 0
        
        const bv = cost - accDep
        currentBV += bv
        depExp += accDep

        const catName = asset.category?.name || "Unknown"
        catMap[catName] = (catMap[catName] || 0) + cost

        // Build projection for 5 years
        for (let i = 0; i <= lifeYears; i++) {
          const projectionYear = pDate.getFullYear() + i
          if (projectionYear >= currentYear - 2 && projectionYear <= currentYear + 5) {
            let projectedBV = cost - (annualDep * i)
            if (projectedBV < salvage) projectedBV = salvage
            yearMap[projectionYear] = (yearMap[projectionYear] || 0) + projectedBV
          }
        }
      }
    })

    const catArr = Object.keys(catMap).map(k => ({ name: k, value: catMap[k] })).sort((a,b) => b.value - a.value)
    
    const yearArr = Object.keys(yearMap).sort().map(y => ({
      year: y,
      value: yearMap[y]
    }))

    return { totalInvestment: totalInv, currentBookValue: currentBV, depreciationExpense: depExp, costByCategory: catArr, yearlyDepreciation: yearArr }
  }, [assets, currentYear])

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val)
  }

  const COLORS = ['#6C63FF', '#38B2AC', '#F59E0B', '#EF4444', '#8B84FF', '#A3B1C6']

  return (
    <div className="space-y-8">
      <HeroSection 
        title="Financial Analytics" 
        description="Track asset depreciation, investment costs, and financial forecasts."
        imageSrc="/images/heroes/analytics.png"
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="rounded-[32px] overflow-hidden group">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-2">Total Investment</p>
                <h3 className="text-4xl font-display font-bold text-foreground">{formatCurrency(totalInvestment)}</h3>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-background shadow-neu-extruded border-neu flex items-center justify-center shrink-0">
                <Briefcase className="text-accent" />
              </div>
            </div>
            <p className="text-xs font-semibold text-muted-foreground mt-4">Total historical cost of all assets</p>
          </CardContent>
        </Card>

        <Card className="rounded-[32px] overflow-hidden group">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-2">Current Book Value</p>
                <h3 className="text-4xl font-display font-bold text-[#38B2AC]">{formatCurrency(currentBookValue)}</h3>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-background shadow-neu-extruded border-neu flex items-center justify-center shrink-0">
                <PiggyBank className="text-[#38B2AC]" />
              </div>
            </div>
            <p className="text-xs font-semibold text-muted-foreground mt-4">Remaining value after depreciation</p>
          </CardContent>
        </Card>

        <Card className="rounded-[32px] overflow-hidden group">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-2">Accumulated Depreciation</p>
                <h3 className="text-4xl font-display font-bold text-red-500">{formatCurrency(depreciationExpense)}</h3>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-background shadow-neu-extruded border-neu flex items-center justify-center shrink-0">
                <TrendingDown className="text-red-500" />
              </div>
            </div>
            <p className="text-xs font-semibold text-muted-foreground mt-4">Total value lost to date</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="rounded-[32px]">
          <CardHeader className="px-6 py-6 border-b border-[#A3B1C6]/20">
            <CardTitle className="text-lg font-bold">Investment by Category</CardTitle>
          </CardHeader>
          <CardContent className="p-6 h-96">
            <ResponsiveContainer width="100%" height="100%" minWidth={0}>
              <PieChart>
                <Pie data={costByCategory} innerRadius={80} outerRadius={120} paddingAngle={2} dataKey="value" stroke="none">
                  {costByCategory.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip formatter={(value: any) => formatCurrency(Number(value || 0))} contentStyle={{backgroundColor: '#E0E5EC', border: 'none', borderRadius: '16px', boxShadow: '9px 9px 16px rgb(163 177 198 / 0.6), -9px -9px 16px rgba(255 255 255 / 0.5)'}} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="rounded-[32px]">
          <CardHeader className="px-6 py-6 border-b border-[#A3B1C6]/20">
            <CardTitle className="text-lg font-bold">Projected Book Value (5 Years)</CardTitle>
          </CardHeader>
          <CardContent className="p-6 h-96">
            <ResponsiveContainer width="100%" height="100%" minWidth={0}>
              <LineChart data={yearlyDepreciation} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#A3B1C6" opacity={0.3} />
                <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontWeight: 600}} dy={10} />
                <YAxis tickFormatter={(val) => `$${val/1000}k`} axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontWeight: 600}} />
                <RechartsTooltip formatter={(value: any) => formatCurrency(Number(value || 0))} contentStyle={{backgroundColor: '#E0E5EC', border: 'none', borderRadius: '16px', boxShadow: '9px 9px 16px rgb(163 177 198 / 0.6), -9px -9px 16px rgba(255 255 255 / 0.5)'}} />
                <Line type="monotone" dataKey="value" stroke="#38B2AC" strokeWidth={4} dot={{ r: 6, fill: '#38B2AC', strokeWidth: 0 }} activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
