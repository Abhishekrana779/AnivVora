import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { WatchHistory } from '../components/user/WatchHistory'
import { historyApi } from '../api/historyApi'
import { encodeEpisodeId } from '../utils/helpers'
import type { PaginatedResponse, WatchHistoryItem } from '../types'

export default function History() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [history, setHistory] = useState<WatchHistoryItem[]>([])

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    historyApi.getHistory()
      .then((data) => {
        if (!cancelled) {
          const paginated = data as PaginatedResponse<WatchHistoryItem>
          setHistory(paginated.data || [])
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

  const clearHistory = async () => {
    const previousHistory = history
    setHistory([])
    try {
      await historyApi.clearHistory()
    } catch {
      setHistory(previousHistory)
    }
  }

  const historyItems = history.map((item) => {
    const animeObj = typeof item.anime === 'object' && item.anime !== null ? item.anime : null
    return {
      id: item.id,
      anime: {
        id: String(animeObj?.id || item.animeId || ''),
        title: animeObj?.title || 'Unknown Anime',
        image: animeObj?.image || item.thumbnail,
        totalEpisodes: animeObj?.episodes || 0,
      },
      lastWatchedEpisode: typeof item.episode === 'number' ? item.episode : (item.episode as any)?.number || 1,
      progressPercentage: item.progress && item.duration ? (item.progress / item.duration) * 100 : 0,
      watchedAt: item.watchedAt || new Date().toISOString(),
    }
  })

  const handleResume = (animeId: string, episodeNumber: number) => {
    navigate(`/watch/${animeId}/${encodeEpisodeId(String(episodeNumber))}`)
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <main className="mx-auto max-w-4xl px-4 py-8">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-4xl font-bold text-white">Watch History</h1>
          {history.length > 0 && (
            <button
              onClick={clearHistory}
              className="flex items-center gap-2 rounded-lg bg-red-600/20 px-4 py-2 text-red-400 hover:bg-red-600/30"
            >
              Clear History
            </button>
          )}
        </div>
        <WatchHistory
          history={historyItems}
          onResume={handleResume}
          onClearHistory={clearHistory}
          isLoading={loading}
        />
      </main>
    </div>
  )
}
