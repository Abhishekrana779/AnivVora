import { Link } from 'react-router-dom';
import { FiPlay } from 'react-icons/fi';
import { encodeEpisodeId } from '../../utils/helpers'
import type { Episode } from '../../types';

interface EpisodeCardProps {
  episode: Episode;
  onClick?: () => void;
  isWatched?: boolean;
  isLoading?: boolean;
}

export function EpisodeCard({ episode, onClick, isWatched, isLoading }: EpisodeCardProps) {
  if (isLoading) {
    return (
      <div className="animate-pulse flex gap-4 rounded-lg bg-gray-800 p-3">
        <div className="w-40 h-24 bg-gray-700 rounded-md flex-shrink-0" />
        <div className="flex-1 space-y-2 py-1">
          <div className="h-4 bg-gray-700 rounded w-1/3" />
          <div className="h-3 bg-gray-700 rounded w-1/2" />
        </div>
      </div>
    );
  }

  const content = (
    <div className="flex flex-col sm:flex-row gap-4 rounded-lg bg-gray-800 p-3 hover:bg-gray-700 transition-colors cursor-pointer group">
      <div className="relative w-full sm:w-40 h-40 sm:h-24 bg-gray-700 rounded-md overflow-hidden flex-shrink-0">
        {episode.thumbnail ? (
          <img src={episode.thumbnail} alt={`Episode ${episode.number}`} className="h-full w-full object-cover" />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">No Image</div>
        )}
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
          <FiPlay className="h-8 w-8 text-white" />
        </div>
      </div>
      <div className="flex-1 min-w-0 flex flex-col justify-center">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-semibold text-purple-400">EP {episode.number}</span>
          {episode.duration && <span className="text-xs text-gray-500">{episode.duration}</span>}
          {isWatched && <span className="text-xs text-green-400">Watched</span>}
        </div>
        <h4 className="text-sm font-medium text-white truncate">{episode.title || `Episode ${episode.number}`}</h4>
        {episode.description && (
          <p className="text-xs text-gray-400 line-clamp-2 mt-1">{episode.description}</p>
        )}
      </div>
    </div>
  );

  if (onClick) {
    return <div onClick={onClick} role="button" tabIndex={0}>{content}</div>;
  }

  return (
    <Link to={`/watch/${episode.animeId}/${encodeEpisodeId(String(episode.id))}`}>
      {content}
    </Link>
  );
}
