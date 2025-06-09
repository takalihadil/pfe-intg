"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { CheckCircle, XCircle, Clock, Lightbulb, Sparkles } from "lucide-react"
import { toast } from "sonner"
import type { Habit } from "@/lib/types/habits"
import confetti from "canvas-confetti"

interface DailyCheckinProps {
  habits: Habit[] // Required prop - no ? mark
  onCheckIn: (habitId: string, completed: boolean, notes?: string) => Promise<void> // Required prop - no ? mark
  onHabitUpdated?: () => void // This can remain optional
}

export function DailyCheckin({ habits, onCheckIn, onHabitUpdated }: DailyCheckinProps) {
  const [todayHabits, setTodayHabits] = useState<Array<Habit & { completed?: boolean; notes?: string }>>([])
  const [loading, setLoading] = useState<Record<string, boolean>>({})
  const [showFeedback, setShowFeedback] = useState(false)
  const [feedbackMessage, setFeedbackMessage] = useState("")
  const [feedbackType, setFeedbackType] = useState<"success" | "warning" | "info">("info")

  useEffect(() => {
    if (!habits || habits.length === 0) return

    // Filter habits that are in progress
    const activeHabits = habits.filter((h) => h.status === "InProgress")

    // Check if habits have been completed today
    const today = new Date().toISOString().split("T")[0]

    const habitsWithTodayStatus = activeHabits
      .map((habit) => {
        const completions = habit.completions || []
        const todayCompletion = completions.find((c) => new Date(c.date).toISOString().split("T")[0] === today)

        return {
          ...habit,
          completed: todayCompletion?.completed || false,
          notes: todayCompletion?.notes || "",
          hasCompletionToday: !!todayCompletion, // Flag to track if habit has a completion record for today
        }
      })
      // Filter out habits that already have a completion record for today
      .filter((habit) => !habit.hasCompletionToday)

    setTodayHabits(habitsWithTodayStatus)
  }, [habits])

  const handleCheckIn = async (habitId: string, completed: boolean, notes?: string) => {
    setLoading((prev) => ({ ...prev, [habitId]: true }))

    try {
      // Get token from localStorage
      const token = localStorage.getItem("token") || localStorage.getItem("access_token")
      if (!token) {
        toast.error("Authentication required", {
          description: "Please log in to track habits",
        })
        return Promise.reject("Authentication required")
      }

      // Find the current habit for debugging information
      const currentHabit = habits.find((h) => h.id === habitId)

      // Important: Make sure notes is properly passed (could be empty string but not undefined)
      const notesToSend = notes || ""

      console.log(`Daily Checkin: Recording habit "${currentHabit?.name}" as ${completed ? "COMPLETED" : "MISSED"}`, {
        habitId,
        completed,
        notes: notesToSend,
        requestBody: JSON.stringify({
          completed: completed,
          notes: notesToSend,
          date: new Date().toISOString().split("T")[0],
        }),
      })

      // Make API call to record completion with explicit completed status
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/habits/${habitId}/completion`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          completed: completed, // Explicitly define completed status
          notes: notesToSend, // Pass notes as is, even if empty string
          date: new Date().toISOString().split("T")[0], // Use same date format as view-habit
        }),
      })

      if (!response.ok) {
        console.error(`API error: ${response.status} ${response.statusText}`)
        throw new Error(`Failed to record completion: ${response.status}`)
      }

      // Get the updated habit data from the response
      const updatedHabit = await response.json()
      console.log("API Response - Updated habit data:", updatedHabit)

      // Verify if the completion was correctly recorded
      const today = new Date().toISOString().split("T")[0]
      const todayCompletion = updatedHabit.completions?.find(
        (c: { date: string | number | Date }) => new Date(c.date).toISOString().split("T")[0] === today,
      )

      console.log(
        "Today's completion status:",
        todayCompletion ? (todayCompletion.completed ? "COMPLETED" : "MISSED") : "NOT FOUND",
        todayCompletion,
      )

      // Remove the habit from todayHabits after successful check-in
      setTodayHabits((prev) => prev.filter((h) => h.id !== habitId))

      // Generate feedback based on completion status
      const completedCount = todayHabits.filter((h) => h.id !== habitId).length
      const totalCount = habits.filter((h) => h.status === "InProgress").length

      if (completed) {
        // Show confetti effect for completed habits
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6, x: 0.5 },
          colors: ["#4f46e5", "#8b5cf6", "#a855f7"],
        })

        if (completedCount === 0) {
          setFeedbackMessage("Amazing! You've completed all your habits today. Your discipline score is growing!")
          setFeedbackType("success")
        } else {
          setFeedbackMessage(`Great job! You've completed ${totalCount - completedCount}/${totalCount} habits today.`)
          setFeedbackType("success")
        }
      } else {
        setFeedbackMessage("It's okay to miss sometimes. Remember why you started this habit journey.")
        setFeedbackType("warning")
      }

      setShowFeedback(true)

      // Store the update in localStorage for other components with explicit completed status
      const completionData = {
        habitId,
        completed: completed, // Explicitly store the completed status
        timestamp: new Date().toISOString(),
      }
      localStorage.setItem("lastHabitCompletion", JSON.stringify(completionData))

      // Dispatch a custom event to notify other components with explicit completed status
      if (typeof window !== "undefined") {
        const event = new CustomEvent("habitUpdated", {
          detail: {
            habitId,
            completed: completed, // Explicitly include the completed status
            timestamp: new Date().toISOString(),
          },
        })
        window.dispatchEvent(event)
      }

      // Trigger the parent refresh callback if provided
      if (onHabitUpdated) {
        onHabitUpdated()
      }

      // Call the onCheckIn function provided by the parent
      await onCheckIn(habitId, completed, notesToSend)

      // Show toast with consistent messaging
      toast.success(completed ? "Habit completed!" : "Habit skipped", {
        description: completed ? "Great job keeping up with your habits!" : "No worries, there's always tomorrow.",
      })

      // Hide feedback after 5 seconds
      setTimeout(() => {
        setShowFeedback(false)
      }, 5000)

      return Promise.resolve()
    } catch (error) {
      console.error("Error in Daily Checkin:", error)
      toast.error("Failed to update habit", {
        description: "Please try again later",
      })
      return Promise.reject(error)
    } finally {
      setLoading((prev) => ({ ...prev, [habitId]: false }))
    }
  }

  const getTimeOfDay = () => {
    const hour = new Date().getHours()
    if (hour < 12) return "morning"
    if (hour < 18) return "afternoon"
    return "evening"
  }

  if (todayHabits.length === 0) {
    return (
      <Card className="shadow-lg border-none bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Clock className="mr-2 h-5 w-5 text-indigo-500" />
            Daily Check-in
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center py-6">
          <Lightbulb className="h-12 w-12 text-amber-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">No active habits to check in</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            {habits.filter((h) => h.status === "InProgress").length > 0
              ? "You've completed all your habits for today. Great job!"
              : "Start by creating some habits or activating paused ones."}
          </p>
          <Button asChild className="bg-indigo-600 hover:bg-indigo-700">
            <a href="/habit/new-habits">Create a new habit</a>
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="shadow-lg border-none bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center">
          <Clock className="mr-2 h-5 w-5 text-indigo-500" />
          Daily Check-in
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <h3 className="text-lg font-medium mb-1">Good {getTimeOfDay()}, Entrepreneur!</h3>
          <p className="text-gray-500 dark:text-gray-400">Track your progress by checking in your habits for today.</p>
        </div>

        <AnimatePresence>
          {showFeedback && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className={`mb-4 p-4 rounded-lg ${
                feedbackType === "success"
                  ? "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300"
                  : feedbackType === "warning"
                    ? "bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300"
                    : "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300"
              }`}
            >
              <div className="flex items-start">
                <Sparkles className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                <p>{feedbackMessage}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="space-y-4">
          <AnimatePresence>
            {todayHabits.map((habit) => (
              <motion.div
                key={habit.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100, height: 0 }}
                transition={{ duration: 0.3 }}
                className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50"
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-medium">{habit.name}</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{habit.description || "No description"}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className={`${
                        habit.completed
                          ? "bg-green-100 text-green-700 border-green-200 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800"
                          : "bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700"
                      }`}
                      onClick={() => handleCheckIn(habit.id, true, habit.notes)}
                      disabled={loading[habit.id]}
                    >
                      {loading[habit.id] ? (
                        <span className="flex items-center">
                          <svg
                            className="animate-spin -ml-1 mr-2 h-4 w-4 text-green-700"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          Processing...
                        </span>
                      ) : (
                        <>
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Done
                        </>
                      )}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className={`${
                        !habit.completed
                          ? "bg-red-100 text-red-700 border-red-200 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800"
                          : "bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700"
                      }`}
                      onClick={() => handleCheckIn(habit.id, false, habit.notes)}
                      disabled={loading[habit.id]}
                    >
                      {loading[habit.id] ? (
                        <span className="flex items-center">
                          <svg
                            className="animate-spin -ml-1 mr-2 h-4 w-4 text-red-700"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          Processing...
                        </span>
                      ) : (
                        <>
                          <XCircle className="h-4 w-4 mr-1" />
                          Skip
                        </>
                      )}
                    </Button>
                  </div>
                </div>
                <Textarea
                  placeholder="Add notes about today's habit (optional)"
                  className="mt-2 h-20 resize-none"
                  value={habit.notes || ""}
                  onChange={(e) => {
                    setTodayHabits((prev) => prev.map((h) => (h.id === habit.id ? { ...h, notes: e.target.value } : h)))
                  }}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <div className="mt-6 p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
          <div className="flex items-center">
            <Lightbulb className="h-5 w-5 text-amber-500 mr-2" />
            <p className="text-sm text-indigo-700 dark:text-indigo-300">
              <span className="font-medium">Pro Tip:</span> Checking in daily, even when you miss a habit, builds
              self-awareness and improves long-term success.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
