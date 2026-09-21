import { useState, useEffect, useCallback } from "react"
import { animeApi } from "../api/animeApi"
import type { Anime, Episode } from "../types"

interface UseEpisodesResult {
  episodes: Episode[] | null
  anime: Anime | null
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
}

export function useEpisodes(animeId: string): UseEpisodesResult {
  const [episodes, setEpisodes] = useState<Episode[] | null>(null)
  const [anime, setAnime] = useState<Anime | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const fetchEpisodes = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const episodesPromise = animeApi.getAnimeEpisodes(animeId)
      const animePromise = animeApi.getAnimeDetails(animeId)

      const episodesData = await episodesPromise.catch((_err) => {
        setError('Failed to load episodes')
        return null
      })
      const animeData = await animePromise.catch((_err) => {
        setError('Failed to load anime details')
        return null
      })

      if (episodesData) {
        const eps = Array.isArray(episodesData)
          ? (episodesData as Episode[])
          : ((episodesData as { episodes?: Episode[] })?.episodes || [])
        setEpisodes(eps)
      }
      if (animeData) {
        setAnime(animeData)
      }
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setLoading(false)
    }
  }, [animeId])

  useEffect(() => {
    if (animeId) {
      fetchEpisodes()
    }
  }, [animeId, fetchEpisodes])

  return { episodes, anime, loading, error, refetch: fetchEpisodes }
}

export function useFilteredEpisodes(
  episodes: Episode[] | null,
  filters: { dubbed?: boolean; subbed?: boolean; quality?: string }
) {
  if (!episodes) return []

  return episodes.filter((ep) => {
    if (filters.dubbed && filters.subbed) return true
    if (filters.dubbed && !filters.subbed) {
      return ep.title?.toLowerCase().includes("dub")
    }
    if (filters.subbed && !filters.dubbed) {
      return !ep.title?.toLowerCase().includes("dub")
    }
    return true
  })
}
