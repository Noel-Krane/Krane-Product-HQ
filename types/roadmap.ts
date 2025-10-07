import type { GoalTodo } from './product-vision'

export interface Sprint {
  id: string
  name: string
  start_date: string
  end_date: string
  description: string | null
  color: string
  created_at: string
  updated_at: string
}

export interface SprintOutcome {
  id: string
  sprint_id: string
  name: string
  description: string | null
  order_index: number
  created_at: string
  updated_at: string
}

export interface OutcomeTodo {
  id: string
  outcome_id: string
  todo_id: string
  created_at: string
}

// Nested types for fetching
export interface OutcomeWithTodos extends SprintOutcome {
  todos: GoalTodo[]
}

export interface SprintWithOutcomes extends Sprint {
  outcomes: OutcomeWithTodos[]
}

// View types
export type TimeView = 'months' | 'weeks' | 'days'
