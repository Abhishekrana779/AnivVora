/* eslint-disable react/set-state-in-effect */
import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  FaDownload,
  FaShare,
  FaFlag,
  FaFilter,
  FaClosedCaptioning,
  FaServer,
  FaPlay,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import { animeApi } from "../api/animeApi";
import { VideoPlayer } from "../components/player/VideoPlayer";
import { SubtitleSelector } from "../components/player/SubtitleSelector";
import { ServerSelector } from "../components/player/ServerSelector";
import type { Anime, Episode, Server } from "../types";

const encodeEpisodeId = (id: string) => id.replace(/\//g, "~");
const decodeEpisodeId = (id: string) => id.replace(/~/g, "/");

export default function Watch() {
  const { animeId, episodeId } = useParams<{
    animeId: string;
    episodeId?: string;
  }>();
  const decodedEpisodeId = episodeId ? decodeEpisodeId(episodeId) : undefined;
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [anime, setAnime] = useState<Anime | null>(null);
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [currentEpisode, setCurrentEpisode] = useState<Episode | null>(null);
  const [selectedSubtitle, setSelectedSubtitle] = useState<string>("off");
  const [error, setError] = useState<string | null>(null);
  const [autoplay, setAutoplay] = useState(true);
  const [autoSkip, setAutoSkip] = useState(false);
  const [shortcuts, setShortcuts] = useState(true);
  const [lightsOff, setLightsOff] = useState(false);
  const [filterText, setFilterText] = useState("");
  const [episodePage, setEpisodePage] = useState(0);
  const [recommendations, setRecommendations] = useState<Anime[]>([]);
  const [userSelectedServer, setUserSelectedServer] = useState<string>("");
  const videoRef = useRef<HTMLVideoElement>(null);
  const episodeListRef = useRef<HTMLDivElement>(null);
  const currentAnimeRef = useRef<string | null>(null);

  useEffect(() => {
    if (animeId && animeId !== currentAnimeRef.current) {
      setUserSelectedServer("");
      setSelectedSubtitle("off");
      currentAnimeRef.current = animeId;
    }
  }, [animeId]);

  const currentEpisodeRef = useRef(currentEpisode);
  const episodesRef = useRef(episodes);

  useEffect(() => {
    currentEpisodeRef.current = currentEpisode;
  }, [currentEpisode]);

  useEffect(() => {
    episodesRef.current = episodes;
  }, [episodes]);

  // eslint-disable-next-line react/set-state-in-effect
  useEffect(() => {
    if (!animeId) return;

    let cancelled = false;
    setLoading(true);
    setError(null);

    const fetchData = async () => {
      let eps, animeData, trending;

      try {
        eps = await animeApi.getAnimeEpisodes(animeId);
      } catch (err) {
        if (cancelled) return;
        setError(
          err instanceof Error ? err.message : "Failed to load episodes",
        );
        setLoading(false);
        return;
      }

      try {
        animeData = await animeApi.getAnimeDetails(animeId);
      } catch (err) {
        if (cancelled) return;
        setError(
          err instanceof Error ? err.message : "Failed to load anime details",
        );
        setLoading(false);
        return;
      }

      try {
        trending = await animeApi.getTrending();
      } catch {
        if (!cancelled) setRecommendations([]);
      }

      if (cancelled) return;

      const episodeList = Array.isArray(eps)
        ? eps
        : (eps as { episodes?: Episode[] })?.episodes || [];
      setEpisodes(episodeList);
      if (animeData) setAnime(animeData);
      if (Array.isArray(trending)) setRecommendations(trending.slice(0, 6));

      const targetId = decodedEpisodeId || episodeList[0]?.id?.toString();
      const found =
        episodeList.find((e) => e.id?.toString() === targetId) ||
        episodeList[0] ||
        null;

      const currentEpisodeId = currentEpisodeRef.current?.id?.toString();
      if (!currentEpisodeId || String(found?.id) !== currentEpisodeId) {
        setCurrentEpisode(found);
      }

      const servers = found?.servers;
      const firstServer =
        servers?.[0]?.id ||
        servers?.[0]?.url ||
        (found?.sources?.length ? "default" : "");
      setUserSelectedServer(firstServer);

      setLoading(false);
    };

    fetchData();

    return () => {
      cancelled = true;
    };
  }, [animeId, decodedEpisodeId]);

  useEffect(() => {
    if (
      !currentEpisode ||
      currentEpisode.servers?.length ||
      currentEpisode.sources?.length
    )
      return;
    if (!animeId) return;

    let cancelled = false;

    const fetchSources = async () => {
      try {
        const sources = await animeApi.getEpisodeSources(
          animeId,
          String(currentEpisode.id),
        );
        if (cancelled) return;
        if (sources.error) {
          setError(sources.error);
          return;
        }
        const updatedEp = { ...currentEpisode, ...sources };
        setCurrentEpisode(updatedEp);
        setEpisodes((prev) =>
          prev.map((e) => (e.id === currentEpisode.id ? updatedEp : e)),
        );
        setUserSelectedServer(sources.servers?.[0]?.id || "default");
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load episode sources",
        );
      }
    };

    fetchSources();

    return () => {
      cancelled = true;
    };
  }, [currentEpisode, animeId]);

  const handleSelectEpisode = useCallback(
    (ep: Episode) => {
      setCurrentEpisode(ep);
      const servers = ep.servers;
      const firstServer =
        servers?.[0]?.id ||
        servers?.[0]?.url ||
        (ep.sources?.length ? "default" : "");
      setUserSelectedServer(firstServer);
      navigate(`/watch/${animeId}/${encodeEpisodeId(String(ep.id))}`, {
        replace: true,
      });
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    [animeId, navigate],
  );

  const handlePreviousEpisode = useCallback(() => {
    if (!currentEpisode || episodes.length === 0) return;
    const currentIndex = episodes.findIndex(
      (e) => String(e.id) === String(currentEpisode.id),
    );
    if (currentIndex > 0) {
      const prev = episodes[currentIndex - 1];
      setCurrentEpisode(prev);
      const servers = prev.servers;
      const firstServer =
        servers?.[0]?.id ||
        servers?.[0]?.url ||
        (prev?.sources?.length ? "default" : "");
      setUserSelectedServer(firstServer);
      navigate(`/watch/${animeId}/${encodeEpisodeId(String(prev.id))}`, {
        replace: true,
      });
    }
  }, [animeId, currentEpisode, episodes, navigate]);

  const handleNextEpisode = useCallback(() => {
    if (!currentEpisode || episodes.length === 0) return;
    const currentIndex = episodes.findIndex(
      (e) => String(e.id) === String(currentEpisode.id),
    );
    if (currentIndex >= 0 && currentIndex < episodes.length - 1) {
      const next = episodes[currentIndex + 1];
      setCurrentEpisode(next);
      const servers = next.servers;
      const firstServer =
        servers?.[0]?.id ||
        servers?.[0]?.url ||
        (next?.sources?.length ? "default" : "");
      setUserSelectedServer(firstServer);
      navigate(`/watch/${animeId}/${encodeEpisodeId(String(next.id))}`, {
        replace: true,
      });
    }
  }, [animeId, currentEpisode, episodes, navigate]);

  const handleVideoEnded = useCallback(() => {
    const ep = currentEpisodeRef.current;
    const eps = episodesRef.current;
    if (!ep || eps.length === 0) return;
    if (!autoSkip) return;
    const currentIndex = eps.findIndex((e) => String(e.id) === String(ep.id));
    if (currentIndex >= 0 && currentIndex < eps.length - 1) {
      const next = eps[currentIndex + 1];
      setCurrentEpisode(next);
      const servers = next.servers;
      const firstServer =
        servers?.[0]?.id ||
        servers?.[0]?.url ||
        (next.sources?.length ? "default" : "");
      setUserSelectedServer(firstServer);
      navigate(`/watch/${animeId}/${encodeEpisodeId(String(next.id))}`, {
        replace: true,
      });
    }
  }, [animeId, navigate, autoSkip]);

  const handleSkipForward = useCallback((seconds: number) => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = Math.min(
      video.duration || 0,
      video.currentTime + seconds,
    );
  }, []);

  const handleScreenshot = useCallback(() => {
    const video = videoRef.current;
    if (!video || !currentEpisode || video.readyState < 2) return;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const safeTitle = (anime?.title || "episode")
      .replace(/[^a-z0-9]/gi, "_")
      .substring(0, 50);
    const link = document.createElement("a");
    link.download = `screenshot-${safeTitle}-ep${currentEpisode.number}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  }, [currentEpisode, anime]);

  const handleSettings = useCallback(() => {
    alert("Settings panel coming soon");
  }, []);

  const visibleEpisodes = useMemo(() => {
    const seen = new Set<number>()
    let filtered = episodes
      .filter((ep) => {
        if (seen.has(ep.number)) return false
        seen.add(ep.number)
        return true
      })
      .filter((ep) => {
        if (anime?.episodes && anime.episodes > 0) {
          return ep.number <= anime.episodes
        }
        return true
      })
    if (filterText) {
      const q = filterText.toLowerCase();
      filtered = filtered.filter(
        (e) =>
          String(e.number).includes(q) ||
          (e.title || "").toLowerCase().includes(q),
      );
    }
    return filtered;
  }, [episodes, filterText, anime]);

  // eslint-disable-next-line react/set-state-in-effect
  useEffect(() => {
    setEpisodePage(0);
  }, [filterText]);

  const EPISODES_PER_PAGE = 100;

  const totalPages = Math.max(
    1,
    Math.ceil(visibleEpisodes.length / EPISODES_PER_PAGE),
  );
  const safePage = Math.min(episodePage, totalPages - 1);
  const pageStart = safePage * EPISODES_PER_PAGE;
  const pageEnd = Math.min(
    pageStart + EPISODES_PER_PAGE,
    visibleEpisodes.length,
  );
  const pageEpisodes = visibleEpisodes.slice(pageStart, pageEnd);

  const handlePageChange = useCallback(
    (newPage: number) => {
      setEpisodePage(Math.max(0, Math.min(newPage, totalPages - 1)));
    },
    [totalPages],
  );

  const currentEpisodeIndex = episodes.findIndex(
    (e) => String(e.id) === String(currentEpisode?.id)
  );
  const hasPrevEpisode = currentEpisodeIndex > 0;
  const hasNextEpisode = currentEpisodeIndex >= 0 && currentEpisodeIndex < episodes.length - 1;

  const availableServers: Server[] = useMemo(() => {
    return currentEpisode?.servers?.length
      ? currentEpisode.servers
      : currentEpisode?.sources?.length
        ? [
            {
              id: "default",
              name: "Default",
              url: currentEpisode.sources[0],
              status: "online" as const,
            },
          ]
        : [];
  }, [currentEpisode]);

  const availableSubtitles = useMemo(() => currentEpisode?.subtitles || [], [currentEpisode])

  const getProxiedUrl = (url?: string, referer?: string) => {
    if (!url) return "";

    if (url.startsWith("http://") || url.startsWith("https://")) {
      const params = new URLSearchParams();
      params.set("url", url);

      if (referer) {
        params.set("referer", referer);
      }

      return `/api/video/proxy?${params.toString()}`;
    }

    return url;
  };

  const getProxiedSubtitleUrl = (url?: string, referer?: string) => {
    if (!url) return "";
    if (url.startsWith("http://") || url.startsWith("https://")) {
      const params = new URLSearchParams()
      params.set("url", url)

      if (referer) {
        params.set("referer", referer)
      }

      return `/api/video/proxy?${params.toString()}`
    }
    return url
  };

  const selectedServerData = useMemo(() => {
    if (userSelectedServer && userSelectedServer !== "default") {
      return (availableServers || []).find((s) => s.id === userSelectedServer) || null;
    }
    return (availableServers || [])[0] || null;
  }, [userSelectedServer, availableServers]);

  const proxiedSubtitles = useMemo(() => {
    return availableSubtitles.map((sub) => ({
      ...sub,
      url: getProxiedSubtitleUrl(sub.url, selectedServerData?.referer),
    }))
  }, [availableSubtitles, selectedServerData])

  const videoSrc = useMemo(() => {
    if (currentEpisode?.servers?.length) {
      const server = selectedServerData || currentEpisode.servers[0]
      return getProxiedUrl(server?.url, server?.referer)
    }

    return getProxiedUrl(currentEpisode?.sources?.[0]) || ""
  }, [selectedServerData, currentEpisode])

  return (
    <div className="min-h-screen bg-gray-950">
      <div className="flex flex-col lg:flex-row">
          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Video Player */}
            <div className="relative bg-black">
              {loading || !currentEpisode ? (
                <div className="aspect-video flex items-center justify-center">
                  {loading ? (
                    <div className="h-12 w-12 animate-spin rounded-full border-4 border-purple-600 border-t-transparent" />
                  ) : (
                    <p className="text-center text-gray-400">{error || "No episode selected"}</p>
                  )}
                </div>
              ) : !videoSrc && !error ? (
                <div className="aspect-video flex items-center justify-center">
                  <div className="text-center">
                    <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-purple-600 border-t-transparent" />
                    <p className="text-sm text-gray-400">Loading video sources...</p>
                  </div>
                </div>
              ) : (
                <VideoPlayer
                  key={currentEpisode?.id}
                  ref={videoRef}
                  src={videoSrc}
                  poster={currentEpisode.thumbnail}
                  onEnded={handleVideoEnded}
                  subtitles={proxiedSubtitles}
                  selectedSubtitle={selectedSubtitle}
                  autoPlay={autoplay}
                  error={error || undefined}
                  onSkipForward={handleSkipForward}
                  onPreviousEpisode={handlePreviousEpisode}
                  onScreenshot={handleScreenshot}
                  onSettings={handleSettings}
                />
              )}
            </div>

            {/* Controls Bar */}
            {currentEpisode && (
            <div className="border-b border-gray-800 px-3 sm:px-4 py-2">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-3 sm:gap-4 overflow-x-auto no-scrollbar">
                  <button className="text-gray-400 hover:text-white shrink-0">
                    <FaPlay className="h-3.5 w-3.5" />
                  </button>
                  <label className="flex items-center gap-1.5 cursor-pointer shrink-0">
                    <input
                      type="checkbox"
                      checked={autoplay}
                      onChange={(e) => setAutoplay(e.target.checked)}
                      className="accent-purple-500"
                    />
                    <span className="text-xs text-gray-400 whitespace-nowrap">
                      Autoplay
                    </span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer shrink-0 hidden sm:flex">
                    <input
                      type="checkbox"
                      checked={autoSkip}
                      onChange={(e) => setAutoSkip(e.target.checked)}
                      className="accent-purple-500"
                    />
                    <span className="text-xs text-gray-400 whitespace-nowrap">
                      Auto Skip
                    </span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer shrink-0 hidden sm:flex">
                    <input
                      type="checkbox"
                      checked={shortcuts}
                      onChange={(e) => setShortcuts(e.target.checked)}
                      className="accent-purple-500"
                    />
                    <span className="text-xs text-gray-400 whitespace-nowrap">
                      Shortcuts
                    </span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer shrink-0 hidden sm:flex">
                    <input
                      type="checkbox"
                      checked={lightsOff}
                      onChange={(e) => setLightsOff(e.target.checked)}
                      className="accent-purple-500"
                    />
                    <span className="text-xs text-gray-400 whitespace-nowrap">
                      Lights Off
                    </span>
                  </label>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={handlePreviousEpisode}
                    disabled={!hasPrevEpisode}
                    className="text-gray-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <FaChevronLeft className="h-4 w-4" />
                  </button>
                  <span className="text-xs text-gray-500">
                    EP {currentEpisode.number}
                  </span>
                  <button
                    onClick={handleNextEpisode}
                    disabled={!hasNextEpisode}
                    className="text-gray-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <FaChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
            )}

            {/* Episode Info Bar */}
            {currentEpisode && (
            <div className="border-b border-gray-800 px-3 sm:px-4 py-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-3 overflow-x-auto no-scrollbar">
                  <span className="text-xs text-gray-500 shrink-0">
                    EP {currentEpisode.number}
                  </span>
                  <span className="text-xs text-gray-500 whitespace-nowrap hidden sm:inline">
                    Episode {currentEpisode.number}
                    {anime?.aired && ` · ${anime.aired}`}
                  </span>
                </div>
                <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
                  {proxiedSubtitles.length > 0 && (
                    <div className="flex items-center gap-1.5 shrink-0">
                      <FaClosedCaptioning className="h-3.5 w-3.5 text-gray-500" />
                      <SubtitleSelector
                        subtitles={proxiedSubtitles}
                        currentSubtitle={selectedSubtitle}
                        onSelect={setSelectedSubtitle}
                      />
                    </div>
                  )}
                  {availableServers.length > 0 && (
                    <div className="flex items-center gap-1.5 shrink-0">
                      <FaServer className="h-3.5 w-3.5 text-gray-500" />
                      <span className="text-xs text-gray-400 hidden sm:inline">
                        server
                      </span>
                      <ServerSelector
                        servers={availableServers}
                        currentServer={userSelectedServer}
                        onSelect={setUserSelectedServer}
                      />
                    </div>
                  )}
                  <button className="flex items-center gap-1.5 rounded bg-gray-800 px-2 sm:px-3 py-1.5 text-xs text-white hover:bg-gray-700 shrink-0">
                    <FaDownload className="h-3 w-3" />
                    <span className="hidden sm:inline">Download</span>
                  </button>
                  <button className="flex items-center gap-1.5 rounded bg-gray-800 px-2 sm:px-3 py-1.5 text-xs text-white hover:bg-gray-700 shrink-0">
                    <FaShare className="h-3 w-3" />
                    <span className="hidden sm:inline">Share</span>
                  </button>
                </div>
              </div>
            </div>
            )}

            {/* Episode Title & Meta */}
            {currentEpisode && (
            <div className="p-4">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-lg font-bold text-white">
                    {currentEpisode.number}.{" "}
                    {currentEpisode.title ||
                      anime?.title ||
                      `Episode ${currentEpisode.number}`}
                  </h1>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-gray-500">
                      {anime?.aired ||
                        anime?.startDate ||
                        `EP ${currentEpisode.number}`}
                    </span>
                    <span className="text-xs text-gray-500">
                      EP {currentEpisode.number}
                    </span>
                    {availableSubtitles.length > 0 && (
                      <span className="text-xs text-gray-500 flex items-center gap-1">
                        <FaClosedCaptioning className="h-3 w-3" />
                        SUB
                      </span>
                    )}
                    <span className="text-xs text-gray-500">DUB</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="flex items-center gap-1.5 rounded bg-gray-800 px-3 py-1.5 text-xs text-white hover:bg-gray-700">
                    <FaFlag className="h-3 w-3" />
                    <span>Report</span>
                  </button>
                </div>
              </div>

              {/* Anime Info */}
              {anime && (
                <div className="mt-6">
                  <div className="flex gap-4">
                    {/* Poster */}
                    <div className="w-20 xs:w-24 sm:w-32 shrink-0">
                      <div className="relative w-20 xs:w-24 sm:w-32 h-28 xs:h-36 sm:h-48 rounded-md overflow-hidden bg-gray-700">
                        {anime.image && (
                          <img
                            src={anime.image}
                            alt={anime.title}
                            className="h-full w-full object-cover"
                          />
                        )}
                      </div>
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <h2 className="text-xl font-bold text-white mb-1">
                        {anime.title}
                      </h2>
                      <div className="flex flex-wrap items-center gap-2 mb-3">
                        {anime.genres?.slice(0, 5).map((genre) => (
                          <span
                            key={genre}
                            className="text-[10px] text-gray-500 uppercase"
                          >
                            {genre}
                          </span>
                        ))}
                      </div>
                      <p className="text-xs text-gray-400 line-clamp-3 mb-4">
                        {anime.synopsis || anime.description || ""}
                      </p>

                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
                        <div>
                          <span className="block text-[10px] text-gray-500 uppercase tracking-wider">
                            Format
                          </span>
                          <span className="text-xs text-gray-200 font-medium">
                            {anime.type || "TV"}
                          </span>
                        </div>
                        <div>
                          <span className="block text-[10px] text-gray-500 uppercase tracking-wider">
                            Start Date
                          </span>
                          <span className="text-xs text-gray-200 font-medium">
                            {anime?.aired || anime?.startDate || "--"}
                          </span>
                        </div>
                        <div>
                          <span className="block text-[10px] text-gray-500 uppercase tracking-wider">
                            End Date
                          </span>
                          <span className="text-xs text-gray-200 font-medium">
                            --
                          </span>
                        </div>
                        <div>
                          <span className="block text-[10px] text-gray-500 uppercase tracking-wider">
                            Country
                          </span>
                          <span className="text-xs text-gray-200 font-medium">
                            JP
                          </span>
                        </div>
                        <div>
                          <span className="block text-[10px] text-gray-500 uppercase tracking-wider">
                            Status
                          </span>
                          <span className="text-xs text-gray-200 font-medium">
                            {anime.status || "Airing"}
                          </span>
                        </div>
                        <div>
                          <span className="block text-[10px] text-gray-500 uppercase tracking-wider">
                            Episodes
                          </span>
                          <span className="text-xs text-gray-200 font-medium">
                            {anime.episodes || "?"}
                          </span>
                        </div>
                        <div>
                          <span className="block text-[10px] text-gray-500 uppercase tracking-wider">
                            Adult
                          </span>
                          <span className="text-xs text-gray-200 font-medium">
                            {anime?.isAdult ? "Yes" : "No"}
                          </span>
                        </div>
                        {anime.rating !== undefined && anime.rating !== null && (
                          <div>
                            <span className="block text-[10px] text-gray-500 uppercase tracking-wider">
                              Rating
                            </span>
                            <span className="text-xs text-gray-200 font-medium">
                              {anime.rating}/100
                            </span>
                          </div>
                        )}
                        <div>
                          <span className="block text-[10px] text-gray-500 uppercase tracking-wider">
                            Duration
                          </span>
                          <span className="text-xs text-gray-200 font-medium">
                            {anime.duration || "24 min"}
                          </span>
                        </div>
                        <div>
                          <span className="block text-[10px] text-gray-500 uppercase tracking-wider">
                            Season
                          </span>
                          <span className="text-xs text-gray-200 font-medium">
                            {anime?.season || anime?.seasonYear || "--"}
                          </span>
                        </div>
                        {anime.studios && anime.studios.length > 0 && (
                          <div>
                            <span className="block text-[10px] text-gray-500 uppercase tracking-wider">
                              Studios
                            </span>
                            <span className="text-xs text-gray-200 font-medium">
                              {anime.studios.join(", ")}
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <button className="flex items-center gap-2 rounded bg-gray-800 px-4 py-2 text-xs text-white hover:bg-gray-700">
                          TRAILER
                        </button>
                        <button className="flex items-center justify-center w-8 h-8 rounded bg-gray-800 text-white hover:bg-gray-700">
                          +
                        </button>
                        <button className="flex items-center justify-center w-8 h-8 rounded bg-gray-800 text-white hover:bg-gray-700 font-bold text-xs">
                          AL
                        </button>
                        <button className="flex items-center justify-center w-8 h-8 rounded bg-gray-800 text-white hover:bg-gray-700 font-bold text-xs">
                          MAL
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Comments */}
              <div className="mt-6 border-t border-gray-800 pt-4">
                <div className="flex items-center gap-2 mb-3">
                  <h2 className="text-sm font-semibold text-gray-400">
                    Comments
                  </h2>
                  <span className="text-xs text-gray-500">
                    EP {currentEpisode.number} · 2 comments · Tap to join the
                    discussion
                  </span>
                </div>
              </div>

              {/* Related */}
              {recommendations.length > 0 && (
                <div className="mt-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-sm font-bold text-gray-400">
                      RELATED
                    </span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                    {recommendations.map((rec) => (
                      <div
                        key={rec.id}
                        className="flex gap-3 rounded-lg p-2 hover:bg-gray-800/50 transition-colors cursor-pointer"
                        onClick={() => navigate(`/watch/${rec.id}`)}
                      >
                        <div className="relative w-16 h-24 rounded-md overflow-hidden bg-gray-700 shrink-0">
                          {rec.image && (
                            <img
                              src={rec.image}
                              alt={rec.title}
                              className="h-full w-full object-cover"
                            />
                          )}
                        </div>
                        <div className="flex-1 min-w-0 py-0.5">
                          <h4 className="text-xs font-medium text-white truncate">
                            {rec.title}
                          </h4>
                          <p className="text-[10px] text-gray-500 mt-1">
                            {rec.synopsis
                              ? rec.synopsis.substring(0, 60) + "..."
                              : ""}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            {rec.type && (
                              <span className="text-[10px] text-gray-500 uppercase">
                                {rec.type}
                              </span>
                            )}
                            {rec.rating !== undefined && rec.rating !== null && (
                              <span className="text-[10px] text-gray-500 flex items-center gap-1">
                                <span>⭐</span> {rec.rating}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                 </div>
              )}
             </div>
               )}
            </div>

            {/* Right Sidebar - Episode List */}
            {/* Right Sidebar - Episode List */}
          <div className="w-full lg:w-[360px] xl:w-[400px] bg-gray-950 border-l border-gray-800 flex flex-col">
            {/* Header */}
            {currentEpisode && (
            <div className="flex items-center gap-2 p-3 sm:p-4 border-b border-gray-800">
              <div className="flex items-center gap-1 shrink-0">
                <select
                  value={safePage + 1}
                  onChange={(e) => handlePageChange(Number(e.target.value) - 1)}
                  className="bg-gray-800 text-xs text-gray-300 rounded px-2 py-1 outline-none focus:ring-1 focus:ring-purple-500"
                >
                  {visibleEpisodes.length > 0 && Array.from({ length: totalPages }, (_, i) => (
                    <option key={i} value={i + 1}>
                      {i * EPISODES_PER_PAGE + 1}-
                      {Math.min(
                        (i + 1) * EPISODES_PER_PAGE,
                        visibleEpisodes.length,
                      )}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex-1 relative min-w-0">
                <FaFilter className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-500 h-3 w-3" />
                <input
                  type="text"
                  placeholder="Filter episodes..."
                  value={filterText}
                  onChange={(e) => setFilterText(e.target.value)}
                  className="w-full rounded bg-gray-800 pl-8 pr-3 py-1.5 text-xs text-white placeholder-gray-500 outline-none focus:ring-1 focus:ring-purple-500"
                />
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button className="text-gray-400 hover:text-white hidden sm:block">
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5s8.268 2.943 9.542 7c-1.274 4.057-5.065 7-9.542 7s-8.268-2.943-9.542-7z"
                    />
                    <circle
                      cx="12"
                      cy="12"
                      r="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                    />
                  </svg>
                </button>
                <button className="text-gray-400 hover:text-white hidden sm:block">
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                    />
                  </svg>
                </button>
               </div>
             </div>
             )}

             {/* Episode Grid */}
             {currentEpisode && episodes.length > 0 && (
             <div
              ref={episodeListRef}
              className="flex-1 overflow-y-auto p-2 sm:p-3"
            >
              <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-1.5 sm:gap-2">
                {pageEpisodes.map((ep) => {
                  const isCurrent =
                    String(ep.id) === String(currentEpisode?.id);
                  return (
                    <button
                      key={ep.id}
                      onClick={() => handleSelectEpisode(ep)}
                      className={`
                        relative py-2 px-1 rounded text-xs font-medium transition-all
                        ${
                          isCurrent
                            ? "bg-purple-600 text-white"
                            : "bg-gray-950 text-gray-400 hover:bg-gray-800 hover:text-white"
                        }
                      `}
                    >
                      {ep.number}
                      {isCurrent && (
                        <span className="absolute -top-1 -right-1">
                          <svg
                            className="h-3 w-3 text-purple-500"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M8 5v14l11 -7z" />
                          </svg>
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
              {pageEpisodes.length === 0 && (
                <div className="text-center text-gray-500 text-sm py-8 col-span-5">
                  No episodes found
                </div>
               )}
             </div>
             )}
           </div>
       </div>
     </div>
   );
 }
