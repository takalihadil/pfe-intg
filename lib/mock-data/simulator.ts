import { RevenueScenario, SimulationResult } from '../types/simulator'

export const mockScenarios: RevenueScenario[] = [
  {
    id: '1',
    name: 'Rate Increase',
    changes: {
      rates: 20,
    },
    impact: {
      revenue: 12000,
      expenses: 4000,
      netIncome: 8000,
      timeRequired: 160
    },
    createdAt: '2024-03-20T10:00:00Z'
  },
  {
    id: '2',
    name: 'Expense Optimization',
    changes: {
      expenses: -15,
    },
    impact: {
      revenue: 10000,
      expenses: 3400,
      netIncome: 6600,
      timeRequired: 160
    },
    createdAt: '2024-03-20T11:00:00Z'
  },
  {
    id: '3',
    name: 'Client Expansion',
    changes: {
      clients: 30,
      hours: 25,
    },
    impact: {
      revenue: 13000,
      expenses: 4500,
      netIncome: 8500,
      timeRequired: 200
    },
    createdAt: '2024-03-20T12:00:00Z'
  }
]

export const mockCurrentState = {
  monthlyRevenue: 10000,
  monthlyExpenses: 4000,
  netIncome: 6000,
  workHours: 160
}