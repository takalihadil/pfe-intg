"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { io, type Socket } from "socket.io-client"

interface SocketContextType {
  socket: Socket | null
  isConnected: boolean
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
})

export const useSocket = () => useContext(SocketContext)

interface SocketProviderProps {
  children: ReactNode
}

export function SocketProvider({ children }: SocketProviderProps) {
  const [socket, setSocket] = useState<Socket | null>(null)
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    const socketInstance = io(process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3001", {
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      autoConnect: false,
      withCredentials: true,
    })

    const token =
      localStorage.getItem("access_token") || localStorage.getItem("token") || localStorage.getItem("authToken")

    if (token) {
      socketInstance.auth = { token }
      socketInstance.connect()

      socketInstance.on("connect", () => {
        console.log("Socket connected")
        setIsConnected(true)
      })

      socketInstance.on("disconnect", () => {
        console.log("Socket disconnected")
        setIsConnected(false)
      })

      socketInstance.on("connect_error", (err) => {
        console.error("Socket connection error:", err)
        setIsConnected(false)

        // Try to reconnect after a delay
        setTimeout(() => {
          console.log("Attempting to reconnect socket...")
          socketInstance.connect()
        }, 3000)
      })

      setSocket(socketInstance)
    }

    return () => {
      console.log("Cleaning up socket connection")
      if (socketInstance.connected) {
        socketInstance.disconnect()
      }
    }
  }, [])

  return <SocketContext.Provider value={{ socket, isConnected }}>{children}</SocketContext.Provider>
}
