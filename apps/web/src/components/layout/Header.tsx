"use client"

import { useAuthStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { LogOut, Bell, Maximize, Search, Menu, Sun, ChevronDown } from "lucide-react"
import { useRouter } from "next/navigation"

export function Header() {
  const user = useAuthStore((state) => state.user)
  const logout = useAuthStore((state) => state.logout)
  const router = useRouter()

  const handleLogout = () => {
    logout()
    router.push("/login")
  }

  return (
    <header className="h-20 bg-background flex items-center justify-between px-8 z-10 m-4 rounded-[32px] shadow-neu-extruded border-neu">
      <div className="flex items-center gap-6 flex-1">
        <Button variant="ghost" size="icon" className="md:hidden text-muted-foreground hover:text-accent shadow-neu-extruded border-neu">
          <Menu size={24} />
        </Button>
        <div className="relative w-full max-w-md hidden md:block group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-accent transition-colors" />
          <Input 
            placeholder="Search assets, tags, serial numbers..." 
            className="w-full pl-12 pr-12 bg-background shadow-neu-inset-deep border-t border-l border-[#A3B1C6]/30 border-b border-r border-white/60"
          />
          <div className="absolute right-4 top-1/2 -translate-y-1/2 flex gap-2">
            <kbd className="hidden sm:inline-flex h-6 items-center justify-center rounded-lg bg-background shadow-neu-extruded border-neu px-2 font-display text-[10px] font-bold text-muted-foreground">
              ⌘
            </kbd>
            <kbd className="hidden sm:inline-flex h-6 items-center justify-center rounded-lg bg-background shadow-neu-extruded px-2 font-display text-[10px] font-bold text-muted-foreground">
              K
            </kbd>
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-accent hidden sm:flex h-12 w-12 rounded-[16px] shadow-neu-extruded hover:shadow-neu-hover active:shadow-neu-inset-small transition-all">
          <Sun size={20} />
        </Button>
        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-accent hidden sm:flex h-12 w-12 rounded-[16px] shadow-neu-extruded hover:shadow-neu-hover active:shadow-neu-inset-small transition-all">
          <Maximize size={20} />
        </Button>
        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-accent relative h-12 w-12 rounded-[16px] shadow-neu-extruded hover:shadow-neu-hover active:shadow-neu-inset-small transition-all">
          <Bell size={20} />
          <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-accent rounded-full shadow-neu-extruded"></span>
        </Button>
        
        <div className="flex items-center gap-4 pl-4 ml-2">
          <div className="h-12 w-12 rounded-full bg-background shadow-neu-extruded p-1 flex items-center justify-center cursor-pointer hover:shadow-neu-inset-small transition-all relative overflow-hidden">
            <img src="https://i.pravatar.cc/150?u=a042581f4e29026704d" alt="Avatar" className="h-full w-full object-cover rounded-full" />
            {/* Fallback avatar if no image (hidden for now since we have an image) */}
            <div className="absolute inset-0 bg-accent text-white text-sm font-bold flex items-center justify-center opacity-0">ADR</div>
          </div>
          <div className="hidden sm:block text-left cursor-pointer group">
            <p className="text-base font-bold text-foreground leading-none group-hover:text-accent transition-colors">{user?.full_name || "Agus Dwi R"}</p>
            <p className="text-xs text-muted-foreground font-medium mt-1">Admin</p>
          </div>
          <Button variant="ghost" size="icon" onClick={handleLogout} className="h-12 w-12 ml-2 rounded-[16px] shadow-neu-extruded hover:shadow-neu-hover active:shadow-neu-inset-small transition-all text-muted-foreground hover:text-red-500">
            <LogOut size={20} />
          </Button>
        </div>
      </div>
    </header>
  )
}

