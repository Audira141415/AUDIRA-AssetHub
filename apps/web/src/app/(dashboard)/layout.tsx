"use client"

import { useEffect, useState } from"react"
import { useRouter } from"next/navigation"
import { useAuthStore } from"@/lib/store"
import { Sidebar } from"@/components/layout/Sidebar"
import { Header } from"@/components/layout/Header"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const token = useAuthStore((state) => state.token)
  const router = useRouter()
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (isMounted && !token) {
      router.push("/login")
    }
  }, [isMounted, token, router])

  if (!isMounted) {
    return null
  }

  if (!token) {
    return <div className="flex items-center justify-center h-screen  text-muted-foreground">Redirecting to login...</div>
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background text-foreground">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Header />
        <main className="flex-1 overflow-y-auto bg-background p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
