export interface RevenueScenario {
  id: string
  name: string
  changes: {
    rates?: number // percentage change
    expenses?: number // percentage change
    clients?: number // percentage change
    hours?: number // percentage change
  }
  impact: {
    revenue: number
    expenses: number
    netIncome: number
    timeRequired: number
  }
  createdAt: string
}

export interface SimulationResult {
  currentState: {
    monthlyRevenue: number
    monthlyExpenses: number
    netIncome: number
    workHours: number
  }
  projectedState: {
    monthlyRevenue: number
    monthlyExpenses: number
    netIncome: number
    workHours: number
  }
  percentageChange: {
    revenue: number
    expenses: number
    netIncome: number
    workHours: number
  }
}