// Extending existing AI types
export interface AIRecommendation {
  id: string
  type: 'financial' | 'productivity' | 'community' | 'wellbeing'
  title: string
  description: string
  impact: {
    type: 'cost' | 'revenue' | 'time' | 'wellbeing'
    value: number
    unit: string
  }
  confidence: number
  actionable: boolean
  suggestedActions: string[]
  createdAt: string
}

export interface AISimulation {
  id: string
  type: 'revenue' | 'expense' | 'time' | 'habit'
  scenario: {
    current: number
    projected: number
    change: number
    confidence: number
  }
  assumptions: string[]
  risks: string[]
  opportunities: string[]
  createdAt: string
}

export interface AICorrelation {
  id: string
  type: 'mood-productivity' | 'habit-revenue' | 'time-income'
  factor1: string
  factor2: string
  strength: number // -1 to 1
  significance: number // 0 to 1
  description: string
  createdAt: string
}

export interface AIMarketInsight {
  id: string
  trend: string
  relevance: number // 0 to 1
  marketSize: number
  growthRate: number
  competitors: number
  opportunities: string[]
  risks: string[]
  createdAt: string
}