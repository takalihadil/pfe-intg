import { Achievement, Leaderboard, UserProgress } from '../types/gamification'

export const mockAchievements: Achievement[] = [
  {
    id: '1',
    title: 'Revenue Milestone',
    description: 'Reach $10,000 in monthly revenue',
    icon: '🏆',
    progress: 85,
    completed: false,
    reward: {
      type: 'badge',
      value: 1
    }
  },
  {
    id: '2',
    title: 'Productivity Master',
    description: 'Complete 100 focused work sessions',
    icon: '⚡',
    progress: 100,
    completed: true,
    reward: {
      type: 'token',
      value: 50
    },
    unlockedAt: '2024-03-15T10:00:00Z'
  },
  {
    id: '3',
    title: 'Green Pioneer',
    description: 'Reduce carbon footprint by 25%',
    icon: '🌱',
    progress: 60,
    completed: false,
    reward: {
      type: 'points',
      value: 1000
    }
  }
]

export const mockLeaderboard: Leaderboard = {
  id: '1',
  title: 'Top Performers',
  type: 'productivity',
  timeframe: 'weekly',
  entries: [
    {
      position: 1,
      userId: '1',
      name: 'Sarah Chen',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
      score: 95,
      trend: 'up'
    },
    {
      position: 2,
      userId: '2',
      name: 'Marcus Rodriguez',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
      score: 88,
      trend: 'stable'
    },
    {
      position: 3,
      userId: '3',
      name: 'Emma Watson',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
      score: 82,
      trend: 'down'
    }
  ]
}

export const mockUserProgress: UserProgress = {
  level: 15,
  experience: 2500,
  nextLevelAt: 3000,
  achievements: mockAchievements,
  tokens: 750,
  badges: ['productivity_master', 'financial_guru', 'eco_warrior'],
}