import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import SignOutButton from './SignOutButton'
import DashboardNav from './DashboardNav'
import Image from 'next/image'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-background-yellow">
      {/* Top Navigation Bar */}
      <nav className="bg-white shadow-yellow border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo and Title */}
            <div className="flex items-center space-x-4">
              <Image
                src="/krane-logo.webp"
                alt="Krane Logo"
                width={150}
                height={150}
                className="h-12 w-auto"
                priority
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

      {/* Tab Navigation */}
      <DashboardNav />

      {/* Page Content */}
      {children}

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12 shadow-yellow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-3">
              <Image
                src="/krane-logo.webp"
                alt="Krane Logo"
                width={100}
                height={100}
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
