import { getAllTodosWithContext } from '@/lib/supabase/queries'
import PriorityTodoCard from './PriorityTodoCard'
import { revalidatePath } from 'next/cache'

export default async function PrioritizationPage() {
  const todos = await getAllTodosWithContext()

  const handleUpdate = async () => {
    'use server'
    revalidatePath('/dashboard/prioritization')
  }

  // Separate completed and incomplete todos
  const incompleteTodos = todos.filter((todo) => !todo.completed)
  const completedTodos = todos.filter((todo) => todo.completed)

  // Stats
  const totalTodos = todos.length
  const completedCount = completedTodos.length
  const completionRate = totalTodos > 0 ? ((completedCount / totalTodos) * 100).toFixed(0) : '0'

  return (
    <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-charcoal-dark mb-2">Task Prioritization</h1>
        <p className="text-charcoal-light mb-6">
          All tasks across modules, ranked by priority score (RICE methodology)
        </p>

        {/* Stats Bar */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-yellow p-4 border border-gray-200">
            <div className="text-sm text-charcoal-light mb-1">Total Tasks</div>
            <div className="text-3xl font-bold text-charcoal-dark">{totalTodos}</div>
          </div>
          <div className="bg-white rounded-lg shadow-yellow p-4 border border-gray-200">
            <div className="text-sm text-charcoal-light mb-1">Active Tasks</div>
            <div className="text-3xl font-bold text-primary-yellow">{incompleteTodos.length}</div>
          </div>
          <div className="bg-white rounded-lg shadow-yellow p-4 border border-gray-200">
            <div className="text-sm text-charcoal-light mb-1">Completed</div>
            <div className="text-3xl font-bold text-green-600">{completedCount}</div>
          </div>
          <div className="bg-white rounded-lg shadow-yellow p-4 border border-gray-200">
            <div className="text-sm text-charcoal-light mb-1">Completion Rate</div>
            <div className="text-3xl font-bold text-charcoal-dark">{completionRate}%</div>
          </div>
        </div>

        {/* Priority Legend */}
        <div className="bg-white rounded-lg shadow-yellow p-4 border border-gray-200">
          <h3 className="text-sm font-semibold text-charcoal-dark mb-3">Priority Levels</h3>
          <div className="flex flex-wrap gap-4 text-xs">
            <div className="flex items-center space-x-2">
              <span className="bg-red-500 text-white px-2 py-1 rounded-full font-bold">
                CRITICAL
              </span>
              <span className="text-charcoal-light">Score ≥ 50</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="bg-orange-500 text-white px-2 py-1 rounded-full font-bold">HIGH</span>
              <span className="text-charcoal-light">Score 25-49</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="bg-yellow-500 text-white px-2 py-1 rounded-full font-bold">
                MEDIUM
              </span>
              <span className="text-charcoal-light">Score 10-24</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="bg-gray-400 text-white px-2 py-1 rounded-full font-bold">LOW</span>
              <span className="text-charcoal-light">Score &lt; 10</span>
            </div>
          </div>
        </div>
      </div>

      {/* Active Tasks */}
      {incompleteTodos.length > 0 ? (
        <div className="mb-12">
          <h2 className="text-xl font-bold text-charcoal-dark mb-4 flex items-center">
            <span className="inline-flex items-center justify-center w-8 h-8 bg-primary-yellow text-white rounded-full text-sm font-bold mr-3">
              {incompleteTodos.length}
            </span>
            Active Tasks
          </h2>
          <div className="space-y-4">
            {incompleteTodos.map((todo, index) => (
              <PriorityTodoCard key={todo.id} todo={todo} rank={index + 1} onUpdate={handleUpdate} />
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-yellow-lg p-12 text-center mb-12">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-2xl font-bold text-charcoal-dark mb-2">All Tasks Complete!</h2>
          <p className="text-charcoal-light">
            Great work! All tasks have been completed. Check the Core Product tab to add more.
          </p>
        </div>
      )}

      {/* Completed Tasks */}
      {completedTodos.length > 0 && (
        <div>
          <h2 className="text-xl font-bold text-charcoal-dark mb-4 flex items-center">
            <span className="inline-flex items-center justify-center w-8 h-8 bg-green-600 text-white rounded-full text-sm font-bold mr-3">
              ✓
            </span>
            Completed Tasks ({completedTodos.length})
          </h2>
          <div className="space-y-4">
            {completedTodos.map((todo, index) => (
              <PriorityTodoCard
                key={todo.id}
                todo={todo}
                rank={incompleteTodos.length + index + 1}
                onUpdate={handleUpdate}
              />
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {totalTodos === 0 && (
        <div className="bg-white rounded-lg shadow-yellow-lg p-12 text-center">
          <h2 className="text-2xl font-bold text-charcoal-dark mb-2">No Tasks Yet</h2>
          <p className="text-charcoal-light mb-6">
            Get started by adding tasks in the Core Product tab.
          </p>
          <a
            href="/dashboard/core-product"
            className="inline-block px-6 py-3 bg-primary-yellow text-charcoal-dark rounded-lg hover:bg-primary-yellow-dark transition-colors font-medium"
          >
            Go to Core Product
          </a>
        </div>
      )}
    </main>
  )
}
