import { createClient } from './client'
import type { Company, SuccessCriterion } from '@/types/companies'

// Company Operations
export async function createCompany(company: Omit<Company, 'id' | 'created_at' | 'updated_at'>) {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('companies')
    .insert(company)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updateCompany(
  companyId: string,
  updates: Partial<Omit<Company, 'id' | 'created_at' | 'updated_at'>>
) {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('companies')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', companyId)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deleteCompany(companyId: string) {
  const supabase = createClient()

  const { error } = await supabase
    .from('companies')
    .delete()
    .eq('id', companyId)

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

