"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Server, Lock, Mail, ArrowRight, ShieldCheck } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("admin@audira.local")
  const [password, setPassword] = useState("admin123")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const res = await signIn("credentials", {
        redirect: false,
        email,
        password,
      })

      if (res?.error) {
        setError("Invalid email or password")
      } else {
        router.push("/dashboard")
        router.refresh()
      }
    } catch (err) {
      setError("An unexpected error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#E4E9F2] flex items-center justify-center p-4 sm:p-8 font-sans relative overflow-hidden">
      {/* Background Ornaments */}
      <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] rounded-full bg-gradient-to-br from-accent/20 to-transparent blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] rounded-full bg-gradient-to-tl from-[#38B2AC]/20 to-transparent blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-[1000px] bg-background shadow-neu-extruded border-neu rounded-[40px] flex flex-col md:flex-row overflow-hidden relative z-10">
        
        {/* Left Side - Hero / Branding */}
        <div className="w-full md:w-1/2 bg-accent p-12 text-white flex flex-col justify-between relative overflow-hidden hidden md:flex">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_white_1px,_transparent_1px)] bg-[size:24px_24px]"></div>
          
          <div className="relative z-10">
            <div className="w-16 h-16 rounded-[20px] bg-white/10 backdrop-blur-md border border-white/20 shadow-neu-extruded flex items-center justify-center mb-8">
              <Server size={32} className="text-white" />
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight mb-4">Audira<br/>AssetHub</h1>
            <p className="text-white/80 font-medium text-lg max-w-sm">
              Enterprise Asset & Infrastructure Management System.
            </p>
          </div>
          
          <div className="relative z-10">
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 shadow-neu-inset">
              <div className="flex items-center gap-3 mb-2">
                <ShieldCheck size={20} className="text-green-400" />
                <span className="font-bold">Secure Access</span>
              </div>
              <p className="text-sm text-white/70">
                Your infrastructure data is protected with enterprise-grade security and role-based access control.
              </p>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full md:w-1/2 p-8 sm:p-12 flex flex-col justify-center">
          <div className="md:hidden flex items-center gap-3 mb-10">
            <div className="w-10 h-10 rounded-xl bg-background shadow-neu-extruded border-neu flex items-center justify-center">
              <Server size={20} className="text-accent" />
            </div>
            <div>
              <span className="font-bold text-xl text-foreground tracking-tight block leading-none">Audira</span>
              <span className="text-xs text-muted-foreground font-medium">AssetHub</span>
            </div>
          </div>

          <div className="mb-10">
            <h2 className="text-3xl font-extrabold text-foreground mb-2">Welcome back</h2>
            <p className="text-muted-foreground font-medium">Sign in to manage your infrastructure.</p>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-500 px-4 py-3 rounded-2xl font-bold text-sm mb-6 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-red-500 shrink-0"></div>
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="text-xs font-bold text-muted-foreground uppercase mb-2 block tracking-widest">Email Address</label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                  <Mail size={18} />
                </div>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-14 pl-12 pr-4 rounded-2xl bg-background shadow-neu-inset border-neu focus:outline-none focus:ring-2 focus:ring-accent/50 font-bold text-sm text-foreground transition-all" 
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Password</label>
                <a href="#" className="text-xs font-bold text-accent hover:underline">Forgot?</a>
              </div>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                  <Lock size={18} />
                </div>
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-14 pl-12 pr-4 rounded-2xl bg-background shadow-neu-inset border-neu focus:outline-none focus:ring-2 focus:ring-accent/50 font-bold text-sm text-foreground transition-all" 
                  required
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-accent hover:bg-accent/90 text-white shadow-neu-extruded hover:shadow-neu-hover active:shadow-neu-inset-small rounded-2xl h-14 font-extrabold flex items-center justify-center gap-2 transition-all disabled:opacity-70 disabled:pointer-events-none mt-4 group"
            >
              {isLoading ? "Authenticating..." : "Sign In"}
              {!isLoading && <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />}
            </button>
          </form>

          <div className="mt-12 text-center">
            <p className="text-xs font-bold text-muted-foreground">
              Don't have an account? <a href="#" className="text-accent hover:underline">Contact Administrator</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
