import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { AnimeGrid } from '../components/anime/AnimeGrid'
import { animeApi } from '../api/animeApi'
import type { Anime } from '../types'

export default function GenreAnime() {
  const { genre: genreParam } = useParams<{ genre: string }>()
  const [loading, setLoading] = useState(true)
  const [genreAnime, setGenreAnime] = useState<Anime[]>([])

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    animeApi.getAnimeByGenre(genreParam || '', 1)
      .then((data) => {
        if (!cancelled) {
          setGenreAnime(data.data || [])
          setLoading(false)
        }
      })
      .catch(() => {
        if (!cancelled) setLoading(false)
      })
    return () => { cancelled = true }
  }, [genreParam])

  return (
    <div className="min-h-screen bg-gray-900">
      <main className="mx-auto max-w-7xl px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white">{genreParam ? `${genreParam} Anime` : 'Genre Anime'}</h1>
          <p className="mt-2 text-gray-400">
            {genreAnime.length} anime found in {genreParam || 'this genre'}
          </p>
        </div>
        <AnimeGrid animeList={genreAnime} isLoading={loading} />
        {genreAnime.length > 0 && (
          <div className="mt-8 flex items-center justify-center gap-4">
            <button className="rounded-lg bg-gray-800 px-4 py-2 text-white hover:bg-gray-700">Previous</button>
            <span className="text-gray-400">Page 1</span>
            <button className="rounded-lg bg-gray-800 px-4 py-2 text-white hover:bg-gray-700">Next</button>
          </div>
        )}
      </main>
    </div>
  )
}
