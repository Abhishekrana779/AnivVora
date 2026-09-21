const client = require('../clients/miruroClient');

const isUpstreamUnavailable = (err) => {
  const status = err?.response?.status;
  const code = err?.code;
  return [502, 503, 504, 444].includes(status) || ['ECONNREFUSED', 'ETIMEDOUT', 'ENOTFOUND', 'ECONNRESET'].includes(code);
};

const wrapError = (err, fallbackMessage) => {
  const status = err?.response?.status;
  const message = err?.message || 'Unknown error';

  if (status) {
    return new Error(`${fallbackMessage}: ${status} ${message}`);
  }

  return new Error(`${fallbackMessage}: ${message}`);
};

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const withRetry = async (fn, { retries = 2, baseDelay = 1000 } = {}) => {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await fn();
    } catch (err) {
      if (!isUpstreamUnavailable(err) || attempt === retries) {
        throw err;
      }
      const delay = baseDelay * (attempt + 1);
      console.warn(`[Miruro] upstream unavailable, retrying in ${delay}ms`, err.message);
      await sleep(delay);
    }
  }
};

exports.fetchTrending = async (page = 1) => {
  try {
    return await client.get('/trending', {
      params: {
        page,
        per_page: 20,
      },
    });
  } catch (err) {
    throw wrapError(err, 'Failed to fetch trending anime');
  }
};

exports.fetchRecent = async (page = 1) => {
  try {
    return await client.get('/recent', {
      params: {
        page,
        per_page: 20,
      },
    });
  } catch (err) {
    throw wrapError(err, 'Failed to fetch recent anime');
  }
};

exports.fetchPopular = async (page = 1) => {
  try {
    return await client.get('/popular', {
      params: {
        page,
        per_page: 50,
      },
    });
  } catch (err) {
    throw wrapError(err, 'Failed to fetch popular anime');
  }
};

exports.fetchUpcoming = async (page = 1) => {
  try {
    return await client.get('/upcoming', {
      params: {
        page,
        per_page: 20,
      },
    });
  } catch (err) {
    throw wrapError(err, 'Failed to fetch upcoming anime');
  }
};

exports.fetchAnimeById = async (id) => {
  try {
    return await client.get(`/info/${id}`);
  } catch (err) {
    throw wrapError(err, `Failed to fetch anime details for id ${id}`);
  }
};

exports.searchAnime = async (query, page = 1) => {
  try {
    return await client.get('/search', {
      params: {
        query,
        page,
        per_page: 20,
      },
    });
  } catch (err) {
    throw wrapError(err, 'Failed to search anime');
  }
};

exports.fetchByGenre = async (genre, page = 1) => {
  try {
    return await client.get('/filter', {
      params: {
        genre,
        page,
        per_page: 20,
      },
    });
  } catch (err) {
    throw wrapError(
      err,
      `Failed to fetch anime by genre ${genre}`
    );
  }
};

exports.fetchSchedule = async (page = 1) => {
  try {
    return await client.get('/schedule', {
      params: {
        page,
        per_page: 20,
      },
    });
  } catch (err) {
    throw wrapError(err, 'Failed to fetch schedule');
  }
};

exports.fetchEpisodes = async (id) => {
  try {
    return await client.get(`/episodes/${id}`)
  } catch (err) {
    throw wrapError(
      err,
      `Failed to fetch episodes for anime id ${id}`
    )
  }
}

exports.fetchEpisodeSources = async (episodeId, provider, anilistId, category) => {
  try {
    return await client.get('/sources', {
      params: { episodeId, provider, anilistId: Number(anilistId), category },
    })
  } catch (err) {
    throw wrapError(err, `Failed to fetch episode sources`)
  }
}

exports.fetchWatchSources = async (provider, anilistId, category, slug) => {
  return withRetry(
    async () => client.get(`/watch/${provider}/${anilistId}/${category}/${slug}`),
    { retries: 2, baseDelay: 1000 }
  );
}

exports.fetchGenres = async () => {
  try {
    return await client.get('/genres');
  } catch (err) {
    throw wrapError(err, 'Failed to fetch genres');
  }
};