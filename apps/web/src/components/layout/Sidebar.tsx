"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Server, Tags, Users, Globe, Building2, Layers, DoorOpen, ArrowRightLeft, ShieldCheck, FileText, Settings, HelpCircle, Box } from "lucide-react"

const navGroups = [
  {
    title: "INVENTORY",
    items: [
      { name: "Assets", href: "/assets", icon: Server },
      { name: "Categories", href: "/categories", icon: Tags },
      { name: "Vendors", href: "/vendors", icon: Box },
    ]
  },
  {
    title: "LOCATION",
    items: [
      { name: "Sites", href: "/sites", icon: Globe },
      { name: "Buildings", href: "/buildings", icon: Building2 },
      { name: "Floors", href: "/floors", icon: Layers },
      { name: "Rooms", href: "/rooms", icon: DoorOpen },
      { name: "Racks", href: "/racks", icon: Server },
    ]
  },
  {
    title: "OPERATIONS",
    items: [
      { name: "Asset Movements", href: "/movements", icon: ArrowRightLeft },
      { name: "Warranty", href: "/warranty", icon: ShieldCheck },
    ]
  },
  {
    title: "MANAGEMENT",
    items: [
      { name: "Users", href: "/users", icon: Users },
      { name: "Audit Logs", href: "/logs", icon: FileText },
      { name: "Settings", href: "/settings", icon: Settings },
    ]
  }
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="w-64 bg-background shadow-neu-extruded border-neu z-20 flex flex-col h-full text-foreground m-4 rounded-[32px]">
      <div className="p-6 flex items-center gap-3 border-b border-[#A3B1C6]/20">
        <div className="w-10 h-10 rounded-[12px] bg-background shadow-neu-extruded border-neu flex items-center justify-center">
          <Server size={20} className="text-accent" />
        </div>
        <div>
          <span className="font-bold text-xl text-foreground tracking-tight block leading-none">Audira</span>
          <span className="text-xs text-muted-foreground font-medium">AssetHub</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 space-y-6 pt-6 pb-6 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        
        {/* Dashboard Link (Outside groups) */}
        <div>
          <Link
            href="/dashboard"
            className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 ${
              pathname === "/dashboard" || pathname.startsWith("/dashboard")
                ? "bg-background shadow-neu-inset-deep border-t border-l border-[#A3B1C6]/30 border-b border-r border-white/60 text-accent" 
                : "text-muted-foreground hover:shadow-neu-extruded hover:border-neu hover:text-foreground border border-transparent"
            }`}
          >
            <LayoutDashboard size={20} />
            <span className="font-semibold text-sm">Dashboard</span>
          </Link>
        </div>

        {navGroups.map((group, idx) => (
          <div key={group.title} className={idx > 0 ? "pt-6 border-t border-white/60 relative before:absolute before:top-0 before:left-0 before:w-full before:border-t before:border-[#A3B1C6]/20" : ""}>
            <h4 className="text-[11px] font-bold text-muted-foreground tracking-widest mb-3 px-4 uppercase">{group.title}</h4>
            <nav className="space-y-2">
              {group.items.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
                const Icon = item.icon
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 ${
                      isActive 
                        ? "bg-background shadow-neu-inset text-accent" 
                        : "text-muted-foreground hover:shadow-neu-extruded hover:text-foreground"
                    }`}
                  >
                    <Icon size={20} className={isActive ? "text-accent" : "text-muted-foreground"} />
                    <span className="font-medium text-sm">{item.name}</span>
                  </Link>
                )
              })}
            </nav>
          </div>
        ))}
      </div>

      <div className="p-6 mt-auto">
        <div className="bg-background shadow-neu-extruded rounded-2xl p-4 flex gap-4 items-start cursor-pointer hover:shadow-neu-inset-small transition-all duration-300">
          <div className="p-2 bg-background shadow-neu-inset-small rounded-xl shrink-0">
            <HelpCircle size={18} className="text-accent" />
          </div>
          <div>
            <p className="text-sm font-bold text-foreground">Need Help?</p>
            <p className="text-[11px] text-muted-foreground font-medium mt-1">Check documentation</p>
          </div>
        </div>
      </div>
    </div>
  )
}

