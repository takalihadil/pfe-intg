"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Formation, FormationProgress } from "@/lib/types/marketplace"
import { CheckCircle2, Circle, Clock, ArrowRight } from "lucide-react"
import { motion } from "framer-motion"

interface FormationRoadmapProps {
  formation: Formation
  progress: FormationProgress
  onStartLesson: (lessonId: string) => void
}

export function FormationRoadmap({ 
  formation, 
  progress,
  onStartLesson 
}: FormationRoadmapProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Learning Journey</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Overall Progress</span>
            <span>{progress.progress}%</span>
          </div>
          <Progress value={progress.progress} className="h-2" />
        </div>

        <div className="space-y-8">
          {formation.modules.map((module, moduleIndex) => (
            <motion.div
              key={module.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: moduleIndex * 0.1 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-medium">{module.title}</h3>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  {module.duration} min
                </div>
              </div>

              <div className="space-y-3">
                {module.lessons.map((lesson) => {
                  const isCompleted = progress.completedLessons.includes(lesson.id)
                  const isNext = !isCompleted && 
                    progress.completedLessons.length === 
                    formation.modules
                      .slice(0, moduleIndex)
                      .reduce((acc, m) => acc + m.lessons.length, 0) +
                    module.lessons.findIndex(l => l.id === lesson.id)

                  return (
                    <div
                      key={lesson.id}
                      className={`
                        flex items-center justify-between p-3 rounded-lg
                        ${isCompleted ? 'bg-primary/10' : 'bg-muted/50'}
                        ${isNext ? 'ring-2 ring-primary/20' : ''}
                      `}
                    >
                      <div className="flex items-center gap-3">
                        {isCompleted ? (
                          <CheckCircle2 className="h-5 w-5 text-primary" />
                        ) : (
                          <Circle className="h-5 w-5 text-muted-foreground" />
                        )}
                        <div>
                          <div className="font-medium">{lesson.title}</div>
                          <div className="text-sm text-muted-foreground">
                            {lesson.duration} min
                          </div>
                        </div>
                      </div>
                      {!isCompleted && (
                        <Button
                          variant={isNext ? "default" : "outline"}
                          size="sm"
                          onClick={() => onStartLesson(lesson.id)}
                          disabled={!isNext}
                        >
                          {isNext ? (
                            <>
                              Start Lesson
                              <ArrowRight className="ml-2 h-4 w-4" />
                            </>
                          ) : (
                            "Locked"
                          )}
                        </Button>
                      )}
                    </div>
                  )
                })}
              </div>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}