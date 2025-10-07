import { createClient } from './client'
import type { ModuleGoal } from '@/types/product-vision'

// Client-side update operations
export async function updateModuleChallenge(moduleId: string, challenge: string) {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('modules')
    .update({ challenge, updated_at: new Date().toISOString() })
    .eq('id', moduleId)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updateGoal(
  goalId: string,
  updates: Partial<Pick<ModuleGoal, 'title' | 'current_state' | 'gap'>>
) {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('module_goals')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', goalId)
    .select()
    .single()

  if (error) throw error
  return data
}

// To-Do operations
export async function updateTodoCompleted(todoId: string, completed: boolean) {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('goal_todos')
    .update({ completed, updated_at: new Date().toISOString() })
    .eq('id', todoId)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updateTodoDescription(todoId: string, description: string) {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('goal_todos')
    .update({ description, updated_at: new Date().toISOString() })
    .eq('id', todoId)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updateTodoRiceScores(
  todoId: string,
  scores: { reach: number; impact: number; confidence: number; effort: number }
) {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('goal_todos')
    .update({ ...scores, updated_at: new Date().toISOString() })
    .eq('id', todoId)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function createTodo(
  goalId: string,
  description: string,
  order: number,
  riceScores?: { reach: number; impact: number; confidence: number; effort: number }
) {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('goal_todos')
    .insert({
      goal_id: goalId,
      description,
      order,
      completed: false,
      reach: riceScores?.reach ?? 5,
      impact: riceScores?.impact ?? 5,
      confidence: riceScores?.confidence ?? 5,
      effort: riceScores?.effort ?? 5,
    })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deleteTodo(todoId: string) {
  const supabase = createClient()
  
  const { error } = await supabase
    .from('goal_todos')
    .delete()
    .eq('id', todoId)

  if (error) throw error
}
