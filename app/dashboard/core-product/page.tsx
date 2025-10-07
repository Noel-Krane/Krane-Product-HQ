import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function CoreProductPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-background-yellow">
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

        {/* Placeholder Content */}
        <div className="bg-white rounded-lg shadow-yellow-lg p-8">
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-accent-yellow rounded-full mb-4">
              <span className="text-3xl">🚀</span>
            </div>
            <h2 className="text-xl font-semibold text-charcoal-dark mb-2">
              Core Product Dashboard
            </h2>
            <p className="text-charcoal-light">
              Module cards and interactive features coming in Phase 3
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
