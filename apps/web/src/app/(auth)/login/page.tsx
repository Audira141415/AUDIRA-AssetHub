"use client"

import { useState } from"react"
import { useRouter } from"next/navigation"
import { useAuthStore } from"@/lib/store"
import { fetchApi } from"@/lib/api"
import { Button } from"@/components/ui/button"
import { Input } from"@/components/ui/input"
import { Label } from"@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from"@/components/ui/card"

export default function LoginPage() {
  const [email, setEmail] = useState("admin@audira.local")
  const [password, setPassword] = useState("admin123")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  
  const setAuth = useAuthStore((state) => state.setAuth)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const formData = new URLSearchParams()
      formData.append("username", email)
      formData.append("password", password)

      const loginRes = await fetchApi("/auth/login", {
        method:"POST",
        headers: {"Content-Type":"application/x-www-form-urlencoded",
        },
        body: formData,
      })

      // Temporary token set to fetch 'me'
      useAuthStore.setState({ token: loginRes.access_token })

      const userRes = await fetchApi("/auth/me")
      
      setAuth(loginRes.access_token, userRes)
      router.push("/dashboard")
    } catch (err: any) {
      setError(err.message ||"Failed to login")
      useAuthStore.setState({ token: null })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center  p-4">
      <Card className="w-full max-w-md   text-foreground shadow-2xl backdrop-blur-xl">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold tracking-tight text-center">
            Audira AssetHub
          </CardTitle>
          <CardDescription className="text-muted-foreground text-center">
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground">Email</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="admin@audira.local" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="text-foreground"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-foreground">Password</Label>
              <Input 
                id="password" 
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="text-foreground"
              />
            </div>
            {error && (
              <div className="text-red-500 text-sm font-medium text-center">
                {error}
              </div>
            )}
            <Button 
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              disabled={isLoading}
            >
              {isLoading ?"Signing in..." :"Sign in"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
