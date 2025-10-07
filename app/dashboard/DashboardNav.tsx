'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function DashboardNav() {
  const pathname = usePathname()

  const tabs = [
    { name: 'Overview', href: '/dashboard' },
    { name: 'Core Product', href: '/dashboard/core-product' },
  ]

  return (
    <div className="border-b border-gray-200 bg-white shadow-yellow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          {tabs.map((tab) => {
            const isActive = pathname === tab.href
            return (
              <Link
                key={tab.name}
                href={tab.href}
                className={`
                  py-4 px-6 border-b-2 font-medium text-sm transition-colors flex items-center space-x-2
                  ${
                    isActive
                      ? 'border-primary-yellow text-primary-yellow bg-accent-yellow'
                      : 'border-transparent text-charcoal hover:text-charcoal-dark hover:border-gray-300'
                  }
                `}
              >
                {tab.name}
              </Link>
            )
          })}
        </nav>
      </div>
    </div>
  )
}
