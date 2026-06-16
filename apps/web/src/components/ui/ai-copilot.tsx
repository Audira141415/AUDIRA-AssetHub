"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send, Bot, User, X, Sparkles } from "lucide-react"
import { useSession } from "next-auth/react"

type Message = {
  id: string
  role: "user" | "ai"
  content: string
}

export function AiCopilot() {
  const { data: session } = useSession()
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  // Load from sessionStorage on mount
  useEffect(() => {
    const savedChat = sessionStorage.getItem('audira_ai_chat');
    if (savedChat) {
      try {
        setMessages(JSON.parse(savedChat));
      } catch (e) {
        // Fallback if parsing fails
        setMessages([{
          id: "1",
          role: "ai",
          content: `Hello ${session?.user?.name || ''}! I am your AssetHub AI Assistant. Ask me anything about our inventory, like "How many assets do we have?"`
        }]);
      }
    } else {
      setMessages([{
        id: "1",
        role: "ai",
        content: `Hello ${session?.user?.name || ''}! I am your AssetHub AI Assistant. Ask me anything about our inventory, like "How many assets do we have?"`
      }]);
    }
  }, [session?.user?.name]);

  // Save to sessionStorage whenever messages change
  useEffect(() => {
    if (messages.length > 0) {
      sessionStorage.setItem('audira_ai_chat', JSON.stringify(messages));
    }
  }, [messages]);

  useEffect(() => {
    if (scrollRef.current && isOpen) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, isOpen])

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage: Message = { id: Date.now().toString(), role: "user", content: input }
    setMessages(prev => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message: userMessage.content })
      })

      const data = await response.json()

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "ai",
        content: data.response || "Sorry, I couldn't understand that."
      }
      setMessages(prev => [...prev, aiMessage])
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "ai",
        content: "Sorry, I am currently experiencing connection issues. Please try again later."
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 w-16 h-16 rounded-full shadow-[0_0_20px_rgba(147,51,234,0.5)] flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-[0_0_30px_rgba(147,51,234,0.8)] z-50 animate-bounce group p-0 overflow-hidden bg-zinc-900 border-2 border-purple-500/50"
        >
          <img 
            src="/images/ai_copilot_icon.png" 
            alt="AI Copilot Robot" 
            className="w-full h-full object-cover group-hover:opacity-90 transition-opacity"
          />
        </button>
      )}

      {/* Floating Chat Widget */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-[350px] sm:w-[400px] h-[500px] z-50 flex flex-col shadow-2xl rounded-2xl overflow-hidden border border-[#A3B1C6]/30 animate-in slide-in-from-bottom-5 fade-in-20">
          <Card className="flex-1 flex flex-col h-full bg-background border-none rounded-none">
            {/* Header */}
            <CardHeader className="bg-purple-600 p-4 shrink-0 flex flex-row items-center justify-between rounded-none">
              <div className="flex items-center gap-2 text-white">
                <Bot size={20} />
                <div>
                  <CardTitle className="text-base text-white">AssetHub Copilot</CardTitle>
                  <CardDescription className="text-purple-200 text-xs mt-0">Enterprise AI Assistant</CardDescription>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-white hover:bg-purple-500 p-1 rounded-md transition-colors"
              >
                <X size={20} />
              </button>
            </CardHeader>
            
            {/* Chat Body */}
            <CardContent className="flex-1 flex flex-col p-0 overflow-hidden relative bg-zinc-50/50 dark:bg-zinc-950/50">
              <div 
                ref={scrollRef}
                className="flex-1 overflow-y-auto p-4 space-y-4"
              >
                {messages.map((msg) => (
                  <div 
                    key={msg.id} 
                    className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                      msg.role === "user" ? "bg-blue-600/20 text-blue-600" : "bg-purple-600/20 text-purple-600"
                    }`}>
                      {msg.role === "user" ? <User size={16} /> : <Bot size={16} />}
                    </div>
                    
                    <div className={`max-w-[75%] rounded-2xl px-4 py-2 shadow-sm ${
                      msg.role === "user" 
                        ? "bg-blue-600 text-white rounded-tr-none" 
                        : "bg-white dark:bg-zinc-900 text-foreground rounded-tl-none border border-zinc-200 dark:border-zinc-800"
                    }`}>
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                    </div>
                  </div>
                ))}
                
                {isLoading && (
                  <div className="flex gap-3 flex-row">
                    <div className="w-8 h-8 rounded-full bg-purple-600/20 text-purple-600 flex items-center justify-center shrink-0">
                      <Bot size={16} />
                    </div>
                    <div className="max-w-[75%] rounded-2xl px-4 py-3 bg-white dark:bg-zinc-900 rounded-tl-none border border-zinc-200 dark:border-zinc-800 flex items-center gap-1.5 shadow-sm">
                      <div className="w-1.5 h-1.5 rounded-full bg-zinc-400 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-1.5 h-1.5 rounded-full bg-zinc-400 animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-1.5 h-1.5 rounded-full bg-zinc-400 animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                  </div>
                )}
              </div>

              {/* Input Area */}
              <div className="p-3 bg-background border-t border-[#A3B1C6]/20 shrink-0">
                <form onSubmit={handleSend} className="relative flex items-center">
                  <Input 
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask me anything..."
                    className="w-full h-10 pr-10 rounded-full text-foreground bg-zinc-100 dark:bg-zinc-900 border-none focus-visible:ring-1 focus-visible:ring-purple-500 text-sm"
                    disabled={isLoading}
                  />
                  <Button 
                    type="submit" 
                    size="icon"
                    variant="ghost"
                    disabled={!input.trim() || isLoading}
                    className="absolute right-1 h-8 w-8 rounded-full text-purple-600 hover:text-purple-700 hover:bg-purple-100 dark:hover:bg-purple-900/50"
                  >
                    <Send size={16} />
                  </Button>
                </form>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  )
}
