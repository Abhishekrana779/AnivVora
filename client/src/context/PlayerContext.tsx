import { type ReactNode, createContext, useContext, useState, useCallback, useRef } from "react"
import type { Episode, Anime, Subtitle } from "../types"

interface PlayerContextType {
  currentEpisode: Episode | null
  currentAnime: Anime | null
  isPlaying: boolean
  currentTime: number
  duration: number
  server: string
  subtitles: Subtitle[]
  quality: string
  autoplay: boolean
  showControls: boolean
  isFullscreen: boolean
  playEpisode: (episode: Episode, anime: Anime) => void
  pause: () => void
  seek: (time: number) => void
  setServer: (server: string) => void
  setSubtitles: (subtitles: Subtitle[]) => void
  toggleFullscreen: () => void
  toggleAutoplay: () => void
  skipIntro: () => void
  setCurrentTime: (time: number) => void
  setDuration: (duration: number) => void
  setShowControls: (show: boolean) => void
  setQuality: (quality: string) => void
  setPlayerRef: (el: HTMLVideoElement | null) => void
}

const PlayerContext = createContext<PlayerContextType | null>(null)

export function PlayerContextProvider({ children }: { children: ReactNode }) {
  const [currentEpisode, setCurrentEpisode] = useState<Episode | null>(null)
  const [currentAnime, setCurrentAnime] = useState<Anime | null>(null)
  const [isPlaying, setIsPlaying] = useState<boolean>(false)
  const [currentTime, setCurrentTime] = useState<number>(0)
  const [duration, setDuration] = useState<number>(0)
  const [server, setServerState] = useState<string>("")
  const [subtitles, setSubtitlesState] = useState<Subtitle[]>([])
  const [quality, setQuality] = useState<string>("auto")
  const [autoplay, setAutoplay] = useState<boolean>(true)
  const [showControls, setShowControls] = useState<boolean>(true)
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false)

  const playerRef = useRef<HTMLVideoElement | null>(null)

  const setPlayerRef = useCallback((el: HTMLVideoElement | null) => {
    playerRef.current = el
  }, [])

  const playEpisode = useCallback((episode: Episode, anime: Anime) => {
    setCurrentEpisode(episode)
    setCurrentAnime(anime)
    setIsPlaying(true)
    setCurrentTime(0)
    setDuration(0)
    if (episode.sources && episode.sources.length > 0) {
      setServerState(episode.sources[0])
    }
    setSubtitlesState(episode.subtitles || [])
  }, [])

  const pause = useCallback(() => {
    setIsPlaying(false)
    playerRef.current?.pause()
  }, [])

  const seek = useCallback((time: number) => {
    setCurrentTime(time)
    if (playerRef.current) {
      playerRef.current.currentTime = time
    }
  }, [])

  const setServer = useCallback((newServer: string) => {
    setServerState(newServer)
  }, [])

  const setSubtitles = useCallback(
    (newSubtitles: Subtitle[]) => {
      setSubtitlesState(newSubtitles)
    },
    []
  )

  const toggleFullscreen = useCallback(() => {
    setIsFullscreen((prev) => !prev)
  }, [])

  const toggleAutoplay = useCallback(() => {
    setAutoplay((prev) => !prev)
  }, [])

  const skipIntro = useCallback(() => {
    const INTRO_DURATION = 90
    seek(INTRO_DURATION)
  }, [seek])

  const value: PlayerContextType = {
    currentEpisode,
    currentAnime,
    isPlaying,
    currentTime,
    duration,
    server,
    subtitles,
    quality,
    autoplay,
    showControls,
    isFullscreen,
    playEpisode,
    pause,
    seek,
    setServer,
    setSubtitles,
    toggleFullscreen,
    toggleAutoplay,
    skipIntro,
    setCurrentTime,
    setDuration,
    setShowControls,
    setQuality,
    setPlayerRef,
  }

  return <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>
}

export function usePlayer(): PlayerContextType {
  const context = useContext(PlayerContext)
  if (!context) {
    throw new Error("usePlayer must be used within a PlayerContextProvider")
  }
  return context
}

export function usePlayerContext(): PlayerContextType {
  return usePlayer()
}
