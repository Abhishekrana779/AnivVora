import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { AnimeInfo } from '../components/anime/AnimeInfo'
import { GenreList } from '../components/anime/GenreList'
import { RecommendationList } from '../components/anime/RecommendationList'
import { EpisodeList } from '../components/episode/EpisodeList'
import { animeApi } from '../api/animeApi'
import { encodeEpisodeId } from '../utils/helpers'
import type { Anime, Episode } from '../types'

export default function AnimeDetails() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [anime, setAnime] = useState<Anime | null>(null)
  const [episodes, setEpisodes] = useState<Episode[]>([])
  const [episodesLoading, setEpisodesLoading] = useState(false)
  const [episodesError, setEpisodesError] = useState<string | null>(null)
  const [recommendations, setRecommendations] = useState<Anime[]>([])

  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)
    animeApi.getAnimeDetails(String(id))
      .then((data) => {
        if (!cancelled) {
          setAnime(data)
          setLoading(false)
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to load anime details')
          setLoading(false)
        }
      })
    return () => { cancelled = true }
  }, [id])

  useEffect(() => {
    if (!anime) return
    let cancelled = false
    setEpisodesLoading(true)
    setEpisodesError(null)
    animeApi.getAnimeEpisodes(String(anime.id))
      .then((data) => {
        if (!cancelled) {
          const eps = Array.isArray(data) ? data : []
          setEpisodes(eps)
          setEpisodesLoading(false)
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setEpisodesError(err instanceof Error ? err.message : 'Failed to load episodes')
          setEpisodesLoading(false)
        }
      })
    return () => {
      cancelled = true
    }
  }, [anime])

  useEffect(() => {
    let cancelled = false
    animeApi.getTrending()
      .then((data) => {
        if (!cancelled) {
          setRecommendations(data.filter((a: Anime) => String(a.id) !== String(id)).slice(0, 6))
        }
      })
      .catch(() => {
        if (!cancelled) setRecommendations([])
      })
    return () => { cancelled = true }
  }, [id])

  const handleEpisodeClick = (ep: Episode) => {
    if (!anime) return
    navigate(`/watch/${anime.id}/${encodeEpisodeId(String(ep.id))}`)
  }

  const handleWatch = () => {
    if (!anime) return
    if (episodes.length > 0) {
      navigate(`/watch/${anime.id}/${encodeEpisodeId(String(episodes[0].id))}`)
    } else {
      navigate(`/watch/${anime.id}`)
    }
  }

  const handleAddToList = () => {
    alert('Add to List feature coming soon!')
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {loading ? (
        <div className="flex min-h-screen items-center justify-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-purple-600 border-t-transparent" />
        </div>
      ) : error || !anime ? (
        <div className="flex min-h-screen items-center justify-center text-white">
          <div className="text-center">
            <p className="mb-4 text-lg text-red-400">{error || 'Anime not found'}</p>
            <button
              onClick={() => window.location.reload()}
              className="rounded-lg bg-purple-600 px-4 py-2 text-white hover:bg-purple-500"
            >
              Retry
            </button>
          </div>
        </div>
      ) : (
        <>
          <AnimeInfo anime={anime} onWatch={handleWatch} onAddToList={handleAddToList} />
          <main className="mx-auto max-w-7xl px-4 py-8">
            <section className="mt-12">
              <h2 className="mb-4 text-2xl font-bold text-white">Episodes</h2>
              {episodesError ? (
                <p className="text-red-400">{episodesError}</p>
              ) : (
                <EpisodeList
                  episodes={episodes}
                  isLoading={episodesLoading}
                  onEpisodeClick={handleEpisodeClick}
                  maxEpisodes={anime?.episodes}
                />
              )}
            </section>
            <section className="mt-12">
              <h2 className="mb-4 text-2xl font-bold text-white">Genres</h2>
              <GenreList genres={anime?.genres || []} />
            </section>
            <RecommendationList animeList={recommendations} currentAnimeId={anime?.id} isLoading={loading} />
          </main>
        </>
      )}
    </div>
  )
}
