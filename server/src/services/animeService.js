const miruro = require('./miruroService');

const transformAnime = (item) => {
  if (!item || !item.title) return null;
  const title = item.title?.romaji || item.title?.english || item.title?.native || 'Unknown';
  const image = item.coverImage?.large || item.coverImage?.extraLarge || item.image || '';
  const banner = item.bannerImage || item.banner || '';
  return {
    id: String(item.id),
    title,
    titleJapanese: item.title?.native,
    synonyms: item.synonyms,
    image,
    banner,
    synopsis: item.synopsis || item.description || '',
    rating: item.averageScore || item.rating,
    episodes: item.episodes,
    duration: item.duration ? `${item.duration} min` : item.duration,
    year: item.seasonYear || item.year,
    type: item.format || item.type,
    status: item.status,
    genres: Array.isArray(item.genres) ? item.genres : [],
    thumbnail: item.coverImage?.large || item.coverImage?.extraLarge || item.thumbnail,
    coverImage: item.coverImage?.large || item.coverImage?.extraLarge || item.coverImage,
    bannerImage: item.bannerImage || item.banner,
    studios: item.studios?.nodes?.map((s) => s.name) || item.studios || [],
    producers: item.producers?.nodes?.map((s) => s.name) || item.producers || [],
    malScore: item.averageScore,
    popularity: item.popularity,
    favorites: item.favourites,
    aired: item.startDate ? `${item.startDate.year}-${String(item.startDate.month).padStart(2, '0')}-${String(item.startDate.day).padStart(2, '0')}` : item.aired,
    description: item.synopsis || item.description || '',
  };
};

const extractArray = (payload) => {
if (Array.isArray(payload)) {
return payload;
}

if (!payload || typeof payload !== 'object') {
return [];
}

if (Array.isArray(payload.data)) {
return payload.data;
}

if (Array.isArray(payload.results)) {
return payload.results;
}

if (Array.isArray(payload.media)) {
return payload.media;
}

if (Array.isArray(payload.Page?.media)) {
return payload.Page.media;
}

if (Array.isArray(payload.data?.Page?.media)) {
return payload.data.Page.media;
}

for (const value of Object.values(payload)) {
if (Array.isArray(value)) {
return value;
}

if (value && typeof value === 'object') {
  const nested = extractArray(value);

  if (nested.length > 0) {
    return nested;
  }
}

}

return [];
};


const unwrap = (result) => {
  if (
    result &&
    typeof result === 'object' &&
    !Array.isArray(result) &&
    'data' in result
  ) {
    return result.data;
  }

  return result;
};

exports.getTrendingAnime = async () => {
try {
const results = await miruro.fetchTrending(1);

console.log(
  '[Trending] Miruro response:',
  JSON.stringify(results, null, 2)
);

const extracted = extractArray(results);

console.log(
  '[Trending] Extracted items:',
  extracted.length
);

const transformed = extracted
  .map(transformAnime)
  .filter(Boolean);

console.log(
  '[Trending] Transformed items:',
  transformed.length
);

return transformed;

} catch (err) {
console.error(
'[Trending] Miruro request failed:',
err?.response?.status || '',
err?.response?.data || err?.message || err
);
throw err;
}
};

exports.getRecentAnime = async () => {
  try {
    const results = await miruro.fetchRecent(1);

    console.log(
      '[Recent] Miruro response:',
      JSON.stringify(results, null, 2)
    );

    const extracted = extractArray(results);

    console.log('[Recent] Extracted items:', extracted.length);

    return extracted
      .map(transformAnime)
      .filter(Boolean);
  } catch (err) {
    console.error(
      '[Recent] Miruro request failed:',
      err?.response?.status || '',
      err?.response?.data || err?.message || err
    );

    throw err;
  }
};

exports.getPopularAnime = async () => {
  try {
    const results = await miruro.fetchPopular(1);

    console.log(
      '[Popular] Miruro response:',
      JSON.stringify(results, null, 2)
    );

    const extracted = extractArray(results);

    console.log('[Popular] Extracted items:', extracted.length);

    return extracted
      .map(transformAnime)
      .filter(Boolean);
  } catch (err) {
    console.error(
      '[Popular] Miruro request failed:',
      err?.response?.status || '',
      err?.response?.data || err?.message || err
    );

    throw err;
  }
};

exports.getAnimeDetails = async (id) => {
  try {
    const results = await miruro.fetchAnimeById(id);
    const transformed = transformAnime(unwrap(results));
    if (transformed) return transformed;
  } catch {
    // ignore
  }

  return {
    id: String(id),
    title: 'Unknown',
    titleJapanese: '',
    synonyms: [],
    image: '',
    banner: '',
    synopsis: '',
    rating: undefined,
    episodes: undefined,
    duration: '',
    year: undefined,
    type: '',
    status: '',
    genres: [],
    thumbnail: '',
    coverImage: '',
    bannerImage: '',
    studios: [],
    producers: [],
    malScore: undefined,
    popularity: undefined,
    favorites: undefined,
    aired: '',
    description: '',
  };
};

exports.searchAnime = async (query, page = 1) => {
  try {
    const results = await miruro.searchAnime(query, page);
    const list = extractArray(results).map(transformAnime).filter(Boolean);
    return {
      data: list,
      page: 1,
      totalPages: 1,
      total: list.length,
      hasNext: false,
      hasPrev: false,
      pages: 1,
    };
  } catch {
    return {
      data: [],
      page: 1,
      totalPages: 1,
      total: 0,
      hasNext: false,
      hasPrev: false,
      pages: 1,
    };
  }
};

exports.getAnimeByGenre = async (genre, page = 1) => {
  try {
    const results = await miruro.fetchByGenre(genre, page);
    const list = extractArray(results).map(transformAnime).filter(Boolean);
    return {
      data: list,
      page: 1,
      totalPages: 1,
      total: list.length,
      hasNext: false,
      hasPrev: false,
      pages: 1,
    };
  } catch {
    return {
      data: [],
      page: 1,
      totalPages: 1,
      total: 0,
      hasNext: false,
      hasPrev: false,
      pages: 1,
    };
  }
};

const DAY_ORDER = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

exports.getAnimeSchedule = async () => {
  try {
    const pages = await Promise.all([
      miruro.fetchSchedule(1),
      miruro.fetchSchedule(2),
      miruro.fetchSchedule(3),
      miruro.fetchSchedule(4),
      miruro.fetchSchedule(5),
    ]);

    const allItems = pages.flatMap((page) => page.results || extractArray(page) || []);
    console.log('[Schedule] Fetched', allItems.length, 'anime from 5 pages')

    if (allItems.length === 0) {
      return DAY_ORDER.map((day) => ({ day, animes: [] }));
    }

    const dayMap = {};

    for (const item of allItems) {
      const anime = transformAnime(item);
      if (!anime) continue;

      let day = 'Unknown';
      if (item.nextAiringEpisode?.airingAt) {
        const date = new Date(item.nextAiringEpisode.airingAt * 1000);
        day = DAY_ORDER[date.getUTCDay()];
      }

      if (!dayMap[day]) dayMap[day] = [];
      dayMap[day].push(anime);
    }

    const schedule = DAY_ORDER.map((day) => ({
      day,
      animes: dayMap[day] || []
    }));

    return schedule;
  } catch (err) {
    return DAY_ORDER.map((day) => ({ day, animes: [] }));
  }
};

exports.getAnimeGenres = async () => {
  try {
    const payload = await miruro.fetchGenres();
    const genres = extractArray(payload);
    return genres.map((g, idx) => ({
      id: String(g.id || idx + 1),
      name: g.name || g.genre || 'Unknown',
      count: g.count || g.amount || 0,
      image: g.image || g.poster || '',
    }));
  } catch {
    return [];
  }
};

exports.getAnimeEpisodes = async (id) => {
  let payload

  try {
    payload = await miruro.fetchEpisodes(id)
  } catch (err) {
    console.error(
      '[Episodes] Miruro fetch failed:',
      err?.message || err
    )

    throw new Error(
      `Failed to fetch episodes for anime ${id}`
    )
  }

  const providers =
    payload?.providers ||
    payload?.data?.providers ||
    {}

  const episodes = []

  for (const [providerName, providerData] of Object.entries(providers)) {
    if (!providerData || typeof providerData !== 'object') {
      continue
    }

    const epCategories = providerData.episodes

    if (!epCategories || typeof epCategories !== 'object') {
      continue
    }

    for (const [category, epList] of Object.entries(epCategories)) {
      if (!Array.isArray(epList)) {
        continue
      }

      for (const ep of epList) {
        if (!ep || typeof ep !== 'object') {
          continue
        }

        if (!ep.id || ep.number == null) {
          continue
        }

        episodes.push({
          id: String(ep.id),
          number: ep.number,
          title: ep.title || `Episode ${ep.number}`,
          thumbnail: ep.image || '',
          duration: ep.duration
            ? `${ep.duration}s`
            : '24 min',
          description: ep.description || '',
          animeId: String(id),
          provider: providerName,
          category,
          servers: [],
          sources: [],
          subtitles: [],
        })
      }
    }
  }

  if (episodes.length > 0) {
    return episodes
  }

  const oldEpisodes =
    payload?.episodes ||
    payload?.data?.episodes ||
    []

  if (Array.isArray(oldEpisodes) && oldEpisodes.length > 0) {
    return oldEpisodes
  }

  throw new Error(
    `No episodes found for anime ${id}`
  )
}


exports.getEpisodeSources = async (animeId, episodeId) => {
  if (!episodeId || typeof episodeId !== 'string') {
    throw new Error('Episode ID is required')
  }

  /*
   * Expected:
   * watch/kiwi/178789/sub/animepahe-1
   */
  const requestedMatch = episodeId.match(
    /^watch\/([^/]+)\/([^/]+)\/([^/]+)\/(.+)$/
  )

  if (!requestedMatch) {
    throw new Error(
      `Invalid Miruro episode ID: ${episodeId}`
    )
  }

  const [
    ,
    requestedProvider,
    requestedAnimeId,
    requestedCategory,
    requestedSlug,
  ] = requestedMatch

  const animeIdString = String(animeId)
  const targetAnimeId = String(requestedAnimeId)

  if (animeIdString !== targetAnimeId) {
    throw new Error(
      `Episode anime ID mismatch: ${animeIdString} !== ${targetAnimeId}`
    )
  }

  /*
   * Extract episode number.
   *
   * animepahe-1
   * anikoto-1
   * allmanga-1
   */
  const episodeNumberMatch = requestedSlug.match(
    /-(\d+(?:\.\d+)?)$/
  )

  if (!episodeNumberMatch) {
    throw new Error(
      `Could not determine episode number from ${requestedSlug}`
    )
  }

  const episodeNumber = episodeNumberMatch[1]

  console.log(
    `[Sources] Anime: ${animeIdString}`
  )

  console.log(
    `[Sources] Episode: ${episodeNumber}`
  )

  console.log(
    `[Sources] Requested provider: ${requestedProvider}`
  )

  /*
   * Fetch all providers so that we can fall back
   * when the requested provider is unavailable.
   */
  let payload

  try {
    payload = await miruro.fetchEpisodes(animeIdString)
  } catch (err) {
    console.error(
      '[Sources] Failed to fetch provider episodes:',
      err?.message || err
    )

    throw new Error(
      `Failed to fetch episode providers: ${
        err?.message || 'Unknown error'
      }`
    )
  }

  const providers =
    payload?.providers ||
    payload?.data?.providers ||
    {}

  /*
   * bee is currently working for this anime.
   *
   * Requested provider is still included so that
   * this works when another provider becomes available.
   */
  const apiProviders = Object.keys(providers)
  const uniqueProviders = [
    requestedProvider,
    ...apiProviders.filter((name) => name !== requestedProvider),
  ]

  let lastError = null

  for (const providerName of uniqueProviders) {
    const providerData = providers[providerName]

    if (
      !providerData ||
      typeof providerData !== 'object'
    ) {
      continue
    }

    const categoryEpisodes =
      providerData?.episodes?.[requestedCategory]

    if (!Array.isArray(categoryEpisodes)) {
      console.log(
        `[Sources] ${providerName}: no ${requestedCategory} episodes`
      )

      continue
    }

    /*
     * Find the same episode number on this provider.
     */
    const episode = categoryEpisodes.find(
      (ep) =>
        ep &&
        String(Number(ep.number)) === String(Number(episodeNumber))
    )

    if (!episode?.id) {
      console.log(
        `[Sources] ${providerName}: episode ${episodeNumber} not found`
      )

      continue
    }

    const watchId = String(episode.id)

    /*
     * Miruro gives us the complete provider-specific
     * watch ID, for example:
     *
     * watch/bee/178789/sub/anikoto-1
     */
    const watchMatch = watchId.match(
      /^watch\/([^/]+)\/([^/]+)\/([^/]+)\/(.+)$/
    )

    if (!watchMatch) {
      console.log(
        `[Sources] ${providerName}: invalid watch ID ${watchId}`
      )

      continue
    }

    const [
      ,
      watchProvider,
      watchAnimeId,
      watchCategory,
      watchSlug,
    ] = watchMatch

    console.log(
      `[Sources] Trying ${watchProvider}/${watchCategory}/${watchSlug}`
    )

    try {
      const response = await miruro.fetchWatchSources(
        watchProvider,
        watchAnimeId,
        watchCategory,
        watchSlug
      )

      const data = response?.data || response

      const streams =
        data?.streams ||
        data?.sources ||
        data?.data?.streams ||
        data?.data?.sources ||
        []

      const subtitles =
        data?.subtitles ||
        data?.tracks ||
        data?.data?.subtitles ||
        data?.data?.tracks ||
        []

      if (
        !Array.isArray(streams) ||
        streams.length === 0
      ) {
        console.log(
          `[Sources] ${providerName}: no streams`
        )

        continue
      }

      const servers = streams
        .map((stream, index) => ({
          id:
            stream.id ||
            `${watchProvider}-${index}`,

          name:
            stream.name ||
            stream.server ||
            stream.provider ||
            `${watchProvider} Server ${index + 1}`,

          url:
            stream.url ||
            stream.file ||
            stream.src ||
            '',

          type:
            stream.type || 'hls',

          quality:
            stream.quality ||
            stream.server ||
            'auto',

          referer:
            stream.referer || '',

          default:
            stream.default === true ||
            index === 0,
        }))
        .filter((server) => server.url)

      if (servers.length === 0) {
        console.log(
          `[Sources] ${providerName}: no playable URLs`
        )

        continue
      }

      const sources = servers.map((server) => ({
        id: server.id,
        url: server.url,
        type: server.type,
        quality: server.quality,
        server: server.name,
        referer: server.referer,
      }))

      console.log(
        `[Sources] SUCCESS: ${watchProvider} returned ${servers.length} streams`
      )

      const normalizedSubtitles = Array.isArray(subtitles)
        ? subtitles.map((sub, index) => ({
            id: sub.id || `${watchProvider}-sub-${index}`,
            language: sub.language || sub.lang || sub.label || `Subtitle ${index + 1}`,
            label: sub.label || `Subtitle ${index + 1}`,
            url: sub.url || sub.file || sub.src || '',
            lang: sub.lang || sub.language || sub.label || `sub-${index}`,
            type: sub.type || 'subtitle',
          }))
        : []

      return {
        servers,
        sources,

        subtitles: normalizedSubtitles,

        provider: watchProvider,

        episodeId: watchId,

        animeId: animeIdString,

        episodeNumber,

        intro: data?.intro || null,

        outro: data?.outro || null,
      }

    } catch (err) {
      lastError = err

      const status =
        err?.response?.status ||
        err?.status ||
        ''

      console.warn(
        `[Sources] ${providerName} failed${
          status ? ` (${status})` : ''
        }:`,
        err?.message || err
      )

      /*
       * Do NOT return here.
       *
       * 444 means this provider failed.
       * Continue to the next provider.
       */
      continue
    }
  }

  console.error(
    '[Sources] All providers failed for:',
    animeIdString,
    episodeNumber
  )

  if (lastError) {
    console.error(
      '[Sources] Last provider error:',
      lastError?.message || lastError
    )
  }

  throw new Error(
    `No working stream provider found for anime ${animeIdString}, episode ${episodeNumber}`
  )
}


exports.getAllAnime = async () => {
  try {
    const payload = await miruro.searchAnime('', 1)

    const list = extractArray(payload)
      .map(transformAnime)
      .filter(Boolean)

    return list
  } catch {
    return []
  }
}
