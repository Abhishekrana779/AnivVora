import { AnimeCard } from './AnimeCard';
import type { Anime } from '../../types';

export interface RecommendationListProps {
  animeList: Anime[];
  currentAnimeId?: string | number;
  title?: string;
  isLoading?: boolean;
}

export function RecommendationList({ animeList, currentAnimeId, title = 'You May Also Like', isLoading }: RecommendationListProps) {
  const filtered = currentAnimeId ? animeList.filter((a) => String(a.id) !== String(currentAnimeId)) : animeList;

  if (filtered.length === 0 && !isLoading) return null;

  return (
    <section className="mb-10">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-white">{title}</h2>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {isLoading
          ? Array.from({ length: 6 }).map((_, i) => (
              <AnimeCard key={i} anime={{} as Anime} isLoading />
            ))
          : filtered.map((anime) => <AnimeCard key={anime.id} anime={anime} />)}
      </div>
    </section>
  );
}
