const axios = require('axios');

const rawBaseURL = (process.env.MIRURO_API_URL || 'http://localhost:3000').replace(/\/+$/, '');
const instance = axios.create({
  baseURL: rawBaseURL,
  timeout: 30000,
  headers: {
    accept: 'application/json',
    'accept-language': 'en-US,en;q=0.9',
    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
  },
});

const MAX_RETRIES = 2;
const RETRY_DELAY = 1000;

const shouldRetry = (err) => {
  const status = err?.response?.status;
  return [502, 503, 504, 444].includes(status);
};

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

instance.interceptors.request.use((config) => {
  console.debug('[Miruro Request]', config.method?.toUpperCase(), config.url);
  return config;
});

instance.interceptors.response.use(
  (res) => res.data,
  async (err) => {
    const status = err?.response?.status;
    const url = err?.config?.url;

    if (!shouldRetry(err)) {
      console.error('[Miruro]', status, url, err.response?.data || err.message);
      throw err;
    }

    const { config } = err;
    if (!config || config.__retryCount >= MAX_RETRIES) {
      console.error('[Miruro]', status, url, 'retries exhausted', err.response?.data || err.message);
      throw err;
    }

    config.__retryCount = (config.__retryCount || 0) + 1;
    const delay = RETRY_DELAY * config.__retryCount;
    console.warn('[Miruro]', status, url, `retrying in ${delay}ms`, `attempt ${config.__retryCount}`);
    await sleep(delay);

    return instance(config);
  }
);

const buildEncodedPath = (...segments) =>
  '/' + segments.map((segment) => encodeURIComponent(String(segment))).join('/');

const fetchWatchSources = async (provider, anilistId, category, slug) => {
  const path = buildEncodedPath('watch', provider, anilistId, category, slug);
  return instance.get(path);
};

module.exports = {
  fetchWatchSources,
  get: (...args) => instance.get(...args),
  post: (...args) => instance.post(...args),
};