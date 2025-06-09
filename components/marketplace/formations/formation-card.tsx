"use client"

import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Star, Clock, Users, BookOpen, ArrowRight } from "lucide-react"
import { Formation, FormationProgress } from "@/lib/types/marketplace"
import { formatCurrency } from "@/lib/utils"

interface FormationCardProps {
  formation: Formation
  progress?: FormationProgress
  view: 'grid' | 'list'
  onEnroll: (formation: Formation) => void
  onContinue?: (formation: Formation) => void
}

export function FormationCard({ 
  formation, 
  progress, 
  view,
  onEnroll,
  onContinue 
}: FormationCardProps) {
  const levelColors = {
    beginner: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100',
    intermediate: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100',
    advanced: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100'
  }

  const categoryColors = {
    financial: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-100',
    marketing: 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-100',
    productivity: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100',
    business: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-100',
    tech: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-100',
    legal: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100'
  }

  return (
    <Card className={view === 'list' ? 'flex' : ''}>
      {formation.preview && (
        <div 
          className={`
            bg-muted/50 
            ${view === 'list' ? 'w-48 shrink-0' : 'aspect-video'}
          `}
        >
          <img
            src={formation.preview}
            alt={formation.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <div className="flex-1">
        <CardContent className={`${view === 'list' ? 'h-full' : ''} pt-6`}>
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant="secondary" className={categoryColors[formation.category]}>
                  {formation.category}
                </Badge>
                <Badge variant="secondary" className={levelColors[formation.level]}>
                  {formation.level}
                </Badge>
                <Badge variant="outline">
                  {formation.type}
                </Badge>
              </div>
              <h3 className="font-semibold">{formation.title}</h3>
              <p className="text-sm text-muted-foreground">{formation.description}</p>
            </div>

            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {Math.round(formation.duration / 60)} hours
              </div>
              <div className="flex items-center gap-1">
                <BookOpen className="h-4 w-4" />
                {formation.modules.length} modules
              </div>
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                {formation.students} students
              </div>
            </div>

            {progress && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progress</span>
                  <span>{progress.progress}%</span>
                </div>
                <Progress value={progress.progress} className="h-2" />
              </div>
            )}

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <img
                  src={formation.instructor.avatar}
                  alt={formation.instructor.name}
                  className="w-6 h-6 rounded-full"
                />
                <div className="text-sm">
                  <div>{formation.instructor.name}</div>
                  <div className="text-muted-foreground">{formation.instructor.title}</div>
                </div>
              </div>
              <div className="flex items-center gap-1 text-sm">
                <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                <span>{formation.rating}</span>
                <span className="text-muted-foreground">
                  ({formation.reviews})
                </span>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex items-center justify-between pt-0">
          <div className="font-semibold">
            {formation.price === 0 ? 'Free' : formatCurrency(formation.price)}
          </div>
          {progress ? (
            <Button onClick={() => onContinue?.(formation)}>
              Continue Learning
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button onClick={() => onEnroll(formation)}>
              Enroll Now
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          )}
        </CardFooter>
      </div>
    </Card>
  )
}