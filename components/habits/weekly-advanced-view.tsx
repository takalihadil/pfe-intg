"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { BarChart, Calendar, TrendingUp } from "lucide-react"
import type { Habit } from "@/lib/types/habits"
import { motion } from "framer-motion"

interface WeeklyAdvancedViewProps {
  habits: Habit[]
}

export function WeeklyAdvancedView({ habits }: WeeklyAdvancedViewProps) {
  const [weeklyProgress, setWeeklyProgress] = useState<Array<{ habit: Habit; progress: number; progressText: string }>>(
    [],
  )

  useEffect(() => {
    if (!habits || habits.length === 0) return

    // Calculate weekly progress for each habit
    const progress = habits
      .filter((habit) => habit.status === "InProgress")
      .map((habit) => {
        const { progress, progressText } = calculateWeeklyProgress(habit)
        return { habit, progress, progressText }
      })
      .sort((a, b) => b.progress - a.progress)

    setWeeklyProgress(progress)
  }, [habits])

  const calculateWeeklyProgress = (habit: Habit) => {
    const completions = habit.completions || []

    // Get completions from the current week
    const now = new Date()
    const startOfWeek = new Date(now)
    startOfWeek.setDate(now.getDate() - now.getDay()) // Start from Sunday
    startOfWeek.setHours(0, 0, 0, 0)

    const weeklyCompletions = completions.filter((completion) => {
      const completionDate = new Date(completion.date)
      return completionDate >= startOfWeek && completion.completed
    })

    // Calculate progress percentage
    const completed = weeklyCompletions.length
    const target = habit.weeklyTarget || 0

    // Handle edge cases
    if (target === 0) {
      return { progress: 0, progressText: "0/0 jours" }
    }

    const progress = Math.min(100, Math.round((completed / target) * 100))
    const progressText = `${completed}/${target} jours`

    return { progress, progressText }
  }

  if (weeklyProgress.length === 0) {
    return (
      <Card className="shadow-lg border-none bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center">
            <BarChart className="mr-2 h-5 w-5 text-indigo-500" />
            Weekly Progress
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center py-6">
          <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">No active habits</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            Start by creating some habits or activating paused ones to see your weekly progress.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="shadow-lg border-none bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center">
          <BarChart className="mr-2 h-5 w-5 text-indigo-500" />
          Weekly Progress
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {weeklyProgress.map(({ habit, progress, progressText }) => (
            <div key={habit.id} className="space-y-2">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium">{habit.name}</h3>
                  <div className="flex items-center text-sm text-gray-500">
                    <TrendingUp className="w-3 h-3 mr-1" /> Streak: {habit.streak} days
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium">{progressText}</div>
                  <div className="text-xs text-gray-500">
                    {progress >= 100 ? "Target achieved!" : `${progress}% complete`}
                  </div>
                </div>
              </div>
              <motion.div initial={{ width: 0 }} animate={{ width: "100%" }} transition={{ duration: 0.5 }}>
                <Progress
                  value={progress}
                  className="h-2"
                  indicatorClassName={progress >= 100 ? "bg-green-500" : "bg-indigo-500"}
                />
              </motion.div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
