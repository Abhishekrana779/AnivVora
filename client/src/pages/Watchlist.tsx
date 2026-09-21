import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { WatchlistCard } from '../components/user/WatchlistCard'
import { watchlistApi } from '../api/watchlistApi'
import { configApi } from '../api/configApi'
import type { WatchlistStatus } from '../components/user/WatchlistCard'
import type { WatchlistItem } from '../types'

export default function Watchlist() {
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('all')
  const [statusTabs, setStatusTabs] = useState<{ key: string; label: string; status?: WatchlistStatus }[]>([])
  const [items, setItems] = useState<WatchlistItem[]>([])

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    Promise.all([
      watchlistApi.getWatchlist(),
      configApi.getWatchlistStatuses(),
    ])
      .then(([data, statuses]) => {
        if (!cancelled) {
          setItems(Array.isArray(data) ? data : [])
          const tabs = [
            { key: 'all', label: 'All' },
            ...(statuses as string[]).map((s) => ({
              key: s,
              label: s.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase()),
              status: s as WatchlistStatus,
            })),
          ]
          setStatusTabs(tabs)
          setLoading(false)
        }
      })
      .catch(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  const filtered = activeTab === 'all' ? items : items.filter((i) => {
    const status = (i.status || '').toLowerCase()
    if (activeTab === 'watching') return status === 'watching'
    if (activeTab === 'completed') return status === 'completed'
    if (activeTab === 'plan_to_watch') return status === 'plan_to_watch'
    if (activeTab === 'dropped') return status === 'dropped'
    if (activeTab === 'on_hold') return status === 'on_hold'
    return true
  })

  const removeItem = async (id: string) => {
    const previousItems = items
    setItems((prev) => prev.filter((item) => item.id !== id))
    try {
      await watchlistApi.removeFromWatchlist(id)
    } catch {
      setItems(previousItems)
    }
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <main className="mx-auto max-w-7xl px-4 py-8">
        <h1 className="mb-8 text-4xl font-bold text-white">My Watchlist</h1>
        <div className="mb-8 flex gap-2 overflow-x-auto">
          {statusTabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`rounded-lg px-4 py-2 whitespace-nowrap font-medium transition ${
                activeTab === tab.key
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        {loading ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-32 rounded-xl bg-gray-800" />
              </div>
            ))}
          </div>
        ) : filtered.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((item) => {
              const anime = item.anime || {
                id: item.animeId as string,
                title: item.title || 'Unknown Anime',
                image: item.image,
                rating: 0,
                episodes: 0,
              }
              return (
                <WatchlistCard
                  key={item.id}
                  anime={{
                    id: String(anime.id),
                    title: anime.title,
                    image: anime.image,
                    status: (item.status?.toLowerCase().replace(/ /g, '_') || 'plan_to_watch') as WatchlistStatus,
                    rating: anime.rating,
                    currentEpisode: item.progress || 0,
                    totalEpisodes: anime.episodes || 0,
                  }}
                  onRemove={() => removeItem(item.id)}
                />
              )
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <svg className="mb-4 h-16 w-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-lg">No anime in your watchlist</p>
            <Link to="/" className="mt-4 text-purple-400 hover:text-purple-300">Browse anime →</Link>
          </div>
        )}
      </main>
    </div>
  )
}
