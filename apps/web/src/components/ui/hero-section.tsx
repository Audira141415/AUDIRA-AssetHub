import React from "react"
import { cn } from "@/lib/utils"

interface HeroSectionProps {
  title: string
  description?: string
  imageSrc?: string
  icon?: React.ReactNode
  className?: string
  children?: React.ReactNode
  compact?: boolean
}

export function HeroSection({ title, description, imageSrc, icon, className, children, compact = false }: HeroSectionProps) {
  return (
    <div className={cn(`shrink-0 relative w-full overflow-hidden rounded-3xl bg-[#E4E9F2] shadow-neu-extruded border border-white/60 group ${compact ? 'mb-4' : 'mb-8'}`, className)}>
      {/* Background Image overlay */}
      <div className="absolute inset-0 z-0 overflow-hidden rounded-3xl">
        <div className="absolute inset-0 bg-gradient-to-r from-[#E4E9F2] via-[#E4E9F2]/80 to-transparent z-10" />
        {imageSrc ? (
          <img src={imageSrc} alt={title} className="w-full h-full object-cover object-right opacity-30 mix-blend-overlay group-hover:scale-105 transition-transform duration-700" />
        ) : (
          <div className="w-full h-full bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-accent/20 via-transparent to-transparent" />
        )}
      </div>

      <div className={`relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 sm:gap-8 h-full ${compact ? 'min-h-[120px] p-4 sm:p-6' : 'min-h-[280px] p-8 sm:p-12'}`}>
        <div className={`backdrop-blur-md bg-white/30 rounded-[32px] shadow-neu-inset border border-white/60 w-full flex ${compact ? 'p-5 sm:px-8 flex-col lg:flex-row items-start lg:items-center justify-between gap-6' : 'p-8 max-w-2xl flex-1 flex-col'}`}>
          
          <div className={`flex flex-col ${compact ? 'gap-1' : 'gap-2'}`}>
            <div className="flex items-center gap-4">
              {icon && <div className={`${compact ? 'w-12 h-12 rounded-xl' : 'w-16 h-16 rounded-[20px]'} bg-background shadow-neu-inset flex items-center justify-center shrink-0 border-t border-l border-[#A3B1C6]/30 border-b border-r border-white/60`}>{icon}</div>}
              <h1 className={`${compact ? 'text-2xl md:text-3xl' : 'text-4xl md:text-5xl'} font-display font-black tracking-tight text-foreground bg-clip-text text-transparent bg-gradient-to-br from-foreground to-foreground/70`}>
                {title}
              </h1>
            </div>
            {description && (
              <p className={`${compact ? 'text-sm text-muted-foreground font-semibold pl-[64px]' : 'mt-4 text-lg text-muted-foreground font-semibold max-w-xl leading-relaxed'}`}>
                {description}
              </p>
            )}
          </div>

          {children && (
            <div className={`${compact ? 'w-full lg:w-auto flex flex-wrap items-center gap-3 lg:justify-end mt-4 lg:mt-0' : 'mt-8 flex flex-wrap items-center gap-4'}`}>
              {children}
            </div>
          )}

        </div>
        
        {imageSrc && !compact && (
          <div className="hidden lg:flex w-72 h-72 shrink-0 rounded-[2rem] shadow-neu-extruded border-8 border-[#E4E9F2] overflow-hidden transform rotate-2 hover:rotate-0 hover:scale-105 transition-all duration-500 bg-background">
             <img src={imageSrc} alt={`${title} Graphic`} className="w-full h-full object-cover" />
          </div>
        )}
      </div>
    </div>
  )
}
