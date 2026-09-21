import { Link, useNavigate } from 'react-router-dom';
import { FiStar, FiPlay, FiMonitor } from 'react-icons/fi';
import type { Anime } from '../../types';
import { useAuth } from '../../hooks/useAuth';

interface AnimeCardProps {
  anime: Anime;
  isLoading?: boolean;
  className?: string;
  progress?: number;
}

export function AnimeCard({ anime, isLoading, className, progress }: AnimeCardProps) {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  if (isLoading) {
    return (
      <div className="animate-pulse rounded-xl overflow-hidden bg-gray-800">
        <div className="aspect-[3/4] bg-gray-700" />
        <div className="p-3 space-y-2">
          <div className="h-4 bg-gray-700 rounded w-3/4" />
          <div className="h-3 bg-gray-700 rounded w-1/2" />
        </div>
      </div>
    );
  }

  const handleWatch = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (!isAuthenticated) {
      navigate('/login')
      return
    }
    navigate(`/watch/${anime.id}`)
  }

  return (
    <div className={`group cursor-pointer ${className || ''}`}>
      <Link to={`/anime/${anime.id}`} className="block">
        <div className="relative aspect-[3/4] rounded-lg overflow-hidden mb-2">
          <img
            src={anime.image}
            alt={anime.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={handleWatch}
              className="flex items-center gap-2 rounded-full bg-purple-600 p-3 text-white hover:bg-purple-500 shadow-lg"
            >
              <FiPlay className="h-5 w-5" />
            </button>
          </div>
          {typeof progress === 'number' && (
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-700/80">
              <div className="h-full bg-purple-500" style={{ width: `${Math.min(progress, 100)}%` }} />
            </div>
          )}
        </div>
      </Link>
      <div className="px-1">
        <h3 className="truncate text-sm font-medium text-white">{anime.title}</h3>
        <div className="mt-1 flex items-center justify-between gap-2 text-[11px] text-gray-400">
          <div className="flex min-w-0 items-center gap-1.5">
            <FiMonitor className="h-3 w-3 shrink-0" />
            {anime.type && <span className="truncate">{anime.type}</span>}
            {anime.year && <span>• {anime.year}</span>}
            {anime.episodes ? <span>• {anime.episodes}</span> : null}
          </div>
          {anime.rating !== undefined && anime.rating !== null && (
            <div className="flex shrink-0 items-center gap-0.5">
              <FiStar className="h-3 w-3 text-yellow-400" />
              <span>{anime.rating.toFixed(0)}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
