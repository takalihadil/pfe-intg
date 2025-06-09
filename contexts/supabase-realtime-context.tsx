"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { createClient, type SupabaseClient } from "@supabase/supabase-js"

interface SupabaseRealtimeContextType {
  supabase: SupabaseClient | null
  isConnected: boolean
  subscribeToChat: (chatId: string, callback: (payload: any) => void) => () => void
  broadcastTyping: (chatId: string, isTyping: boolean) => void
}

const SupabaseRealtimeContext = createContext<SupabaseRealtimeContextType>({
  supabase: null,
  isConnected: false,
  subscribeToChat: () => () => {},
  broadcastTyping: () => {},
})

export const useSupabaseRealtime = () => useContext(SupabaseRealtimeContext)

interface SupabaseRealtimeProviderProps {
  children: ReactNode
}

export function SupabaseRealtimeProvider({ children }: SupabaseRealtimeProviderProps) {
  const [supabase, setSupabase] = useState<SupabaseClient | null>(null)
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    // Initialize Supabase client
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://your-project.supabase.co"
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""

    if (supabaseUrl && supabaseKey) {
      console.log("Initializing Supabase client")
      const supabaseClient = createClient(supabaseUrl, supabaseKey)
      setSupabase(supabaseClient)
      setIsConnected(true)
    } else {
      console.error("Missing Supabase credentials")
    }
  }, [])

  const subscribeToChat = (chatId: string, callback: (payload: any) => void) => {
    if (!supabase) {
      console.error("Supabase client not initialized")
      return () => {}
    }

    console.log(`Subscribing to chat channel: ${chatId}`)

    // Create a channel for this chat
    const channel = supabase
      .channel(`chat:${chatId}`)
      .on("broadcast", { event: "*" }, (payload) => {
        console.log("Received broadcast event:", payload)
        callback(payload)
      })
      .subscribe((status) => {
        console.log(`Subscription status for chat:${chatId}:`, status)
      })

    // Return unsubscribe function
    return () => {
      console.log(`Unsubscribing from chat channel: ${chatId}`)
      channel.unsubscribe()
    }
  }

  const broadcastTyping = (chatId: string, isTyping: boolean) => {
    if (!supabase) {
      console.error("Supabase client not initialized")
      return
    }

    const token = localStorage.getItem("access_token")
    if (!token) {
      console.error("No authentication token found")
      return
    }

    // Send typing status to backend
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/messages/typing`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ chatId, isTyping }),
    }).catch((err) => {
      console.error("Error sending typing indicator:", err)
    })
  }

  return (
    <SupabaseRealtimeContext.Provider value={{ supabase, isConnected, subscribeToChat, broadcastTyping }}>
      {children}
    </SupabaseRealtimeContext.Provider>
  )
}
