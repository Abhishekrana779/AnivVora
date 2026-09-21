import { useRef, useEffect, useState, useCallback, forwardRef } from 'react'
import Hls from 'hls.js'
import type { VideoPlayerProps } from '../../types'

export const VideoPlayer = forwardRef<HTMLVideoElement, VideoPlayerProps>(function VideoPlayer({
  src,
  poster,
  onEnded,
  onError,
  autoPlay = false,
  subtitles,
  selectedSubtitle,
  error: externalError,
}, ref) {
  const internalVideoRef = useRef<HTMLVideoElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const hlsRef = useRef<Hls | null>(null)
  const errorTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const retryTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const retryCountRef = useRef(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [hasStarted, setHasStarted] = useState(false)
  const [retrying, setRetrying] = useState(false)
  const [retryCount, setRetryCount] = useState(0)
  const srcRef = useRef(src)
  const hasStartedRef = useRef(hasStarted)
  const errorRef = useRef(error)
  const autoPlayRef = useRef(autoPlay)

  useEffect(() => {
    srcRef.current = src
  }, [src])

  useEffect(() => {
    hasStartedRef.current = hasStarted
  }, [hasStarted])

  useEffect(() => {
    errorRef.current = error
  }, [error])

  useEffect(() => {
    autoPlayRef.current = autoPlay
  }, [autoPlay])

  const clearHls = useCallback(() => {
    if (hlsRef.current) {
      hlsRef.current.destroy()
      hlsRef.current = null
    }
  }, [])

  const loadSource = useCallback((url: string, video: HTMLVideoElement) => {
    const isHls = url.includes('.m3u8') || url.includes('m3u8')

    if (isHls && Hls.isSupported()) {
      clearHls()

      const hls = new Hls({
        enableWorker: true,
        lowLatencyMode: false,
        backBufferLength: 90,
        xhrSetup: (xhr) => {
          xhr.setRequestHeader('Accept', '*/*')
          xhr.setRequestHeader('Accept-Language', 'en-US,en;q=0.9')
        },
      })

      hls.loadSource(url)
      hls.attachMedia(video)
      hlsRef.current = hls

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        setIsLoading(false)
        setError(null)
        retryCountRef.current = 0
        if (autoPlayRef.current) {
          video.play().then(() => setHasStarted(true)).catch(() => {})
        }
      })

      hls.on(Hls.Events.ERROR, (_, data) => {
        if (data.fatal) {
          const isNetwork = data.type === Hls.ErrorTypes.NETWORK_ERROR
          const isMedia = data.type === Hls.ErrorTypes.MEDIA_ERROR

          if ((isNetwork || isMedia) && retryCountRef.current < 3) {
            setRetrying(true)
            retryCountRef.current += 1
            setRetryCount(retryCountRef.current)
            if (retryTimerRef.current) clearTimeout(retryTimerRef.current)
            retryTimerRef.current = setTimeout(() => {
              retryTimerRef.current = null
              if (srcRef.current && hlsRef.current === hls) {
                if (isMedia) {
                  hls.recoverMediaError()
                }
                hls.startLoad()
                setRetrying(false)
              }
            }, 1500 * retryCountRef.current)
            return
          }

          if (isNetwork) {
            setError('Network error. Please check your connection.')
          } else if (isMedia) {
            setError('Media error. The video format may not be supported.')
          } else {
            setError('Failed to load video stream.')
          }
          setIsLoading(false)
          setRetrying(false)
          onError?.(new Error('Playback error'))
        }
      })

      return
    }

    if (isHls && video.canPlayType('application/vnd.apple.mpegurl')) {
      clearHls()
      video.src = url
      video.load()
      return
    }

    clearHls()
    video.src = url
    video.load()
  }, [clearHls, onError])

  useEffect(() => {
    const video = internalVideoRef.current
    if (!video || !src) return

    setIsLoading(true)
    setError(null)
    setHasStarted(false)
    setRetrying(false)
    retryCountRef.current = 0

    if (errorTimerRef.current) {
      clearTimeout(errorTimerRef.current)
      errorTimerRef.current = null
    }

    if (retryTimerRef.current) {
      clearTimeout(retryTimerRef.current)
      retryTimerRef.current = null
    }

    loadSource(src, video)

    return () => {
      clearHls()
      if (errorTimerRef.current) {
        clearTimeout(errorTimerRef.current)
        errorTimerRef.current = null
      }
      if (retryTimerRef.current) {
        clearTimeout(retryTimerRef.current)
        retryTimerRef.current = null
      }
    }
  }, [src, loadSource, clearHls])

  useEffect(() => {
    const video = internalVideoRef.current
    if (!video) return

    const handleEnded = () => {
      onEnded?.()
    }
    const handleError = () => {
      const mediaError = video.error
      if (!mediaError) return

      let message = 'Video playback error'
      switch (mediaError.code) {
        case MediaError.MEDIA_ERR_ABORTED:
          message = 'Playback aborted by the user.'
          break
        case MediaError.MEDIA_ERR_NETWORK:
          message = 'Network error while loading video.'
          break
        case MediaError.MEDIA_ERR_DECODE:
          message = 'Video decode error. The file may be corrupted.'
          break
        case MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED:
          message = 'Video format or source not supported.'
          break
        default:
          break
      }

      setError(message)
      setIsLoading(false)
      onError?.(new Error(message))
    }
    const handleWaiting = () => {
      if (hasStartedRef.current) setIsLoading(true)
    }
    const handleCanPlay = () => setIsLoading(false)
    const handleStalled = () => {
      if (hasStartedRef.current && !errorRef.current) setIsLoading(true)
    }
    const handleSuspend = () => {
      if (hasStartedRef.current) setIsLoading(true)
    }

    video.addEventListener('ended', handleEnded)
    video.addEventListener('error', handleError)
    video.addEventListener('waiting', handleWaiting)
    video.addEventListener('canplay', handleCanPlay)
    video.addEventListener('stalled', handleStalled)
    video.addEventListener('suspend', handleSuspend)

    return () => {
      video.removeEventListener('ended', handleEnded)
      video.removeEventListener('error', handleError)
      video.removeEventListener('waiting', handleWaiting)
      video.removeEventListener('canplay', handleCanPlay)
      video.removeEventListener('stalled', handleStalled)
      video.removeEventListener('suspend', handleSuspend)
    }
  }, [onEnded, onError, src])

  useEffect(() => {
    const video = internalVideoRef.current
    if (!video || !subtitles || subtitles.length === 0) return

    const tracks = video.textTracks
    for (let i = 0; i < tracks.length; i++) {
      const track = tracks[i]
      if (track.language === selectedSubtitle) {
        track.mode = 'showing'
      } else {
        track.mode = 'hidden'
      }
    }
  }, [selectedSubtitle, subtitles])

  useEffect(() => {
    return () => {
      if (errorTimerRef.current) {
        clearTimeout(errorTimerRef.current)
        errorTimerRef.current = null
      }
    }
  }, [])

  const togglePlay = useCallback(() => {
    const video = internalVideoRef.current
    if (!video || error) return
    if (video.paused) {
      video.play().then(() => setHasStarted(true)).catch(() => {})
    } else {
      video.pause()
    }
  }, [error])

  const handlePlayClick = useCallback(() => {
    const video = internalVideoRef.current
    if (!video || !src || error) return
    if (video.paused) {
      video.play().then(() => setHasStarted(true)).catch(() => {})
    }
  }, [src, error])

  const handleRetry = useCallback(() => {
    if (externalError) {
      window.location.reload()
      return
    }

    const video = internalVideoRef.current
    if (!video || !src) return

    setRetrying(true)
    setError(null)
    setIsLoading(true)
    retryCountRef.current = 0

    if (hlsRef.current) {
      clearHls()
    }

    if (retryTimerRef.current) {
      clearTimeout(retryTimerRef.current)
      retryTimerRef.current = null
    }

    retryTimerRef.current = setTimeout(() => {
      retryTimerRef.current = null
      loadSource(src, video)
    }, 500)
  }, [clearHls, loadSource, src, externalError])

  return (
    <div
      ref={containerRef}
      className="relative w-full bg-black overflow-hidden"
    >
      <video
        ref={(el) => {
          internalVideoRef.current = el
          if (typeof ref === 'function') {
            ref(el)
          } else if (ref) {
            ref.current = el
          }
        }}
        poster={poster}
        className="w-full aspect-video"
        onClick={togglePlay}
        playsInline
        controls
      >
        {subtitles?.map((sub) => (
          <track
            key={sub.url}
            kind="subtitles"
            src={sub.url}
            srcLang={sub.lang}
            label={sub.label}
            default={sub.lang === selectedSubtitle}
          />
        ))}
      </video>

      {!hasStarted && !error && !isLoading && (
        <div
          className="absolute inset-0 flex items-center justify-center cursor-pointer bg-black/30 transition-opacity z-10"
          onClick={(e) => {
            e.stopPropagation()
            handlePlayClick()
          }}
        >
          <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center pl-1 hover:bg-white/30 transition-colors">
            <svg className="h-8 w-8 sm:h-10 sm:w-10 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
               <path d="M8 5v14l11 -7z" />
            </svg>
          </div>
        </div>
      )}

      {(isLoading || retrying) && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-20">
          <div className="flex flex-col items-center gap-3">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-white border-t-transparent" />
            {retrying && (
              <p className="text-white text-sm">Retrying... ({retryCount}/3)</p>
            )}
          </div>
        </div>
      )}

      {externalError && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-30">
          <div className="text-center text-white max-w-sm mx-auto px-4">
            <p className="mb-4 text-lg">{externalError}</p>
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={handleRetry}
                className="rounded bg-purple-600 px-4 py-2 hover:bg-purple-700 transition-colors"
              >
                Reload Page
              </button>
            </div>
          </div>
        </div>
      )}

      {error && !externalError && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-30">
          <div className="text-center text-white max-w-sm mx-auto px-4">
            <p className="mb-4 text-lg">{error}</p>
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={handleRetry}
                disabled={retrying}
                className="rounded bg-purple-600 px-4 py-2 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {retrying ? 'Retrying...' : 'Retry'}
              </button>
              <button
                onClick={() => window.location.reload()}
                className="rounded bg-gray-700 px-4 py-2 hover:bg-gray-600 transition-colors"
              >
                Reload Page
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
})
