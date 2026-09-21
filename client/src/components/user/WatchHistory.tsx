import { FaPlay, FaTrash } from "react-icons/fa";
import { Link } from "react-router-dom";

export interface AnimeInfo {
  id: string;
  title: string;
  image?: string;
  totalEpisodes: number;
}

export interface HistoryItem {
  id: string;
  anime: AnimeInfo;
  lastWatchedEpisode: number;
  progressPercentage: number;
  watchedAt: string;
}

export interface WatchHistoryProps {
  history: HistoryItem[];
  onResume?: (animeId: string, episodeNumber: number) => void;
  onClearHistory?: () => void;
  isLoading?: boolean;
}

export function WatchHistory({ history, onResume, onClearHistory, isLoading = false }: WatchHistoryProps) {
  const formatTimestamp = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  if (isLoading) {
    return (
      <div className="w-full max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 p-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center space-x-4">
                <div className="h-24 w-20 bg-gray-200 dark:bg-gray-700 rounded-lg" />
                <div className="flex-1 space-y-2">
                  <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Watch History</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Continue where you left off</p>
          </div>
          {history.length > 0 && onClearHistory && (
            <button
              onClick={onClearHistory}
              className="flex items-center px-3 py-2 text-sm font-medium text-red-600 dark:text-red-400 border border-red-600 dark:border-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
            >
              <FaTrash className="mr-2 h-4 w-4" />
              Clear History
            </button>
          )}
        </div>

        {history.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <FaPlay className="mx-auto h-12 w-12 text-gray-300 dark:text-gray-600 mb-4" />
            <p className="text-gray-600 dark:text-gray-400">No watch history yet</p>
            <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">Start watching anime and it will appear here</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {history.map((item) => (
              <div
                key={item.id}
                className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer"
                onClick={() => onResume?.(item.anime.id, item.lastWatchedEpisode)}
              >
                <div className="flex items-start space-x-4">
                 <div className="flex-shrink-0">
                     {item.anime.image ? (
                       <img
                         src={item.anime.image}
                         alt={item.anime.title}
                         className="h-24 w-20 sm:h-24 sm:w-20 object-cover rounded-lg shadow-md"
                       />
                     ) : (
                       <div className="h-24 w-20 sm:h-24 sm:w-20 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white text-lg font-bold">
                         {item.anime.title.charAt(0).toUpperCase()}
                       </div>
                     )}
                   </div>

                  <div className="flex-1 min-w-0">
                    <Link to={`/anime/${item.anime.id}`} className="block">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors truncate">
                        {item.anime.title}
                      </h3>
                    </Link>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      Episode {item.lastWatchedEpisode} of {item.anime.totalEpisodes}
                    </p>

                    <div className="mt-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-blue-600 dark:bg-blue-500 h-2 rounded-full transition-all"
                        style={{ width: `${Math.min(item.progressPercentage, 100)}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {item.progressPercentage.toFixed(0)}% watched
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {formatTimestamp(item.watchedAt)}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onResume?.(item.anime.id, item.lastWatchedEpisode);
                    }}
                    className="flex-shrink-0 p-3 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                    title="Resume watching"
                  >
                    <FaPlay className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
