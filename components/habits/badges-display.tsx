"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Award, Flame, Trophy, Medal, Star, TrendingUp, ChevronDown, ChevronUp, Sparkles } from "lucide-react"
import type { Badge as BadgeType } from "@/lib/types/habits"
import confetti from "canvas-confetti"

interface BadgesDisplayProps {
  badges: BadgeType[]
  newBadge?: BadgeType | null
}

export function BadgesDisplay({ badges, newBadge = null }: BadgesDisplayProps) {
  const [expanded, setExpanded] = useState(false)
  const [selectedBadge, setSelectedBadge] = useState<BadgeType | null>(null)
  const [showNewBadgeAnimation, setShowNewBadgeAnimation] = useState(false)
  const [playSound, setPlaySound] = useState(false)

  useEffect(() => {
    if (newBadge) {
      setShowNewBadgeAnimation(true)
      setPlaySound(true)

      // Trigger confetti for new badge
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.3 },
        colors: ["#FFD700", "#FFA500", "#FF8C00"],
      })

      // Auto-select the new badge
      setSelectedBadge(newBadge)

      // Hide animation after 3 seconds
      setTimeout(() => {
        setShowNewBadgeAnimation(false)
      }, 3000)
    }
  }, [newBadge])

  const getBadgeIcon = (type: string) => {
    switch (type) {
      case "Streak":
        return <Flame className="h-4 w-4 text-orange-500" />
      case "Consistency":
        return <TrendingUp className="h-4 w-4 text-blue-500" />
      case "Achievement":
        return <Trophy className="h-4 w-4 text-amber-500" />
      case "Milestone":
        return <Medal className="h-4 w-4 text-purple-500" />
      default:
        return <Star className="h-4 w-4 text-indigo-500" />
    }
  }

  const getBadgeColor = (type: string) => {
    switch (type) {
      case "Streak":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300"
      case "Consistency":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
      case "Achievement":
        return "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300"
      case "Milestone":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300"
      default:
        return "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300"
    }
  }

  const getBadgeGradient = (type: string) => {
    switch (type) {
      case "Streak":
        return "from-orange-500 to-red-500"
      case "Consistency":
        return "from-blue-500 to-cyan-500"
      case "Achievement":
        return "from-amber-500 to-yellow-500"
      case "Milestone":
        return "from-purple-500 to-pink-500"
      default:
        return "from-indigo-500 to-violet-500"
    }
  }

  // Sort badges by date (most recent first)
  const sortedBadges = [...badges].sort((a, b) => new Date(b.earnedAt).getTime() - new Date(a.earnedAt).getTime())

  // Limit number of badges displayed if not expanded
  const displayedBadges = expanded ? sortedBadges : sortedBadges.slice(0, 3)

  return (
    <Card className="overflow-hidden border-t-4 border-t-amber-500 shadow-lg">
      {playSound && (
        <audio src="/achievement-sound.mp3" autoPlay onEnded={() => setPlaySound(false)} style={{ display: "none" }} />
      )}
      <CardHeader className="pb-2 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30">
        <CardTitle className="flex items-center">
          <Award className="mr-2 h-5 w-5 text-amber-500" />
          Your Achievements
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        {badges.length > 0 ? (
          <>
            <div className="grid grid-cols-1 gap-3 mb-2">
              {displayedBadges.map((badge, index) => (
                <motion.div
                  key={badge.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => setSelectedBadge(badge)}
                  className="cursor-pointer"
                >
                  <div
                    className={`flex items-center p-3 rounded-lg transition-all duration-300 ${
                      selectedBadge?.id === badge.id
                        ? `bg-gradient-to-r ${getBadgeGradient(badge.type)} text-white shadow-md`
                        : "bg-gray-50 dark:bg-gray-800"
                    }`}
                  >
                    <div
                      className={`mr-3 p-2 rounded-full ${
                        selectedBadge?.id === badge.id ? "bg-white/20" : "bg-white dark:bg-gray-700"
                      }`}
                    >
                      {getBadgeIcon(badge.type)}
                    </div>
                    <div className="flex-1">
                      <div className={`font-medium ${selectedBadge?.id === badge.id ? "text-white" : ""}`}>
                        {badge.name}
                        {newBadge?.id === badge.id && showNewBadgeAnimation && (
                          <motion.span
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="ml-2 inline-flex items-center text-xs font-medium text-amber-600 dark:text-amber-400"
                          >
                            <Sparkles className="h-3 w-3 mr-1" /> NEW!
                          </motion.span>
                        )}
                      </div>
                      <div className={`text-sm ${selectedBadge?.id === badge.id ? "text-white/80" : "text-gray-500"}`}>
                        {badge.description}
                      </div>
                    </div>
                    <Badge
                      className={selectedBadge?.id === badge.id ? "bg-white/20 text-white" : getBadgeColor(badge.type)}
                    >
                      {badge.type}
                    </Badge>
                  </div>
                </motion.div>
              ))}
            </div>

            {badges.length > 3 && (
              <button
                onClick={() => setExpanded(!expanded)}
                className="w-full text-center text-sm text-indigo-600 dark:text-indigo-400 hover:underline flex items-center justify-center mt-2"
              >
                {expanded ? (
                  <>
                    Show less <ChevronUp className="ml-1 h-4 w-4" />
                  </>
                ) : (
                  <>
                    Show all {badges.length} badges <ChevronDown className="ml-1 h-4 w-4" />
                  </>
                )}
              </button>
            )}
          </>
        ) : (
          <div className="text-center py-6">
            <motion.div
              animate={{
                y: [0, -10, 0],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 2,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "reverse",
              }}
              className="mx-auto w-16 h-16 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center mb-3"
            >
              <Award className="h-8 w-8 text-amber-500" />
            </motion.div>
            <h3 className="text-lg font-medium mb-1">No badges yet</h3>
            <p className="text-sm text-gray-500 max-w-xs mx-auto">
              Complete your habits consistently to earn achievement badges.
            </p>
            <motion.div
              className="mt-4 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg text-amber-800 dark:text-amber-300 text-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <p className="font-medium">Tip: Your first badge is waiting!</p>
              <p>Complete a habit for 3 consecutive days to earn the "Streak Starter" badge.</p>
            </motion.div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
