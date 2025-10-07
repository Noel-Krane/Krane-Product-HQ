import { createClient } from './server'
import type { ModuleWithGoals } from '@/types/product-vision'

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
