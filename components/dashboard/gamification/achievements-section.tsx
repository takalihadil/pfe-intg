"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { mockUserProgress } from "@/lib/mock-data/gamification"
import { Trophy, Star } from "lucide-react"
import { motion } from "framer-motion"

export function AchievementsSection() {
  const { level, experience, nextLevelAt, achievements } = mockUserProgress
  const levelProgress = (experience / nextLevelAt) * 100

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-primary" />
            <CardTitle>Achievements</CardTitle>
          </div>
          <div className="flex items-center gap-2">
            <Star className="h-4 w-4 text-yellow-500" />
            <span className="text-lg font-bold">Level {level}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Experience</span>
              <span>{experience} / {nextLevelAt}</span>
            </div>
            <Progress value={levelProgress} className="h-2" />
          </div>

          <div className="space-y-4">
            {achievements.map((achievement, index) => (
              <motion.div
                key={achievement.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative"
              >
                <div className="flex items-center gap-4 p-4 rounded-lg bg-muted/50">
                  <div className="text-2xl">{achievement.icon}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium truncate">{achievement.title}</h4>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">
                          {achievement.progress}%
                        </span>
                        {achievement.completed && (
                          <div className="text-green-500">✓</div>
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground truncate">
                      {achievement.description}
                    </p>
                    <Progress 
                      value={achievement.progress} 
                      className="h-1 mt-2"
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}