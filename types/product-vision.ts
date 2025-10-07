export interface Module {
  id: string
  name: string
  order: number
  challenge: string
  created_at: string
  updated_at: string
}

// Note: Database table is 'module_goals' but we refer to them as 'initiatives' in the UI
export interface ModuleGoal {
  id: string
  module_id: string
  order: number
  title: string
  current_state: string | null
  gap: string | null
  created_at: string
  updated_at: string
}

export interface GoalTodo {
  id: string
  goal_id: string
  order: number
  description: string
  completed: boolean
  reach: number
  impact: number
  confidence: number
  effort: number
  rice_score: number
  created_at: string
  updated_at: string
}

export interface ModuleWithGoals extends Module {
  goals: GoalWithTodos[]
}

export interface GoalWithTodos extends ModuleGoal {
  todos: GoalTodo[]
}
