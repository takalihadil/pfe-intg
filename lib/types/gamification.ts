export interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  progress: number
  completed: boolean
  reward: {
    type: 'badge' | 'token' | 'points'
    value: number
  }
  unlockedAt?: string
}

export interface Leaderboard {
  id: string
  title: string
  type: 'financial' | 'productivity' | 'sustainability'
  timeframe: 'daily' | 'weekly' | 'monthly'
  entries: {
    position: number
    userId: string
    name: string
    avatar: string
    score: number
    trend: 'up' | 'down' | 'stable'
  }[]
}

export interface UserProgress {
  level: number
  experience: number
  nextLevelAt: number
  achievements: Achievement[]
  tokens: number
  badges: string[]
}