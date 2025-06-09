import { Habit, HabitEntry, HabitsReport } from '../types/habits'

export const mockHabits: Habit[] = [
  {
    id: '1',
    name: 'Exercise',
    type: 'good',
    description: 'At least 30 minutes of physical activity',
    target: 5, // 5 times per week
    createdAt: '2024-03-01T00:00:00Z',
    updatedAt: '2024-03-01T00:00:00Z',
  },
  {
    id: '2',
    name: 'Meditation',
    type: 'good',
    description: '15 minutes of mindfulness',
    target: 7, // Daily
    createdAt: '2024-03-01T00:00:00Z',
    updatedAt: '2024-03-01T00:00:00Z',
  },
  {
    id: '3',
    name: 'Social Media',
    type: 'bad',
    description: 'Limit social media usage',
    target: 2, // Max 2 times per week
    createdAt: '2024-03-01T00:00:00Z',
    updatedAt: '2024-03-01T00:00:00Z',
  },
]

export const mockHabitEntries: HabitEntry[] = [
  {
    id: '1',
    habitId: '1',
    date: '2024-03-18',
    isPositive: true,
    createdAt: '2024-03-18T10:00:00Z',
  },
  {
    id: '2',
    habitId: '1',
    date: '2024-03-19',
    isPositive: true,
    createdAt: '2024-03-19T11:00:00Z',
  },
  {
    id: '3',
    habitId: '2',
    date: '2024-03-18',
    isPositive: true,
    createdAt: '2024-03-18T09:00:00Z',
  },
  {
    id: '4',
    habitId: '3',
    date: '2024-03-18',
    isPositive: false,
    createdAt: '2024-03-18T15:00:00Z',
  },
]

export const mockHabitsReport: HabitsReport = {
  weeklyProgress: {
    '1': {
      habitId: '1',
      positive: 2,
      negative: 0,
      total: 2,
      targetProgress: 40, // 2/5 = 40%
    },
    '2': {
      habitId: '2',
      positive: 1,
      negative: 0,
      total: 1,
      targetProgress: 14.3, // 1/7 = ~14.3%
    },
    '3': {
      habitId: '3',
      positive: 0,
      negative: 1,
      total: 1,
      targetProgress: 50, // 1/2 = 50%
    },
  },
  goodHabitsAverage: 27.15, // Average progress of good habits
  badHabitsAverage: 50, // Average progress of bad habits
  streaks: {
    '1': 2, // 2 days streak for Exercise
    '2': 1, // 1 day streak for Meditation
    '3': 0, // No streak for Social Media
  },
}