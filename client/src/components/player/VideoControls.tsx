import React, { useEffect, useState, useCallback } from 'react'

interface VideoControlsProps {
  videoRef: React.RefObject<HTMLVideoElement | null>
  onEnded?: () => void
  onSkipForward?: (seconds: number) => void
  onPreviousEpisode?: () => void
  onScreenshot?: () => void
  onSettings?: () => void
  episodeTitle?: { number?: number; title?: string }
}

export function VideoControls({
  videoRef,
  onEnded,
  onSkipForward,
  onPreviousEpisode,
  onScreenshot,
  onSettings,
  episodeTitle,
}: VideoControlsProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [isMuted, setIsMuted] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [hasStarted, setIsStarted] = useState(false)
  const [isPiP, setIsPiP] = useState(false)

  const togglePlay = useCallback(() => {
    const video = videoRef.current
    if (!video) return
    if (video.paused) {
      video.play().then(() => setIsStarted(true)).catch(() => {})
    } else {
      video.pause()
    }
  }, [videoRef])

  const handleSeek = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current
    if (!video) return
    const time = Number(e.target.value)
    video.currentTime = time
    setCurrentTime(time)
  }, [videoRef])

  const handleSkipForward = useCallback((seconds: number) => {
    const video = videoRef.current
    if (!video) return
    video.currentTime = Math.min(duration, video.currentTime + seconds)
    onSkipForward?.(seconds)
  }, [duration, onSkipForward, videoRef])

  const handlePrevious = useCallback(() => {
    onPreviousEpisode?.()
  }, [onPreviousEpisode])

  const toggleMute = useCallback(() => {
    const video = videoRef.current
    if (!video) return
    video.muted = !isMuted
    setIsMuted(!isMuted)
  }, [isMuted, videoRef])

  const toggleFullscreen = useCallback(async () => {
    const video = videoRef.current
    if (!video) return

    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen()
        setIsFullscreen(false)
      } else {
        await video.requestFullscreen()
        setIsFullscreen(true)
      }
    } catch {
      // fullscreen not supported
    }
  }, [videoRef])

  const togglePiP = useCallback(async () => {
    const video = videoRef.current
    if (!video) return

    try {
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture()
        setIsPiP(false)
      } else if (document.pictureInPictureEnabled) {
        await video.requestPictureInPicture()
        setIsPiP(true)
      }
    } catch {
      // PiP not supported
    }
  }, [videoRef])

  const formatTime = (time: number) => {
    if (isNaN(time)) return '00:00'
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const handleTimeUpdate = () => setCurrentTime(video.currentTime)
    const handleDurationChange = () => setDuration(video.duration)
    const handlePlay = () => setIsPlaying(true)
    const handlePause = () => setIsPlaying(false)
    const handleEnded = () => {
      setIsPlaying(false)
      onEnded?.()
    }
    const handleWaiting = () => {
      if (hasStarted) setIsLoading(true)
    }
    const handleCanPlay = () => setIsLoading(false)
    const handleStalled = () => {
      if (hasStarted) setIsLoading(true)
    }
    const handleSuspend = () => setIsLoading(false)

    video.addEventListener('timeupdate', handleTimeUpdate)
    video.addEventListener('durationchange', handleDurationChange)
    video.addEventListener('play', handlePlay)
    video.addEventListener('pause', handlePause)
    video.addEventListener('ended', handleEnded)
    video.addEventListener('waiting', handleWaiting)
    video.addEventListener('canplay', handleCanPlay)
    video.addEventListener('stalled', handleStalled)
    video.addEventListener('suspend', handleSuspend)

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate)
      video.removeEventListener('durationchange', handleDurationChange)
      video.removeEventListener('play', handlePlay)
      video.removeEventListener('pause', handlePause)
      video.removeEventListener('ended', handleEnded)
      video.removeEventListener('waiting', handleWaiting)
      video.removeEventListener('canplay', handleCanPlay)
      video.removeEventListener('stalled', handleStalled)
      video.removeEventListener('suspend', handleSuspend)
    }
  }, [onEnded, hasStarted, videoRef])

  return (
    <div className="border-t border-gray-800 bg-gray-950">
      <div className="px-2 sm:px-4 py-2">
        <div className="space-y-2">
          <div className="relative group/progress">
            <div className="h-1 rounded-full bg-gray-600 group-hover/progress:h-1.5 transition-all">
              <div
                className="h-full rounded-full bg-purple-500 transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
            <input
              type="range"
              min={0}
              max={duration || 0}
              value={currentTime}
              onChange={handleSeek}
              className="absolute inset-0 h-full w-full cursor-pointer appearance-none bg-transparent opacity-0 group-hover/progress:opacity-100 transition-opacity"
            />
          </div>

          <div className="flex items-center justify-between text-white">
            <div className="flex items-center gap-1 sm:gap-3 overflow-hidden">
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  handlePrevious()
                }}
                className="text-white hover:text-purple-400 transition-colors shrink-0"
                title="Previous"
              >
                <svg className="h-3 w-3 sm:h-4 sm:w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" />
                </svg>
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation()
                  togglePlay()
                }}
                className="text-white hover:text-purple-400 transition-colors shrink-0"
              >
                {isLoading && hasStarted ? (
                  <svg className="h-3 w-3 sm:h-4 sm:w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                ) : isPlaying ? (
                  <svg className="h-3 w-3 sm:h-4 sm:w-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                  </svg>
                ) : (
                  <svg className="h-3 w-3 sm:h-4 sm:w-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                )}
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation()
                  toggleMute()
                }}
                className="hover:text-purple-400 transition-colors shrink-0"
              >
                {isMuted ? (
                  <svg className="h-3 w-3 sm:h-4 sm:w-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
                  </svg>
                ) : (
                  <svg className="h-3 w-3 sm:h-4 sm:w-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
                  </svg>
                )}
              </button>

              <span className="text-[10px] sm:text-xs font-mono text-white shrink-0">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>

              <span className="text-[10px] sm:text-xs text-gray-300 truncate hidden sm:block">
                {episodeTitle ? `EP ${episodeTitle.number || ''} · ${episodeTitle.title || ''}` : ''}
              </span>
            </div>

            <div className="flex items-center gap-1 sm:gap-3 shrink-0">
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  handleSkipForward(10)
                }}
                className="text-white hover:text-purple-400 transition-colors"
                title="Forward 10s"
              >
                <div className="flex items-center gap-0.5">
                  <svg className="h-2.5 w-2.5 sm:h-3 sm:w-3" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M4 18l8.5-6L4 6v12zm9-12v12l8.5-6L13 6z" />
                  </svg>
                  <span className="text-[10px] sm:text-xs font-medium">10</span>
                </div>
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation()
                  handleSkipForward(15)
                }}
                className="text-white hover:text-purple-400 transition-colors"
                title="Forward 15s"
              >
                <div className="flex items-center gap-0.5">
                  <svg className="h-2.5 w-2.5 sm:h-3 sm:w-3" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M4 18l8.5-6L4 6v12zm9-12v12l8.5-6L13 6z" />
                  </svg>
                  <span className="text-[10px] sm:text-xs font-medium">15</span>
                </div>
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onScreenshot?.()
                }}
                className="text-white hover:text-purple-400 transition-colors hidden sm:block"
                title="Screenshot"
              >
                <svg className="h-3 w-3 sm:h-4 sm:w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" />
                </svg>
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onSettings?.()
                }}
                className="text-white hover:text-purple-400 transition-colors hidden sm:block"
                title="Settings"
              >
                <svg className="h-3 w-3 sm:h-4 sm:w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.64l-1.92-3.32c-.12-.22-.39-.29-.61-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.49-.41h-3.84c-.24 0-.44.17-.49.41l-.36 2.54c-.59.24-1.12.57-1.62.94l-2.39-.96c-.22-.08-.49 0-.61.22L3.16 8.87c-.12.23-.07.5.12.64l2.03 1.58c-.05.3-.07.62-.07.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.64l1.92 3.32c.12.22.39.29.61.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.25.41.49.41h3.84c.24 0 .44-.17.49-.41l.36-2.54c.59-.24 1.12-.57 1.62-.94l2.39.96c.22.08.49 0 .61-.22l1.92-3.32c.12-.22.07-.5-.12-.64l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z" />
                </svg>
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation()
                  togglePiP()
                }}
                className={`hover:text-purple-400 transition-colors ${isPiP ? 'text-purple-400' : 'text-white'} hidden sm:block`}
                title="Picture in Picture"
              >
                <svg className="h-3 w-3 sm:h-4 sm:w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 7h-8v6h8V7zm2-4H3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H3V5h18v14z" />
                </svg>
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation()
                  toggleFullscreen()
                }}
                className="text-white hover:text-purple-400 transition-colors"
                title={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
              >
                {isFullscreen ? (
                  <svg className="h-3 w-3 sm:h-4 sm:w-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z" />
                  </svg>
                ) : (
                  <svg className="h-3 w-3 sm:h-4 sm:w-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
