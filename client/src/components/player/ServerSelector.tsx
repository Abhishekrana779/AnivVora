import { useState } from 'react'
import { FaServer } from 'react-icons/fa'

interface Server {
  id: string
  name: string
}

interface ServerSelectorProps {
  servers: Server[]
  currentServer?: string
  onSelect?: (serverId: string) => void
}

export function ServerSelector({ servers, currentServer, onSelect }: ServerSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const current = servers.find((s) => s.id === currentServer) || servers[0]

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-lg bg-gray-800/80 px-3 py-1.5 text-sm text-white hover:bg-gray-700"
      >
        <FaServer className="h-4 w-4 text-gray-300" />
        <span className="text-xs font-medium">{current?.name || 'Server'}</span>
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
            {servers.map((server) => (
              <button
                key={server.id}
                onClick={() => {
                  onSelect?.(server.id)
                  setIsOpen(false)
                }}
                className={`block w-full px-4 py-2 text-left text-sm text-white hover:bg-gray-700 ${
                  server.id === currentServer ? 'bg-purple-600/20 text-purple-400' : ''
                }`}
              >
                {server.name}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
