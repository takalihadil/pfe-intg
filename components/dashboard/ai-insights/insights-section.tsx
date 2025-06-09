"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { InsightCard } from "./insight-card"
import { mockAIInsights } from "@/lib/mock-data/ai-insights"
import { Brain } from "lucide-react"

export function InsightsSection() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            <CardTitle>AI Insights</CardTitle>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {mockAIInsights.map((insight) => (
            <InsightCard key={insight.id} insight={insight} />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}