import { AnimeCard } from './AnimeCard';
import type { Anime } from '../../types';

export interface AnimeGridProps {
  animeList: Anime[];
  isLoading?: boolean;
  columns?: {
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
    '2xl'?: number;
  };
}

export function AnimeGrid({ animeList, isLoading }: AnimeGridProps) {
  const gridClass = [
    'grid',
    'grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6',
    'gap-4',
  ].join(' ');

  return (
    <div className={gridClass}>
      {isLoading
        ? Array.from({ length: 12 }).map((_, i) => (
            <AnimeCard key={`skeleton-${i}`} anime={{} as Anime} isLoading />
          ))
        : animeList.map((anime) => <AnimeCard key={anime.id} anime={anime} />)}
    </div>
  );
}
