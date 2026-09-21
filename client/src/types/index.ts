export interface Anime {
  id: string | number
  title: string
  image: string
  banner?: string
  synopsis?: string
  rating?: number
  episodes?: number
  duration?: string
  year?: number
  type?: string
  status?: string
  genres?: string[]
  thumbnail?: string
  titleJapanese?: string
  synonyms?: string
  aired?: string
  description?: string
  coverImage?: string
  bannerImage?: string
  studios?: string[]
  producers?: string[]
  malScore?: number
  popularity?: number
  favorites?: number
  startDate?: string
  isAdult?: boolean
  season?: string
  seasonYear?: number
}

export interface Episode {
  id: string | number
  number: number
  title?: string
  thumbnail?: string
  duration?: string
  description?: string
  animeId: string | number
  isWatched?: boolean
  sources?: string[]
  subtitles?: Subtitle[]
  servers?: Server[]
}

export interface Server {
  id: string
  name: string
  url: string
  referer?: string
  isActive?: boolean
  status?: "online" | "offline" | "loading"
}

export interface EpisodeSources {
  servers: Server[]
  sources: string[]
  subtitles: Subtitle[]
  error?: string
}

export interface VideoPlayerProps {
  src: string
  poster?: string
  referer?: string
  onEnded?: () => void
  onError?: (error: Error) => void
  autoPlay?: boolean
  subtitles?: Subtitle[]
  selectedSubtitle?: string
  episodeTitle?: { number?: number | string; title?: string }
  onSkipForward?: (seconds: number) => void
  onPreviousEpisode?: () => void
  onToggleSubtitles?: () => void
  onScreenshot?: () => void
  onTheaterMode?: () => void
  onSettings?: () => void
  isTheaterMode?: boolean
  error?: string
}

export interface Subtitle {
  id: string
  language: string
  label: string
  url: string
  lang: string
  type?: 'subtitle' | 'dub'
}

export interface User {
  id: string
  username: string
  email: string
  avatar: string
  bio?: string
  location?: string
  website?: string
  joinedAt: string
  role?: string
  preferences?: UserPreferences
  watchlist?: WatchlistItem[]
  stats?: {
    animeWatched: number
    episodesWatched: number
    hoursWatched: number
    daysWatched: number
  }
}

export interface UserPreferences {
  autoplay?: boolean
  defaultQuality?: string
  defaultServer?: string
  theme?: string
}

export interface WatchlistItem {
  id: string
  user?: string
  animeId: string | number
  anime?: Anime
  title?: string
  image?: string
  synopsis?: string
  episodes?: number
  genres?: string[]
  status?: string
  rating?: number
  addedAt?: string
  progress?: number
  updatedAt?: string
}

export interface WatchHistoryItem {
  id: string
  _id?: string
  user?: string
  anime?: Anime | null
  animeId?: string
  episode?: number | Episode
  episodeId?: string
  episodeTitle?: string
  title?: string
  thumbnail?: string
  watchedAt?: string
  progress?: number
  duration?: number
}

export interface Genre {
  id: string
  name: string
  count?: number
  image?: string
}

export interface ScheduleDay {
  day: string
  anime?: Anime[]
  animes?: Anime[]
}

export interface AuthResponse {
  user: User
  token?: string
}

export interface LoginData {
  email: string
  password: string
}

export interface RegisterData {
  username: string
  email: string
  password: string
  confirmPassword?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  page: number
  totalPages: number
  total: number
  hasNext?: boolean
  hasPrev?: boolean
  pages?: number
}

export interface SearchParams {
  query?: string
  page?: number
  limit?: number
  genre?: string
  status?: string
  type?: string
  year?: number
}

export type Theme = "light" | "dark" | "system"
