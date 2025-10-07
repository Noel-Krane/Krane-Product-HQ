'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      if (data.user) {
        router.push('/dashboard')
        router.refresh()
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during login')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background-yellow flex items-center justify-center p-6">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-lg shadow-yellow-lg p-8">
          {/* Logo */}
          <div className="flex items-center justify-center mb-6">
            <Image
              src="/krane-logo.webp"
              alt="Krane Logo"
              width={120}
              height={120}
              priority
              className="h-16 w-auto"
            />
          </div>

          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-charcoal-dark mb-2">
              Krane Product HQ
            </h2>
            <p className="text-charcoal-light">
              Sign in to your account
            </p>
          </div>

          {/* Form */}
          <form className="space-y-6" onSubmit={handleLogin}>
            <div>
              <label htmlFor="email-address" className="block text-sm font-medium text-charcoal-dark mb-2">
                Email address
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-primary-yellow focus:ring-2 focus:ring-primary-yellow focus:ring-opacity-20 transition-all duration-200 text-charcoal"
                placeholder="you@krane.tech"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-charcoal-dark mb-2">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-primary-yellow focus:ring-2 focus:ring-primary-yellow focus:ring-opacity-20 transition-all duration-200 text-charcoal"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {error && (
              <div className="rounded-lg bg-red-50 border border-red-200 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <span className="text-red-600">⚠️</span>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">{error}</h3>
                  </div>
                </div>
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary-yellow text-charcoal-dark hover:bg-primary-yellow-dark shadow-yellow-strong hover:shadow-yellow-lg px-6 py-3 rounded-lg font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-primary-yellow"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-charcoal mr-2"></div>
                    Signing in...
                  </span>
                ) : (
                  'Sign in'
                )}
              </button>
            </div>

            <div className="text-center pt-4 border-t border-gray-200">
              <p className="text-sm text-charcoal-light">
                Don&apos;t have an account?{' '}
                <Link href="/register" className="font-semibold text-primary-yellow hover:text-primary-yellow-dark transition-colors">
                  Sign up
                </Link>
              </p>
            </div>
          </form>
        </div>

        {/* Footer note */}
        <p className="text-center text-xs text-charcoal-light mt-6">
          Internal use only - Krane Technologies
        </p>
      </div>
    </div>
  )
}