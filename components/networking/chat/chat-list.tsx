"use client"

import { cn } from "@/lib/utils"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  PlusCircle,
  Search,
  Users,
  Bell,
  Clock,
  CheckCheck,
  Check,
  X,
  MoreVertical,
  Pin,
  PinOff,
  BellOff,
  Archive,
  Trash,
  MessageSquare,
  Filter,
  VolumeX,
  AudioWaveformIcon as Waveform,
  ImageIcon,
  FileText,
  Video,
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/hooks/use-toast"

interface ChatUser {
  id: string
  fullname: string
  profile_photo: string | null
}

interface Chat {
  id: string
  name: string | null
  isGroup: boolean
  isPinned?: boolean
  isMuted?: boolean
  lastMessage: {
    content: string | null
    type: string
    createdAt: string
    status?: "SENDING" | "DELIVERED" | "SENT" | "SEEN" | "FAILED" | "EDITED"
    sender: ChatUser
  } | null
  users: {
    userId: string
    user: ChatUser
  }[]
  unreadCount: number
}

interface ChatListProps {
  chats: Chat[]
  activeChatId?: string | null
  onChatSelect?: (chatId: string) => void
  showHeader?: boolean
  title?: string
  loading?: boolean
  onDeleteChat?: (chatId: string) => void
  onPinChat?: (chatId: string, isPinned: boolean) => void
  onMuteChat?: (chatId: string, isMuted: boolean) => void
}

export default function ChatList({
  chats,
  onChatSelect,
  activeChatId,
  showHeader = true,
  title = "Messages",
  loading = false,
  onDeleteChat,
  onPinChat,
  onMuteChat,
}: ChatListProps) {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [animateChats, setAnimateChats] = useState(false)
  const [activeFilter, setActiveFilter] = useState<"all" | "unread" | "pinned">("all")
  const [showFilterPanel, setShowFilterPanel] = useState(false)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  useEffect(() => {
    // Trigger animation after component mounts
    setAnimateChats(true)
  }, [])

  const handleChatClick = (chatId: string) => {
    localStorage.setItem("selectedChatId", chatId)

    if (onChatSelect) {
      onChatSelect(chatId)
    } else {
      router.push(`/habits/networking/messages/${chatId}`)
    }
  }

  const handleNewChat = () => {
    router.push("/habits/networking/messages/new")
  }

  const handleDeleteChat = (chatId: string) => {
    if (onDeleteChat) {
      onDeleteChat(chatId)
    } else {
      toast({
        title: "Chat deleted",
        description: "The conversation has been deleted",
      })
    }
  }

  const handlePinChat = (chatId: string, isPinned: boolean) => {
    if (onPinChat) {
      onPinChat(chatId, isPinned)
    } else {
      toast({
        title: isPinned ? "Chat unpinned" : "Chat pinned",
        description: isPinned ? "The conversation has been unpinned" : "The conversation has been pinned",
      })
    }
  }

  const handleMuteChat = (chatId: string, isMuted: boolean) => {
    if (onMuteChat) {
      onMuteChat(chatId, isMuted)
    } else {
      toast({
        title: isMuted ? "Chat unmuted" : "Chat muted",
        description: isMuted ? "Notifications enabled" : "Notifications disabled",
      })
    }
  }

  const getCurrentUserId = () => {
    if (typeof window !== "undefined") {
      try {
        const userStr = localStorage.getItem("user")
        if (userStr) {
          const user = JSON.parse(userStr)
          if (user?.id) return user.id
        }
        return localStorage.getItem("user_id")
      } catch (e) {
        console.error("Error parsing user from localStorage:", e)
      }
    }
    return null
  }

  const getChatName = (chat: Chat) => {
    if (chat.isGroup) return chat.name || "Group Chat"

    const currentUserId = getCurrentUserId()
    const otherUser = chat.users.find((u) => u.userId !== currentUserId)
    return otherUser?.user.fullname || "Chat"
  }

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))

    if (diffInDays === 0) {
      return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    } else if (diffInDays === 1) {
      return "Yesterday"
    } else if (diffInDays < 7) {
      return date.toLocaleDateString([], { weekday: "short" })
    } else {
      return date.toLocaleDateString([], { month: "short", day: "numeric" })
    }
  }

  const getMessagePreview = (chat: Chat) => {
    if (!chat.lastMessage) return "No messages yet"

    const messageType = chat.lastMessage.type
    if (messageType === "TEXT") {
      return chat.lastMessage.content || "Empty message"
    } else if (messageType === "IMAGE") {
      return "📷 Photo"
    } else if (messageType === "VIDEO") {
      return "🎥 Video"
    } else if (messageType === "AUDIO") {
      return "🎵 Voice message"
    } else if (messageType === "FILE") {
      return "📎 File"
    } else if (messageType === "CALL") {
      return "📞 Call"
    }

    return messageType.charAt(0) + messageType.slice(1).toLowerCase()
  }

  // Filter chats based on search query and active filter
  const filteredChats = chats.filter((chat) => {
    const chatName = getChatName(chat)
    const matchesSearch = chatName.toLowerCase().includes(searchQuery.toLowerCase())

    if (activeFilter === "unread") {
      return matchesSearch && chat.unreadCount > 0
    } else if (activeFilter === "pinned") {
      return matchesSearch && chat.isPinned
    }

    return matchesSearch
  })

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 },
  }

  // Render message status icon
  const renderMessageStatus = (status?: string) => {
    if (!status) return null

    switch (status) {
      case "SENDING":
        return <Clock size={14} className="text-gray-400" />
      case "SENT":
        return <Check size={14} className="text-gray-400" />
      case "DELIVERED":
        return <CheckCheck size={14} className="text-gray-400" />
      case "SEEN":
        return <CheckCheck size={14} className="text-emerald-500" />
      default:
        return null
    }
  }

  // Get message type icon
  const getMessageTypeIcon = (type?: string) => {
    if (!type || type === "TEXT") return null

    switch (type) {
      case "IMAGE":
        return <ImageIcon size={14} className="text-blue-500" />
      case "VIDEO":
        return <Video size={14} className="text-purple-500" />
      case "AUDIO":
        return <Waveform size={14} className="text-emerald-500" />
      case "FILE":
        return <FileText size={14} className="text-orange-500" />
      default:
        return null
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col h-full">
        {showHeader && (
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 sticky top-0 bg-white dark:bg-gray-800 z-10">
            <div className="flex justify-between items-center mb-4">
              <Skeleton className="h-8 w-24" />
              <Skeleton className="h-9 w-20" />
            </div>
            <Skeleton className="h-10 w-full" />
          </div>
        )}
        <div className="flex-1 overflow-y-auto p-2 space-y-2">
          {Array(5)
            .fill(0)
            .map((_, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-lg">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="flex-1">
                  <Skeleton className="h-5 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
                <Skeleton className="h-4 w-10" />
              </div>
            ))}
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      {showHeader && (
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 sticky top-0 bg-white dark:bg-gray-800 z-10">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
              {title}
            </h1>
            <Button
              onClick={handleNewChat}
              size="sm"
              className="flex items-center gap-1 bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white shadow-md hover:shadow-lg transition-all"
            >
              <PlusCircle size={16} />
              <span>New Chat</span>
            </Button>
          </div>

          <div className="flex gap-2 mb-3">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                ref={searchInputRef}
                placeholder="Search conversations..."
                className="pl-10 pr-9 bg-muted/30 focus:bg-background transition-colors"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7 text-muted-foreground hover:text-foreground"
                  onClick={() => setSearchQuery("")}
                >
                  <X size={14} />
                </Button>
              )}
            </div>

            <TooltipProvider delayDuration={300}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-10 w-10 bg-muted/30 hover:bg-muted/50 border-muted"
                    onClick={() => setShowFilterPanel(!showFilterPanel)}
                  >
                    <Filter size={16} className="text-muted-foreground" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="text-xs">
                  Filter conversations
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          <AnimatePresence>
            {showFilterPanel && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <Tabs
                  value={activeFilter}
                  onValueChange={(value) => setActiveFilter(value as "all" | "unread" | "pinned")}
                  className="w-full mb-2"
                >
                  <TabsList className="grid w-full grid-cols-3 h-9">
                    <TabsTrigger value="all" className="text-xs">
                      All
                    </TabsTrigger>
                    <TabsTrigger value="unread" className="text-xs">
                      Unread
                    </TabsTrigger>
                    <TabsTrigger value="pinned" className="text-xs">
                      Pinned
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      <div className="flex-1 overflow-y-auto">
        <AnimatePresence>
          {filteredChats.length > 0 ? (
            <motion.div
              className="space-y-1 p-2"
              variants={container}
              initial="hidden"
              animate={animateChats ? "show" : "hidden"}
            >
              {filteredChats.map((chat) => {
                const chatName = getChatName(chat)
                const messagePreview = getMessagePreview(chat)
                const lastMessageSender =
                  chat.lastMessage && chat.isGroup ? `${chat.lastMessage.sender.fullname}: ` : ""
                const timestamp = chat.lastMessage ? formatTimestamp(chat.lastMessage.createdAt) : ""
                const currentUserId = getCurrentUserId()
                const otherUser = chat.users.find((u) => u.userId !== currentUserId)?.user
                const isLastMessageFromMe = chat.lastMessage?.sender.id === currentUserId
                const messageTypeIcon = chat.lastMessage ? getMessageTypeIcon(chat.lastMessage.type) : null

                return (
                  <motion.div
                    key={chat.id}
                    variants={item}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    className="relative"
                  >
                    <Card
                      className={cn(
                        "border-0 shadow-sm hover:shadow-md transition-all cursor-pointer overflow-hidden",
                        activeChatId === chat.id
                          ? "bg-gradient-to-r from-indigo-50 to-violet-50 dark:from-indigo-900/20 dark:to-violet-900/20 border-l-4 border-indigo-500"
                          : "hover:bg-gray-50 dark:hover:bg-gray-800/50",
                        chat.isPinned && "bg-amber-50/50 dark:bg-amber-900/10",
                      )}
                      onClick={() => handleChatClick(chat.id)}
                    >
                      <CardContent className="p-3">
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <Avatar
                              className={cn(
                                "h-12 w-12 border-2",
                                chat.unreadCount > 0
                                  ? "border-indigo-500 ring-2 ring-indigo-200"
                                  : "border-gray-100 dark:border-gray-700",
                                chat.isPinned && "border-amber-300",
                              )}
                            >
                              <AvatarImage
                                src={
                                  chat.isGroup
                                    ? "/placeholder.svg?height=48&width=48"
                                    : otherUser?.profile_photo || "/placeholder.svg?height=48&width=48"
                                }
                                alt={chatName}
                              />
                              <AvatarFallback
                                className={cn(
                                  "text-white",
                                  chat.isGroup
                                    ? "bg-gradient-to-br from-indigo-500 to-violet-600"
                                    : "bg-gradient-to-br from-emerald-500 to-teal-600",
                                )}
                              >
                                {chat.isGroup ? <Users size={20} /> : chatName.charAt(0)}
                              </AvatarFallback>
                            </Avatar>

                            {chat.unreadCount > 0 && (
                              <Badge className="absolute -top-1 -right-1 px-1.5 py-0.5 min-w-[20px] h-5 flex items-center justify-center bg-indigo-500 border-2 border-white dark:border-gray-800">
                                {chat.unreadCount}
                              </Badge>
                            )}

                            {chat.isMuted && (
                              <div className="absolute -bottom-1 -right-1 bg-gray-100 dark:bg-gray-700 rounded-full p-0.5 border border-white dark:border-gray-800">
                                <VolumeX size={10} className="text-gray-500 dark:text-gray-400" />
                              </div>
                            )}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-center">
                              <div className="flex items-center gap-1.5">
                                <h3 className="font-medium truncate">{chatName}</h3>
                                {chat.isPinned && <Pin size={12} className="text-amber-500" />}
                                {chat.isMuted && <VolumeX size={12} className="text-gray-400" />}
                              </div>
                              <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">{timestamp}</span>
                            </div>

                            <div className="flex justify-between items-center mt-1">
                              <div className="flex items-center gap-1 max-w-[80%]">
                                {messageTypeIcon && <span className="flex-shrink-0">{messageTypeIcon}</span>}
                                <p className="text-sm text-muted-foreground truncate">
                                  {lastMessageSender}
                                  {messagePreview}
                                </p>
                              </div>

                              <div className="flex items-center gap-1 ml-1">
                                {isLastMessageFromMe && chat.lastMessage?.status && (
                                  <span className="text-xs text-muted-foreground">
                                    {renderMessageStatus(chat.lastMessage.status)}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Chat actions dropdown */}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute top-1/2 right-2 transform -translate-y-1/2 h-8 w-8 rounded-full opacity-0 group-hover:opacity-100 hover:opacity-100 focus:opacity-100 transition-opacity"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <MoreVertical size={16} className="text-muted-foreground" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation()
                            handlePinChat(chat.id, !!chat.isPinned)
                          }}
                        >
                          {chat.isPinned ? (
                            <>
                              <PinOff size={16} className="mr-2" />
                              Unpin conversation
                            </>
                          ) : (
                            <>
                              <Pin size={16} className="mr-2" />
                              Pin conversation
                            </>
                          )}
                        </DropdownMenuItem>

                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation()
                            handleMuteChat(chat.id, !!chat.isMuted)
                          }}
                        >
                          {chat.isMuted ? (
                            <>
                              <Bell size={16} className="mr-2" />
                              Unmute notifications
                            </>
                          ) : (
                            <>
                              <BellOff size={16} className="mr-2" />
                              Mute notifications
                            </>
                          )}
                        </DropdownMenuItem>

                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation()
                            // Archive functionality would go here
                            toast({
                              title: "Chat archived",
                              description: "The conversation has been archived",
                            })
                          }}
                        >
                          <Archive size={16} className="mr-2" />
                          Archive conversation
                        </DropdownMenuItem>

                        <DropdownMenuSeparator />

                        <DropdownMenuItem
                          className="text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDeleteChat(chat.id)
                          }}
                        >
                          <Trash size={16} className="mr-2" />
                          Delete conversation
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </motion.div>
                )
              })}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center h-full p-4 text-center"
            >
              <div className="w-20 h-20 bg-gradient-to-br from-indigo-100 to-violet-100 dark:from-indigo-900/30 dark:to-violet-900/30 rounded-full flex items-center justify-center mb-4">
                <MessageSquare size={32} className="text-indigo-500" />
              </div>
              <h3 className="font-medium mb-1 text-lg">No conversations found</h3>
              <p className="text-sm text-muted-foreground mb-6 max-w-xs">
                {searchQuery
                  ? `No results for "${searchQuery}"`
                  : activeFilter === "unread"
                    ? "You don't have any unread messages"
                    : activeFilter === "pinned"
                      ? "You don't have any pinned conversations"
                      : "Start a new conversation to connect with friends and colleagues"}
              </p>
              <Button
                onClick={handleNewChat}
                variant="default"
                className="bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white shadow-md hover:shadow-lg transition-all"
              >
                <PlusCircle size={16} className="mr-2" />
                Start a new conversation
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
