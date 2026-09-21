import { Link } from 'react-router-dom';
import { FiPlay, FiPlus, FiInfo } from 'react-icons/fi';
import type { Anime } from '../../types';

export interface AnimeHeroProps {
  anime: Anime;
  onPlay?: () => void;
  onAddToWatchlist?: () => void;
}

export function AnimeHero({ anime, onPlay, onAddToWatchlist }: AnimeHeroProps) {
  if (!anime) return null;

  return (
    <div className="relative h-[60vh] sm:h-[70vh] md:h-[80vh] min-h-[500px] w-full overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${anime.banner || anime.image})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f0f] via-[#0f0f0f]/60 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#0f0f0f]/90 via-[#0f0f0f]/30 to-transparent" />
      <div className="relative z-10 flex h-full items-end p-6 md:p-12">
        <div className="max-w-2xl">
          <div className="flex items-center gap-3 mb-3 text-sm text-gray-300">
            {anime.type && <span className="text-purple-400 font-semibold">{anime.type}</span>}
            {anime.duration && <span>{anime.duration}</span>}
            {anime.rating !== undefined && anime.rating > 0 && <span className="text-yellow-400">★ {anime.rating.toFixed(1)}</span>}
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
            {anime.title}
          </h1>
          {anime.synopsis && (
            <p className="mb-6 line-clamp-2 md:line-clamp-3 text-sm md:text-base text-gray-300">
              {anime.synopsis}
            </p>
          )}
          <div className="flex flex-wrap gap-3">
            {onPlay && (
              <button
                onClick={onPlay}
                className="flex items-center gap-2 rounded-lg bg-purple-600 px-6 py-2.5 font-semibold text-white hover:bg-purple-500 transition-colors"
              >
                <FiPlay className="h-5 w-5" />
                Watch Now
              </button>
            )}
            {onAddToWatchlist && (
              <button
                onClick={onAddToWatchlist}
                className="flex items-center gap-2 rounded-lg bg-gray-700/80 px-6 py-2.5 font-semibold text-white hover:bg-gray-600 transition-colors"
              >
                <FiPlus className="h-5 w-5" />
                Watchlist
              </button>
            )}
            <Link
              to={`/anime/${anime.id}`}
              className="flex items-center gap-2 rounded-lg bg-gray-700/80 px-6 py-2.5 font-semibold text-white hover:bg-gray-600 transition-colors"
            >
              <FiInfo className="h-5 w-5" />
              Details
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
