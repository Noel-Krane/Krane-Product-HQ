import { createClient } from './server'
import type { ModuleWithGoals, GoalTodo } from '@/types/product-vision'

// Extended type for todos with module and goal context
export interface TodoWithContext extends GoalTodo {
  module_name: string
  goal_title: string
}

// Server-side queries
export async function getAllModulesWithGoalsAndTodos(): Promise<ModuleWithGoals[]> {
  const supabase = await createClient()

  // Fetch all modules
  const { data: modules, error: modulesError } = await supabase
    .from('modules')
    .select('*')
    .order('order', { ascending: true })

  if (modulesError) {
    console.error('Error fetching modules:', modulesError)
    return []
  }

  // Fetch all goals with their todos
  const modulesWithGoals: ModuleWithGoals[] = await Promise.all(
    modules.map(async (module) => {
      const { data: goals, error: goalsError } = await supabase
        .from('module_goals')
        .select('*')
        .eq('module_id', module.id)
        .order('order', { ascending: true })

      if (goalsError) {
        console.error('Error fetching goals:', goalsError)
        return { ...module, goals: [] }
      }

      // Fetch todos for each goal
      const goalsWithTodos = await Promise.all(
        goals.map(async (goal) => {
          const { data: todos, error: todosError } = await supabase
            .from('goal_todos')
            .select('*')
            .eq('goal_id', goal.id)
            .order('order', { ascending: true })

          if (todosError) {
            console.error('Error fetching todos:', todosError)
            return { ...goal, todos: [] }
          }

          return { ...goal, todos: todos || [] }
        })
      )

      return { ...module, goals: goalsWithTodos }
    })
  )

  return modulesWithGoals
}

// Fetch all todos across all modules with context
export async function getAllTodosWithContext(): Promise<TodoWithContext[]> {
  const supabase = await createClient()

  // Fetch all todos with their goal and module information using joins
  const { data: todos, error } = await supabase
    .from('goal_todos')
    .select(`
      *,
      module_goals!inner (
        title,
        modules!inner (
          name
        )
      )
    `)
    .order('rice_score', { ascending: false })

  if (error) {
    console.error('Error fetching todos with context:', error)
    return []
  }

  // Transform the data to include module and goal names
  const todosWithContext: TodoWithContext[] = todos.map((todo) => ({
    id: todo.id,
    goal_id: todo.goal_id,
    order: todo.order,
    description: todo.description,
    completed: todo.completed,
    reach: todo.reach,
    impact: todo.impact,
    confidence: todo.confidence,
    effort: todo.effort,
    rice_score: todo.rice_score,
    created_at: todo.created_at,
    updated_at: todo.updated_at,
    module_name: todo.module_goals.modules.name,
    goal_title: todo.module_goals.title,
  }))

  return todosWithContext
}