import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { animeApi } from '../api/animeApi'
import type { Genre } from '../types'

export default function Genres() {
  const [loading, setLoading] = useState(true)
  const [genres, setGenres] = useState<Genre[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)
    animeApi.getGenres()
      .then((data) => {
        if (!cancelled) {
          setGenres(Array.isArray(data) ? data : [])
          setLoading(false)
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err?.message || 'Failed to load genres. Please try again later.')
          setLoading(false)
        }
      })
    return () => { cancelled = true }
  }, [])

  return (
    <div className="min-h-screen bg-gray-900">
      <main className="mx-auto max-w-7xl px-4 py-8">
        <h1 className="mb-8 text-4xl font-bold text-white">Browse Genres</h1>
        <p className="mb-8 text-gray-400">Explore anime by your favorite genres</p>
        {error && (
          <div className="mb-6 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}
        {loading ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-24 rounded-lg bg-gray-700" />
              </div>
            ))}
          </div>
        ) : genres.length === 0 ? (
          <p className="text-gray-400">No genres available at the moment.</p>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {genres.map((genre) => (
              <Link
                key={genre.id}
                to={`/genre/${encodeURIComponent(genre.name)}`}
                className="group relative h-24 overflow-hidden rounded-lg bg-gray-800 shadow-lg transition hover:scale-105"
              >
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-300 group-hover:scale-110"
                  style={{ backgroundImage: genre.image ? `url(${genre.image})` : undefined }}
                />
                <div className="absolute inset-0 bg-black/50 transition group-hover:bg-black/40" />
                <div className="relative flex h-full flex-col items-center justify-center text-white">
                  <h3 className="text-sm font-semibold">{genre.name}</h3>
                  <p className="text-xs text-gray-300">{genre.count} anime</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
