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
