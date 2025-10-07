import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { getAllModulesWithGoalsAndTodos } from '@/lib/supabase/queries'
import ModuleCard from './ModuleCard'

export default async function CoreProductPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Fetch all modules with goals and todos
  const modules = await getAllModulesWithGoalsAndTodos()

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-charcoal-dark mb-2">
          Core Product
        </h1>
        <p className="text-charcoal-light">
          Key Problems to Solve - Product Vision Dashboard
        </p>
      </div>

      {/* Info Banner */}
      <div className="bg-white border-l-4 border-primary-yellow rounded-lg shadow-yellow p-4 mb-8">
        <div className="flex items-start space-x-3">
          <span className="text-xl">💡</span>
          <div>
            <p className="text-sm text-charcoal">
              <strong>Note:</strong> This dashboard displays Krane&apos;s core product vision. 
              Click on each module to expand and view goals, current state, gaps, and to-dos. 
              Editing capabilities coming in Phase 4-6.
            </p>
          </div>
        </div>
      </div>

      {/* Module Grid */}
      {modules.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {modules.map((module) => (
            <ModuleCard key={module.id} module={module} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-yellow-lg p-12 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-accent-yellow rounded-full mb-4">
            <span className="text-3xl">📋</span>
          </div>
          <h2 className="text-xl font-semibold text-charcoal-dark mb-2">
            No Modules Found
          </h2>
          <p className="text-charcoal-light">
            Please check your database connection or seed the initial data.
          </p>
        </div>
      )}
    </div>
  )
}