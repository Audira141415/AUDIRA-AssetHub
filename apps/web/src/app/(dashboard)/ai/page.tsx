"use client"

import { useState, useRef, useEffect } from"react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from"@/components/ui/card"
import { Button } from"@/components/ui/button"
import { Input } from"@/components/ui/input"
import { Sparkles, Send, Bot, User } from"lucide-react"
import { useAuthStore } from"@/lib/store"
import { fetchApi } from"@/lib/api"

type Message = {
  id: string
  role:"user" |"ai"
  content: string
}

export default function AIPage() {
  const currentUser = useAuthStore((state) => state.user)
  const [messages, setMessages] = useState<Message[]>([
    {
      id:"1",
      role:"ai",
      content: `Hello ${currentUser?.email || ''}! I am your AssetHub AI Assistant. You can ask me questions about our data center like"How many assets do we have?" or"Are there any warranties expiring?"`
    }
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage: Message = { id: Date.now().toString(), role:"user", content: input }
    setMessages(prev => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      const response = await fetchApi("/ai/chat", {
        method:"POST",
        body: JSON.stringify({ message: userMessage.content })
      })

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role:"ai",
        content: response.response
      }
      setMessages(prev => [...prev, aiMessage])
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role:"ai",
        content:"Sorry, I am currently experiencing connection issues. Please try again later."
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6 h-[calc(100vh-8rem)] flex flex-col">
      <div className="flex items-center gap-3 shrink-0">
        <Sparkles className="text-purple-500" size={32} />
        <h1 className="text-3xl font-bold tracking-tight text-white">Smart Assistant</h1>
      </div>
      
      <Card className="flex-1 flex flex-col overflow-hidden shadow-2xl">
        <CardHeader className="-b  /50 pb-4 shrink-0">
          <CardTitle className="text-white flex items-center gap-2">
            <Bot size={20} className="text-purple-500" />
            AssetHub AI
          </CardTitle>
          <CardDescription className="text-muted-foreground">Powered by Data Center LLM (Mock)</CardDescription>
        </CardHeader>
        
        <CardContent className="flex-1 flex flex-col p-0 overflow-hidden relative">
          <div 
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-6 space-y-6"
          >
            {messages.map((msg) => (
              <div 
                key={msg.id} 
                className={`flex gap-4 ${msg.role ==="user" ?"flex-row-reverse" :"flex-row"}`}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                  msg.role ==="user" ?"bg-blue-600/20 text-blue-500  -blue-500/30" :"bg-purple-600/20 text-purple-500  -purple-500/30"
                }`}>
                  {msg.role ==="user" ? <User size={20} /> : <Bot size={20} />}
                </div>
                
                <div className={`max-w-[75%] rounded-2xl px-5 py-3 ${
                  msg.role ==="user" 
                    ?"bg-blue-600 text-white rounded-tr-none" 
                    :" text-foreground   rounded-tl-none"
                }`}>
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex gap-4 flex-row">
                <div className="w-10 h-10 rounded-full bg-purple-600/20 text-purple-500  -purple-500/30 flex items-center justify-center shrink-0">
                  <Bot size={20} />
                </div>
                <div className="max-w-[75%] rounded-2xl px-5 py-4    rounded-tl-none flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-zinc-500 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 rounded-full bg-zinc-500 animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 rounded-full bg-zinc-500 animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            )}
          </div>

          <div className="p-4  -t  shrink-0">
            <form onSubmit={handleSend} className="relative flex items-center">
              <Input 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask me about assets, warranties, or racks..."
                className="w-full   h-14 pl-5 pr-14 rounded-full text-foreground placeholder:text-muted-foreground focus-visible:ring-purple-500"
                disabled={isLoading}
              />
              <Button 
                type="submit" 
                size="icon"
                disabled={!input.trim() || isLoading}
                className="absolute right-2 h-10 w-10 rounded-full bg-purple-600 hover:bg-purple-700 text-white"
              >
                <Send size={18} className={input.trim() && !isLoading ?"translate-x-0.5 -translate-y-0.5 transition-transform" :""} />
              </Button>
            </form>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
