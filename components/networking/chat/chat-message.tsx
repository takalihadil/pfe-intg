"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import {
  Check,
  X,
  ThumbsUp,
  Heart,
  Laugh,
  Angry,
  FrownIcon as Sad,
  Star,
  Reply,
  Copy,
  Forward,
  Edit,
  Trash,
  Pin,
  MoreVertical,
  Clock,
  CheckCheck,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { motion, AnimatePresence } from "framer-motion"
import { format } from "date-fns"

export type ReactionType = "LIKE" | "LOVE" | "LAUGH" | "SAD" | "ANGRY" | "STAR"

interface ChatMessageProps {
  message: {
    id: string
    content: string | null
    createdAt: string
    status: string
    type?: string
    isPinned?: boolean
    sender: {
      id: string
      fullname: string
      profile_photo: string | null
    }
    replyTo?: {
      id: string
      content: string | null
      type?: string
      sender: {
        id: string
        fullname: string
      }
    } | null
    reactions?: {
      id: string
      type: ReactionType
      userId: string
      user: {
        id: string
        fullname: string
        profile_photo: string | null
      }
    }[]
  }
  isMe: boolean
  onDelete?: (messageId: string, forEveryone: boolean) => void
  onResend?: (messageId: string) => void
  onReply?: (messageId: string) => void
  onCopy?: (content: string | null) => void
  onForward?: (messageId: string) => void
  onPin?: (messageId: string, isPinned: boolean) => void
  onEdit?: (messageId: string, newContent: string) => void
  onReact?: (messageId: string, type: ReactionType) => void
  onRemoveReaction?: (reactionId: string) => void
  renderStatus?: () => React.ReactNode
}

export default function ChatMessage({
  message,
  isMe,
  onDelete,
  onResend,
  onReply,
  onCopy,
  onForward,
  onPin,
  onEdit,
  onReact,
  onRemoveReaction,
  renderStatus,
}: ChatMessageProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editedContent, setEditedContent] = useState(message.content || "")
  const [showReactions, setShowReactions] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const messageRef = useRef<HTMLDivElement>(null)
  const editInputRef = useRef<HTMLTextAreaElement>(null)
  const [dropdownOpen, setDropdownOpen] = useState(false)

  useEffect(() => {
    if (isEditing && editInputRef.current) {
      editInputRef.current.focus()
      editInputRef.current.setSelectionRange(editedContent.length, editedContent.length)
    }
  }, [isEditing, editedContent])

  const handleEdit = () => {
    if (onEdit && editedContent.trim() !== "") {
      onEdit(message.id, editedContent)
      setIsEditing(false)
    }
  }

  const handleReact = (type: ReactionType) => {
    if (onReact) {
      onReact(message.id, type)
      setShowReactions(false)
    }
  }

  const handleRemoveReaction = (reactionId: string) => {
    if (onRemoveReaction) {
      onRemoveReaction(reactionId)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleEdit()
    } else if (e.key === "Escape") {
      setIsEditing(false)
      setEditedContent(message.content || "")
    }
  }

  const getReactionIcon = (type: ReactionType) => {
    switch (type) {
      case "LIKE":
        return <ThumbsUp className="h-4 w-4 text-blue-500" />
      case "LOVE":
        return <Heart className="h-4 w-4 text-red-500" />
      case "LAUGH":
        return <Laugh className="h-4 w-4 text-yellow-500" />
      case "SAD":
        return <Sad className="h-4 w-4 text-purple-500" />
      case "ANGRY":
        return <Angry className="h-4 w-4 text-orange-500" />
      case "STAR":
        return <Star className="h-4 w-4 text-amber-500" />
      default:
        return <ThumbsUp className="h-4 w-4" />
    }
  }

  // Group reactions by type
  const reactionsByType = message.reactions?.reduce(
    (acc, reaction) => {
      if (!acc[reaction.type]) {
        acc[reaction.type] = []
      }
      acc[reaction.type].push(reaction)
      return acc
    },
    {} as Record<ReactionType, typeof message.reactions>,
  )

  // Render message status icon
  const renderMessageStatusIcon = (status: string) => {
    switch (status) {
      case "SENDING":
        return <Clock size={14} className="text-gray-400" />
      case "SENT":
        return <Check size={14} className="text-gray-400" />
      case "DELIVERED":
        return <CheckCheck size={14} className="text-gray-400" />
      case "SEEN":
        return <CheckCheck size={14} className="text-emerald-500" />
      case "FAILED":
        return <X size={14} className="text-red-500" />
      default:
        return null
    }
  }

  const getMessageTypeLabel = (type?: string) => {
    if (!type || type === "TEXT") return null

    switch (type) {
      case "IMAGE":
        return "Photo"
      case "VIDEO":
        return "Video"
      case "AUDIO":
        return "Audio message"
      case "FILE":
        return "File"
      case "CALL":
        return "Call"
      default:
        return type.charAt(0) + type.slice(1).toLowerCase()
    }
  }

  const reactions = [
    { type: "LIKE" as ReactionType, icon: <ThumbsUp className="h-5 w-5" />, color: "bg-blue-500", label: "Like" },
    { type: "LOVE" as ReactionType, icon: <Heart className="h-5 w-5" />, color: "bg-red-500", label: "Love" },
    { type: "LAUGH" as ReactionType, icon: <Laugh className="h-5 w-5" />, color: "bg-yellow-500", label: "Laugh" },
    { type: "SAD" as ReactionType, icon: <Sad className="h-5 w-5" />, color: "bg-purple-500", label: "Sad" },
    { type: "ANGRY" as ReactionType, icon: <Angry className="h-5 w-5" />, color: "bg-orange-500", label: "Angry" },
    { type: "STAR" as ReactionType, icon: <Star className="h-5 w-5" />, color: "bg-amber-500", label: "Star" },
  ]

  return (
    <motion.div
      ref={messageRef}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={cn(
        "group flex w-full mb-6 relative",
        isMe ? "justify-end" : "justify-start",
        message.isPinned && "bg-amber-50/30 dark:bg-amber-900/10 px-3 py-2 rounded-lg -mx-3",
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        if (!dropdownOpen) {
          setIsHovered(false)
        }
      }}
    >
      {message.isPinned && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
          <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-200 shadow-sm">
            <Pin className="h-3 w-3 mr-1" /> Pinned
          </Badge>
        </div>
      )}

      <div className={cn("flex max-w-[85%] gap-2", isMe ? "flex-row-reverse" : "flex-row")}>
        <div className={cn("pt-1", isMe ? "ml-2" : "mr-2")}>
          <Avatar className="h-9 w-9 border-2 border-background shadow-sm transition-transform hover:scale-110">
            <AvatarImage
              src={message.sender.profile_photo || "/placeholder.svg?height=36&width=36"}
              alt={message.sender.fullname}
            />
            <AvatarFallback
              className={cn(
                "text-white",
                isMe
                  ? "bg-gradient-to-br from-violet-500 to-indigo-600"
                  : "bg-gradient-to-br from-emerald-500 to-teal-600",
              )}
            >
              {message.sender.fullname.charAt(0)}
            </AvatarFallback>
          </Avatar>
        </div>

        <div className={cn("flex flex-col max-w-[calc(100%-48px)]", isMe ? "items-end" : "items-start")}>
          {!isMe && (
            <div className="text-xs font-medium mb-1 ml-1 text-gray-700 dark:text-gray-300">
              {message.sender.fullname}
            </div>
          )}

          {message.replyTo && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                "text-xs p-2 rounded-lg mb-1 max-w-[300px] cursor-pointer",
                isMe
                  ? "bg-indigo-100/80 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-200 border-l-2 border-indigo-300 dark:border-indigo-700 mr-1"
                  : "bg-emerald-100/80 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-200 border-l-2 border-emerald-300 dark:border-emerald-700 ml-1",
              )}
            >
              <div className="font-medium flex items-center gap-1">
                <div
                  className={cn(
                    "w-1 h-3 rounded-full mr-1",
                    isMe ? "bg-indigo-400 dark:bg-indigo-600" : "bg-emerald-400 dark:bg-emerald-600",
                  )}
                ></div>
                {message.replyTo.sender.fullname}
              </div>
              <div className="truncate mt-1">
                {message.replyTo.type && message.replyTo.type !== "TEXT"
                  ? getMessageTypeLabel(message.replyTo.type)
                  : message.replyTo.content || "Content unavailable"}
              </div>
            </motion.div>
          )}

          <Card
            className={cn(
              "border-0 shadow-md overflow-hidden",
              isMe
                ? "bg-gradient-to-br from-indigo-500 to-violet-600 text-white rounded-tr-none"
                : "bg-gradient-to-br from-emerald-500 to-teal-600 text-white rounded-tl-none",
              message.status === "FAILED" && "opacity-70",
            )}
          >
            {isEditing ? (
              <div className="p-3 space-y-2 min-w-[200px]">
                <Textarea
                  ref={editInputRef}
                  value={editedContent}
                  onChange={(e) => setEditedContent(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="min-h-[80px] resize-none border rounded-md p-2 text-foreground bg-background"
                  placeholder="Edit your message..."
                />
                <div className="flex justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setIsEditing(false)
                      setEditedContent(message.content || "")
                    }}
                    className="h-8 text-xs bg-white/20 hover:bg-white/30 text-white"
                  >
                    <X className="h-3.5 w-3.5 mr-1" />
                    Cancel
                  </Button>
                  <Button
                    variant="default"
                    size="sm"
                    onClick={handleEdit}
                    className="h-8 text-xs bg-white/30 hover:bg-white/40 text-white"
                  >
                    <Check className="h-3.5 w-3.5 mr-1" />
                    Save
                  </Button>
                </div>
              </div>
            ) : (
              <div className="p-3 relative">
                {message.status === "FAILED" && (
                  <div className="absolute -left-1 -top-1 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                    Failed
                  </div>
                )}
                <div className="whitespace-pre-wrap break-words">{message.content}</div>
                <div
                  className={cn(
                    "text-xs mt-2 flex items-center gap-1.5",
                    isMe ? "justify-end text-indigo-100" : "justify-start text-emerald-100",
                  )}
                >
                  <span>{format(new Date(message.createdAt), "HH:mm")}</span>
                  {message.status === "EDITED" && <span>(edited)</span>}
                  {isMe && renderMessageStatusIcon(message.status)}
                </div>
              </div>
            )}
          </Card>

          {/* Reactions display */}
          <AnimatePresence>
            {message.reactions && message.reactions.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className={cn(
                  "flex items-center gap-1 mt-1 bg-white dark:bg-gray-800 rounded-full shadow-md px-2 py-1",
                  isMe ? "self-end mr-1" : "self-start ml-1",
                )}
              >
                {Object.entries(reactionsByType || {}).map(([type, reactions]) => (
                  <TooltipProvider key={type} delayDuration={300}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="flex items-center gap-1 px-1 py-0.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
                          {getReactionIcon(type as ReactionType)}
                          <span className="text-xs font-medium">{reactions?.length}</span>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent side="bottom" className="text-xs p-2">
                        {reactions?.map((r) => r.user.fullname).join(", ")}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Quick action buttons */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.15 }}
            className={cn(
              "absolute -top-3 bg-white dark:bg-gray-800 rounded-full shadow-lg p-1 flex items-center gap-1 border border-gray-100 dark:border-gray-700",
              isMe ? "right-12" : "left-12",
            )}
          >
            <TooltipProvider delayDuration={300}>
              {/* Reply button */}
              {onReply && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onReply(message.id)}
                      className="h-7 w-7 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <Reply className="h-3.5 w-3.5 text-gray-600 dark:text-gray-300" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="text-xs">
                    Reply
                  </TooltipContent>
                </Tooltip>
              )}

              {/* React button */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowReactions(!showReactions)}
                    className="h-7 w-7 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <Heart className="h-3.5 w-3.5 text-gray-600 dark:text-gray-300" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top" className="text-xs">
                  React
                </TooltipContent>
              </Tooltip>

              {/* Forward button */}
              {onForward && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onForward(message.id)}
                      className="h-7 w-7 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <Forward className="h-3.5 w-3.5 text-gray-600 dark:text-gray-300" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="text-xs">
                    Forward
                  </TooltipContent>
                </Tooltip>
              )}

              {/* More actions dropdown */}
              <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        <MoreVertical className="h-3.5 w-3.5 text-gray-600 dark:text-gray-300" />
                      </Button>
                    </DropdownMenuTrigger>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="text-xs">
                    More options
                  </TooltipContent>
                </Tooltip>
                <DropdownMenuContent align={isMe ? "end" : "start"} className="w-48">
                  {onCopy && message.content && (
                    <DropdownMenuItem onClick={() => onCopy(message.content)}>
                      <Copy className="h-4 w-4 mr-2" />
                      Copy Text
                    </DropdownMenuItem>
                  )}
                  {isMe && onEdit && (!message.type || message.type === "TEXT") && (
                    <DropdownMenuItem onClick={() => setIsEditing(true)}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                  )}
                  {onPin && (
                    <DropdownMenuItem onClick={() => onPin(message.id, !message.isPinned)}>
                      <Pin className="h-4 w-4 mr-2" />
                      {message.isPinned ? "Unpin" : "Pin"}
                    </DropdownMenuItem>
                  )}
                  {onResend && message.status === "FAILED" && (
                    <DropdownMenuItem onClick={() => onResend(message.id)}>
                      <Forward className="h-4 w-4 mr-2" />
                      Resend
                    </DropdownMenuItem>
                  )}
                  {onDelete && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950"
                        onClick={() => onDelete(message.id, false)}
                      >
                        <Trash className="h-4 w-4 mr-2" />
                        Delete for me
                      </DropdownMenuItem>
                      {isMe && (
                        <DropdownMenuItem
                          className="text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950"
                          onClick={() => onDelete(message.id, true)}
                        >
                          <Trash className="h-4 w-4 mr-2" />
                          Delete for everyone
                        </DropdownMenuItem>
                      )}
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </TooltipProvider>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reaction picker */}
      <AnimatePresence>
        {showReactions && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className={cn(
              "absolute -top-12 bg-white dark:bg-gray-800 rounded-full shadow-lg p-1.5 flex items-center gap-1 border border-gray-100 dark:border-gray-700 z-20",
              isMe ? "right-12" : "left-12",
            )}
          >
            {reactions.map((reaction, index) => (
              <motion.div
                key={reaction.type}
                initial={{ opacity: 0, scale: 0.5, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ delay: index * 0.05, type: "spring" }}
              >
                <TooltipProvider delayDuration={300}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className={cn(
                          "h-9 w-9 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-transform hover:scale-125",
                          reaction.color.replace("bg-", "hover:text-"),
                        )}
                        onClick={() => handleReact(reaction.type)}
                      >
                        {reaction.icon}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="top" className="text-xs">
                      {reaction.label}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
