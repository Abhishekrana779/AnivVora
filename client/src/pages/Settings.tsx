import { useState } from 'react'
import { useLocalStorage } from '../hooks/useHooks'
import { FaCog, FaMoon, FaSun, FaDesktop, FaServer, FaPlay, FaBell, FaLock } from 'react-icons/fa'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import type { Theme } from '../types'

export default function Settings() {
  const { user: _user, changePassword } = useAuth()
  const { theme, setTheme } = useTheme()
  const [defaultServer, setDefaultServer] = useLocalStorage('defaultServer', 'vidstreaming')
  const [defaultQuality, setDefaultQuality] = useLocalStorage('defaultQuality', '1080p')
  const [autoplay, setAutoplay] = useLocalStorage('autoplay', true)
  const [notifications, setNotifications] = useLocalStorage('notifications', true)
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmNewPassword, setConfirmNewPassword] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [isChangingPassword, setIsChangingPassword] = useState(false)

  const themes: { value: Theme; label: string; icon: typeof FaSun }[] = [
    { value: 'light', label: 'Light', icon: FaSun },
    { value: 'dark', label: 'Dark', icon: FaMoon },
    { value: 'system', label: 'System', icon: FaDesktop },
  ]

  return (
    <div className="min-h-screen bg-gray-900">
      <main className="mx-auto max-w-3xl px-4 py-8">
        <h1 className="mb-8 text-4xl font-bold text-white">Settings</h1>
        <div className="space-y-6">
          <section className="rounded-xl bg-gray-800 p-6 shadow-lg">
            <div className="mb-4 flex items-center gap-3">
               <FaCog className="text-purple-400" size={24} />
              <h2 className="text-xl font-semibold text-white">Appearance</h2>
            </div>
            <div>
              <label className="mb-3 block text-sm text-gray-400">Theme</label>
              <div className="flex gap-3">
                {themes.map((t) => (
                  <button
                    key={t.value}
                    onClick={() => setTheme(t.value)}
                    className={`flex items-center gap-2 rounded-lg px-4 py-2 transition ${
                      theme === t.value
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    <t.icon size={18} />
                    {t.label}
                  </button>
                ))}
              </div>
            </div>
          </section>

          <section className="rounded-xl bg-gray-800 p-6 shadow-lg">
            <div className="mb-4 flex items-center gap-3">
               <FaServer className="text-purple-400" size={24} />
              <h2 className="text-xl font-semibold text-white">Playback</h2>
            </div>
            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm text-gray-400">Default Server</label>
                <select
                  value={defaultServer}
                  onChange={(e) => setDefaultServer(e.target.value)}
                  className="w-full rounded-lg bg-gray-700 px-3 py-2 text-white outline-none"
                >
                  <option value="server1">Server 1 (HD)</option>
                  <option value="server2">Server 2 (SD)</option>
                  <option value="server3">Server 3 (Backup)</option>
                </select>
              </div>
              <div>
                <label className="mb-2 block text-sm text-gray-400">Default Quality</label>
                <select
                  value={defaultQuality}
                  onChange={(e) => setDefaultQuality(e.target.value)}
                  className="w-full rounded-lg bg-gray-700 px-3 py-2 text-white outline-none"
                >
                  <option value="4k">4K Ultra HD</option>
                  <option value="1080p">1080p Full HD</option>
                  <option value="720p">720p HD</option>
                  <option value="480p">480p</option>
                </select>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                   <FaPlay className="text-purple-400" size={20} />
                  <span className="text-white">Autoplay Next Episode</span>
                </div>
                <button
                  onClick={() => setAutoplay(!autoplay)}
                  className={`relative h-7 w-12 sm:h-6 sm:w-11 rounded-full transition-colors ${autoplay ? 'bg-purple-600' : 'bg-gray-600'}`}
                >
                  <span
                    className={`absolute top-1 left-1 h-5 w-5 sm:h-4 sm:w-4 rounded-full bg-white transition-transform ${autoplay ? 'translate-x-5 sm:translate-x-5' : ''}`}
                  />
                </button>
              </div>
            </div>
          </section>

          <section className="rounded-xl bg-gray-800 p-6 shadow-lg">
            <div className="mb-4 flex items-center gap-3">
               <FaBell className="text-purple-400" size={24} />
              <h2 className="text-xl font-semibold text-white">Notifications</h2>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-white">Enable Notifications</span>
              <button
                onClick={() => setNotifications(!notifications)}
                className={`relative h-7 w-12 sm:h-6 sm:w-11 rounded-full transition-colors ${notifications ? 'bg-purple-600' : 'bg-gray-600'}`}
              >
                <span
                  className={`absolute top-1 left-1 h-5 w-5 sm:h-4 sm:w-4 rounded-full bg-white transition-transform ${notifications ? 'translate-x-5 sm:translate-x-5' : ''}`}
                />
              </button>
            </div>
          </section>

          <section className="rounded-xl bg-gray-800 p-6 shadow-lg">
            <div className="mb-4 flex items-center gap-3">
               <FaLock className="text-purple-400" size={24} />
              <h2 className="text-xl font-semibold text-white">Account</h2>
            </div>
            <div className="space-y-4">
              {passwordError && (
                <div className="rounded-lg bg-red-900/20 p-3 text-sm text-red-400">{passwordError}</div>
              )}
              <div>
                <label className="mb-1 block text-sm text-gray-400">Current Password</label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full rounded-lg bg-gray-700 px-3 py-2 text-white outline-none"
                  placeholder="Enter current password"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm text-gray-400">New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full rounded-lg bg-gray-700 px-3 py-2 text-white outline-none"
                  placeholder="Enter new password"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm text-gray-400">Confirm New Password</label>
                <input
                  type="password"
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  className="w-full rounded-lg bg-gray-700 px-3 py-2 text-white outline-none"
                  placeholder="Confirm new password"
                />
              </div>
              <button
                onClick={async () => {
                  setPasswordError('')
                  if (!currentPassword || !newPassword || !confirmNewPassword) {
                    setPasswordError('Please fill in all password fields')
                    return
                  }
                  if (newPassword !== confirmNewPassword) {
                    setPasswordError('New passwords do not match')
                    return
                  }
                  if (newPassword.length < 6) {
                    setPasswordError('New password must be at least 6 characters')
                    return
                  }
                  setIsChangingPassword(true)
                  try {
                    await changePassword(currentPassword, newPassword)
                    setCurrentPassword('')
                    setNewPassword('')
                    setConfirmNewPassword('')
                  } catch {
                    setPasswordError('Failed to change password. Please check your current password.')
                  } finally {
                    setIsChangingPassword(false)
                  }
                }}
                disabled={isChangingPassword}
                className="w-full rounded-lg bg-purple-600 py-2 text-white hover:bg-purple-500 disabled:opacity-50"
              >
                {isChangingPassword ? 'Changing...' : 'Change Password'}
              </button>
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}
