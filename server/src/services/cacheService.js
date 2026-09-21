const cache = new Map();

exports.set = (key, value, ttl = 300000) => {
  const expiresAt = Date.now() + ttl;
  cache.set(key, { value, expiresAt });
};

exports.get = (key) => {
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    cache.delete(key);
    return null;
  }
  return entry.value;
};

exports.delete = (key) => {
  cache.delete(key);
};

exports.clear = () => {
  cache.clear();
};

exports.middleware = (req, res, next) => {
  if (req.method !== 'GET') {
    return next();
  }

  const rawUrl = req.originalUrl;
  const [path, query] = rawUrl.split('?');
  const normalizedKey = query
    ? `${path}?${query.split('&').sort().join('&')}`
    : rawUrl;

  const key = normalizedKey;
  const cached = exports.get(key);

  if (cached) {
    return res.json(cached);
  }

  const originalJson = res.json.bind(res);
  res.json = (body) => {
    if (res.statusCode < 400) {
      exports.set(key, body);
    }
    return originalJson(body);
  };

  next();
};
