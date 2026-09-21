import { useState } from 'react'
import { Link } from 'react-router-dom'
import { FaEnvelope } from 'react-icons/fa'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!email.trim()) {
      setError('Email is required')
      return
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address')
      return
    }

    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-900 px-4">
        <div className="w-full max-w-md">
          <div className="rounded-2xl bg-gray-800 p-8 text-center shadow-xl">
            <div className="mb-4 text-5xl">📧</div>
            <h1 className="text-2xl font-bold text-white">Check your email</h1>
            <p className="mt-2 text-gray-400">
              If an account exists for {email}, we've sent password reset instructions.
            </p>
            <Link
              to="/login"
              className="mt-6 inline-block rounded-lg bg-purple-600 px-6 py-2 text-white hover:bg-purple-500"
            >
              Back to login
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-900 px-4">
      <div className="w-full max-w-md">
        <div className="rounded-2xl bg-gray-800 p-8 shadow-xl">
          <div className="mb-6 text-center">
            <h1 className="text-3xl font-bold text-white">Forgot Password?</h1>
            <p className="mt-2 text-gray-400">Enter your email and we'll send you reset instructions</p>
          </div>

          {error && (
            <div className="mb-6 rounded-lg bg-red-900/20 p-4 text-sm text-red-400">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="mb-2 block text-sm text-gray-300">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaEnvelope className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg border border-gray-600 bg-gray-700 px-10 py-3 text-white outline-none focus:border-purple-500"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full rounded-lg bg-purple-600 py-3 text-white hover:bg-purple-500"
            >
              Send Reset Link
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-400">
            Remember your password?{' '}
            <Link to="/login" className="text-purple-400 hover:text-purple-300">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
