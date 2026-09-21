import { useState, useMemo, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useDebounce } from '../hooks/useDebounce'
import { AnimeGrid } from '../components/anime/AnimeGrid'
import { animeApi } from '../api/animeApi'
import { configApi } from '../api/configApi'
import { getYearRange } from '../utils/helpers'
import { FaFilter } from 'react-icons/fa'
import type { Anime, Genre } from '../types'

export default function Search() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [query, setQuery] = useState(searchParams.get('q') || '')
  const debouncedQuery = useDebounce(query, 300)
  const [typeFilter, setTypeFilter] = useState(searchParams.get('type') || '')
  const [statusFilter, setStatusFilter] = useState(searchParams.get('status') || '')
  const [genreFilter, setGenreFilter] = useState(searchParams.get('genre') || '')
  const [yearFilter, setYearFilter] = useState(searchParams.get('year') || '')
  const [showFilters, setShowFilters] = useState(false)
  const [results, setResults] = useState<Anime[]>([])
  const [searching, setSearching] = useState(false)
  const [allGenres, setAllGenres] = useState<Genre[]>([])
  const [animeTypes, setAnimeTypes] = useState<{ value: string; label: string }[]>([])
  const [animeStatuses, setAnimeStatuses] = useState<{ value: string; label: string }[]>([])

  useEffect(() => {
    let cancelled = false
    Promise.all([
      animeApi.getGenres(),
      configApi.getAnimeTypes(),
      configApi.getAnimeStatuses(),
    ])
      .then(([genres, types, statuses]) => {
        if (!cancelled) {
          setAllGenres(Array.isArray(genres) ? genres : [])
          setAnimeTypes(Array.isArray(types) ? types : [])
          setAnimeStatuses(Array.isArray(statuses) ? statuses : [])
        }
      })
      .catch(() => {
        // ignore
      })
    return () => { cancelled = true }
  }, [])

  useEffect(() => {
    let cancelled = false
    setSearching(true)
    const doSearch = async () => {
      try {
        const data = await animeApi.searchAnime(debouncedQuery, 1)
        if (!cancelled) setResults(data.data || [])
      } catch {
        if (!cancelled) setResults([])
      } finally {
        if (!cancelled) setSearching(false)
      }
    }
    if (debouncedQuery.trim()) {
      doSearch()
    } else {
      setResults([])
      setSearching(false)
    }
    return () => { cancelled = true }
  }, [debouncedQuery])

  const filtered = useMemo(() => {
    let resultsList = results
    if (typeFilter) resultsList = resultsList.filter((a) => a.type === typeFilter)
    if (statusFilter) resultsList = resultsList.filter((a) => a.status === statusFilter)
    if (genreFilter) resultsList = resultsList.filter((a) => a.genres?.includes(genreFilter))
    if (yearFilter) {
      const yearNum = Number(yearFilter)
      if (!Number.isNaN(yearNum)) {
        resultsList = resultsList.filter((a) => a.year === yearNum)
      }
    }
    return resultsList
  }, [results, typeFilter, statusFilter, genreFilter, yearFilter])

  const clearFilters = () => {
    setQuery('')
    setTypeFilter('')
    setStatusFilter('')
    setGenreFilter('')
    setYearFilter('')
    setSearchParams({})
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <main className="mx-auto max-w-7xl px-3 sm:px-4 py-6 sm:py-8">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-white">Search Anime</h1>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-4">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search anime..."
              className="flex-1 rounded-lg bg-gray-800 px-4 py-2.5 sm:py-3 text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-purple-500"
            />
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center justify-center gap-2 rounded-lg bg-gray-800 px-3 py-2.5 sm:px-4 sm:py-3 text-white hover:bg-gray-700"
            >
              <FaFilter size={18} />
              Filters
            </button>
          </div>
          {showFilters && (
            <div className="mt-4 grid grid-cols-1 gap-3 sm:gap-4 rounded-lg bg-gray-800 p-4 sm:p-6 sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <label className="mb-1 block text-sm text-gray-400">Type</label>
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="w-full rounded-lg bg-gray-700 px-3 py-2 text-white outline-none"
                >
                  <option value="">All</option>
                  {animeTypes.map((t) => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-sm text-gray-400">Status</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full rounded-lg bg-gray-700 px-3 py-2 text-white outline-none"
                >
                  <option value="">All</option>
                  {animeStatuses.map((s) => (
                    <option key={s.value} value={s.value}>{s.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-sm text-gray-400">Genre</label>
                <select
                  value={genreFilter}
                  onChange={(e) => setGenreFilter(e.target.value)}
                  className="w-full rounded-lg bg-gray-700 px-3 py-2 text-white outline-none"
                >
                  <option value="">All</option>
                  {allGenres.map((g) => (
                    <option key={g.id} value={g.name}>{g.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-sm text-gray-400">Year</label>
                <select
                  value={yearFilter}
                  onChange={(e) => setYearFilter(e.target.value)}
                  className="w-full rounded-lg bg-gray-700 px-3 py-2 text-white outline-none"
                >
                  <option value="">All</option>
                  {getYearRange().map((y) => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              </div>
              <button
                onClick={clearFilters}
                className="col-span-full rounded-lg bg-purple-600 px-4 py-2 text-sm text-white hover:bg-purple-500"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
        <AnimeGrid animeList={filtered} isLoading={searching} />
      </main>
    </div>
  )
}
