const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

const errorHandler = (err, req, res, _next) => {
  const statusCode = err?.statusCode || err?.response?.status || (res.statusCode === 200 ? 500 : res.statusCode);
  res.status(statusCode);
  res.json({
    success: false,
    message: err?.message || 'Internal server error',
    stack: process.env.NODE_ENV === 'development' ? err?.stack : null
  });
};

module.exports = { notFound, errorHandler };