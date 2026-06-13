"use client"

import { useState, useEffect, useRef } from "react"

import { signOut, useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { LogOut, Bell, Maximize, Search, Menu, Sun, ChevronDown } from "lucide-react"
import { useRouter } from "next/navigation"

export function Header() {
  const { data: session } = useSession()
  const user = session?.user as any
  const router = useRouter()

  const [showNotifications, setShowNotifications] = useState(false)
  const [showProfile, setShowProfile] = useState(false)
  const [isDark, setIsDark] = useState(false)
  
  const searchInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        searchInputRef.current?.focus()
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  const handleLogout = async () => {
    await signOut({ redirect: false })
    router.push("/login")
  }

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.log(`Error attempting to enable fullscreen: ${err.message}`)
      })
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen()
      }
    }
  }

  const toggleDarkMode = () => {
    setIsDark(!isDark)
    document.documentElement.classList.toggle('dark')
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
            ref={searchInputRef}
            placeholder="Search assets, tags, serial numbers..." 
            className="w-full pl-12 pr-12 bg-background shadow-neu-inset-deep border-t border-l border-[#A3B1C6]/30 border-b border-r border-white/60 focus:outline-none"
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
      
      <div className="flex items-center gap-4 relative">
        <Button onClick={toggleDarkMode} variant="ghost" size="icon" className={`text-muted-foreground hover:text-accent hidden sm:flex h-12 w-12 rounded-[16px] transition-all ${isDark ? 'shadow-neu-inset-deep text-accent' : 'shadow-neu-extruded hover:shadow-neu-hover active:shadow-neu-inset-small'}`}>
          <Sun size={20} />
        </Button>
        <Button onClick={toggleFullscreen} variant="ghost" size="icon" className="text-muted-foreground hover:text-accent hidden sm:flex h-12 w-12 rounded-[16px] shadow-neu-extruded hover:shadow-neu-hover active:shadow-neu-inset-small transition-all">
          <Maximize size={20} />
        </Button>
        
        <div className="relative">
          <Button onClick={() => { setShowNotifications(!showNotifications); setShowProfile(false); }} variant="ghost" size="icon" className={`text-muted-foreground hover:text-accent relative h-12 w-12 rounded-[16px] transition-all ${showNotifications ? 'shadow-neu-inset-deep' : 'shadow-neu-extruded hover:shadow-neu-hover active:shadow-neu-inset-small'}`}>
            <Bell size={20} />
            <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-accent rounded-full shadow-neu-extruded"></span>
          </Button>
          
          {showNotifications && (
            <div className="absolute right-0 top-full mt-4 w-80 bg-[#E4E9F2] rounded-[24px] shadow-neu-extruded border border-white/50 p-4 z-50">
              <h4 className="font-bold text-foreground mb-4 pb-2 border-b border-[#A3B1C6]/30">Notifications (2)</h4>
              <div className="flex flex-col gap-3">
                <div className="flex gap-3 p-3 rounded-2xl hover:bg-[#A3B1C6]/10 cursor-pointer transition-colors">
                  <div className="w-2 h-2 mt-1.5 rounded-full bg-red-500 shrink-0"></div>
                  <div>
                    <p className="text-sm font-bold text-foreground">Warranty Expiring</p>
                    <p className="text-xs text-muted-foreground font-semibold mt-1">UPS-SYS-1 warranty expires in 14 days.</p>
                  </div>
                </div>
                <div className="flex gap-3 p-3 rounded-2xl hover:bg-[#A3B1C6]/10 cursor-pointer transition-colors">
                  <div className="w-2 h-2 mt-1.5 rounded-full bg-[#8B84FF] shrink-0"></div>
                  <div>
                    <p className="text-sm font-bold text-foreground">Scheduled Maintenance</p>
                    <p className="text-xs text-muted-foreground font-semibold mt-1">CHIL-01 maintenance is due today at 14:00.</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-4 pl-4 ml-2 relative">
          <div 
            onClick={() => { setShowProfile(!showProfile); setShowNotifications(false); }}
            className={`h-12 w-12 rounded-full bg-background flex items-center justify-center cursor-pointer transition-all relative overflow-hidden font-display font-bold text-xl text-accent ${showProfile ? 'shadow-neu-inset-deep' : 'shadow-neu-extruded hover:shadow-neu-inset-small'}`}
          >
            SA
          </div>
          <div onClick={() => { setShowProfile(!showProfile); setShowNotifications(false); }} className="hidden sm:block text-left cursor-pointer group">
            <p className="text-base font-bold text-foreground leading-none group-hover:text-accent transition-colors">{user?.name || "System Admin"}</p>
            <p className="text-xs text-muted-foreground font-medium mt-1">{user?.role || "Admin"}</p>
          </div>
          <Button variant="ghost" size="icon" onClick={handleLogout} className="h-12 w-12 ml-2 rounded-[16px] shadow-neu-extruded hover:shadow-neu-hover active:shadow-neu-inset-small transition-all text-muted-foreground hover:text-red-500" title="Logout">
            <LogOut size={20} />
          </Button>

          {showProfile && (
            <div className="absolute right-14 top-full mt-4 w-48 bg-[#E4E9F2] rounded-[24px] shadow-neu-extruded border border-white/50 p-2 z-50">
              <div className="flex flex-col gap-1">
                <button className="text-left px-4 py-3 text-sm font-bold text-foreground hover:bg-[#A3B1C6]/20 rounded-xl transition-colors">My Profile</button>
                <button className="text-left px-4 py-3 text-sm font-bold text-foreground hover:bg-[#A3B1C6]/20 rounded-xl transition-colors">Settings</button>
                <div className="h-px bg-[#A3B1C6]/30 my-1 mx-2"></div>
                <button onClick={handleLogout} className="text-left px-4 py-3 text-sm font-bold text-red-500 hover:bg-[#A3B1C6]/20 rounded-xl transition-colors">Sign Out</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

