'use client'

import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function SignOutButton() {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleSignOut = async () => {
    setLoading(true)
    try {
      await supabase.auth.signOut()
      router.push('/login')
      router.refresh()
    } catch (error) {
      console.error('Error signing out:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleSignOut}
      disabled={loading}
      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-semibold rounded-lg text-charcoal-dark bg-primary-yellow-light hover:bg-primary-yellow shadow-yellow hover:shadow-yellow-strong transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-primary-yellow-light"
    >
      {loading ? (
        <span className="flex items-center">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-charcoal mr-2"></div>
          Signing out...
        </span>
      ) : (
        <span className="flex items-center">
          <span className="mr-1">🚪</span>
          Sign out
        </span>
      )}
    </button>
  )
}