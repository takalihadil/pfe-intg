"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, XCircle, Clock } from "lucide-react"
import { toast } from "sonner"
import type { Habit } from "@/lib/types/habits"


interface HabitCompletionFormProps {
  habit: Habit
  onCompletionAdded?: (habitId: string, completed: boolean, notes?: string) => void
}

export function HabitCompletionForm({ habit, onCompletionAdded }: HabitCompletionFormProps) {
  const [notes, setNotes] = useState("")
  const [loading, setLoading] = useState(false)

  // Check if habit has been completed today
  const hasCompletionToday = () => {
    if (!habit.completions || habit.completions.length === 0) return false

    const today = new Date().toISOString().split("T")[0]
    return habit.completions.some((completion) => {
      const completionDate = new Date(completion.date).toISOString().split("T")[0]
      return completionDate === today
    })
  }

  const todayCompletion = () => {
    if (!habit.completions || habit.completions.length === 0) return null

    const today = new Date().toISOString().split("T")[0]
    const completion = habit.completions.find((completion) => {
      const completionDate = new Date(completion.date).toISOString().split("T")[0]
      return completionDate === today
    })

    if (completion) {
      console.log(`Today's completion for "${habit.name}":`, completion.completed ? "COMPLETED" : "MISSED", completion)
    }

    return completion
  }

  // Effet pour charger les notes si une complétion existe déjà
  useEffect(() => {
    const completion = todayCompletion()
    if (completion) {
      setNotes(completion.notes || "")
    }
  }, [habit])

  // Update the handleSubmit function to match DailyCheckIn's behavior
const handleSubmit = async (completed: boolean) => {
  if (!onCompletionAdded) return

  setLoading(true)

  try {
    // Add debug logging like in DailyCheckIn
    console.log(`Marking habit "${habit.name}" as ${completed ? "COMPLETED" : "MISSED"}`)

    await onCompletionAdded(habit.id, completed, notes)

    // Use same toast message format as DailyCheckIn
    toast.success(completed ? "Habit completed for today!" : "Habit completed for today", {
      description: completed 
        ? `Great job completing "${habit.name}"!`
        : `You've marked "${habit.name}" as completed today. Tomorrow is another chance!`
    })

    // Clear notes after submission
    setNotes("")
  } catch (error) {
    console.error("Error recording completion:", error)
    toast.error("Failed to update habit", {
      description: "Please try again later"
    })
  } finally {
    setLoading(false)
  }
}

  const completion = todayCompletion()
  const completedToday = hasCompletionToday()

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center">
          <Clock className="w-5 h-5 mr-2 text-indigo-500" />
          Record Today's Progress
        </CardTitle>
      </CardHeader>
      <CardContent>
        {completedToday ? (
          <div className="text-center py-4">
            <div className="mx-auto w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-3">
              {completion?.completed ? (
                <CheckCircle className="w-6 h-6 text-green-500" />
              ) : (
                <XCircle className="w-6 h-6 text-red-500" />
              )}
            </div>
            <h3 className="text-lg font-medium mb-1">{completion?.completed ? "Completed Today" : "Missed Today"}</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-3">
              {completion?.completed
                ? "You've already completed this habit today. Great job!"
                : "You've already recorded this habit as missed today."}
            </p>
            {completion?.notes && (
              <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
                <p className="text-sm italic text-gray-600 dark:text-gray-300">"{completion.notes}"</p>
              </div>
            )}
          </div>
        ) : (
          <>
            <div className="mb-4">
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Did you complete this habit today? Record your progress and add optional notes.
              </p>
              <Textarea
                placeholder="Add notes about today's habit (optional)"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="mb-4 h-24"
              />
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1 border-red-200 text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-950"
                  onClick={() => handleSubmit(false)}
                  disabled={loading}
                >
                  <XCircle className="w-4 h-4 mr-2" />
                  Skip Today
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 border-green-200 text-green-600 hover:bg-green-50 dark:border-green-800 dark:text-green-400 dark:hover:bg-green-950"
                  onClick={() => handleSubmit(true)}
                  disabled={loading}
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Complete
                </Button>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
