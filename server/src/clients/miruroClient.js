const axios = require('axios');

const rawBaseURL = (
process.env.MIRURO_API_URL || 'http://localhost:3000'
).replace(/\/+$/, '');

const instance = axios.create({
baseURL: rawBaseURL,
timeout: 30000,
headers: {
accept: 'application/json',
'accept-language': 'en-US,en;q=0.9',
'user-agent':
'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
},
});

const MAX_RETRIES = 2;
const RETRY_DELAY = 1000;

const shouldRetry = (err) => {
const status = err?.response?.status;

return [429, 502, 503, 504, 444].includes(status);
};

const sleep = (ms) =>
new Promise((resolve) => setTimeout(resolve, ms));

instance.interceptors.request.use((config) => {
console.debug(
'[Miruro Request]',
config.method?.toUpperCase(),
config.url,
config.params || ''
);

return config;
});

instance.interceptors.response.use(
(res) => res.data,

async (err) => {
const status = err?.response?.status;
const url = err?.config?.url;

if (!shouldRetry(err)) {
  console.error(
    '[Miruro]',
    status,
    url,
    err?.response?.data || err?.message
  );

  throw err;
}

const { config } = err;

if (!config || config.__retryCount >= MAX_RETRIES) {
  console.error(
    '[Miruro]',
    status,
    url,
    'retries exhausted',
    err?.response?.data || err?.message
  );

  throw err;
}

config.__retryCount = (config.__retryCount || 0) + 1;

const delay = RETRY_DELAY * config.__retryCount;

console.warn(
  '[Miruro]',
  status,
  url,
  `retrying in ${delay}ms`,
  `attempt ${config.__retryCount}`
);

await sleep(delay);

return instance(config);

}
);

const buildEncodedPath = (...segments) =>
'/' +
segments
.filter(
(segment) =>
segment !== undefined &&
segment !== null &&
String(segment).length > 0
)
.map((segment) => encodeURIComponent(String(segment)))
.join('/');

const getPageParams = (page = 1) => ({
page: Math.max(Number(page) || 1, 1),
});

const fetchTrending = async (page = 1) => {
return instance.get('/anime/trending', {
params: getPageParams(page),
});
};

const fetchRecent = async (page = 1) => {
return instance.get('/anime/recent', {
params: getPageParams(page),
});
};

const fetchPopular = async (page = 1) => {
return instance.get('/anime/popular', {
params: getPageParams(page),
});
};

const fetchAnimeById = async (id) => {
if (!id) {
throw new Error('Anime ID is required');
}

return instance.get(
buildEncodedPath('anime', id)
);
};

const searchAnime = async (query, page = 1) => {
if (!query) {
throw new Error('Search query is required');
}

return instance.get('/anime/search', {
params: {
q: query,
page: Math.max(Number(page) || 1, 1),
},
});
};

const fetchByGenre = async (genre, page = 1) => {
if (!genre) {
throw new Error('Genre is required');
}

return instance.get(
buildEncodedPath('anime', 'genre', genre),
{
params: getPageParams(page),
}
);
};

const fetchSchedule = async () => {
return instance.get('/anime/schedule');
};

const fetchGenres = async () => {
return instance.get('/anime/genres');
};

const fetchAllAnime = async (page = 1) => {
return instance.get('/anime', {
params: getPageParams(page),
});
};

const fetchEpisodes = async (animeId) => {
if (!animeId) {
throw new Error('Anime ID is required');
}

return instance.get(
buildEncodedPath('anime', animeId, 'episodes')
);
};

const fetchEpisodeSources = async (
animeId,
episodeId
) => {
if (!animeId) {
throw new Error('Anime ID is required');
}

if (!episodeId) {
throw new Error('Episode ID is required');
}

return instance.post(
buildEncodedPath(
'anime',
animeId,
'episodes',
'sources'
),
{
episodeId,
}
);
};

const fetchWatchSources = async (
provider,
anilistId,
category,
slug
) => {
const path = buildEncodedPath(
'watch',
provider,
anilistId,
category,
slug
);

return instance.get(path);
};

const get = (...args) => instance.get(...args);

const post = (...args) => instance.post(...args);

module.exports = {
fetchTrending,
fetchRecent,
fetchPopular,
fetchAnimeById,
searchAnime,
fetchByGenre,
fetchSchedule,
fetchGenres,
fetchAllAnime,
fetchEpisodes,
fetchEpisodeSources,
fetchWatchSources,
get,
post,
};
