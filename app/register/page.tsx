'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import Image from 'next/image'

export default function RegisterPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  const validateEmail = (email: string) => {
    return email.endsWith('@krane.tech')
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    // Client-side validation
    if (!validateEmail(email)) {
      setError('Only @krane.tech email addresses are allowed')
      setLoading(false)
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long')
      setLoading(false)
      return
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/login`,
        },
      })

      if (error) throw error

      if (data.user) {
        setSuccess(true)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during registration')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
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

            {/* Success Message */}
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-accent-yellow rounded-full mb-4">
                <span className="text-4xl">📧</span>
              </div>
              <h2 className="text-2xl font-bold text-charcoal-dark mb-2">
                Check your email
              </h2>
            </div>

            <div className="rounded-lg bg-green-50 border border-green-200 p-4 mb-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <span className="text-green-600">✓</span>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-green-800">
                    We&apos;ve sent you a confirmation email. Please check your inbox and click the
                    confirmation link to activate your account.
                  </p>
                </div>
              </div>
            </div>

            <Link 
              href="/login" 
              className="block w-full text-center bg-primary-yellow text-charcoal-dark hover:bg-primary-yellow-dark shadow-yellow-strong hover:shadow-yellow-lg px-6 py-3 rounded-lg font-semibold transition-all duration-200"
            >
              Go to login page
            </Link>
          </div>
        </div>
      </div>
    )
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
            <p className="text-charcoal-light mb-1">
              Create your account
            </p>
            <div className="inline-flex items-center px-3 py-1 bg-accent-yellow rounded-full mt-2">
              <span className="text-xs font-medium text-charcoal">
                🔒 Only @krane.tech emails allowed
              </span>
            </div>
          </div>

          {/* Form */}
          <form className="space-y-5" onSubmit={handleRegister}>
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
                autoComplete="new-password"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-primary-yellow focus:ring-2 focus:ring-primary-yellow focus:ring-opacity-20 transition-all duration-200 text-charcoal"
                placeholder="Minimum 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="confirm-password" className="block text-sm font-medium text-charcoal-dark mb-2">
                Confirm password
              </label>
              <input
                id="confirm-password"
                name="confirm-password"
                type="password"
                autoComplete="new-password"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-primary-yellow focus:ring-2 focus:ring-primary-yellow focus:ring-opacity-20 transition-all duration-200 text-charcoal"
                placeholder="Re-enter your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
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

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary-yellow text-charcoal-dark hover:bg-primary-yellow-dark shadow-yellow-strong hover:shadow-yellow-lg px-6 py-3 rounded-lg font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-primary-yellow"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-charcoal mr-2"></div>
                    Creating account...
                  </span>
                ) : (
                  'Create account'
                )}
              </button>
            </div>

            <div className="text-center pt-4 border-t border-gray-200">
              <p className="text-sm text-charcoal-light">
                Already have an account?{' '}
                <Link href="/login" className="font-semibold text-primary-yellow hover:text-primary-yellow-dark transition-colors">
                  Sign in
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