/* eslint-disable react/set-state-in-effect */
import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { FaUser, FaCalendarAlt, FaLock, FaCamera, FaPlay } from 'react-icons/fa'
import toast from 'react-hot-toast'

export default function Profile() {
  const { user, updateProfile } = useAuth()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [username, setUsername] = useState('')
  const [email] = useState('')

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 300)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (user) {
      setUsername(user.username || '')
    }
  }, [user])

  const handleSave = async () => {
    if (!username.trim()) {
      toast.error('Name cannot be empty')
      return
    }
    setSaving(true)
    try {
      await updateProfile({ username: username.trim() })
      toast.success('Profile saved successfully')
    } catch {
      toast.error('Failed to save profile')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-purple-600 border-t-transparent" />
      </div>
    )
  }

  const displayUser = user || { username: '', email: '', avatar: '', joinedAt: new Date().toISOString() }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Greeting Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-800/40 to-blue-800/40" />
        <div className="relative max-w-5xl mx-auto px-4 pt-10 pb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-white">
            Hi, {displayUser.username || 'User'}
          </h1>
          <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-white/20 bg-gray-700">
            {displayUser.avatar ? (
              <img src={displayUser.avatar} alt={displayUser.username} className="h-full w-full object-cover" />
            ) : (
              <div className="h-full w-full flex items-center justify-center text-white text-xl font-bold">
                {displayUser.username?.charAt(0).toUpperCase() || 'U'}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-800">
        <div className="max-w-5xl mx-auto px-4">
          <nav className="flex items-center gap-1 overflow-x-auto no-scrollbar">
            {[
              { label: 'Continue Watching', icon: FaPlay },
              { label: 'Watch List', icon: FaUser },
              { label: 'Notifications', icon: FaUser },
              { label: 'Import/Export', icon: FaUser },
              { label: 'Settings', icon: FaUser },
            ].map((tab, idx) => (
              <button
                key={tab.label}
                className={`flex items-center gap-2 px-3 py-3 text-sm whitespace-nowrap border-b-2 transition-colors ${
                  idx === 0
                    ? 'border-purple-500 text-purple-400'
                    : 'border-transparent text-gray-400 hover:text-white hover:border-gray-700'
                }`}
              >
                <tab.icon className="h-3.5 w-3.5" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex items-center gap-2 mb-6">
          <FaUser className="h-5 w-5 text-purple-400" />
          <h2 className="text-xl font-bold text-white">Edit Profile</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Form */}
          <div className="lg:col-span-2 space-y-5">
            {/* Email Address */}
            <div>
              <label className="mb-1.5 block text-[11px] font-medium text-gray-500 uppercase tracking-wider">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email || displayUser.email}
                  disabled
                  className="w-full rounded-lg bg-gray-800 border border-gray-700 pl-4 pr-24 py-2.5 text-sm text-gray-400 cursor-not-allowed"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 inline-flex items-center gap-1 rounded bg-gray-700 px-2 py-0.5 text-[11px] font-medium text-gray-300">
                  <svg className="h-3 w-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m0 0v2m0-2h2m-2 0H10m9-9a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Unverified
                </span>
              </div>
              <p className="mt-1.5 text-xs text-gray-500">
                Not verified yet — check your inbox, or resend the link. Once verified, your email becomes permanent.
              </p>
            </div>

            {/* Your Name */}
            <div>
              <label className="mb-1.5 block text-[11px] font-medium text-gray-500 uppercase tracking-wider">
                Your Name
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full rounded-lg bg-gray-800 border border-gray-700 px-4 py-2.5 text-sm text-white outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors"
              />
            </div>

            {/* Joined */}
            <div>
              <label className="mb-1.5 block text-[11px] font-medium text-gray-500 uppercase tracking-wider">
                Joined
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={displayUser.joinedAt ? new Date(displayUser.joinedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : ''}
                  disabled
                  className="w-full rounded-lg bg-gray-800 border border-gray-700 pl-4 pr-10 py-2.5 text-sm text-gray-400 cursor-not-allowed"
                />
                <FaCalendarAlt className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
              </div>
            </div>

            {/* Change Password */}
            <div className="flex items-center gap-2 pt-1">
              <FaLock className="h-3.5 w-3.5 text-gray-400" />
              <button className="text-xs text-gray-400 hover:text-white transition-colors">
                Change password
              </button>
            </div>

            {/* Save Button */}
            <div className="pt-2">
              <button
                onClick={handleSave}
                disabled={saving}
                className="rounded-lg bg-purple-500 px-8 py-2.5 text-sm font-medium text-white hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {saving ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>

          {/* Right Column - Avatar */}
          <div className="lg:col-span-1">
            <div className="flex flex-col items-center">
              <div className="relative w-32 h-32 rounded-full overflow-hidden border-2 border-gray-700 bg-gray-800">
                {displayUser.avatar ? (
                  <img src={displayUser.avatar} alt={displayUser.username} className="h-full w-full object-cover" />
                ) : (
                  <div className="h-full w-full flex items-center justify-center text-white text-4xl font-bold">
                    {displayUser.username?.charAt(0).toUpperCase() || 'U'}
                  </div>
                )}
                <button className="absolute bottom-1 right-1 flex h-8 w-8 items-center justify-center rounded-full bg-gray-900/80 text-white hover:bg-gray-800 transition-colors">
                  <FaCamera className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
