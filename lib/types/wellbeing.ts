export type MoodLevel = 'excellent' | 'good' | 'neutral' | 'low' | 'poor'
export type EnergyLevel = 'high' | 'moderate' | 'low'
export type StressLevel = 'none' | 'mild' | 'moderate' | 'high' | 'severe'

export interface WellbeingCheck {
  id: string
  date: string
  mood: MoodLevel
  energy: EnergyLevel
  stress: StressLevel
  notes?: string
  tags: string[]
  correlations?: {
    productivity: number // -1 to 1
    revenue: number // -1 to 1
    workHours: number
  }
}

export interface WellbeingInsight {
  id: string
  type: 'productivity' | 'work-life-balance' | 'stress-management'
  title: string
  description: string
  recommendation: string
  impact: 'positive' | 'negative'
  correlationStrength: number // 0 to 1
}

export interface WellbeingStats {
  averageMood: number // 1-5
  averageEnergy: number // 1-3
  averageStress: number // 1-5
  topProductiveMoods: MoodLevel[]
  stressFactors: {
    factor: string
    frequency: number
  }[]
  wellbeingTrend: 'improving' | 'stable' | 'declining'
}