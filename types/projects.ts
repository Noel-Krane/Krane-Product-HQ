export interface Project {
  id: string
  name: string
  company_name: string | null
  description: string | null
  order_index: number
  created_at: string
  updated_at: string
}

export interface SuccessCriterion {
  id: string
  project_id: string
  description: string
  completed: boolean
  order_index: number
  created_at: string
  updated_at: string
}

// Nested type for fetching
export interface ProjectWithCriteria extends Project {
  criteria: SuccessCriterion[]
}

