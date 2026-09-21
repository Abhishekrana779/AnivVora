import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { FiChevronLeft, FiPlay, FiInfo } from "react-icons/fi";
import { encodeEpisodeId } from "../../utils/helpers"

interface Episode {
  id: number;
  number: number;
  title: string;
  duration: string;
}

interface RelatedAnime {
  id: number;
  title: string;
  coverImage: string;
}

interface AnimeInfo {
  title: string;
  coverImage: string;
  synopsis: string;
  genres: string[];
  rating: number;
  status: string;
  totalEpisodes: number;
}

interface SidebarProps {
  episodes: Episode[];
  animeInfo: AnimeInfo;
  relatedAnime?: RelatedAnime[];
  currentEpisodeId?: number;
}

export function Sidebar({ episodes, animeInfo, relatedAnime = [], currentEpisodeId }: SidebarProps) {
  const [showAllEpisodes, setShowAllEpisodes] = useState(false);
  const { animeId, episodeId } = useParams();
  const displayedEpisodes = showAllEpisodes ? episodes : episodes.slice(0, 10);

  return (
    <aside className="w-full space-y-6">
      <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-hidden">
        <div className="relative h-40 bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
          <img
            src={animeInfo.coverImage}
            alt={animeInfo.title}
            className="h-full w-full object-cover opacity-60"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <FiPlay className="h-12 w-12 text-white drop-shadow-lg" />
          </div>
        </div>
        <div className="p-4 space-y-3">
          <h3 className="font-semibold text-gray-900 dark:text-white truncate">{animeInfo.title}</h3>
          <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
            <span className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-green-500" />
              {animeInfo.status}
            </span>
            <span>{animeInfo.rating}/10</span>
            <span>{animeInfo.totalEpisodes} eps</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {animeInfo.genres.map((genre) => (
              <span key={genre} className="rounded-md bg-indigo-50 px-2 py-0.5 text-xs font-medium text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300">
                {genre}
              </span>
            ))}
          </div>
          <div className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-300">
            <FiInfo className="h-4 w-4 mt-0.5 shrink-0 text-gray-400" />
            <p className="line-clamp-3">{animeInfo.synopsis}</p>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
          <h3 className="font-semibold text-gray-900 dark:text-white">Episodes</h3>
        </div>
        <div className="divide-y divide-gray-200 dark:divide-gray-700 max-h-[400px] overflow-y-auto">
          {displayedEpisodes.map((episode) => (
            <Link
              key={episode.id}
              to={`/watch/${animeId}/${encodeEpisodeId(String(episode.id))}`}
              className={[
                "flex items-center gap-3 px-4 py-3 transition-colors",
                String(currentEpisodeId) === String(episode.id) || String(episodeId) === String(episode.id)
                  ? "bg-indigo-50 dark:bg-indigo-900/20"
                  : "hover:bg-gray-50 dark:hover:bg-gray-700/50",
              ].join(" ")}
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-100 dark:bg-indigo-900/40 text-sm font-semibold text-indigo-600 dark:text-indigo-400">
                {episode.number}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {episode.title}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{episode.duration}</p>
              </div>
            </Link>
          ))}
        </div>
        {episodes.length > 10 && (
          <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setShowAllEpisodes(!showAllEpisodes)}
              className="w-full flex items-center justify-center gap-1 text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300"
            >
              <FiChevronLeft className={`h-4 w-4 transition-transform ${showAllEpisodes ? "rotate-90" : ""}`} />
              {showAllEpisodes ? "Show less" : `Show all ${episodes.length} episodes`}
            </button>
          </div>
        )}
      </div>

      {relatedAnime.length > 0 && (
        <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold text-gray-900 dark:text-white">Related Anime</h3>
          </div>
          <div className="p-4 grid grid-cols-2 gap-3">
            {relatedAnime.map((anime) => (
              <Link
                key={anime.id}
                to={`/anime/${anime.id}`}
                className="group rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-600 transition-colors"
              >
                <div className="aspect-[3/4] bg-gray-100 dark:bg-gray-700 overflow-hidden">
                  <img
                    src={anime.coverImage}
                    alt={anime.title}
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-200"
                  />
                </div>
                <div className="p-2">
                  <p className="text-xs font-medium text-gray-900 dark:text-white line-clamp-2 leading-tight">
                    {anime.title}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </aside>
  );
}
