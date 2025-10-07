import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { getAllModulesWithGoalsAndTodos } from '@/lib/supabase/queries'
import ModuleTabs from './ModuleTabs'

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

      {/* Module Tabs */}
      <ModuleTabs modules={modules} />
    </div>
  )
}