import { createClient } from './client'
import type { Project, SuccessCriterion } from '@/types/projects'

// Project Operations
export async function createProject(project: Omit<Project, 'id' | 'created_at' | 'updated_at'>) {
  const supabase = createClient()

  const { data, error} = await supabase
    .from('projects')
    .insert(project)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updateProject(
  projectId: string,
  updates: Partial<Omit<Project, 'id' | 'created_at' | 'updated_at'>>
) {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('projects')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', projectId)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deleteProject(projectId: string) {
  const supabase = createClient()

  const { error } = await supabase
    .from('projects')
    .delete()
    .eq('id', projectId)

  if (error) throw error
}

// Success Criteria Operations
export async function createSuccessCriterion(
  criterion: Omit<SuccessCriterion, 'id' | 'created_at' | 'updated_at'>
) {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('success_criteria')
    .insert(criterion)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updateSuccessCriterion(
  criterionId: string,
  updates: Partial<Omit<SuccessCriterion, 'id' | 'created_at' | 'updated_at'>>
) {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('success_criteria')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', criterionId)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deleteSuccessCriterion(criterionId: string) {
  const supabase = createClient()

  const { error } = await supabase
    .from('success_criteria')
    .delete()
    .eq('id', criterionId)

  if (error) throw error
}

