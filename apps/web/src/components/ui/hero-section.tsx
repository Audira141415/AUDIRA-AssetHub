import React from "react"
import { cn } from "@/lib/utils"

interface HeroSectionProps {
  title: string
  description?: string
  imageSrc?: string
  className?: string
  children?: React.ReactNode
}

export function HeroSection({ title, description, imageSrc, className, children }: HeroSectionProps) {
  return (
    <div className={cn("relative w-full overflow-hidden rounded-3xl mb-8 bg-[#E4E9F2] shadow-neu-extruded border border-white/60 group", className)}>
      {/* Background Image overlay */}
      <div className="absolute inset-0 z-0 overflow-hidden rounded-3xl">
        <div className="absolute inset-0 bg-gradient-to-r from-[#E4E9F2] via-[#E4E9F2]/80 to-transparent z-10" />
        {imageSrc ? (
          <img src={imageSrc} alt={title} className="w-full h-full object-cover object-right opacity-30 mix-blend-overlay group-hover:scale-105 transition-transform duration-700" />
        ) : (
          <div className="w-full h-full bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-accent/20 via-transparent to-transparent" />
        )}
      </div>

      <div className="relative z-10 p-8 sm:p-12 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 h-full min-h-[280px]">
        <div className="max-w-2xl flex-1 backdrop-blur-md bg-white/30 p-8 rounded-[32px] shadow-neu-inset border border-white/60">
          <h1 className="text-4xl md:text-5xl font-display font-black tracking-tight text-foreground bg-clip-text text-transparent bg-gradient-to-br from-foreground to-foreground/70">
            {title}
          </h1>
          {description && (
            <p className="mt-4 text-lg text-muted-foreground font-semibold max-w-xl leading-relaxed">
              {description}
            </p>
          )}
          {children && <div className="mt-8 flex flex-wrap items-center gap-4">{children}</div>}
        </div>
        
        {imageSrc && (
          <div className="hidden lg:flex w-72 h-72 shrink-0 rounded-[2rem] shadow-neu-extruded border-8 border-[#E4E9F2] overflow-hidden transform rotate-2 hover:rotate-0 hover:scale-105 transition-all duration-500 bg-background">
             <img src={imageSrc} alt={`${title} Graphic`} className="w-full h-full object-cover" />
          </div>
        )}
      </div>
    </div>
  )
}
