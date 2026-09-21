import { useState, useEffect, useMemo, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { FiPlay, FiInfo, FiClock, FiTrendingUp } from 'react-icons/fi'
import { AnimeRow } from '../components/anime/AnimeRow'
import { AnimeCard } from '../components/anime/AnimeCard'
import { useTrending, useRecent } from '../hooks/useAnime'
import { useAuth } from '../hooks/useAuth'
import { animeApi } from '../api/animeApi'
import { historyApi } from '../api/historyApi'
import type { Anime, WatchHistoryItem } from '../types'

export default function Home() {
  const navigate = useNavigate()
  const { isAuthenticated, loading: authLoading } = useAuth()
  const { data: trending, loading: trendingLoading } = useTrending()
  const { data: recent, loading: recentLoading } = useRecent()
  const [popular, setPopular] = useState<Anime[]>([])
  const [popularLoading, setPopularLoading] = useState(true)
  const [continueWatching, setContinueWatching] = useState<WatchHistoryItem[]>([])
  const [continueWatchingLoading, setContinueWatchingLoading] = useState(false)
  const continueWatchingLoaded = useRef(false)

  const topAiring = useMemo(() => (trending || []).slice(0, 8), [trending])

  useEffect(() => {
    let cancelled = false
    const fetchPopular = async () => {
      try {
        const data = await animeApi.getPopular()
        if (!cancelled) {
          setPopular(data.slice(0, 16))
          setPopularLoading(false)
        }
      } catch {
        if (!cancelled) setPopularLoading(false)
      }
    }
    fetchPopular()
    return () => { cancelled = true }
  }, [])

  const fetchContinueWatching = useCallback(async () => {
    if (!isAuthenticated) return
    if (continueWatchingLoaded.current) return
    continueWatchingLoaded.current = true
    setContinueWatchingLoading(true)
    try {
      const result = await historyApi.getHistory({ limit: 10, page: 1 })
      const mapped = (result.data || []).map((item) => {
        const rawAnime = item.anime
        const animeId = typeof rawAnime === 'string'
          ? rawAnime
          : item.animeId || ''
        const animeObj = typeof rawAnime === 'object' && rawAnime !== null
          ? rawAnime
          : null
        const anime: Anime = animeObj
          ? {
              id: String(animeObj.id || animeId),
              title: animeObj.title || item.title || 'Unknown',
              image: animeObj.image || animeObj.thumbnail || item.thumbnail || '',
              type: animeObj.type,
              year: animeObj.year,
              episodes: animeObj.episodes,
              rating: animeObj.rating,
              genres: animeObj.genres || [],
              studios: animeObj.studios || [],
              producers: animeObj.producers || [],
            }
          : {
              id: String(animeId),
              title: item.title || 'Unknown',
              image: item.thumbnail || '',
              type: undefined,
              year: undefined,
              episodes: undefined,
              rating: undefined,
              genres: [],
              studios: [],
              producers: [],
            }
        return {
          id: String(item._id || item.id),
          anime,
          animeId: String(animeId),
          episode: item.episode,
          episodeTitle: item.episodeTitle,
          title: item.title,
          thumbnail: item.thumbnail,
          watchedAt: item.watchedAt,
          progress: item.progress,
          duration: item.duration,
        }
      })
      setContinueWatching(mapped)
    } catch {
      setContinueWatching([])
    } finally {
      setContinueWatchingLoading(false)
    }
  }, [isAuthenticated])

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      fetchContinueWatching()
    }
  }, [isAuthenticated, authLoading, fetchContinueWatching])

  const heroAnime = trending?.[0] || recent?.[0]

  return (
    <div className="min-h-screen bg-[#0f0f0f]">
      {/* Hero Section */}
      {heroAnime && (
        <div className="relative h-[70vh] min-h-[500px] w-full overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${heroAnime.banner || heroAnime.image})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f0f] via-[#0f0f0f]/70 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0f0f0f]/90 via-[#0f0f0f]/40 to-transparent" />
          <div className="relative z-10 flex h-full items-end p-6 md:p-12">
            <div className="max-w-2xl">
              <div className="flex items-center gap-3 mb-4 text-sm text-gray-300">
                 <span className="text-purple-400 font-semibold">{heroAnime.type || 'TV'}</span>
                <span>{heroAnime.type}</span>
                <span className="text-gray-500">|</span>
                <span>{heroAnime.duration}</span>
                <span className="text-gray-500">|</span>
                <span>{heroAnime.rating ? `★ ${heroAnime.rating}` : ''}</span>
              </div>
              <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 leading-tight">
                {heroAnime.title}
              </h1>
              <p className="mb-8 text-gray-300 line-clamp-3 md:text-base">
                {heroAnime.synopsis}
              </p>
              <div className="flex flex-wrap gap-3">
                {isAuthenticated ? (
                  <button
                    onClick={() => navigate(`/watch/${heroAnime.id}`)}
                    className="flex items-center gap-2 rounded-lg bg-purple-600 px-8 py-3 font-semibold text-white hover:bg-purple-500 transition-colors"
                  >
                    <FiPlay className="h-5 w-5" />
                    Watch Now
                  </button>
                ) : (
                  <button
                    onClick={() => navigate('/login')}
                    className="flex items-center gap-2 rounded-lg bg-purple-600 px-8 py-3 font-semibold text-white hover:bg-purple-500 transition-colors"
                  >
                    <FiPlay className="h-5 w-5" />
                    Login to Watch
                  </button>
                )}
                <button
                  onClick={() => navigate(`/anime/${heroAnime.id}`)}
                  className="flex items-center gap-2 rounded-lg bg-gray-700/80 px-8 py-3 font-semibold text-white hover:bg-gray-600 transition-colors"
                >
                  <FiInfo className="h-5 w-5" />
                  Details
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <main className="mx-auto max-w-7xl px-4 py-8">
        {/* Continue Watching */}
        {isAuthenticated && (
          <section className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <FiClock className="text-purple-400 h-5 w-5" />
              <h2 className="text-xl font-bold text-white">Continue Watching</h2>
            </div>
            <div className="flex gap-4 overflow-x-auto pb-4 scroll-smooth no-scrollbar">
              {continueWatchingLoading && continueWatching.length === 0 && (
                <div className="flex gap-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="flex-shrink-0 w-36 sm:w-40">
                      <AnimeCard anime={{} as Anime} isLoading />
                    </div>
                  ))}
                </div>
              )}
              {!continueWatchingLoading && continueWatching.length === 0 && (
                <p className="text-gray-400 text-sm py-4">No watch history yet.</p>
              )}
              {continueWatching.map((item) => {
                const progressPercent = ((item.progress || 0) / (item.duration || 1)) * 100
                const anime: Anime = item.anime || {
                  id: item.animeId || item.id,
                  title: item.title || 'Unknown',
                  image: item.thumbnail || '',
                  type: undefined,
                  year: undefined,
                  episodes: undefined,
                  rating: undefined,
                  genres: [],
                  studios: [],
                  producers: [],
                }

                return (
                  <div key={item.id} className="flex-shrink-0 w-36 sm:w-40">
                    <AnimeCard anime={anime} progress={progressPercent} />
                  </div>
                )
              })}
            </div>
          </section>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          {/* Popular Section */}
          <section>
            <div className="flex items-center gap-4 mb-4">
              <FiTrendingUp className="text-purple-400 h-5 w-5" />
              <h2 className="text-xl font-bold text-white">Popular</h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4 gap-2 sm:gap-3">
              {popular.length === 0 && !popularLoading && (
                <p className="text-gray-400 col-span-full py-8">No popular anime available.</p>
              )}
              {popular.map((anime) => (
                <AnimeCard key={anime.id} anime={anime} />
              ))}
            </div>
          </section>

          {/* Top Airing */}
          <section>
            <div className="flex items-center gap-4 mb-4">
              <FiTrendingUp className="text-purple-400 h-5 w-5" />
              <h2 className="text-xl font-bold text-white">Top Airing</h2>
            </div>
            <div className="space-y-3">
              {topAiring.length === 0 && !trendingLoading && (
                <p className="text-gray-400 text-sm">No top airing anime available.</p>
              )}
              {topAiring.map((anime) => (
                <div
                  key={anime.id}
                  onClick={() => navigate(`/anime/${anime.id}`)}
                  className="flex gap-3 cursor-pointer group"
                >
                  <div className="relative w-16 sm:w-20 h-24 sm:h-28 flex-shrink-0 rounded-lg overflow-hidden">
                    <img
                      src={anime.image}
                      alt={anime.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                   <div className="flex-1 min-w-0 py-1">
                    <h4 className="flex items-center gap-1.5 text-sm font-semibold text-white truncate group-hover:text-purple-400 transition-colors">
                      {(anime.status === 'Ongoing' || anime.status === 'RELEASING') && (
                        <span className="h-2 w-2 shrink-0 rounded-full bg-green-500" />
                      )}
                      {anime.title}
                    </h4>
                    <p className="text-xs text-gray-400 mt-1">{anime.type}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xs text-yellow-400">★ {anime.rating?.toFixed(1)}</span>
                      {anime.episodes && <span className="text-xs text-gray-500">• {anime.episodes} eps</span>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Trending and Recently Added */}
        <div className="mt-12 space-y-8">
          <AnimeRow title="Trending Now" animeList={trending || []} isLoading={trendingLoading} />
          <AnimeRow title="Recently Added" animeList={recent || []} isLoading={recentLoading} />
        </div>
      </main>
    </div>
  )
}
