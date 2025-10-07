export default async function DashboardPage() {
  return (
    <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      {/* Welcome Card */}
      <div className="bg-white rounded-lg shadow-yellow-lg p-8 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-charcoal-dark mb-2">
            Welcome to Krane Product HQ
          </h2>
          <p className="text-charcoal mb-4">
            Your internal dashboard for managing Krane&apos;s product vision and operations.
          </p>
          <div className="inline-flex items-center px-3 py-1 bg-green-50 border border-green-200 rounded-full">
            <span className="text-xs font-medium text-green-800">Authenticated</span>
          </div>
        </div>
      </div>

      {/* Feature Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {/* Card 1 */}
        <div className="bg-white rounded-lg shadow-yellow p-6 hover:shadow-yellow-lg transition-all duration-200">
          <div className="w-12 h-12 bg-accent-yellow rounded-lg flex items-center justify-center mb-4 shadow-yellow">
            <span className="text-lg font-bold text-charcoal-dark">A</span>
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
            <span className="text-lg font-bold text-charcoal-dark">T</span>
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
            <span className="text-lg font-bold text-charcoal-dark">S</span>
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
            <span className="text-lg font-bold text-charcoal-dark">P</span>
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
            <span className="text-lg font-bold text-charcoal-dark">D</span>
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
            <span className="text-lg font-bold text-charcoal-dark">H</span>
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
    </main>
  )
}