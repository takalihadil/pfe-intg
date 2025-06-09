import { AIInsight, AIAssistant, PredictiveAnalysis, CarbonFootprint } from '../types/ai'

export const mockAIInsights: AIInsight[] = [
  {
    id: '1',
    type: 'financial',
    title: 'Optimize Subscription Costs',
    description: 'Analysis shows potential savings in your current subscription services.',
    impact: 'high',
    recommendation: 'Consider consolidating your cloud services to a single provider to save 25% monthly.',
    createdAt: '2024-03-20T10:00:00Z'
  },
  {
    id: '2',
    type: 'productivity',
    title: 'Peak Performance Hours',
    description: 'Your productivity data shows highest output during morning hours.',
    impact: 'medium',
    recommendation: 'Schedule complex tasks between 9 AM and 11 AM for optimal performance.',
    createdAt: '2024-03-20T10:00:00Z'
  },
  {
    id: '3',
    type: 'sustainability',
    title: 'Reduce Digital Carbon Footprint',
    description: 'Your cloud usage has a significant environmental impact.',
    impact: 'medium',
    recommendation: 'Switch to green hosting providers and optimize data storage.',
    createdAt: '2024-03-20T10:00:00Z'
  }
]

export const mockAIAssistants: AIAssistant[] = [
  {
    id: '1',
    name: 'Fin',
    avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=100&h=100&fit=crop',
    specialization: 'finance'
  },
  {
    id: '2',
    name: 'Nova',
    avatar: 'https://images.unsplash.com/photo-1568572933382-74d440642117?w=100&h=100&fit=crop',
    specialization: 'productivity'
  },
  {
    id: '3',
    name: 'Zen',
    avatar: 'https://images.unsplash.com/photo-1601288496920-b6154fe3626a?w=100&h=100&fit=crop',
    specialization: 'wellness'
  }
]

export const mockPredictiveAnalysis: PredictiveAnalysis = {
  revenue: {
    forecast: 12500,
    confidence: 85,
    trend: 'up'
  },
  expenses: {
    forecast: 4200,
    confidence: 90,
    trend: 'stable'
  },
  productivity: {
    forecast: 165, // hours
    confidence: 75,
    trend: 'up'
  }
}

export const mockCarbonFootprint: CarbonFootprint = {
  total: 2450, // kg CO2
  breakdown: {
    energy: 850,
    travel: 1200,
    digital: 300,
    other: 100
  },
  recommendations: [
    {
      id: '1',
      title: 'Switch to Green Hosting',
      impact: 200,
      difficulty: 'medium'
    },
    {
      id: '2',
      title: 'Implement Cloud Storage Optimization',
      impact: 150,
      difficulty: 'easy'
    },
    {
      id: '3',
      title: 'Remote Meeting Policy',
      impact: 500,
      difficulty: 'medium'
    }
  ]
}