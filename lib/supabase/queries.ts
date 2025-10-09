import { createClient } from './server'
import type { ModuleWithGoals, GoalTodo } from '@/types/product-vision'
import type { SprintWithOutcomes } from '@/types/roadmap'
import type { CompanyWithCriteria } from '@/types/companies'

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

// Fetch all sprints with outcomes and todos
export async function getAllSprintsWithOutcomes(): Promise<SprintWithOutcomes[]> {
  const supabase = await createClient()

  // Fetch all sprints
  const { data: sprints, error: sprintsError } = await supabase
    .from('sprints')
    .select('*')
    .order('start_date', { ascending: true })

  if (sprintsError) {
    console.error('Error fetching sprints:', sprintsError)
    return []
  }

  // Fetch outcomes and todos for each sprint
  const sprintsWithOutcomes: SprintWithOutcomes[] = await Promise.all(
    sprints.map(async (sprint) => {
      const { data: outcomes, error: outcomesError } = await supabase
        .from('sprint_outcomes')
        .select('*')
        .eq('sprint_id', sprint.id)
        .order('order_index', { ascending: true })

      if (outcomesError) {
        console.error('Error fetching outcomes:', outcomesError)
        return { ...sprint, outcomes: [] }
      }

      // Fetch todos for each outcome
      const outcomesWithTodos = await Promise.all(
        outcomes.map(async (outcome) => {
          const { data: outcomeTodos, error: outcomeTodosError } = await supabase
            .from('outcome_todos')
            .select('todo_id')
            .eq('outcome_id', outcome.id)

          if (outcomeTodosError) {
            console.error('Error fetching outcome todos:', outcomeTodosError)
            return { ...outcome, todos: [] }
          }

          // Fetch full todo details
          const todoIds = outcomeTodos.map((ot) => ot.todo_id)
          if (todoIds.length === 0) {
            return { ...outcome, todos: [] }
          }

          const { data: todos, error: todosError } = await supabase
            .from('goal_todos')
            .select('*')
            .in('id', todoIds)

          if (todosError) {
            console.error('Error fetching todos:', todosError)
            return { ...outcome, todos: [] }
          }

          return { ...outcome, todos: todos || [] }
        })
      )

      return { ...sprint, outcomes: outcomesWithTodos }
    })
  )

  return sprintsWithOutcomes
}

// Fetch all companies with their success criteria
export async function getAllCompaniesWithCriteria(): Promise<CompanyWithCriteria[]> {
  const supabase = await createClient()

  // Fetch all companies
  const { data: companies, error: companiesError } = await supabase
    .from('companies')
    .select('*')
    .order('order_index', { ascending: true })

  if (companiesError) {
    console.error('Error fetching companies:', companiesError)
    return []
  }

  // Fetch success criteria for each company
  const companiesWithCriteria: CompanyWithCriteria[] = await Promise.all(
    companies.map(async (company) => {
      const { data: criteria, error: criteriaError } = await supabase
        .from('success_criteria')
        .select('*')
        .eq('company_id', company.id)
        .order('order_index', { ascending: true })

      if (criteriaError) {
        console.error('Error fetching criteria:', criteriaError)
        return { ...company, criteria: [] }
      }

      return { ...company, criteria: criteria || [] }
    })
  )

  return companiesWithCriteria
}