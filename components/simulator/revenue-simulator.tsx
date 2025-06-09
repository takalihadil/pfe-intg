"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { TrendingUp, ArrowRight, Clock } from "lucide-react"
import { mockCurrentState } from "@/lib/mock-data/simulator"
import { SimulationResult } from "@/lib/types/simulator"
import { formatCurrency } from "@/lib/utils"

export function RevenueSimulator() {
  const [rateChange, setRateChange] = useState(0)
  const [expenseChange, setExpenseChange] = useState(0)
  const [clientChange, setClientChange] = useState(0)
  const [hourChange, setHourChange] = useState(0)
  const [result, setResult] = useState<SimulationResult | null>(null)

  const calculateSimulation = () => {
    const revenueMultiplier = (100 + rateChange) / 100
    const expenseMultiplier = (100 + expenseChange) / 100
    const clientMultiplier = (100 + clientChange) / 100
    const hourMultiplier = (100 + hourChange) / 100

    const projectedRevenue = mockCurrentState.monthlyRevenue * revenueMultiplier * clientMultiplier
    const projectedExpenses = mockCurrentState.monthlyExpenses * expenseMultiplier
    const projectedHours = mockCurrentState.workHours * hourMultiplier

    const simulation: SimulationResult = {
      currentState: { ...mockCurrentState },
      projectedState: {
        monthlyRevenue: projectedRevenue,
        monthlyExpenses: projectedExpenses,
        netIncome: projectedRevenue - projectedExpenses,
        workHours: projectedHours
      },
      percentageChange: {
        revenue: ((projectedRevenue - mockCurrentState.monthlyRevenue) / mockCurrentState.monthlyRevenue) * 100,
        expenses: ((projectedExpenses - mockCurrentState.monthlyExpenses) / mockCurrentState.monthlyExpenses) * 100,
        netIncome: ((projectedRevenue - projectedExpenses - mockCurrentState.netIncome) / mockCurrentState.netIncome) * 100,
        workHours: ((projectedHours - mockCurrentState.workHours) / mockCurrentState.workHours) * 100
      }
    }

    setResult(simulation)
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          <CardTitle>Revenue Simulator</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Rate Change (%)</label>
              <Slider
                value={[rateChange]}
                onValueChange={([value]) => setRateChange(value)}
                min={-50}
                max={100}
                step={5}
              />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>-50%</span>
                <span>{rateChange}%</span>
                <span>+100%</span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Expense Change (%)</label>
              <Slider
                value={[expenseChange]}
                onValueChange={([value]) => setExpenseChange(value)}
                min={-50}
                max={100}
                step={5}
              />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>-50%</span>
                <span>{expenseChange}%</span>
                <span>+100%</span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Client Change (%)</label>
              <Slider
                value={[clientChange]}
                onValueChange={([value]) => setClientChange(value)}
                min={-50}
                max={100}
                step={5}
              />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>-50%</span>
                <span>{clientChange}%</span>
                <span>+100%</span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Work Hours Change (%)</label>
              <Slider
                value={[hourChange]}
                onValueChange={([value]) => setHourChange(value)}
                min={-50}
                max={100}
                step={5}
              />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>-50%</span>
                <span>{hourChange}%</span>
                <span>+100%</span>
              </div>
            </div>

            <Button onClick={calculateSimulation} className="w-full">
              Simulate Changes
            </Button>
          </div>

          {result && (
            <div className="space-y-4 pt-4 border-t">
              <h3 className="font-medium">Simulation Results</h3>
              
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground">Monthly Revenue</div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono">{formatCurrency(result.currentState.monthlyRevenue)}</span>
                    <ArrowRight className="h-4 w-4" />
                    <span className="font-mono">{formatCurrency(result.projectedState.monthlyRevenue)}</span>
                    <span className={`text-sm ${
                      result.percentageChange.revenue >= 0 ? 'text-green-500' : 'text-red-500'
                    }`}>
                      ({result.percentageChange.revenue.toFixed(1)}%)
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground">Monthly Expenses</div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono">{formatCurrency(result.currentState.monthlyExpenses)}</span>
                    <ArrowRight className="h-4 w-4" />
                    <span className="font-mono">{formatCurrency(result.projectedState.monthlyExpenses)}</span>
                    <span className={`text-sm ${
                      result.percentageChange.expenses <= 0 ? 'text-green-500' : 'text-red-500'
                    }`}>
                      ({result.percentageChange.expenses.toFixed(1)}%)
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground">Net Income</div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono">{formatCurrency(result.currentState.netIncome)}</span>
                    <ArrowRight className="h-4 w-4" />
                    <span className="font-mono">{formatCurrency(result.projectedState.netIncome)}</span>
                    <span className={`text-sm ${
                      result.percentageChange.netIncome >= 0 ? 'text-green-500' : 'text-red-500'
                    }`}>
                      ({result.percentageChange.netIncome.toFixed(1)}%)
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground">Monthly Hours</div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono">{result.currentState.workHours}h</span>
                    <ArrowRight className="h-4 w-4" />
                    <span className="font-mono">{result.projectedState.workHours.toFixed(1)}h</span>
                    <span className={`text-sm ${
                      result.percentageChange.workHours <= 0 ? 'text-green-500' : 'text-red-500'
                    }`}>
                      ({result.percentageChange.workHours.toFixed(1)}%)
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}