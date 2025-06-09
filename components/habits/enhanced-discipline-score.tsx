"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Zap, TrendingUp, Award, Star } from "lucide-react"
import { calculateDisciplineScore } from "@/lib/discipline"
import type { Habit, DisciplineScore } from "@/lib/types/habits"
import confetti from "canvas-confetti"

interface EnhancedDisciplineScoreProps {
  habits: Habit[]
  previousScore?: number
}

export function EnhancedDisciplineScore({ habits, previousScore = 0 }: EnhancedDisciplineScoreProps) {
  const [score, setScore] = useState<DisciplineScore>({
    score: 0,
    level: "Novice",
    nextLevel: "Apprentice",
    progress: 0,
  })
  const [showAnimation, setShowAnimation] = useState(false)
  const [scoreIncreased, setScoreIncreased] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (habits.length > 0) {
      const newScore = calculateDisciplineScore(habits)

      // Check if score increased
      if (previousScore > 0 && newScore.score > previousScore) {
        setScoreIncreased(true)
        setShowAnimation(true)

        // Trigger confetti if score increased significantly
        if (newScore.score - previousScore >= 5) {
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
            colors: ["#4f46e5", "#8b5cf6", "#a855f7"],
          })
        }

        // Hide animation after 3 seconds
        setTimeout(() => {
          setShowAnimation(false)
        }, 3000)
      }

      setScore(newScore)
    }
  }, [habits, previousScore])

  // Draw particles animation
  useEffect(() => {
    if (!canvasRef.current || !showAnimation) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight

    const particles: any[] = []
    const particleCount = 30

    // Create particles
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: canvas.height + Math.random() * 20,
        radius: Math.random() * 3 + 1,
        color: `hsl(${Math.random() * 60 + 220}, 70%, 60%)`,
        velocity: {
          x: Math.random() * 2 - 1,
          y: -Math.random() * 3 - 1,
        },
        alpha: 1,
      })
    }

    // Animation loop
    let animationId: number
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particles.forEach((particle, index) => {
        particle.x += particle.velocity.x
        particle.y += particle.velocity.y
        particle.alpha -= 0.01

        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2)
        ctx.fillStyle = particle.color.replace(")", `, ${particle.alpha})`)
        ctx.fill()

        // Remove particles that are off screen or faded out
        if (particle.y < -10 || particle.alpha <= 0) {
          particles.splice(index, 1)
        }
      })

      if (particles.length > 0) {
        animationId = requestAnimationFrame(animate)
      }
    }

    animate()

    return () => {
      cancelAnimationFrame(animationId)
    }
  }, [showAnimation])

  const getLevelColor = (level: string) => {
    switch (level) {
      case "Novice":
        return "text-blue-500"
      case "Apprentice":
        return "text-green-500"
      case "Practitioner":
        return "text-yellow-500"
      case "Expert":
        return "text-orange-500"
      case "Master":
        return "text-red-500"
      case "Grandmaster":
        return "text-purple-500"
      default:
        return "text-gray-500"
    }
  }

  const getProgressColor = (progress: number) => {
    if (progress < 30) return "bg-blue-500"
    if (progress < 60) return "bg-green-500"
    if (progress < 80) return "bg-yellow-500"
    return "bg-red-500"
  }

  return (
    <Card className="overflow-hidden border-t-4 border-t-indigo-500 shadow-lg relative">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none z-10" />
      <CardHeader className="pb-2 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30">
        <CardTitle className="flex items-center">
          <Zap className="mr-2 h-5 w-5 text-indigo-500" />
          Discipline Score
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 relative">
        <div className="flex flex-col items-center justify-center mb-6">
          <div className="relative mb-2">
            <motion.div
              className="text-6xl font-bold text-indigo-600 dark:text-indigo-400"
              initial={{ scale: 1 }}
              animate={scoreIncreased ? { scale: [1, 1.2, 1] } : {}}
              transition={{ duration: 0.5 }}
            >
              {score.score}
            </motion.div>

            <AnimatePresence>
              {showAnimation && (
                <motion.div
                  className="absolute -top-4 -right-4 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-300 px-2 py-1 rounded-full text-sm font-medium"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <TrendingUp className="h-3 w-3 inline mr-1" />+{score.score - previousScore}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="flex items-center mb-1">
            <Star className="h-4 w-4 text-amber-500 mr-1" />
            <span className={`text-xl font-medium ${getLevelColor(score.level)}`}>{score.level}</span>
          </div>

          <div className="text-sm text-gray-500 dark:text-gray-400">
            {score.progress}% to {score.nextLevel}
          </div>
        </div>

        <div className="mb-6">
          <div className="flex justify-between text-sm mb-1">
            <span>{score.level}</span>
            <span>{score.nextLevel}</span>
          </div>
          <Progress value={score.progress} className="h-2" indicatorClassName={getProgressColor(score.progress)} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-lg p-3 flex flex-col items-center">
            <TrendingUp className="h-5 w-5 text-indigo-500 mb-1" />
            <div className="text-sm font-medium">Consistency</div>
            <div className="text-lg font-bold text-indigo-600 dark:text-indigo-400">
              {Math.round(score.score * 0.4)}%
            </div>
          </div>

          <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-3 flex flex-col items-center">
            <Award className="h-5 w-5 text-amber-500 mb-1" />
            <div className="text-sm font-medium">Achievement</div>
            <div className="text-lg font-bold text-amber-600 dark:text-amber-400">{Math.round(score.score * 0.6)}%</div>
          </div>
        </div>

        <motion.div
          className="mt-4 p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg text-indigo-800 dark:text-indigo-300 text-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <p className="font-medium">Level Up Tip:</p>
          <p>
            {score.score < 30
              ? "Complete your habits consistently for 3 days to boost your score."
              : score.score < 60
                ? "Try to maintain longer streaks to reach the next level."
                : "Focus on completing all your weekly targets to master discipline."}
          </p>
        </motion.div>
      </CardContent>
    </Card>
  )
}
