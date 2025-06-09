export type FormationType = 'course' | 'webinar' | 'tutorial'
export type FormationLevel = 'beginner' | 'intermediate' | 'advanced'
export type FormationCategory = 
  | 'financial' 
  | 'marketing' 
  | 'productivity' 
  | 'business' 
  | 'tech' 
  | 'legal'

export interface Formation {
  id: string
  type: FormationType
  title: string
  description: string
  category: FormationCategory
  level: FormationLevel
  duration: number // in minutes
  modules: {
    id: string
    title: string
    duration: number
    lessons: {
      id: string
      title: string
      duration: number
      completed?: boolean
    }[]
  }[]
  price: number
  rating: number
  reviews: number
  students: number
  instructor: {
    id: string
    name: string
    avatar: string
    title: string
    bio: string
  }
  preview?: string
  skills: string[]
  requirements?: string[]
  createdAt: string
  updatedAt: string
}

export interface FormationProgress {
  formationId: string
  userId: string
  progress: number // 0-100
  completedLessons: string[] // lesson IDs
  lastAccessed: string
  notes?: string
  startedAt: string
  targetCompletionDate?: string
}

export interface FormationRecommendation {
  formation: Formation
  matchScore: number // 0-100
  reasons: string[]
  skillGaps: string[]
  businessImpact: {
    area: string
    potential: 'low' | 'medium' | 'high'
    description: string
  }[]
}