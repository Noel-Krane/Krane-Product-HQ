import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import SignOutButton from './SignOutButton'
import Image from 'next/image'

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-background-yellow">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-yellow border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo and Title */}
            <div className="flex items-center space-x-4">
              <Image
                src="/krane-logo.webp"
                alt="Krane Logo"
                width={48}
                height={48}
                className="h-12 w-auto"
              />
              <div>
                <h1 className="text-xl font-bold text-charcoal-dark">Krane Product HQ</h1>
                <p className="text-xs text-charcoal-light">Internal Dashboard</p>
              </div>
            </div>

            {/* User Info and Sign Out */}
            <div className="flex items-center space-x-4">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-charcoal-dark">{user.email}</p>
                <p className="text-xs text-charcoal-light">Team Member</p>
              </div>
              <SignOutButton />
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Welcome Card */}
        <div className="bg-white rounded-lg shadow-yellow-lg p-8 mb-8">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <div className="w-16 h-16 bg-accent-yellow rounded-full flex items-center justify-center shadow-yellow">
                <span className="text-3xl">👋</span>
              </div>
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-charcoal-dark mb-2">
                Welcome to Krane Product HQ
              </h2>
              <p className="text-charcoal mb-4">
                You are successfully logged in as <strong className="text-primary-yellow">{user.email}</strong>
              </p>
              <div className="inline-flex items-center px-3 py-1 bg-green-50 border border-green-200 rounded-full">
                <span className="text-xs font-medium text-green-800">✓ Authenticated</span>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Card 1 */}
          <div className="bg-white rounded-lg shadow-yellow p-6 hover:shadow-yellow-lg transition-all duration-200">
            <div className="w-12 h-12 bg-accent-yellow rounded-lg flex items-center justify-center mb-4 shadow-yellow">
              <span className="text-2xl">📊</span>
            </div>
            <h3 className="text-lg font-semibold text-charcoal-dark mb-2">Analytics</h3>
            <p className="text-sm text-charcoal-light">
              View product metrics and performance data
            </p>
            <div className="mt-4">
              <span className="text-xs px-2 py-1 bg-accent-yellow text-charcoal rounded-full">
                Coming Soon
              </span>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-white rounded-lg shadow-yellow p-6 hover:shadow-yellow-lg transition-all duration-200">
            <div className="w-12 h-12 bg-accent-yellow rounded-lg flex items-center justify-center mb-4 shadow-yellow">
              <span className="text-2xl">👥</span>
            </div>
            <h3 className="text-lg font-semibold text-charcoal-dark mb-2">Team Management</h3>
            <p className="text-sm text-charcoal-light">
              Manage team members and permissions
            </p>
            <div className="mt-4">
              <span className="text-xs px-2 py-1 bg-accent-yellow text-charcoal rounded-full">
                Coming Soon
              </span>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-white rounded-lg shadow-yellow p-6 hover:shadow-yellow-lg transition-all duration-200">
            <div className="w-12 h-12 bg-accent-yellow rounded-lg flex items-center justify-center mb-4 shadow-yellow">
              <span className="text-2xl">⚙️</span>
            </div>
            <h3 className="text-lg font-semibold text-charcoal-dark mb-2">Settings</h3>
            <p className="text-sm text-charcoal-light">
              Configure your dashboard preferences
            </p>
            <div className="mt-4">
              <span className="text-xs px-2 py-1 bg-accent-yellow text-charcoal rounded-full">
                Coming Soon
              </span>
            </div>
          </div>

          {/* Card 4 */}
          <div className="bg-white rounded-lg shadow-yellow p-6 hover:shadow-yellow-lg transition-all duration-200">
            <div className="w-12 h-12 bg-accent-yellow rounded-lg flex items-center justify-center mb-4 shadow-yellow">
              <span className="text-2xl">📁</span>
            </div>
            <h3 className="text-lg font-semibold text-charcoal-dark mb-2">Projects</h3>
            <p className="text-sm text-charcoal-light">
              Access and manage your projects
            </p>
            <div className="mt-4">
              <span className="text-xs px-2 py-1 bg-accent-yellow text-charcoal rounded-full">
                Coming Soon
              </span>
            </div>
          </div>

          {/* Card 5 */}
          <div className="bg-white rounded-lg shadow-yellow p-6 hover:shadow-yellow-lg transition-all duration-200">
            <div className="w-12 h-12 bg-accent-yellow rounded-lg flex items-center justify-center mb-4 shadow-yellow">
              <span className="text-2xl">📝</span>
            </div>
            <h3 className="text-lg font-semibold text-charcoal-dark mb-2">Documentation</h3>
            <p className="text-sm text-charcoal-light">
              Browse internal documentation and guides
            </p>
            <div className="mt-4">
              <span className="text-xs px-2 py-1 bg-accent-yellow text-charcoal rounded-full">
                Coming Soon
              </span>
            </div>
          </div>

          {/* Card 6 */}
          <div className="bg-white rounded-lg shadow-yellow p-6 hover:shadow-yellow-lg transition-all duration-200">
            <div className="w-12 h-12 bg-accent-yellow rounded-lg flex items-center justify-center mb-4 shadow-yellow">
              <span className="text-2xl">💬</span>
            </div>
            <h3 className="text-lg font-semibold text-charcoal-dark mb-2">Support</h3>
            <p className="text-sm text-charcoal-light">
              Get help from the Krane team
            </p>
            <div className="mt-4">
              <span className="text-xs px-2 py-1 bg-accent-yellow text-charcoal rounded-full">
                Coming Soon
              </span>
            </div>
          </div>
        </div>

        {/* Info Card */}
        <div className="bg-white border-l-4 border-primary-yellow rounded-lg shadow-yellow p-6">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <span className="text-2xl">💡</span>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-charcoal-dark mb-2">
                Dashboard Features Coming Soon
              </h3>
              <p className="text-charcoal-light text-sm leading-relaxed">
                This is your internal dashboard. Features and functionality will be added here as
                the product evolves. Stay tuned for updates on analytics, team management, project
                tracking, and more.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12 shadow-yellow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-3">
              <Image
                src="/krane-logo.webp"
                alt="Krane Logo"
                width={32}
                height={32}
                className="h-8 w-auto"
              />
              <p className="text-sm text-charcoal-light">
                © 2025 Krane Technologies. Internal use only.
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-xs px-3 py-1 bg-accent-yellow text-charcoal rounded-full">
                v0.1.0
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}