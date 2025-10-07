import { createClient } from './client'
import type { Sprint, SprintOutcome } from '@/types/roadmap'

// Sprint operations
export async function createSprint(data: {
  name: string
  start_date: string
  end_date: string
  description?: string
  color?: string
}) {
  const supabase = createClient()

  const { data: sprint, error } = await supabase
    .from('sprints')
    .insert({
      name: data.name,
      start_date: data.start_date,
      end_date: data.end_date,
      description: data.description || null,
      color: data.color || '#F59E0B',
    })
    .select()
    .single()

  if (error) throw error
  return sprint
}

export async function updateSprint(
  sprintId: string,
  data: Partial<Pick<Sprint, 'name' | 'start_date' | 'end_date' | 'description' | 'color'>>
) {
  const supabase = createClient()

  const { data: sprint, error } = await supabase
    .from('sprints')
    .update({ ...data, updated_at: new Date().toISOString() })
    .eq('id', sprintId)
    .select()
    .single()

  if (error) throw error
  return sprint
}

export async function deleteSprint(sprintId: string) {
  const supabase = createClient()

  const { error } = await supabase.from('sprints').delete().eq('id', sprintId)

  if (error) throw error
}

// Outcome operations
export async function createOutcome(data: {
  sprint_id: string
  name: string
  description?: string
  order_index?: number
}) {
  const supabase = createClient()

  const { data: outcome, error } = await supabase
    .from('sprint_outcomes')
    .insert({
      sprint_id: data.sprint_id,
      name: data.name,
      description: data.description || null,
      order_index: data.order_index || 0,
    })
    .select()
    .single()

  if (error) throw error
  return outcome
}

export async function updateOutcome(
  outcomeId: string,
  data: Partial<Pick<SprintOutcome, 'name' | 'description' | 'order_index'>>
) {
  const supabase = createClient()

  const { data: outcome, error } = await supabase
    .from('sprint_outcomes')
    .update({ ...data, updated_at: new Date().toISOString() })
    .eq('id', outcomeId)
    .select()
    .single()

  if (error) throw error
  return outcome
}

export async function deleteOutcome(outcomeId: string) {
  const supabase = createClient()

  const { error } = await supabase.from('sprint_outcomes').delete().eq('id', outcomeId)

  if (error) throw error
}

// Outcome-Todo relationship operations
export async function addTodoToOutcome(outcomeId: string, todoId: string) {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('outcome_todos')
    .insert({
      outcome_id: outcomeId,
      todo_id: todoId,
    })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function removeTodoFromOutcome(outcomeId: string, todoId: string) {
  const supabase = createClient()

  const { error } = await supabase
    .from('outcome_todos')
    .delete()
    .eq('outcome_id', outcomeId)
    .eq('todo_id', todoId)

  if (error) throw error
}
