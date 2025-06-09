"use client"

import { Card, CardContent } from "@/components/ui/card"
import { AIInsight } from "@/lib/types/ai"
import { Brain, TrendingUp, Clock, Leaf } from "lucide-react"
import { motion } from "framer-motion"

interface InsightCardProps {
  insight: AIInsight
}

export function InsightCard({ insight }: InsightCardProps) {
  const icons = {
    financial: TrendingUp,
    productivity: Clock,
    habit: Brain,
    sustainability: Leaf
  }

  const Icon = icons[insight.type]
  
  const impactColors = {
    high: "text-red-500",
    medium: "text-yellow-500",
    low: "text-green-500"
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <div className={`rounded-full p-2 bg-primary/10`}>
              <Icon className="h-4 w-4" />
            </div>
            <div className="space-y-1 flex-1">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">{insight.title}</h3>
                <span className={`text-sm ${impactColors[insight.impact]}`}>
                  {insight.impact.toUpperCase()} IMPACT
                </span>
              </div>
              <p className="text-sm text-muted-foreground">{insight.description}</p>
              <div className="mt-4 p-3 bg-muted/50 rounded-lg">
                <p className="text-sm">
                  <span className="font-medium">Recommendation: </span>
                  {insight.recommendation}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}