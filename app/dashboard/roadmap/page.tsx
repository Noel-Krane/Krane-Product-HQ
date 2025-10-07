import { getAllSprintsWithOutcomes, getAllTodosWithContext } from '@/lib/supabase/queries'
import RoadmapClient from './RoadmapClient'

export default async function RoadmapPage() {
  const sprints = await getAllSprintsWithOutcomes()
  const todosData = await getAllTodosWithContext()
  
  // Convert TodoWithContext to GoalTodo format
  const availableTodos = todosData.map(t => ({
    id: t.id,
    goal_id: t.goal_id,
    order: t.order,
    description: t.description,
    completed: t.completed,
    reach: t.reach,
    impact: t.impact,
    confidence: t.confidence,
    effort: t.effort,
    rice_score: t.rice_score,
    created_at: t.created_at,
    updated_at: t.updated_at,
  }))

  return <RoadmapClient initialSprints={sprints} initialTodos={availableTodos} />
}