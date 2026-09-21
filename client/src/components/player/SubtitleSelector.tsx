import { useState } from 'react'
import { FaClosedCaptioning } from 'react-icons/fa'
import type { Subtitle } from '../../types'

interface SubtitleSelectorProps {
  subtitles: Subtitle[]
  currentSubtitle?: string
  onSelect?: (lang: string) => void
}

export function SubtitleSelector({ subtitles, currentSubtitle, onSelect }: SubtitleSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const current = subtitles.find((s) => s.lang === currentSubtitle) || subtitles[0]
  const displayLabel = currentSubtitle === 'off' ? 'Off' : (current?.label || 'Sub')

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-lg bg-gray-800/80 px-3 py-1.5 text-sm text-white hover:bg-gray-700"
      >
        <FaClosedCaptioning className="h-4 w-4 text-gray-300" />
        <span className="text-xs font-medium">{displayLabel}</span>
        <div className="flex flex-col items-center text-gray-400">
          <svg className="h-2 w-2" fill="currentColor" viewBox="0 0 24 24">
            <path d="M7 14l5-5 5 5z" />
          </svg>
          <svg className="h-2 w-2" fill="currentColor" viewBox="0 0 24 24">
            <path d="M7 10l5 5 5-5z" />
          </svg>
        </div>
      </button>
      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
          <div className="absolute bottom-full mb-2 w-max max-w-[calc(100vw-2rem)] rounded-lg bg-gray-800 shadow-xl">
            <button
              onClick={() => {
                onSelect?.('off')
                setIsOpen(false)
              }}
              className={`block w-full px-4 py-2 text-left text-sm text-white hover:bg-gray-700 ${
                currentSubtitle === 'off' ? 'bg-purple-600/20 text-purple-400' : ''
              }`}
            >
              Off
            </button>
            {subtitles.map((sub) => (
              <button
                key={sub.id}
                onClick={() => {
                  onSelect?.(sub.lang || '')
                  setIsOpen(false)
                }}
                className={`block w-full px-4 py-2 text-left text-sm text-white hover:bg-gray-700 ${
                  sub.lang === currentSubtitle ? 'bg-purple-600/20 text-purple-400' : ''
                }`}
              >
                {sub.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
