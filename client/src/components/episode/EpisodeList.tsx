import { useMemo } from 'react';
import { EpisodeCard } from './EpisodeCard';
import type { Episode } from '../../types';

export interface EpisodeListProps {
  episodes: Episode[];
  isLoading?: boolean;
  onEpisodeClick?: (episode: Episode) => void;
  currentEpisodeId?: string | number;
  maxEpisodes?: number;
}

export function EpisodeList({ episodes, isLoading, onEpisodeClick, currentEpisodeId, maxEpisodes }: EpisodeListProps) {
  const sortedEpisodes = useMemo(
    () => {
      const seen = new Set<number>()
      return [...(episodes || [])]
        .sort((a, b) => (a.number || 0) - (b.number || 0))
        .filter((ep) => {
          if (seen.has(ep.number)) return false
          seen.add(ep.number)
          return true
        })
        .filter((ep) => !maxEpisodes || ep.number <= maxEpisodes)
    },
    [episodes, maxEpisodes]
  );

  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="animate-pulse rounded-lg bg-gray-800 h-24" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {sortedEpisodes.map((episode) => (
        <EpisodeCard
          key={episode.id}
          episode={episode}
          onClick={() => onEpisodeClick?.(episode)}
          isWatched={episode.id === currentEpisodeId}
        />
      ))}
    </div>
  );
}
