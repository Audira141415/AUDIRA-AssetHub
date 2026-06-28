import React, { createContext, useContext, useState } from "react"
import { cn } from "@/lib/utils"
import { X } from "lucide-react"

interface DialogContextProps {
  open: boolean
  setOpen: (open: boolean) => void
}

const DialogContext = createContext<DialogContextProps | undefined>(undefined)

export function Dialog({ 
  children, 
  open: controlledOpen, 
  onOpenChange 
}: { 
  children: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
}) {
  const [localOpen, setLocalOpen] = useState(false)
  const open = controlledOpen !== undefined ? controlledOpen : localOpen
  const setOpen = onOpenChange !== undefined ? onOpenChange : setLocalOpen

  return (
    <DialogContext.Provider value={{ open, setOpen }}>
      {children}
    </DialogContext.Provider>
  )
}

export function DialogTrigger({ children, asChild }: { children: React.ReactElement, asChild?: boolean }) {
  const context = useContext(DialogContext)
  if (!context) throw new Error("DialogTrigger must be used within Dialog")
  
  return React.cloneElement(children as React.ReactElement<any>, {
    onClick: (e: React.MouseEvent) => {
      if (children.props && (children.props as any).onClick) {
        (children.props as any).onClick(e)
      }
      context.setOpen(true)
    }
  })
}

export function DialogContent({ children, className }: { children: React.ReactNode, className?: string }) {
  const context = useContext(DialogContext)
  if (!context) throw new Error("DialogContent must be used within Dialog")
  if (!context.open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" 
        onClick={() => context.setOpen(false)}
      />
      {/* Modal Container */}
      <div className={cn(
        "relative z-50 w-full max-w-lg bg-background p-6 rounded-[32px] shadow-neu-extruded border border-white/60", 
        className
      )}>
        {/* Close Button */}
        <button 
          onClick={() => context.setOpen(false)}
          className="absolute right-6 top-6 rounded-xl p-2 text-muted-foreground hover:text-foreground hover:bg-neutral-200 transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
        {children}
      </div>
    </div>
  )
}

export function DialogHeader({ children, className }: { children: React.ReactNode, className?: string }) {
  return (
    <div className={cn("flex flex-col space-y-1.5 text-center sm:text-left mb-4", className)}>
      {children}
    </div>
  )
}

export function DialogTitle({ children, className }: { children: React.ReactNode, className?: string }) {
  return (
    <h2 className={cn("text-xl font-bold leading-none tracking-tight text-foreground", className)}>
      {children}
    </h2>
  )
}
