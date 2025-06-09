"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AIRecommendation } from "@/lib/types/ai"
import { ArrowRight, TrendingUp, Clock, Brain, Heart } from "lucide-react"
import { motion } from "framer-motion"
import { formatCurrency } from "@/lib/utils"

interface RecommendationCardProps {
  recommendation: AIRecommendation
  onAction: (recommendation: AIRecommendation) => void
}

export function RecommendationCard({ recommendation, onAction }: RecommendationCardProps) {
  const icons = {
    financial: TrendingUp,
    productivity: Clock,
    community: Brain,
    wellbeing: Heart
  }

  const Icon = icons[recommendation.type]

  const formatImpact = (impact: AIRecommendation['impact']) => {
    switch (impact.unit) {
      case 'currency':
        return formatCurrency(impact.value)
      case 'percentage':
        return `${impact.value}%`
      case 'hours':
        return `${impact.value} hours`
      default:
        return impact.value.toString()
    }
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
                <h3 className="font-medium">{recommendation.title}</h3>
                <span className="text-sm text-muted-foreground">
                  {recommendation.confidence}% confidence
                </span>
              </div>
              <p className="text-sm text-muted-foreground">{recommendation.description}</p>
              
              <div className="mt-4 p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Potential Impact</span>
                  <span className="text-sm">
                    {formatImpact(recommendation.impact)}
                  </span>
                </div>
              </div>

              {recommendation.actionable && (
                <div className="mt-4">
                  <Button 
                    className="w-full"
                    onClick={() => onAction(recommendation)}
                  >
                    Take Action
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}