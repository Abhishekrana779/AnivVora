import { useCallback, useRef, useEffect } from "react"
import { usePlayerContext } from "../context/PlayerContext"

export function useVideoPlayer() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const {
    currentEpisode,
    isPlaying,
    currentTime,
    autoplay,
    pause,
    seek,
    setCurrentTime,
    setDuration,
  } = usePlayerContext()

  const handleTimeUpdate = useCallback(() => {
    const video = videoRef.current
    if (video) {
      setCurrentTime(video.currentTime)
    }
  }, [setCurrentTime])

  const handleLoadedMetadata = useCallback(() => {
    const video = videoRef.current
    if (video) {
      setDuration(video.duration)
      if (autoplay) {
        video.play().catch(() => {})
      }
    }
  }, [setDuration, autoplay])

  const handleEnded = useCallback(() => {
    pause()
  }, [pause])

  const togglePlay = useCallback(() => {
    const video = videoRef.current
    if (!video) return
    if (video.paused) {
      video.play().catch(() => {})
    } else {
      video.pause()
    }
  }, [])

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    video.addEventListener("timeupdate", handleTimeUpdate)
    video.addEventListener("loadedmetadata", handleLoadedMetadata)
    video.addEventListener("ended", handleEnded)

    return () => {
      video.removeEventListener("timeupdate", handleTimeUpdate)
      video.removeEventListener("loadedmetadata", handleLoadedMetadata)
      video.removeEventListener("ended", handleEnded)
    }
  }, [handleTimeUpdate, handleLoadedMetadata, handleEnded])

  const skipForward = useCallback(
    (seconds: number = 10) => {
      const video = videoRef.current
      if (video) {
        seek(Math.min(video.currentTime + seconds, video.duration || 0))
      }
    },
    [seek]
  )

  const skipBackward = useCallback(
    (seconds: number = 10) => {
      const video = videoRef.current
      if (video) {
        seek(Math.max(video.currentTime - seconds, 0))
      }
    },
    [seek]
  )

  return {
    videoRef,
    currentEpisode,
    isPlaying,
    currentTime,
    togglePlay,
    handleTimeUpdate,
    handleLoadedMetadata,
    handleEnded,
    skipForward,
    skipBackward,
  }
}
