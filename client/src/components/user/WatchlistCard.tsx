import { useState, useRef, useEffect } from "react";
import { FaEllipsisV, FaStar, FaCheck, FaClock, FaPlay, FaHeartBroken, FaTrash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";

export type WatchlistStatus = "watching" | "completed" | "on_hold" | "dropped" | "plan_to_watch";

export interface WatchlistAnime {
  id: string;
  title: string;
  image?: string;
  status: WatchlistStatus;
  rating?: number;
  currentEpisode: number;
  totalEpisodes: number;
}

export interface WatchlistCardProps {
  anime: WatchlistAnime;
  onStatusChange?: (animeId: string, status: WatchlistStatus) => void;
  onRemove?: (animeId: string) => void;
}

const statusConfig: Record<WatchlistStatus, { label: string; className: string }> = {
  watching: { label: "Watching", className: "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400" },
  completed: { label: "Completed", className: "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400" },
  on_hold: { label: "On Hold", className: "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400" },
  dropped: { label: "Dropped", className: "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400" },
  plan_to_watch: { label: "Plan to Watch", className: "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300" },
};

export function WatchlistCard({ anime, onStatusChange, onRemove }: WatchlistCardProps) {
  const [showOptions, setShowOptions] = useState(false);
  const optionsRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (optionsRef.current && !optionsRef.current.contains(event.target as Node)) {
        setShowOptions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleStatusChange = (status: WatchlistStatus) => {
    onStatusChange?.(anime.id, status);
    setShowOptions(false);
  };

  const handleRemove = () => {
    onRemove?.(anime.id);
    setShowOptions(false);
  };

  const progressPercentage = anime.totalEpisodes > 0
    ? Math.round((anime.currentEpisode / anime.totalEpisodes) * 100)
    : 0;

  const normalizedStatus = (anime.status || 'plan_to_watch').toLowerCase().replace(/ /g, '_') as WatchlistStatus;
  const statusInfo = statusConfig[normalizedStatus] || statusConfig.plan_to_watch;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-shadow">
      <div className="flex items-center p-4">
        <div className="flex-shrink-0 relative">
          <Link to={`/anime/${anime.id}`} className="block">
            {anime.image ? (
              <img
                src={anime.image}
                alt={anime.title}
                className="h-32 w-24 object-cover rounded-lg shadow-sm hover:opacity-90 transition-opacity"
              />
            ) : (
              <div className="h-32 w-24 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white text-2xl font-bold">
                {anime.title.charAt(0).toUpperCase()}
              </div>
            )}
          </Link>
          <button
            onClick={() => navigate(`/watch/${anime.id}`)}
            className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 hover:opacity-100 transition-opacity rounded-lg"
            title="Watch now"
          >
            <FaPlay className="h-8 w-8 text-white" />
          </button>
        </div>

        <div className="ml-4 flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0 pr-4">
              <Link to={`/anime/${anime.id}`}>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors truncate">
                  {anime.title}
                </h3>
              </Link>

              <div className="mt-2 flex items-center space-x-3">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusInfo.className}`}>
                  {statusInfo.label}
                </span>

                {anime.rating !== undefined && (
                  <div className="flex items-center text-yellow-500">
                    <FaStar className="h-4 w-4 mr-1" />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{anime.rating}</span>
                  </div>
                )}
              </div>

              <div className="mt-3">
                <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mb-1">
                  <span>
                    {anime.currentEpisode} / {anime.totalEpisodes} episodes
                  </span>
                  <span>{progressPercentage}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-blue-600 dark:bg-blue-500 h-2 rounded-full transition-all"
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="relative" ref={optionsRef}>
              <button
                onClick={() => setShowOptions(!showOptions)}
                className="p-2 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <FaEllipsisV className="h-5 w-5" />
              </button>

              {showOptions && (
                 <div className="absolute right-0 mt-2 w-max max-w-[calc(100vw-2rem)] rounded-lg shadow-lg bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 py-1 z-10">
                  <div className="px-3 py-2 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Change Status
                  </div>
                  <button
                    onClick={() => handleStatusChange("watching")}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 flex items-center"
                  >
                    <FaPlay className="mr-2 h-4 w-4 text-green-500" />
                    Watching
                  </button>
                  <button
                    onClick={() => handleStatusChange("completed")}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 flex items-center"
                  >
                    <FaCheck className="mr-2 h-4 w-4 text-blue-500" />
                    Completed
                  </button>
                  <button
                    onClick={() => handleStatusChange("on_hold")}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 flex items-center"
                  >
                    <FaClock className="mr-2 h-4 w-4 text-yellow-500" />
                    On Hold
                  </button>
                  <button
                    onClick={() => handleStatusChange("dropped")}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 flex items-center"
                  >
                    <FaHeartBroken className="mr-2 h-4 w-4 text-red-500" />
                    Dropped
                  </button>
                  <div className="border-t border-gray-200 dark:border-gray-600 my-1" />
                  <button
                    onClick={handleRemove}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-600 flex items-center"
                  >
                    <FaTrash className="mr-2 h-4 w-4" />
                    Remove
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
