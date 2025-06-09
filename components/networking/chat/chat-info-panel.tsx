"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  UserPlus,
  UserX,
  ImageIcon,
  FileText,
  Film,
  Info,
  Shield,
  Music,
  Download,
  ChevronRight,
  Play,
  Calendar,
  Clock,
  Users,
  Star,
  Sparkles,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"

interface User {
  id: string
  fullname: string
  profile_photo: string | null
}

interface ChatParticipant {
  userId: string
  chatId: string
  joinedAt: string
  user: User
}

interface Chat {
  id: string
  name: string | null
  isGroup: boolean
  adminId: string | null
  createdAt: string
  updatedAt: string
  users: ChatParticipant[]
}

interface ChatInfoPanelProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  chat: Chat | null
  participants: ChatParticipant[]
  currentUserId: string
  isAdmin: boolean
  imageMessages: any[]
  videoMessages: any[]
  fileMessages: any[]
  onRemoveParticipant: (userId: string) => void
  onNavigateToProfile: (userId: string) => void
}

export default function ChatInfoPanel({
  open,
  onOpenChange,
  chat,
  participants,
  currentUserId,
  isAdmin,
  imageMessages,
  videoMessages,
  fileMessages,
  onRemoveParticipant,
  onNavigateToProfile,
}: ChatInfoPanelProps) {
  const [activeTab, setActiveTab] = useState("participants")
  const { toast } = useToast()
  const [audioMessages, setAudioMessages] = useState<any[]>([])
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [animationComplete, setAnimationComplete] = useState(false)

  useEffect(() => {
    if (open) {
      // Reset animation state when panel opens
      setAnimationComplete(false)

      // Set animation complete after delay
      const timer = setTimeout(() => {
        setAnimationComplete(true)
      }, 800)

      return () => clearTimeout(timer)
    }
  }, [open])

  const handleAddParticipants = () => {
    const event = new CustomEvent("open-add-participants")
    document.dispatchEvent(event)
    onOpenChange(false)
  }

  const handleRemoveParticipant = (userId: string) => {
    if (!isAdmin) {
      toast({
        title: "Permission denied",
        description: "Only group admin can remove participants",
        variant: "destructive",
      })
      return
    }
    onRemoveParticipant(userId)
  }

  const handleDownload = (url: string, filename: string) => {
    const link = document.createElement("a")
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    toast({
      title: "Download Started",
      description: "Your file is being downloaded.",
    })
  }

  if (!chat) return null

  // Get chat creation date
  const chatCreationDate = new Date(chat.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  // Get total media count
  const totalMediaCount = imageMessages.length + videoMessages.length + audioMessages.length + fileMessages.length

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.07,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 24 },
    },
  }

  const tabIndicatorVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md md:max-w-lg lg:max-w-xl rounded-xl border-0 shadow-2xl bg-gradient-to-br from-background to-background/95 backdrop-blur-sm overflow-hidden p-0">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="relative w-full h-full"
        >
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/20 to-primary/5 rounded-full blur-3xl -z-10 transform translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-blue-500/10 to-purple-500/5 rounded-full blur-3xl -z-10 transform -translate-x-1/2 translate-y-1/2"></div>

          <DialogHeader className="p-6 border-b border-muted/20">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="flex items-center"
            >
              <div className="mr-4 relative">
                <div className="bg-gradient-to-br from-primary/80 to-primary p-3 rounded-xl text-white shadow-lg">
                  <Info className="h-6 w-6" />
                </div>
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.5, type: "spring" }}
                  className="absolute -bottom-1 -right-1 bg-white rounded-full p-1 shadow-md"
                >
                  {chat.isGroup ? (
                    <Users className="h-3 w-3 text-primary" />
                  ) : (
                    <Star className="h-3 w-3 text-amber-500" />
                  )}
                </motion.div>
              </div>
              <div>
                <DialogTitle className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600">
                  {chat.isGroup ? chat.name || "Group Chat" : "Chat Information"}
                </DialogTitle>
                <div className="flex items-center gap-2 mt-1">
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className="flex items-center text-sm text-muted-foreground"
                  >
                    <Calendar className="h-3.5 w-3.5 mr-1" />
                    <span>Created {chatCreationDate}</span>
                  </motion.div>
                  <span className="text-muted-foreground">•</span>
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                    className="flex items-center text-sm text-muted-foreground"
                  >
                    <Users className="h-3.5 w-3.5 mr-1" />
                    <span>{participants.length} participants</span>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </DialogHeader>

          <Tabs defaultValue="participants" value={activeTab} onValueChange={setActiveTab} className="p-6">
            <TabsList className="grid w-full grid-cols-3 bg-muted/10 rounded-xl p-1 h-auto mb-6 relative overflow-hidden border border-muted/20">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-blue-500/5 rounded-xl"></div>
              {[
                { value: "participants", label: "Participants", icon: <Users className="h-4 w-4 mr-2" /> },
                { value: "media", label: "Media", icon: <ImageIcon className="h-4 w-4 mr-2" /> },
                { value: "files", label: "Files", icon: <FileText className="h-4 w-4 mr-2" /> },
              ].map((tab) => (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className="relative py-2.5 rounded-lg transition-all data-[state=active]:text-primary data-[state=active]:font-medium z-10"
                >
                  {activeTab === tab.value && (
                    <motion.div
                      layoutId="activeTabIndicator"
                      className="absolute inset-0 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-muted/30"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <span className="relative z-10 flex items-center">
                    {tab.icon}
                    {tab.label}
                  </span>
                </TabsTrigger>
              ))}
            </TabsList>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <TabsContent value="participants" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
                  {chat.isGroup && isAdmin && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                      className="mb-6"
                    >
                      <Button
                        variant="default"
                        className="w-full flex items-center justify-center bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-700 text-white shadow-md hover:shadow-lg transition-all"
                        onClick={handleAddParticipants}
                      >
                        <UserPlus className="h-4 w-4 mr-2" />
                        Add Participants
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: [0, 1.2, 1] }}
                          transition={{ delay: 0.5, duration: 0.5 }}
                          className="ml-2 bg-white/20 rounded-full p-1"
                        >
                          <Sparkles className="h-3 w-3" />
                        </motion.div>
                      </Button>
                    </motion.div>
                  )}

                  <ScrollArea className="h-[350px] pr-4">
                    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-3">
                      {participants.map((participant, index) => (
                        <motion.div
                          key={participant.userId}
                          variants={itemVariants}
                          custom={index}
                          className="relative"
                        >
                          <Card
                            className={cn(
                              "overflow-hidden transition-all hover:shadow-lg border-muted/30 group",
                              participant.userId === chat.adminId
                                ? "bg-gradient-to-r from-primary/10 to-blue-500/5 border-primary/20"
                                : "hover:bg-muted/5",
                            )}
                          >
                            <CardContent className="p-4">
                              <div className="flex items-center justify-between">
                                <div
                                  className="flex items-center gap-3 cursor-pointer flex-1 min-w-0"
                                  onClick={() => onNavigateToProfile(participant.userId)}
                                >
                                  <div className="relative">
                                    <Avatar className="h-12 w-12 border-2 border-background shadow-md group-hover:shadow-lg transition-all">
                                      <AvatarImage
                                        src={participant.user.profile_photo || "/placeholder.svg?height=48&width=48"}
                                        alt={participant.user.fullname}
                                      />
                                      <AvatarFallback
                                        className={cn(
                                          "text-white font-medium",
                                          participant.userId === chat.adminId
                                            ? "bg-gradient-to-br from-primary to-blue-600"
                                            : "bg-gradient-to-br from-gray-500 to-gray-600",
                                        )}
                                      >
                                        {participant.user.fullname.charAt(0)}
                                      </AvatarFallback>
                                    </Avatar>
                                    {participant.userId === chat.adminId && (
                                      <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ delay: 0.3 + index * 0.1, type: "spring" }}
                                        className="absolute -bottom-1 -right-1 bg-primary text-white rounded-full p-1 shadow-md"
                                      >
                                        <Shield className="h-3 w-3" />
                                      </motion.div>
                                    )}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                      <p className="font-semibold truncate">{participant.user.fullname}</p>
                                      {participant.userId === currentUserId && (
                                        <Badge className="bg-green-500/10 text-green-600 border-green-200 text-xs">
                                          You
                                        </Badge>
                                      )}
                                    </div>
                                    <div className="flex items-center gap-2 mt-1">
                                      {participant.userId === chat.adminId ? (
                                        <Badge
                                          variant="outline"
                                          className="bg-primary/10 text-primary border-primary/20 flex items-center gap-1 text-xs"
                                        >
                                          <Shield className="h-3 w-3" />
                                          Admin
                                        </Badge>
                                      ) : (
                                        <div className="flex items-center text-xs text-muted-foreground">
                                          <Clock className="h-3 w-3 mr-1" />
                                          <span>Joined {new Date(participant.joinedAt).toLocaleDateString()}</span>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>

                                {chat.isGroup &&
                                  isAdmin &&
                                  participant.userId !== chat.adminId &&
                                  participant.userId !== currentUserId && (
                                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20"
                                        onClick={() => handleRemoveParticipant(participant.userId)}
                                      >
                                        <UserX className="h-4 w-4" />
                                      </Button>
                                    </motion.div>
                                  )}
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      ))}
                    </motion.div>
                  </ScrollArea>
                </TabsContent>

                <TabsContent value="media" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
                  <ScrollArea className="h-[350px] pr-4">
                    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-8">
                      {/* Images Section */}
                      <motion.div variants={itemVariants}>
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-semibold flex items-center">
                            <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-2 rounded-lg mr-3 text-white shadow-md">
                              <ImageIcon className="h-5 w-5" />
                            </div>
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-500">
                              Images
                            </span>
                            <Badge className="ml-2 bg-blue-500/10 text-blue-600 border-blue-200">
                              {imageMessages.length}
                            </Badge>
                          </h3>
                          {imageMessages.length > 0 && (
                            <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">
                              View All
                              <ChevronRight className="h-4 w-4 ml-1" />
                            </Button>
                          )}
                        </div>

                        {imageMessages.length > 0 ? (
                          <div className="grid grid-cols-3 gap-3">
                            {imageMessages.slice(0, 9).map((message, idx) => (
                              <motion.div
                                key={message.id}
                                variants={itemVariants}
                                custom={idx}
                                whileHover={{ scale: 1.03, y: -2 }}
                                whileTap={{ scale: 0.98 }}
                                className="aspect-square rounded-xl overflow-hidden border shadow-sm hover:shadow-md transition-all cursor-pointer relative group"
                                onClick={() => setSelectedImage(message.attachment[0]?.url)}
                              >
                                <img
                                  src={message.attachment[0]?.url || "/placeholder.svg?height=100&width=100"}
                                  alt="Image"
                                  className="w-full h-full object-cover transition-transform group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-2">
                                  <div className="flex items-center justify-between">
                                    <span className="text-xs text-white">
                                      {new Date(message.createdAt).toLocaleDateString()}
                                    </span>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-7 w-7 rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/30"
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        handleDownload(message.attachment[0]?.url, `image-${message.id}.jpg`)
                                      }}
                                    >
                                      <Download className="h-3.5 w-3.5" />
                                    </Button>
                                  </div>
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        ) : (
                          <Card className="bg-gradient-to-r from-blue-50 to-blue-100/30 dark:from-blue-950/10 dark:to-blue-900/5 border-blue-200/30 dark:border-blue-800/30">
                            <CardContent className="flex flex-col items-center justify-center p-8">
                              <div className="bg-blue-100 dark:bg-blue-900/20 p-3 rounded-full mb-3">
                                <ImageIcon className="h-8 w-8 text-blue-500" />
                              </div>
                              <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">
                                No images shared in this chat
                              </p>
                              <p className="text-xs text-blue-500/70 dark:text-blue-500/50 mt-1">
                                Images you share will appear here
                              </p>
                            </CardContent>
                          </Card>
                        )}
                      </motion.div>

                      {/* Videos Section */}
                      <motion.div variants={itemVariants}>
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-semibold flex items-center">
                            <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-2 rounded-lg mr-3 text-white shadow-md">
                              <Film className="h-5 w-5" />
                            </div>
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-purple-500">
                              Videos
                            </span>
                            <Badge className="ml-2 bg-purple-500/10 text-purple-600 border-purple-200">
                              {videoMessages.length}
                            </Badge>
                          </h3>
                          {videoMessages.length > 0 && (
                            <Button variant="ghost" size="sm" className="text-purple-600 hover:text-purple-700">
                              View All
                              <ChevronRight className="h-4 w-4 ml-1" />
                            </Button>
                          )}
                        </div>

                        {videoMessages.length > 0 ? (
                          <div className="grid grid-cols-2 gap-4">
                            {videoMessages.slice(0, 4).map((message, idx) => (
                              <motion.div
                                key={message.id}
                                variants={itemVariants}
                                custom={idx}
                                whileHover={{ scale: 1.02, y: -2 }}
                                className="relative rounded-xl overflow-hidden group cursor-pointer"
                                onClick={() => handleDownload(message.attachment[0]?.url, `video-${message.id}.mp4`)}
                              >
                                <Card className="border-purple-200/30 dark:border-purple-800/30 overflow-hidden bg-gradient-to-r from-purple-50 to-purple-100/30 dark:from-purple-950/10 dark:to-purple-900/5">
                                  <CardContent className="p-0">
                                    <div className="aspect-video bg-gradient-to-br from-purple-400/10 to-purple-600/5 flex items-center justify-center relative">
                                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-60"></div>
                                      <motion.div
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        className="relative z-10 bg-white/20 backdrop-blur-sm p-3 rounded-full"
                                      >
                                        <Play className="h-6 w-6 text-white fill-white" />
                                      </motion.div>
                                      <div className="absolute bottom-2 right-2 flex gap-2">
                                        <Button
                                          variant="ghost"
                                          size="icon"
                                          className="h-7 w-7 rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/30"
                                          onClick={(e) => {
                                            e.stopPropagation()
                                            handleDownload(message.attachment[0]?.url, `video-${message.id}.mp4`)
                                          }}
                                        >
                                          <Download className="h-3.5 w-3.5" />
                                        </Button>
                                      </div>
                                    </div>
                                    <div className="p-3">
                                      <p className="text-sm font-medium text-purple-900 dark:text-purple-300">
                                        Video message
                                      </p>
                                      <p className="text-xs text-purple-700/70 dark:text-purple-400/70">
                                        {new Date(message.createdAt).toLocaleDateString()}
                                      </p>
                                    </div>
                                  </CardContent>
                                </Card>
                              </motion.div>
                            ))}
                          </div>
                        ) : (
                          <Card className="bg-gradient-to-r from-purple-50 to-purple-100/30 dark:from-purple-950/10 dark:to-purple-900/5 border-purple-200/30 dark:border-purple-800/30">
                            <CardContent className="flex flex-col items-center justify-center p-8">
                              <div className="bg-purple-100 dark:bg-purple-900/20 p-3 rounded-full mb-3">
                                <Film className="h-8 w-8 text-purple-500" />
                              </div>
                              <p className="text-sm text-purple-600 dark:text-purple-400 font-medium">
                                No videos shared in this chat
                              </p>
                              <p className="text-xs text-purple-500/70 dark:text-purple-500/50 mt-1">
                                Videos you share will appear here
                              </p>
                            </CardContent>
                          </Card>
                        )}
                      </motion.div>

                      {/* Audio Section */}
                      <motion.div variants={itemVariants}>
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-semibold flex items-center">
                            <div className="bg-gradient-to-r from-green-500 to-green-600 p-2 rounded-lg mr-3 text-white shadow-md">
                              <Music className="h-5 w-5" />
                            </div>
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-green-500">
                              Audio
                            </span>
                            <Badge className="ml-2 bg-green-500/10 text-green-600 border-green-200">
                              {audioMessages.length}
                            </Badge>
                          </h3>
                        </div>

                        {audioMessages.length > 0 ? (
                          <div className="space-y-3">
                            {audioMessages.slice(0, 3).map((message, idx) => (
                              <motion.div
                                key={message.id}
                                variants={itemVariants}
                                custom={idx}
                                whileHover={{ scale: 1.01, x: 2 }}
                                className="relative"
                              >
                                <Card
                                  className="border-green-200/30 dark:border-green-800/30 hover:shadow-md transition-all cursor-pointer bg-gradient-to-r from-green-50 to-green-100/30 dark:from-green-950/10 dark:to-green-900/5"
                                  onClick={() => handleDownload(message.attachment[0]?.url, `audio-${message.id}.mp3`)}
                                >
                                  <CardContent className="p-4 flex items-center justify-between">
                                    <div className="flex items-center">
                                      <div className="bg-gradient-to-r from-green-400 to-green-500 p-2 rounded-lg mr-3 text-white shadow-sm">
                                        <Music className="h-5 w-5" />
                                      </div>
                                      <div>
                                        <p className="text-sm font-medium text-green-900 dark:text-green-300">
                                          Voice Message
                                        </p>
                                        <p className="text-xs text-green-700/70 dark:text-green-400/70">
                                          {new Date(message.createdAt).toLocaleDateString()}
                                        </p>
                                      </div>
                                    </div>
                                    <motion.div whileHover={{ scale: 1.1, rotate: 15 }} whileTap={{ scale: 0.9 }}>
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className="text-green-600 hover:text-green-700 hover:bg-green-100 dark:hover:bg-green-900/20"
                                      >
                                        <Download className="h-4 w-4" />
                                      </Button>
                                    </motion.div>
                                  </CardContent>
                                </Card>
                              </motion.div>
                            ))}
                          </div>
                        ) : (
                          <Card className="bg-gradient-to-r from-green-50 to-green-100/30 dark:from-green-950/10 dark:to-green-900/5 border-green-200/30 dark:border-green-800/30">
                            <CardContent className="flex flex-col items-center justify-center p-8">
                              <div className="bg-green-100 dark:bg-green-900/20 p-3 rounded-full mb-3">
                                <Music className="h-8 w-8 text-green-500" />
                              </div>
                              <p className="text-sm text-green-600 dark:text-green-400 font-medium">
                                No audio messages in this chat
                              </p>
                              <p className="text-xs text-green-500/70 dark:text-green-500/50 mt-1">
                                Audio messages you share will appear here
                              </p>
                            </CardContent>
                          </Card>
                        )}
                      </motion.div>
                    </motion.div>
                  </ScrollArea>
                </TabsContent>

                <TabsContent value="files" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
                  <ScrollArea className="h-[350px] pr-4">
                    <motion.div variants={containerVariants} initial="hidden" animate="visible">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold flex items-center">
                          <div className="bg-gradient-to-r from-amber-500 to-amber-600 p-2 rounded-lg mr-3 text-white shadow-md">
                            <FileText className="h-5 w-5" />
                          </div>
                          <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-600 to-amber-500">
                            Files
                          </span>
                          <Badge className="ml-2 bg-amber-500/10 text-amber-600 border-amber-200">
                            {fileMessages.length}
                          </Badge>
                        </h3>
                      </div>

                      {fileMessages.length > 0 ? (
                        <div className="space-y-3">
                          {fileMessages.map((message, idx) => (
                            <motion.div
                              key={message.id}
                              variants={itemVariants}
                              custom={idx}
                              whileHover={{ scale: 1.01, x: 2 }}
                              className="relative"
                            >
                              <Card
                                className="border-amber-200/30 dark:border-amber-800/30 hover:shadow-md transition-all cursor-pointer bg-gradient-to-r from-amber-50 to-amber-100/30 dark:from-amber-950/10 dark:to-amber-900/5"
                                onClick={() =>
                                  handleDownload(
                                    message.attachment[0]?.url,
                                    message.attachment[0]?.fileName || `file-${message.id}`,
                                  )
                                }
                              >
                                <CardContent className="p-4 flex items-center justify-between">
                                  <div className="flex items-center flex-1 min-w-0">
                                    <div className="bg-gradient-to-r from-amber-400 to-amber-500 p-2 rounded-lg mr-3 text-white shadow-sm">
                                      <FileText className="h-5 w-5" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <p className="text-sm font-medium truncate text-amber-900 dark:text-amber-300">
                                        {message.attachment[0]?.fileName || "File"}
                                      </p>
                                      <p className="text-xs text-amber-700/70 dark:text-amber-400/70 truncate">
                                        {message.attachment[0]?.fileSize
                                          ? `${(message.attachment[0].fileSize / 1024).toFixed(2)} KB`
                                          : "Unknown size"}{" "}
                                        • {new Date(message.createdAt).toLocaleDateString()}
                                      </p>
                                    </div>
                                  </div>
                                  <div className="flex items-center">
                                    <motion.div whileHover={{ scale: 1.1, rotate: 15 }} whileTap={{ scale: 0.9 }}>
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className="text-amber-600 hover:text-amber-700 hover:bg-amber-100 dark:hover:bg-amber-900/20"
                                      >
                                        <Download className="h-4 w-4" />
                                      </Button>
                                    </motion.div>
                                    <ChevronRight className="h-4 w-4 text-amber-400 ml-1" />
                                  </div>
                                </CardContent>
                              </Card>
                            </motion.div>
                          ))}
                        </div>
                      ) : (
                        <Card className="bg-gradient-to-r from-amber-50 to-amber-100/30 dark:from-amber-950/10 dark:to-amber-900/5 border-amber-200/30 dark:border-amber-800/30">
                          <CardContent className="flex flex-col items-center justify-center p-8">
                            <div className="bg-amber-100 dark:bg-amber-900/20 p-3 rounded-full mb-3">
                              <FileText className="h-8 w-8 text-amber-500" />
                            </div>
                            <p className="text-sm text-amber-600 dark:text-amber-400 font-medium">
                              No files shared in this chat
                            </p>
                            <p className="text-xs text-amber-500/70 dark:text-amber-500/50 mt-1">
                              Files you share will appear here
                            </p>
                          </CardContent>
                        </Card>
                      )}
                    </motion.div>
                  </ScrollArea>
                </TabsContent>
              </motion.div>
            </AnimatePresence>

            {/* Stats footer */}
            {animationComplete && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.4 }}
                className="mt-6 pt-4 border-t border-muted/20"
              >
                <div className="grid grid-cols-3 gap-4">
                  <div className="flex flex-col items-center justify-center p-2 rounded-lg bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/10">
                    <p className="text-xs text-muted-foreground">Participants</p>
                    <p className="text-xl font-bold text-primary">{participants.length}</p>
                  </div>
                  <div className="flex flex-col items-center justify-center p-2 rounded-lg bg-gradient-to-br from-blue-500/5 to-blue-500/10 border border-blue-500/10">
                    <p className="text-xs text-muted-foreground">Media</p>
                    <p className="text-xl font-bold text-blue-500">{totalMediaCount}</p>
                  </div>
                  <div className="flex flex-col items-center justify-center p-2 rounded-lg bg-gradient-to-br from-purple-500/5 to-purple-500/10 border border-purple-500/10">
                    <p className="text-xs text-muted-foreground">Created</p>
                    <p className="text-xl font-bold text-purple-500">
                      {new Date(chat.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </Tabs>
        </motion.div>

        {/* Fullscreen image viewer */}
        {selectedImage && (
          <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
            <DialogContent className="max-w-4xl p-0 bg-transparent border-0">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="relative"
              >
                <img
                  src={selectedImage || "/placeholder.svg"}
                  alt="Fullscreen image"
                  className="max-h-[80vh] max-w-full object-contain rounded-md"
                />
                <div className="absolute top-2 right-2 flex gap-2">
                  <Button
                    variant="secondary"
                    size="icon"
                    className="h-8 w-8 rounded-full bg-black/50 hover:bg-black/70 text-white"
                    onClick={() => handleDownload(selectedImage, `image-${Date.now()}.jpg`)}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </motion.div>
            </DialogContent>
          </Dialog>
        )}
      </DialogContent>
    </Dialog>
  )
}
