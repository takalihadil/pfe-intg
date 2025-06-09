"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AICorrelation } from "@/lib/types/ai"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Brain } from "lucide-react"

interface MoodCorrelationProps {
  correlations: AICorrelation[]
}

export function MoodCorrelation({ correlations }: MoodCorrelationProps) {
  // Transform correlations into chart data
  const chartData = correlations.map(correlation => ({
    name: correlation.factor1,
    correlation: correlation.strength * 100,
    significance: correlation.significance * 100
  }))

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-primary" />
          <CardTitle>Mood Impact Analysis</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="correlation"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="significance"
                  stroke="hsl(var(--muted-foreground))"
                  strokeDasharray="5 5"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-4">
            {correlations.map((correlation) => (
              <div
                key={correlation.id}
                className="p-4 rounded-lg bg-muted/50"
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">
                    {correlation.factor1} → {correlation.factor2}
                  </h4>
                  <span className="text-sm text-muted-foreground">
                    {(correlation.strength * 100).toFixed(1)}% correlation
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {correlation.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}