"use client"

import { RevenueSimulator } from "@/components/simulator/revenue-simulator"
import { MoodTracker } from "@/components/wellbeing/mood-tracker"

export default function SimulatorPage() {
  
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Business Simulator</h1>
      </div>
      
      <div className="grid gap-8 md:grid-cols-[2fr,1fr]">
        <RevenueSimulator />
        <MoodTracker />
      </div>
    </div>
  )
}