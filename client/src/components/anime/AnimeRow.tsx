import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { AnimeCard } from './AnimeCard';
import type { Anime } from '../../types';

export interface AnimeRowProps {
  title: string;
  animeList: Anime[];
  seeAllLink?: string;
  isLoading?: boolean;
}

export function AnimeRow({ title, animeList, seeAllLink, isLoading }: AnimeRowProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const { current } = scrollRef;
    const scrollAmount = current.clientWidth * 0.8;
    current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  return (
    <section className="mb-6 md:mb-10">
      <div className="flex items-center justify-between mb-3 md:mb-4">
        <h2 className="text-lg sm:text-xl font-bold text-white">{title}</h2>
        {seeAllLink && (
          <Link to={seeAllLink} className="text-sm text-purple-400 hover:text-purple-300 transition-colors">
            See All
          </Link>
        )}
      </div>
      <div className="relative group">
        <button
          onClick={() => scroll('left')}
          className="absolute left-0 top-0 bottom-0 z-10 w-10 sm:w-12 bg-gradient-to-r from-gray-900 to-transparent flex items-center justify-start pl-1 sm:pl-2"
          aria-label="Scroll left"
        >
          <FiChevronLeft className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
        </button>
        <div
          ref={scrollRef}
          className="flex gap-3 sm:gap-4 overflow-x-auto scroll-smooth no-scrollbar"
        >
          {isLoading
            ? Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="flex-shrink-0 w-36 sm:w-40">
                  <AnimeCard anime={{} as Anime} isLoading />
                </div>
              ))
            : (Array.isArray(animeList) ? animeList : []).map((anime) => (
                <div key={anime.id} className="flex-shrink-0 w-36 sm:w-40">
                  <AnimeCard anime={anime} />
                </div>
              ))}
        </div>
        <button
          onClick={() => scroll('right')}
          className="absolute right-0 top-0 bottom-0 z-10 w-10 sm:w-12 bg-gradient-to-l from-gray-900 to-transparent flex items-center justify-end pr-1 sm:pr-2"
          aria-label="Scroll right"
        >
          <FiChevronRight className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
        </button>
      </div>
    </section>
  );
}
