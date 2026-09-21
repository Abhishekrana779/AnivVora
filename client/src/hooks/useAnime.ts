import { useState, useEffect, useCallback } from "react"
import { animeApi } from "../api/animeApi"
import type { Anime, PaginatedResponse } from "../types"

interface UseAnimeResult<T> {
  data: T[]
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
}

export function useTrending(): UseAnimeResult<Anime> {
  const [data, setData] = useState<Anime[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const fetchTrending = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const result = await animeApi.getTrending()
      setData(result)
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchTrending()
  }, [fetchTrending])

  return { data, loading, error, refetch: fetchTrending }
}

export function useRecent(): UseAnimeResult<Anime> {
  const [data, setData] = useState<Anime[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const fetchRecent = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const result = await animeApi.getRecent()
      setData(result)
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchRecent()
  }, [fetchRecent])

  return { data, loading, error, refetch: fetchRecent }
}

export function useSearch(): UseAnimeResult<Anime> & { page: number; totalPages: number; query: string; setQuery: (q: string) => void; setPage: (p: number) => void } {
  const [data, setData] = useState<Anime[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [query, setQueryState] = useState<string>("")
  const [page, setPageState] = useState<number>(1)
  const [totalPages, setTotalPages] = useState<number>(1)

  const search = useCallback(async (searchQuery: string, pageNum: number = 1) => {
    if (!searchQuery.trim()) {
      setData([])
      return
    }
    try {
      setLoading(true)
      setError(null)
      const result: PaginatedResponse<Anime> = await animeApi.searchAnime(searchQuery, pageNum)
      setData(result.data)
      setTotalPages(result.totalPages)
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setLoading(false)
    }
  }, [])

  return { data, loading, error, refetch: () => search(query, page), query, setQuery: setQueryState, page, setPage: setPageState, totalPages }
}
