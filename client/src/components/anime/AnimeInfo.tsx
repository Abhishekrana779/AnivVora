import { useState } from "react";
import { Link } from "react-router-dom";
import { FiPlay, FiPlus, FiShare2, FiChevronRight } from "react-icons/fi";
import { FaFacebook, FaTwitter, FaReddit, FaTelegram } from "react-icons/fa";
import type { Anime } from "../../types";

interface AnimeInfoProps {
  anime: Anime;
  onWatch?: () => void;
  onAddToList?: () => void;
}

export function AnimeInfo({ anime, onWatch, onAddToList }: AnimeInfoProps) {
  const [expanded, setExpanded] = useState(false);

  if (!anime) return null;

  const MAX_SYNOPSIS = 300;
  const shouldTruncate = (anime.synopsis || anime.description || "").length > MAX_SYNOPSIS;
  const displaySynopsis = shouldTruncate && !expanded
    ? (anime.synopsis || anime.description || "").slice(0, MAX_SYNOPSIS) + "..."
    : (anime.synopsis || anime.description || "");

  return (
    <div className="bg-slate-900">
      <div className="mx-auto max-w-7xl px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-400 mb-6">
          <Link to="/" className="hover:text-white transition-colors">Home</Link>
          <FiChevronRight className="h-3 w-3" />
          <span className="text-gray-500">{anime.type || "TV"}</span>
          <FiChevronRight className="h-3 w-3" />
          <span className="text-white truncate">{anime.title}</span>
        </nav>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left: Poster */}
          <div className="shrink-0 mx-auto lg:mx-0">
            <div className="relative w-32 sm:w-40 lg:w-52">
              <img
                src={anime.image}
                alt={anime.title}
                className="w-full aspect-[3/4] object-cover rounded-2xl shadow-2xl"
              />
            </div>
          </div>

          {/* Center: Main Content */}
          <div className="flex-1 min-w-0">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
              {anime.title}
            </h1>

            {/* Info Badges */}
            <div className="flex flex-wrap items-center gap-3 mb-6">
              {anime.rating && (
                <span className="inline-flex items-center gap-1 rounded-md bg-red-500/20 px-2 py-1 text-xs font-bold text-red-400 border border-red-500/30">
                  R
                </span>
              )}
              <span className="inline-flex items-center gap-1 rounded-md bg-blue-500/20 px-2 py-1 text-xs font-bold text-blue-400 border border-blue-500/30">
                HD
              </span>
              {anime.episodes && (
                <span className="inline-flex items-center gap-1 rounded-md bg-gray-700/50 px-2 py-1 text-xs font-bold text-gray-300 border border-gray-600/30">
                  {anime.episodes}
                </span>
              )}
              {anime.type && (
                <span className="inline-flex items-center gap-1 rounded-md bg-gray-700/50 px-2 py-1 text-xs font-bold text-gray-300 border border-gray-600/30">
                  {anime.type}
                </span>
              )}
              {anime.duration && (
                <span className="inline-flex items-center gap-1 rounded-md bg-gray-700/50 px-2 py-1 text-xs font-bold text-gray-300 border border-gray-600/30">
                  {anime.duration}
                </span>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 mb-6">
              {onWatch && (
                <button
                  onClick={onWatch}
                  className="flex items-center gap-2 rounded-lg bg-purple-600 px-6 py-2.5 font-semibold text-white hover:bg-purple-700 transition-colors"
                >
                  <FiPlay className="h-4 w-4" />
                  Watch now
                </button>
              )}
              {onAddToList && (
                <button
                  onClick={onAddToList}
                  className="flex items-center gap-2 rounded-lg bg-white/10 px-6 py-2.5 font-semibold text-white hover:bg-white/20 transition-colors border border-white/10"
                >
                  <FiPlus className="h-4 w-4" />
                  Add to List
                </button>
              )}
            </div>

            {/* Description */}
            <div className="mb-6">
              <p className="text-gray-300 leading-relaxed">
                {displaySynopsis}
              </p>
              {shouldTruncate && (
                <button
                  onClick={() => setExpanded(!expanded)}
                   className="mt-2 text-sm text-purple-600 hover:text-purple-700 font-medium"
                >
                  {expanded ? "Show Less" : "+ More"}
                </button>
              )}
            </div>

            {/* Share Section */}
            <div className="flex items-center gap-4">
              <span className="text-sm font-semibold text-gray-400">Share Anime</span>
              <div className="flex items-center gap-2">
                 <button className="p-2 rounded-full bg-blue-600 text-white hover:opacity-80 transition-opacity">
                   <FaFacebook className="h-4 w-4" />
                 </button>
                 <button className="p-2 rounded-full bg-sky-500 text-white hover:opacity-80 transition-opacity">
                   <FaTwitter className="h-4 w-4" />
                 </button>
                 <button className="p-2 rounded-full bg-orange-600 text-white hover:opacity-80 transition-opacity">
                   <FaReddit className="h-4 w-4" />
                 </button>
                 <button className="p-2 rounded-full bg-sky-600 text-white hover:opacity-80 transition-opacity">
                   <FaTelegram className="h-4 w-4" />
                 </button>
                <button className="p-2 rounded-full bg-gray-700 text-gray-300 hover:bg-gray-600 transition-colors">
                  <FiShare2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="w-full lg:w-80 shrink-0 space-y-6">
            {/* Japanese Title */}
            {anime.titleJapanese && (
              <div className="rounded-xl bg-white/5 border border-white/10 p-4">
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Japanese</h3>
                <p className="text-sm text-gray-200">{anime.titleJapanese}</p>
              </div>
            )}

            {/* Synonyms */}
            {anime.synonyms && (
              <div className="rounded-xl bg-white/5 border border-white/10 p-4">
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Synonyms</h3>
                <p className="text-sm text-gray-200">{anime.synonyms}</p>
              </div>
            )}

            {/* Aired */}
            {anime.aired && (
              <div className="rounded-xl bg-white/5 border border-white/10 p-4">
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Aired</h3>
                <p className="text-sm text-gray-200">{anime.aired}</p>
              </div>
            )}

            {/* Duration */}
            {anime.duration && (
              <div className="rounded-xl bg-white/5 border border-white/10 p-4">
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Duration</h3>
                <p className="text-sm text-gray-200">{anime.duration}</p>
              </div>
            )}

            {/* Status */}
            {anime.status && (
              <div className="rounded-xl bg-white/5 border border-white/10 p-4">
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Status</h3>
                <p className="text-sm text-gray-200">{anime.status}</p>
              </div>
            )}

            {/* MAL Score */}
            {anime.malScore && (
              <div className="rounded-xl bg-white/5 border border-white/10 p-4">
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">MAL Score</h3>
                <p className="text-sm text-gray-200">{anime.malScore.toFixed(2)}</p>
              </div>
            )}

            {/* Genres */}
            {anime.genres && anime.genres.length > 0 && (
              <div className="rounded-xl bg-white/5 border border-white/10 p-4">
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Genres</h3>
                <div className="flex flex-wrap gap-2">
                  {anime.genres.map((genre) => (
                    <Link
                      key={genre}
                      to={`/genre/${encodeURIComponent(genre)}`}
                      className="rounded-lg bg-slate-800 px-3 py-1.5 text-xs font-medium text-gray-300 hover:bg-slate-700 transition-colors border border-white/5"
                    >
                      {genre}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Studios */}
            {anime.studios && anime.studios.length > 0 && (
              <div className="rounded-xl bg-white/5 border border-white/10 p-4">
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Studios</h3>
                <p className="text-sm text-gray-200">{anime.studios.join(", ")}</p>
              </div>
            )}

            {/* Producers */}
            {anime.producers && anime.producers.length > 0 && (
              <div className="rounded-xl bg-white/5 border border-white/10 p-4">
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Producers</h3>
                <p className="text-sm text-gray-200">{anime.producers.join(", ")}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}