import { useState, useEffect, useRef } from 'react'

interface AutoNextProps {
  nextEpisodeId?: string | number
  countdown?: number
  onSkip?: () => void
}

export function AutoNext({ nextEpisodeId, countdown = 10, onSkip }: AutoNextProps) {
  const [secondsLeft, setSecondsLeft] = useState(countdown)
  const cancelledRef = useRef(false)

  useEffect(() => {
    if (!nextEpisodeId) return
    cancelledRef.current = false
    setSecondsLeft(countdown)

    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (cancelledRef.current || prev <= 1) {
          clearInterval(timer)
          if (!cancelledRef.current) {
            onSkip?.()
          }
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [nextEpisodeId, countdown, onSkip])

  if (!nextEpisodeId) return null

  return (
    <div className="fixed bottom-24 left-1/2 z-50 -translate-x-1/2 rounded-lg bg-gray-900/95 p-4 shadow-2xl backdrop-blur">
      <p className="text-sm text-gray-400">Next episode in {secondsLeft}s</p>
      <div className="mt-2 flex gap-3">
        <button
          onClick={() => {
            cancelledRef.current = true
            onSkip?.()
          }}
          className="rounded-lg bg-purple-600 px-4 py-2 text-sm text-white hover:bg-purple-500"
        >
          Play Next
        </button>
        <button
          onClick={() => {
            cancelledRef.current = true
            setSecondsLeft(0)
          }}
          className="rounded-lg bg-gray-700 px-4 py-2 text-sm text-white hover:bg-gray-600"
        >
          Cancel
        </button>
      </div>
    </div>
  )
}
