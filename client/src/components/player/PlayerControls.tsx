import { useState, useEffect, useCallback, useRef } from 'react'

interface PlayerControlsProps {
  videoRef: React.RefObject<HTMLVideoElement | null>
  isPlaying: boolean
  currentTime: number
  duration: number
  volume: number
  isMuted: boolean
  isFullscreen: boolean
  isLoading: boolean
  onTogglePlay: () => void
  onSeek: (time: number) => void
  onVolumeChange: (volume: number) => void
  onToggleMute: () => void
  onToggleFullscreen: () => void
  onSkipIntro?: () => void
  showSkipIntro?: boolean
}

export function PlayerControls({
  videoRef,
  isPlaying,
  currentTime,
  duration,
  volume,
  isMuted,
  isFullscreen,
  isLoading,
  onTogglePlay,
  onSeek,
  onVolumeChange,
  onToggleMute,
  onToggleFullscreen,
  onSkipIntro,
  showSkipIntro = false,
}: PlayerControlsProps) {
  const [showControls, setShowControls] = useState(true)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const hideControls = useCallback(() => {
    if (isPlaying) {
      setShowControls(false)
    }
  }, [isPlaying])

  const resetHideTimer = useCallback(() => {
    setShowControls(true)
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    if (isPlaying) {
      timeoutRef.current = setTimeout(hideControls, 3000)
    }
  }, [isPlaying, hideControls])

  useEffect(() => {
    resetHideTimer()
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [isPlaying, resetHideTimer])

  const formatTime = (time: number) => {
    if (isNaN(time)) return '00:00'
    const hours = Math.floor(time / 3600)
    const minutes = Math.floor((time % 3600) / 60)
    const seconds = Math.floor(time % 60)

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
    }
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  }

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0
  const buffered = videoRef.current && videoRef.current.buffered.length > 0 && duration > 0
    ? (videoRef.current.buffered.end(videoRef.current.buffered.length - 1) / duration) * 100
    : 0

  return (
    <div
      className={`absolute inset-0 transition-opacity duration-300 ${
        showControls || !isPlaying ? 'opacity-100' : 'opacity-0'
      }`}
      onMouseMove={resetHideTimer}
      onClick={resetHideTimer}
    >
      <div className="flex h-full flex-col justify-between bg-gradient-to-t from-black/80 via-transparent to-black/30">
        <div className="flex-1" />

        <div className="space-y-2 sm:space-y-3 px-2 sm:px-4 pb-2 sm:pb-4">
          <div className="relative">
            <div className="h-1 rounded-full bg-gray-600">
              <div
                className="h-1 rounded-full bg-purple-500 transition-all"
                style={{ width: `${progress}%` }}
              />
              {buffered > 0 && (
                <div
                  className="absolute top-0 h-1 rounded-full bg-gray-500/50"
                  style={{ width: `${buffered}%`, left: 0 }}
                />
              )}
            </div>
              <input
                type="range"
                min={0}
                max={duration || 0}
                value={currentTime}
                onChange={(e) => onSeek(Number(e.target.value))}
                className="absolute inset-0 h-full w-full cursor-pointer appearance-none bg-transparent"
              />
          </div>

          <div className="flex items-center justify-between text-white">
            <div className="flex items-center gap-2 sm:gap-4">
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onTogglePlay()
                }}
                className="text-2xl hover:text-purple-400"
              >
                {isLoading ? '⏳' : isPlaying ? '⏸️' : '▶️'}
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onSkipIntro?.()
                }}
                className={`rounded-lg px-3 py-1 text-sm font-medium transition-colors ${
                  showSkipIntro
                    ? 'bg-purple-600 text-white hover:bg-purple-700'
                    : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                }`}
              >
                Skip Intro
              </button>

              <span className="text-sm">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
            </div>

            <div className="flex items-center gap-2 sm:gap-4">
              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    onToggleMute()
                  }}
                  className="hover:text-purple-400"
                >
                  {isMuted || volume === 0 ? '🔇' : volume < 0.5 ? '🔉' : '🔊'}
                </button>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.1}
                  value={isMuted ? 0 : volume}
                  onChange={(e) => onVolumeChange(Number(e.target.value))}
                  onClick={(e) => e.stopPropagation()}
                  className="h-1 w-20 cursor-pointer appearance-none rounded-lg bg-gray-600 accent-purple-500"
                />
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onToggleFullscreen()
                }}
                className="hover:text-purple-400"
              >
                {isFullscreen ? '⛶' : '⛶'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
