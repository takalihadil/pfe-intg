"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Heart, Battery, Activity } from "lucide-react"
import { MoodLevel, EnergyLevel, StressLevel } from "@/lib/types/wellbeing"
import { mockWellbeingChecks } from "@/lib/mock-data/wellbeing"

export function MoodTracker() {
  const [mood, setMood] = useState<MoodLevel>('neutral')
  const [energy, setEnergy] = useState<EnergyLevel>('moderate')
  const [stress, setStress] = useState<StressLevel>('mild')
  const [notes, setNotes] = useState('')
  const [tags, setTags] = useState<string[]>([])

  const handleSubmit = () => {
    // TODO: Implement check-in submission
    console.log({ mood, energy, stress, notes, tags })
    setMood('neutral')
    setEnergy('moderate')
    setStress('mild')
    setNotes('')
    setTags([])
  }

  const getMoodEmoji = (mood: MoodLevel) => {
    const emojis = {
      excellent: '😄',
      good: '🙂',
      neutral: '😐',
      low: '😕',
      poor: '😞'
    }
    return emojis[mood]
  }

  const getEnergyColor = (energy: EnergyLevel) => {
    const colors = {
      high: 'text-green-500',
      moderate: 'text-yellow-500',
      low: 'text-red-500'
    }
    return colors[energy]
  }

  const getStressColor = (stress: StressLevel) => {
    const colors = {
      none: 'text-green-500',
      mild: 'text-blue-500',
      moderate: 'text-yellow-500',
      high: 'text-orange-500',
      severe: 'text-red-500'
    }
    return colors[stress]
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Heart className="h-5 w-5 text-primary" />
          <CardTitle>Daily Well-being Check</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="grid gap-6 md:grid-cols-3">
            <div className="space-y-2">
              <label className="text-sm font-medium">Mood</label>
              <Select value={mood} onValueChange={(value) => setMood(value as MoodLevel)}>
                <SelectTrigger>
                  <SelectValue placeholder="How are you feeling?" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="excellent">
                    <div className="flex items-center gap-2">
                      {getMoodEmoji('excellent')} Excellent
                    </div>
                  </SelectItem>
                  <SelectItem value="good">
                    <div className="flex items-center gap-2">
                      {getMoodEmoji('good')} Good
                    </div>
                  </SelectItem>
                  <SelectItem value="neutral">
                    <div className="flex items-center gap-2">
                      {getMoodEmoji('neutral')} Neutral
                    </div>
                  </SelectItem>
                  <SelectItem value="low">
                    <div className="flex items-center gap-2">
                      {getMoodEmoji('low')} Low
                    </div>
                  </SelectItem>
                  <SelectItem value="poor">
                    <div className="flex items-center gap-2">
                      {getMoodEmoji('poor')} Poor
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Energy Level</label>
              <Select value={energy} onValueChange={(value) => setEnergy(value as EnergyLevel)}>
                <SelectTrigger>
                  <SelectValue placeholder="How's your energy?" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="high">
                    <div className="flex items-center gap-2">
                      <Battery className={getEnergyColor('high')} /> High
                    </div>
                  </SelectItem>
                  <SelectItem value="moderate">
                    <div className="flex items-center gap-2">
                      <Battery className={getEnergyColor('moderate')} /> Moderate
                    </div>
                  </SelectItem>
                  <SelectItem value="low">
                    <div className="flex items-center gap-2">
                      <Battery className={getEnergyColor('low')} /> Low
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Stress Level</label>
              <Select value={stress} onValueChange={(value) => setStress(value as StressLevel)}>
                <SelectTrigger>
                  <SelectValue placeholder="Stress level?" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">
                    <div className="flex items-center gap-2">
                      <Activity className={getStressColor('none')} /> None
                    </div>
                  </SelectItem>
                  <SelectItem value="mild">
                    <div className="flex items-center gap-2">
                      <Activity className={getStressColor('mild')} /> Mild
                    </div>
                  </SelectItem>
                  <SelectItem value="moderate">
                    <div className="flex items-center gap-2">
                      <Activity className={getStressColor('moderate')} /> Moderate
                    </div>
                  </SelectItem>
                  <SelectItem value="high">
                    <div className="flex items-center gap-2">
                      <Activity className={getStressColor('high')} /> High
                    </div>
                  </SelectItem>
                  <SelectItem value="severe">
                    <div className="flex items-center gap-2">
                      <Activity className={getStressColor('severe')} /> Severe
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Notes (Optional)</label>
            <Textarea
              placeholder="Any specific thoughts or events affecting your well-being today?"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          <Button onClick={handleSubmit} className="w-full">
            Save Check-in
          </Button>

          <div className="space-y-4 pt-4 border-t">
            <h3 className="font-medium">Recent Check-ins</h3>
            <div className="space-y-4">
              {mockWellbeingChecks.map((check) => (
                <div
                  key={check.id}
                  className="flex items-center justify-between p-4 rounded-lg bg-muted/50"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{getMoodEmoji(check.mood)}</span>
                      <span className="font-medium">
                        {new Date(check.date).toLocaleDateString()}
                      </span>
                    </div>
                    {check.notes && (
                      <p className="text-sm text-muted-foreground">{check.notes}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-4">
                    <Battery className={getEnergyColor(check.energy)} />
                    <Activity className={getStressColor(check.stress)} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}