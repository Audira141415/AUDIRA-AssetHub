"use client"

import { useState, useEffect, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Package, Activity, ShieldAlert, MapPin, Calendar, ArrowRightLeft, Plus, Pen, Minus, Server, HardDrive, Database, ScanLine, ChevronDown, MoreVertical, Download, WifiOff } from "lucide-react"
import { baseAssets, getAssetImage } from "@/lib/mock-data"
import { apiClient } from "@/lib/api-client"
import { HeroSection } from "@/components/ui/hero-section"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from "recharts"

export default function DashboardPage() {
  const [isMounted, setIsMounted] = useState(false)
  const [apiSummary, setApiSummary] = useState<any>(null)
  const [isOffline, setIsOffline] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    
    const fetchSummary = async () => {
      try {
        const res = await apiClient.get('/dashboard/summary')
        setApiSummary(res.data)
        setIsOffline(false)
      } catch (err) {
        console.error("Failed to fetch dashboard summary, falling back to mock data", err)
        setIsOffline(true)
      }
    }
    
    fetchSummary()
  }, [])

  const currentYear = new Date().getFullYear(); // 2026

  const getAssetYear = (tag: string) => {
    const parts = tag.split('-');
    if (parts.length >= 2) {
      const yearStr = parts[1];
      if (yearStr.length === 4 && yearStr.startsWith('20')) return parseInt(yearStr);
      if (yearStr.length === 6) {
        const yy = parseInt(yearStr.substring(0, 2));
        return 2000 + yy;
      }
    }
    return 2025; // fallback
  };

  const { totalAssets, activeAssets, activePercent, locations, locData, ageData, olderThan5, statusData, vendorData, catData, warrantyData } = useMemo(() => {
    let active = 0;
    const locMap: Record<string, number> = {};
    const ageCounts = { "< 1 Year": 0, "1-3 Years": 0, "3-5 Years": 0, "> 5 Years": 0 };
    const older: any[] = [];
    const statusMap: Record<string, number> = { "Active": 0, "Maintenance": 0, "Spare/Stock": 0, "Decommissioned": 0 };
    const vendorMap: Record<string, number> = {};
    const catMap: Record<string, number> = {};
    const warrantyMap: Record<string, number> = {};
    
    baseAssets.forEach(asset => {
      if (asset.status === "Active") active++;
      locMap[asset.loc] = (locMap[asset.loc] || 0) + 1;
      
      const year = getAssetYear(asset.tag);
      const age = currentYear - year;
      
      if (age < 1) ageCounts["< 1 Year"]++;
      else if (age <= 3) ageCounts["1-3 Years"]++;
      else if (age <= 5) ageCounts["3-5 Years"]++;
      else {
        ageCounts["> 5 Years"]++;
        older.push({ ...asset, age });
      }

      // Status Breakdown
      if (asset.status === "Active") statusMap["Active"]++;
      else if (asset.status === "Maintenance" || asset.status === "Repair") statusMap["Maintenance"]++;
      else if (asset.status === "Decommissioned" || asset.status === "Retired") statusMap["Decommissioned"]++;
      else statusMap["Spare/Stock"]++;

      // Vendor Dominance
      if (asset.vendor) {
        vendorMap[asset.vendor] = (vendorMap[asset.vendor] || 0) + 1;
      }

      // Category Breakdown
      catMap[asset.cat] = (catMap[asset.cat] || 0) + 1;

      // Warranty Timeline
      if (asset.warranty && asset.warranty !== "Lifetime" && asset.warranty !== "-") {
        warrantyMap[asset.warranty] = (warrantyMap[asset.warranty] || 0) + 1;
      }
    });

    const locArr = Object.keys(locMap).map(k => ({ name: k, value: locMap[k] })).sort((a,b) => b.value - a.value);
    
    const colors = ['#38B2AC', '#6C63FF', '#F59E0B', '#EF4444'];
    const ageArr = Object.keys(ageCounts).map((k, i) => ({ 
      name: k, 
      value: (ageCounts as any)[k],
      color: colors[i],
      percentage: ((ageCounts as any)[k] / baseAssets.length * 100).toFixed(1) + '%'
    }));

    // Vendor Data
    const vendorArr = Object.keys(vendorMap)
      .map(k => ({ name: k, value: vendorMap[k] }))
      .sort((a,b) => b.value - a.value);
    
    let finalVendors = vendorArr.slice(0, 4);
    if (vendorArr.length > 4) {
      const others = vendorArr.slice(4).reduce((sum, v) => sum + v.value, 0);
      finalVendors.push({ name: "Others", value: others });
    }
    const vendorColors = ['#6C63FF', '#38B2AC', '#F59E0B', '#8B84FF', '#A3B1C6'];
    const processedVendors = finalVendors.map((v, i) => ({ ...v, color: vendorColors[i], percentage: ((v.value / baseAssets.length) * 100).toFixed(1) + '%' }));

    // Status Data
    const statusColors = { "Active": "#38B2AC", "Maintenance": "#F59E0B", "Spare/Stock": "#6C63FF", "Decommissioned": "#EF4444" };
    const processedStatus = Object.keys(statusMap).map(k => ({
      name: k,
      value: statusMap[k],
      color: statusColors[k as keyof typeof statusColors],
      percentage: ((statusMap[k] / baseAssets.length) * 100).toFixed(1)
    })).filter(s => s.value > 0);

    // Category Data
    const catArr = Object.keys(catMap)
      .map(k => ({ name: k, value: catMap[k] }))
      .sort((a,b) => b.value - a.value)
      .slice(0, 6); // Top 6 categories

    // Warranty Data
    const warrantyArr = Object.keys(warrantyMap)
      .sort((a, b) => a.localeCompare(b))
      .map(k => ({ year: k, assets: warrantyMap[k] }));

    // Sort older by age descending
    older.sort((a,b) => b.age - a.age);

    return {
      totalAssets: baseAssets.length,
      activeAssets: active,
      activePercent: ((active / baseAssets.length) * 100).toFixed(1),
      locations: Object.keys(locMap).length,
      locData: locArr,
      ageData: ageArr,
      olderThan5: older.slice(0, 5), // Top 5 oldest
      statusData: processedStatus,
      vendorData: processedVendors,
      catData: catArr,
      warrantyData: warrantyArr
    };
  }, []);

  // Use API summary if available, otherwise use computed data
  const displayTotalAssets = apiSummary ? apiSummary.totalAssets : totalAssets;
  const displayActiveAssets = apiSummary ? apiSummary.activeAssets : activeAssets;
  const displayActivePercent = apiSummary ? apiSummary.activePercent : activePercent;
  const displayLocations = apiSummary ? apiSummary.locations : locations;
  const displayOlderThan5 = apiSummary ? [] /* Mock for now */ : olderThan5;
  
  const statusColors = { "Active": "#38B2AC", "Maintenance": "#F59E0B", "Spare/Stock": "#6C63FF", "Decommissioned": "#EF4444" };
  const displayStatusData = apiSummary ? apiSummary.statusData.map((d: any) => ({
    name: d.name,
    value: d.value,
    color: statusColors[d.name as keyof typeof statusColors] || "#A3B1C6",
    percentage: ((d.value / (apiSummary.totalAssets || 1)) * 100).toFixed(1)
  })) : statusData;

  const displayAgeData = ageData; // Keep mock for charts not provided by API yet
  
  const chartColors = ['#38B2AC', '#6C63FF', '#F59E0B', '#EF4444', '#A3B1C6'];
  const displayLocData = apiSummary ? apiSummary.locData.map((d: any, i: number) => ({ name: d.name, value: d.value, color: chartColors[i % chartColors.length] })) : locData;
  const displayVendorData = apiSummary ? apiSummary.vendorData.map((d: any, i: number) => ({ name: d.name, value: d.value, color: chartColors[i % chartColors.length], percentage: ((d.value / (apiSummary.totalAssets || 1)) * 100).toFixed(1) + '%' })) : vendorData;
  const displayCatData = apiSummary ? apiSummary.catData : catData;
  const displayWarrantyData = warrantyData;

  const recentAssets = baseAssets.slice(0, 10);

  return (
    <div className="space-y-8">
      {/* Header */}
      <HeroSection 
        title="Dashboard" 
        description="Overview of your data center assets"
        imageSrc="/images/heroes/dashboard.png"
      >
        {isOffline && (
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-yellow-500/10 text-yellow-600 rounded-lg text-xs font-bold shadow-neu-inset-small border border-yellow-500/20">
            <WifiOff className="w-4 h-4" />
            <span>Offline / Mock Mode</span>
          </div>
        )}
        <Button variant="outline" className="shadow-neu-extruded bg-background/50 backdrop-blur-md">
          <Calendar className="mr-2 h-4 w-4 text-accent" />
          <span className="font-semibold">May 1 – May 31, 2025</span>
          <ChevronDown className="ml-2 h-4 w-4 text-muted-foreground" />
        </Button>
      </HeroSection>

      {/* Quick Actions */}
      <div className="flex flex-wrap items-center gap-4 py-2">
        <Button className="h-10 px-6 rounded-xl font-bold bg-[#6C63FF] text-white hover:bg-[#5a52d5] shadow-neu-extruded transition-all">
          <Plus className="mr-2 h-4 w-4" /> Add New Asset
        </Button>
        <Button variant="outline" className="h-10 px-6 rounded-xl font-bold text-foreground border-neu shadow-neu-extruded hover:shadow-neu-inset transition-all">
          <ScanLine className="mr-2 h-4 w-4 text-accent" /> Audit Mode
        </Button>
        <Button variant="outline" className="h-10 px-6 rounded-xl font-bold text-foreground border-neu shadow-neu-extruded hover:shadow-neu-inset transition-all">
          <Download className="mr-2 h-4 w-4 text-accent" /> Export Report
        </Button>
      </div>

        {/* 4 Top Widgets */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="px-6 py-6">
            <CardContent className="p-0">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Total Assets</p>
                  <h3 className="text-4xl font-display font-bold text-foreground mt-2">{displayTotalAssets}</h3>
                  <p className="text-xs font-semibold text-muted-foreground mt-2"><span className="text-accent">↑ 12.5%</span> vs last month</p>
                </div>
                <div className="p-3 bg-background shadow-neu-inset rounded-2xl">
                  <Package className="h-6 w-6 text-accent" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="px-6 py-6">
            <CardContent className="p-0">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Asset Status</p>
                  <h3 className="text-4xl font-display font-bold text-foreground mt-2">{displayActiveAssets} <span className="text-lg text-muted-foreground font-medium">Active</span></h3>
                </div>
                <div className="p-3 bg-background shadow-neu-extruded rounded-2xl shrink-0">
                  <Activity className="h-6 w-6 text-[#38B2AC]" />
                </div>
              </div>
              
              <div className="w-full h-3 rounded-full overflow-hidden flex shadow-neu-inset bg-[#A3B1C6]/20">
                {displayStatusData.map(s => (
                  <div key={s.name} style={{ width: `${s.percentage}%`, backgroundColor: s.color }} className="h-full" title={`${s.name}: ${s.value}`} />
                ))}
              </div>
              <div className="flex justify-between items-center mt-3 gap-2">
                {displayStatusData.slice(0,4).map(s => (
                  <div key={s.name} className="flex items-center gap-1.5 shrink-0">
                    <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: s.color }} />
                    <span className="text-[10px] font-bold text-muted-foreground truncate" title={s.name}>{s.name}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="px-6 py-6">
            <CardContent className="p-0">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Aging Assets</p>
                  <h3 className="text-4xl font-display font-bold text-foreground mt-2">{displayOlderThan5.length > 0 ? (displayAgeData.find(d => d.name === '> 5 Years')?.value || 0) : 0}</h3>
                  <p className="text-xs font-semibold text-muted-foreground mt-2">Over 5 years old</p>
                </div>
                <div className="p-3 bg-background shadow-neu-inset rounded-2xl">
                  <ShieldAlert className="h-6 w-6 text-red-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="px-6 py-6">
            <CardContent className="p-0">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Total Locations</p>
                  <h3 className="text-4xl font-display font-bold text-foreground mt-2">{displayLocations}</h3>
                  <p className="text-xs font-semibold text-muted-foreground mt-2">Sites & Rooms</p>
                </div>
                <div className="p-3 bg-background shadow-neu-inset rounded-2xl">
                  <MapPin className="h-6 w-6 text-[#F59E0B]" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="pb-0 pt-4 px-6">
              <CardTitle className="text-lg font-bold text-foreground">Asset Age Distribution</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-start h-80 px-6 pb-6 pt-2">
              <div className="w-full h-[180px] relative mb-4 min-h-0 min-w-0">
                {isMounted ? (
                  <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
                    <PieChart>
                      <Pie data={displayAgeData} innerRadius={55} outerRadius={80} paddingAngle={4} dataKey="value" stroke="none">
                        {displayAgeData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{backgroundColor: '#E0E5EC', border: 'none', borderRadius: '16px', boxShadow: '9px 9px 16px rgb(163 177 198 / 0.6), -9px -9px 16px rgba(255 255 255 / 0.5)'}} itemStyle={{color: '#3D4852', fontWeight: 'bold'}} />
                    </PieChart>
                  </ResponsiveContainer>
                ) : null}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-3xl font-display font-bold text-foreground">{displayTotalAssets}</span>
                  <span className="text-xs font-bold text-muted-foreground">Total</span>
                </div>
              </div>
              <div className="w-full grid grid-cols-2 gap-x-4 gap-y-2">
                {displayAgeData.map((item) => (
                  <div key={item.name} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full shrink-0 shadow-neu-extruded" style={{ backgroundColor: item.color }} />
                      <span className="text-foreground font-semibold truncate">{item.name}</span>
                    </div>
                    <span className="text-muted-foreground font-bold">{item.percentage}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-0 pt-4 px-6">
              <CardTitle className="text-lg font-bold text-foreground">Assets by Location</CardTitle>
              <Button variant="outline" size="sm" className="h-8 text-xs font-bold rounded-xl shadow-neu-extruded hover:shadow-neu-inset transition-all">
                Top Locations <ChevronDown className="ml-1 h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent className="h-80 pt-6 px-4 pb-6 min-h-0 min-w-0">
              {isMounted ? (
                <ResponsiveContainer width="100%" height={250} minWidth={1} minHeight={1}>
                  <BarChart data={displayLocData} margin={{ top: 25, right: 0, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#A3B1C6" opacity={0.3} />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontSize: 12, fontWeight: 600}} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontSize: 12, fontWeight: 600}} />
                    <Tooltip cursor={{fill: '#A3B1C6', opacity: 0.1}} contentStyle={{backgroundColor: '#E0E5EC', border: 'none', borderRadius: '16px', boxShadow: '9px 9px 16px rgb(163 177 198 / 0.6), -9px -9px 16px rgba(255 255 255 / 0.5)'}} itemStyle={{color: '#3D4852', fontWeight: 'bold'}} />
                    <Bar dataKey="value" fill="#6C63FF" radius={[8, 8, 0, 0]} maxBarSize={32} label={{ position: 'top', fill: '#6C63FF', fontSize: 12, fontWeight: 'bold' }} />
                  </BarChart>
                </ResponsiveContainer>
              ) : null}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-0 pt-4 px-6">
              <CardTitle className="text-lg font-bold text-foreground">Vendor Dominance</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-start h-80 px-6 pb-6 pt-2">
              <div className="w-full h-[180px] relative mb-4 min-h-0 min-w-0">
                {isMounted ? (
                  <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
                    <PieChart>
                      <Pie data={displayVendorData} innerRadius={55} outerRadius={80} paddingAngle={4} dataKey="value" stroke="none">
                        {displayVendorData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{backgroundColor: '#E0E5EC', border: 'none', borderRadius: '16px', boxShadow: '9px 9px 16px rgb(163 177 198 / 0.6), -9px -9px 16px rgba(255 255 255 / 0.5)'}} itemStyle={{color: '#3D4852', fontWeight: 'bold'}} />
                    </PieChart>
                  </ResponsiveContainer>
                ) : null}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-3xl font-display font-bold text-foreground">{displayVendorData.length}</span>
                  <span className="text-xs font-bold text-muted-foreground">Brands</span>
                </div>
              </div>
              <div className="w-full grid grid-cols-2 gap-x-4 gap-y-2">
                {displayVendorData.map((item) => (
                  <div key={item.name} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full shrink-0 shadow-neu-extruded" style={{ backgroundColor: item.color }} />
                      <span className="text-foreground font-semibold truncate">{item.name}</span>
                    </div>
                    <span className="text-muted-foreground font-bold">{item.percentage}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Additional Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader className="pb-0 pt-6 px-6">
              <CardTitle className="text-lg font-bold text-foreground">Asset Category Breakdown</CardTitle>
            </CardHeader>
            <CardContent className="h-80 pt-6 px-4 pb-6 min-h-0 min-w-0">
              {isMounted ? (
                <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
                  <BarChart data={displayCatData} layout="vertical" margin={{ top: 0, right: 40, left: 30, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#A3B1C6" opacity={0.3} />
                    <XAxis type="number" axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontSize: 12, fontWeight: 600}} />
                    <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontSize: 11, fontWeight: 600}} width={120} />
                    <Tooltip cursor={{fill: '#A3B1C6', opacity: 0.1}} contentStyle={{backgroundColor: '#E0E5EC', border: 'none', borderRadius: '16px', boxShadow: '9px 9px 16px rgb(163 177 198 / 0.6), -9px -9px 16px rgba(255 255 255 / 0.5)'}} itemStyle={{color: '#3D4852', fontWeight: 'bold'}} />
                    <Bar dataKey="value" fill="#38B2AC" radius={[0, 8, 8, 0]} maxBarSize={20} label={{ position: 'right', fill: '#38B2AC', fontSize: 12, fontWeight: 'bold' }} />
                  </BarChart>
                </ResponsiveContainer>
              ) : null}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-0 pt-6 px-6">
              <CardTitle className="text-lg font-bold text-foreground">Warranty Expiry Projection</CardTitle>
            </CardHeader>
            <CardContent className="h-80 pt-6 px-4 pb-6 min-h-0 min-w-0">
              {isMounted ? (
                <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
                  <AreaChart data={displayWarrantyData} margin={{ top: 20, right: 20, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorAssets" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#F59E0B" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#A3B1C6" opacity={0.3} />
                    <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontSize: 12, fontWeight: 600}} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontSize: 12, fontWeight: 600}} />
                    <Tooltip contentStyle={{backgroundColor: '#E0E5EC', border: 'none', borderRadius: '16px', boxShadow: '9px 9px 16px rgb(163 177 198 / 0.6), -9px -9px 16px rgba(255 255 255 / 0.5)'}} itemStyle={{color: '#3D4852', fontWeight: 'bold'}} />
                    <Area type="monotone" dataKey="assets" stroke="#F59E0B" strokeWidth={3} fillOpacity={1} fill="url(#colorAssets)" />
                  </AreaChart>
                </ResponsiveContainer>
              ) : null}
            </CardContent>
          </Card>
        </div>

      {/* Bottom Section: Tables and Lists */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* Left Column (Spans 2): Recent Assets */}
        <div className="xl:col-span-2 space-y-8">
          {/* Recent Assets Table */}
          <Card className="h-full flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between py-4 px-0">
              <CardTitle className="text-lg font-bold text-foreground">Recent Assets</CardTitle>
              <a href="#" className="text-sm font-bold text-accent hover:text-accent-light transition-colors">View all</a>
            </CardHeader>
          <div className="overflow-x-auto rounded-2xl shadow-neu-inset bg-background p-4 mb-4">
            <table className="w-full text-sm text-left border-collapse">
              <thead className="text-xs text-muted-foreground uppercase tracking-wider border-b border-[#A3B1C6]/30">
                <tr>
                  <th className="px-6 py-4 font-bold border-b border-white/60 whitespace-nowrap">Asset Tag</th>
                  <th className="px-6 py-4 font-bold border-b border-white/60 whitespace-nowrap">Hostname</th>
                  <th className="px-6 py-4 font-bold border-b border-white/60 whitespace-nowrap">Category</th>
                  <th className="px-6 py-4 font-bold border-b border-white/60 whitespace-nowrap">Location</th>
                  <th className="px-6 py-4 font-bold border-b border-white/60 whitespace-nowrap">Rack</th>
                  <th className="px-6 py-4 font-bold border-b border-white/60 whitespace-nowrap">Status</th>
                  <th className="px-6 py-4 font-bold border-b border-white/60 whitespace-nowrap">Warranty End</th>
                  <th className="px-6 py-4 font-bold border-b border-white/60 whitespace-nowrap"></th>
                </tr>
              </thead>
              <tbody className="text-foreground divide-y divide-[#A3B1C6]/20">
                {recentAssets.map((asset) => (
                  <tr key={asset.tag} className="group hover:bg-[#E4E9F2]/50 transition-colors">
                    <td className="px-6 py-4 font-bold text-foreground bg-background group-hover:bg-[#E4E9F2]/50 transition-all border-b border-white/60 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-background shadow-neu-extruded border border-white/40 flex items-center justify-center shrink-0 overflow-hidden">
                          <img src={getAssetImage(asset.cat)} alt={asset.cat} className="w-full h-full object-cover scale-[1.3]" />
                        </div>
                        <span className="truncate">{asset.tag}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-medium bg-background group-hover:bg-[#E4E9F2]/50 transition-all border-b border-white/60 whitespace-nowrap">{asset.host}</td>
                    <td className="px-6 py-4 bg-background group-hover:bg-[#E4E9F2]/50 transition-all border-b border-white/60 whitespace-nowrap">
                      <span className="px-3 py-1.5 text-xs font-bold bg-background shadow-neu-extruded border-neu rounded-lg text-accent uppercase tracking-wider">{asset.cat}</span>
                    </td>
                    <td className="px-6 py-4 bg-background group-hover:bg-[#E4E9F2]/50 transition-all border-b border-white/60 whitespace-nowrap">
                      <div className="flex flex-col">
                        <span className="font-semibold">{asset.loc}</span>
                        <span className="text-xs text-muted-foreground">{asset.room}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-medium bg-background group-hover:bg-[#E4E9F2]/50 transition-all border-b border-white/60 whitespace-nowrap">{asset.rack}</td>
                    <td className="px-6 py-4 bg-background group-hover:bg-[#E4E9F2]/50 transition-all border-b border-white/60 whitespace-nowrap">
                      <span className={`px-3 py-1.5 text-xs font-bold bg-background shadow-neu-extruded border-neu rounded-lg uppercase tracking-wider ${asset.status === 'Active' ? 'text-[#38B2AC]' : 'text-red-500'}`}>{asset.status}</span>
                    </td>
                    <td className="px-6 py-4 font-medium bg-background group-hover:bg-[#E4E9F2]/50 transition-all border-b border-white/60 whitespace-nowrap">{asset.warranty || '-'}</td>
                    <td className="px-6 py-4 text-right bg-background group-hover:bg-[#E4E9F2]/50 transition-all border-b border-white/60 whitespace-nowrap">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-accent shadow-none border border-transparent hover:border-neu hover:shadow-neu-extruded"><MoreVertical className="h-5 w-5" /></Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between text-sm font-semibold text-muted-foreground mt-4 px-2">
            <span>Showing 1 to 5 of 50 assets</span>
            <div className="flex gap-2">
              <Button variant="outline" size="icon" className="h-8 w-8 rounded-xl disabled:opacity-50"><ArrowRightLeft className="h-4 w-4 rotate-180" /></Button>
              <Button variant="default" size="icon" className="h-8 w-8 rounded-xl">1</Button>
              <Button variant="outline" size="icon" className="h-8 w-8 rounded-xl">2</Button>
              <Button variant="outline" size="icon" className="h-8 w-8 rounded-xl">3</Button>
              <span className="px-2 py-1">...</span>
              <Button variant="outline" size="icon" className="h-8 w-8 rounded-xl">10</Button>
              <Button variant="outline" size="icon" className="h-8 w-8 rounded-xl"><ArrowRightLeft className="h-4 w-4" /></Button>
            </div>
          </div>
        </Card>
      </div>

        {/* Right Column (Spans 1): Warnings and Movements */}
        <div className="xl:col-span-1 space-y-8">
          
          {/* Aging Assets Warning */}
          <Card className="relative overflow-hidden group border-red-500/20">
            <div className="absolute inset-0 bg-red-500/5 transition-all group-hover:bg-red-500/10"></div>
            <CardContent className="p-6 relative z-10">
              <div className="flex items-center gap-4 w-full mb-6 pb-4 border-b border-red-500/20">
                <div className="p-3 bg-background shadow-neu-extruded rounded-2xl shrink-0">
                  <ShieldAlert className="h-6 w-6 text-red-500" />
                </div>
                <div className="text-left flex-1">
                  <h4 className="text-base font-bold text-foreground">Hardware Refresh Due</h4>
                  <p className="text-xs font-semibold text-red-500 mt-1">{displayOlderThan5.length} Assets &gt; 5 years old</p>
                </div>
              </div>
              
              <div className="space-y-4">
                {displayOlderThan5.map((asset: any, i: number) => (
                  <div key={asset.tag} className="flex justify-between items-center bg-background/50 p-3 rounded-xl border border-white/40">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-foreground">{asset.tag}</span>
                      <span className="text-xs font-medium text-muted-foreground">{asset.cat}</span>
                    </div>
                    <span className="px-3 py-1 bg-red-100 text-red-600 rounded-lg text-xs font-bold shadow-neu-inset-small">
                      {asset.age} Years
                    </span>
                  </div>
                ))}
                {displayOlderThan5.length === 0 && (
                  <div className="text-center py-4 text-sm font-bold text-muted-foreground">
                    All assets are relatively new.
                  </div>
                )}
              </div>
              
              <Button className="w-full h-12 mt-6 text-sm font-bold bg-red-500 text-white hover:bg-red-600 transition-all shadow-neu-extruded">
                View Replacement Plan
              </Button>
            </CardContent>
          </Card>

          {/* Warranty Expiring Soon */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between py-4 px-0 border-b border-[#A3B1C6]/20">
              <CardTitle className="text-lg font-bold text-foreground">Warranty Expiring Soon</CardTitle>
              <a href="#" className="text-sm font-bold text-accent hover:text-accent-light">View all</a>
            </CardHeader>
            <CardContent className="space-y-0 pt-0 px-0 pb-0 divide-y divide-[#A3B1C6]/20">
              
              <div className="flex gap-4 items-center group py-4 border-t border-white/60">
                <div className="w-12 h-12 bg-background shadow-neu-inset border-t border-l border-[#A3B1C6]/30 border-b border-r border-white/60 rounded-2xl shrink-0 overflow-hidden">
                  <img src={getAssetImage("server")} alt="Server" className="w-full h-full object-cover scale-[1.3]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-foreground truncate">SRV-240601-001</p>
                  <p className="text-xs font-semibold text-muted-foreground truncate">Dell PowerEdge R750</p>
                </div>
                <div className="text-right shrink-0">
                  <span className="px-3 py-1.5 text-xs font-bold bg-background shadow-neu-extruded text-[#F59E0B] rounded-lg">15 days</span>
                  <p className="text-xs font-semibold text-muted-foreground mt-2">15 Jun 2025</p>
                </div>
              </div>

              <div className="flex gap-4 items-center group py-4 border-t border-white/60">
                <div className="w-12 h-12 bg-background shadow-neu-inset border-t border-l border-[#A3B1C6]/30 border-b border-r border-white/60 rounded-2xl shrink-0 overflow-hidden">
                  <img src={getAssetImage("switch")} alt="Switch" className="w-full h-full object-cover scale-[1.3]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-foreground truncate">SW-240702-002</p>
                  <p className="text-xs font-semibold text-muted-foreground truncate">Cisco Catalyst 9500</p>
                </div>
                <div className="text-right shrink-0">
                  <span className="px-3 py-1.5 text-xs font-bold bg-background shadow-neu-extruded text-[#F59E0B] rounded-lg">28 days</span>
                  <p className="text-xs font-semibold text-muted-foreground mt-2">28 Jun 2025</p>
                </div>
              </div>

              <div className="flex gap-4 items-center group py-4 border-t border-white/60">
                <div className="w-12 h-12 bg-background shadow-neu-inset border-t border-l border-[#A3B1C6]/30 border-b border-r border-white/60 rounded-2xl shrink-0 overflow-hidden">
                  <img src={getAssetImage("storage")} alt="Storage" className="w-full h-full object-cover scale-[1.3]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-foreground truncate">STG-240803-003</p>
                  <p className="text-xs font-semibold text-muted-foreground truncate">HPE MSA 2062</p>
                </div>
                <div className="text-right shrink-0">
                  <span className="px-3 py-1.5 text-xs font-bold bg-background shadow-neu-extruded text-red-500 rounded-lg">5 days</span>
                  <p className="text-xs font-semibold text-muted-foreground mt-2">5 Jun 2025</p>
                </div>
              </div>

              <Button variant="outline" className="w-full mt-4 h-12 font-bold text-sm">
                View all warranties
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Full Width Row: Recent Movements */}
      <div className="w-full">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between py-4 px-0 border-b border-[#A3B1C6]/20">
            <CardTitle className="text-lg font-bold text-foreground">Recent Movements</CardTitle>
            <a href="#" className="text-sm font-bold text-accent hover:text-accent-light">View all</a>
          </CardHeader>
          <CardContent className="space-y-0 pt-0 px-0 pb-0 divide-y divide-[#A3B1C6]/20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
            
            <div className="flex gap-4 items-start group py-4 px-4 border-t border-white/60 border-r border-[#A3B1C6]/20">
              <div className="p-3 bg-background shadow-neu-extruded border-neu group-hover:shadow-neu-inset rounded-2xl shrink-0 transition-all">
                <ArrowRightLeft className="h-5 w-5 text-accent" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <p className="text-sm font-bold text-foreground">SRV-250501-001</p>
                  <span className="text-xs font-semibold text-muted-foreground">2h ago</span>
                </div>
                <p className="text-sm font-medium text-muted-foreground mt-1">Moved to <span className="text-foreground font-bold">Rack R05 - U24</span></p>
                <p className="text-xs font-semibold text-muted-foreground mt-0.5">Batam DC - Server Room A</p>
              </div>
            </div>
            
            <div className="flex gap-4 items-start group py-4 px-4 border-t border-white/60 border-r border-[#A3B1C6]/20">
              <div className="p-3 bg-background shadow-neu-extruded border-neu group-hover:shadow-neu-inset rounded-2xl shrink-0 transition-all">
                <Plus className="h-5 w-5 text-[#38B2AC]" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <p className="text-sm font-bold text-foreground">SW-250501-002</p>
                  <span className="text-xs font-semibold text-muted-foreground">5h ago</span>
                </div>
                <p className="text-sm font-medium text-muted-foreground mt-1">Added to <span className="text-foreground font-bold">Rack R02 - U12</span></p>
                <p className="text-xs font-semibold text-muted-foreground mt-0.5">Jakarta DC - Network Room</p>
              </div>
            </div>

            <div className="flex gap-4 items-start group py-4 px-4 border-t border-white/60 border-r border-[#A3B1C6]/20">
              <div className="p-3 bg-background shadow-neu-extruded border-neu group-hover:shadow-neu-inset rounded-2xl shrink-0 transition-all">
                <Pen className="h-5 w-5 text-[#F59E0B]" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <p className="text-sm font-bold text-foreground">STG-250501-003</p>
                  <span className="text-xs font-semibold text-muted-foreground">1d ago</span>
                </div>
                <p className="text-sm font-medium text-muted-foreground mt-1">Changed information</p>
                <p className="text-xs font-semibold text-muted-foreground mt-0.5">Surabaya DC - Storage Room</p>
              </div>
            </div>

            <div className="flex gap-4 items-start group py-4 px-4 border-t border-white/60">
              <div className="p-3 bg-background shadow-neu-extruded border-neu group-hover:shadow-neu-inset rounded-2xl shrink-0 transition-all">
                <Minus className="h-5 w-5 text-red-500" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <p className="text-sm font-bold text-foreground">PDU-250430-004</p>
                  <span className="text-xs font-semibold text-muted-foreground">2d ago</span>
                </div>
                <p className="text-sm font-medium text-muted-foreground mt-1">Removed from Rack R01</p>
                <p className="text-xs font-semibold text-muted-foreground mt-0.5">Batam DC - Power Room</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div></div>
  )
}

