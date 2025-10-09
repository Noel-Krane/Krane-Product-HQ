export interface Company {
  id: string
  name: string
  description: string | null
  order_index: number
  created_at: string
  updated_at: string
}

export interface SuccessCriterion {
  id: string
  company_id: string
  description: string
  completed: boolean
  order_index: number
  created_at: string
  updated_at: string
}

// Nested type for fetching
export interface CompanyWithCriteria extends Company {
  criteria: SuccessCriterion[]
}

