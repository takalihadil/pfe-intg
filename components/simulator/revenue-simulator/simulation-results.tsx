"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AISimulation } from "@/lib/types/ai"
import { formatCurrency } from "@/lib/utils"
import { ArrowRight, TrendingUp, TrendingDown } from "lucide-react"
import { motion } from "framer-motion"

interface SimulationResultsProps {
  simulation: AISimulation
}

export function SimulationResults({ simulation }: SimulationResultsProps) {
  const isPositive = simulation.scenario.change >= 0
  const changePercent = ((simulation.scenario.projected - simulation.scenario.current) / 
    simulation.scenario.current * 100).toFixed(1)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card>
        <CardHeader>
          <CardTitle>Simulation Results</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">Current State</div>
              <div className="text-2xl font-bold">
                {formatCurrency(simulation.scenario.current)}
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">Projected State</div>
              <div className="text-2xl font-bold">
                {formatCurrency(simulation.scenario.projected)}
              </div>
            </div>
          </div>

          <div className="p-4 rounded-lg bg-muted/50">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="text-sm text-muted-foreground">Projected Change</div>
                <div className="flex items-center gap-2">
                  {isPositive ? (
                    <TrendingUp className="h-4 w-4 text-green-500" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-500" />
                  )}
                  <span className={`font-medium ${
                    isPositive ? 'text-green-500' : 'text-red-500'
                  }`}>
                    {changePercent}%
                  </span>
                </div>
              </div>
              <div className="text-sm text-muted-foreground">
                {simulation.scenario.confidence}% confidence
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Key Assumptions</h4>
              <ul className="space-y-1">
                {simulation.assumptions.map((assumption, index) => (
                  <li key={index} className="text-sm text-muted-foreground">
                    • {assumption}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-medium mb-2">Potential Risks</h4>
              <ul className="space-y-1">
                {simulation.risks.map((risk, index) => (
                  <li key={index} className="text-sm text-muted-foreground">
                    • {risk}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-medium mb-2">Opportunities</h4>
              <ul className="space-y-1">
                {simulation.opportunities.map((opportunity, index) => (
                  <li key={index} className="text-sm text-muted-foreground">
                    • {opportunity}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}