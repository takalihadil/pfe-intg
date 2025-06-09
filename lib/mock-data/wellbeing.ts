import { WellbeingCheck, WellbeingInsight, WellbeingStats } from '../types/wellbeing'

export const mockWellbeingChecks: WellbeingCheck[] = [
  {
    id: '1',
    date: '2024-03-20',
    mood: 'excellent',
    energy: 'high',
    stress: 'mild',
    notes: 'Great productive day, completed major project milestone',
    tags: ['project-success', 'high-focus'],
    correlations: {
      productivity: 0.8,
      revenue: 0.6,
      workHours: 7.5
    }
  },
  {
    id: '2',
    date: '2024-03-19',
    mood: 'good',
    energy: 'moderate',
    stress: 'moderate',
    notes: 'Busy day with client meetings',
    tags: ['client-meetings', 'deadline'],
    correlations: {
      productivity: 0.5,
      revenue: 0.7,
      workHours: 8.5
    }
  },
  {
    id: '3',
    date: '2024-03-18',
    mood: 'neutral',
    energy: 'low',
    stress: 'high',
    notes: 'Technical issues slowed down work',
    tags: ['technical-problems', 'stress'],
    correlations: {
      productivity: -0.3,
      revenue: -0.1,
      workHours: 9
    }
  }
]

export const mockWellbeingInsights: WellbeingInsight[] = [
  {
    id: '1',
    type: 'productivity',
    title: 'Peak Performance Pattern',
    description: 'You\'re most productive during high-energy morning hours',
    recommendation: 'Schedule complex tasks before noon to maximize output',
    impact: 'positive',
    correlationStrength: 0.85
  },
  {
    id: '2',
    type: 'work-life-balance',
    title: 'Extended Work Hours Impact',
    description: 'Working beyond 8 hours correlates with increased stress',
    recommendation: 'Consider implementing strict work-hour boundaries',
    impact: 'negative',
    correlationStrength: 0.75
  },
  {
    id: '3',
    type: 'stress-management',
    title: 'Meeting Intensity',
    description: 'Back-to-back meetings increase stress levels significantly',
    recommendation: 'Add 15-minute breaks between meetings',
    impact: 'negative',
    correlationStrength: 0.9
  }
]

export const mockWellbeingStats: WellbeingStats = {
  averageMood: 3.8,
  averageEnergy: 2.4,
  averageStress: 2.7,
  topProductiveMoods: ['excellent', 'good'],
  stressFactors: [
    { factor: 'Deadlines', frequency: 8 },
    { factor: 'Technical Issues', frequency: 5 },
    { factor: 'Client Meetings', frequency: 4 }
  ],
  wellbeingTrend: 'improving'
}