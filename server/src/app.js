const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { config } = require('./config/env');
const { generalLimiter, videoProxyLimiter, authLimiter } = require('./middleware/rateLimitMiddleware');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const animeRoutes = require('./routes/animeRoutes');
const historyRoutes = require('./routes/historyRoutes');
const watchlistRoutes = require('./routes/watchlistRoutes');
const videoRoutes = require('./routes/videoRoutes');
const configRoutes = require('./routes/configRoutes');

const app = express();

app.set('trust proxy', 1);

app.use(cors({
  origin: config.clientUrl,
  credentials: true
}));

app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

app.use('/api', generalLimiter);

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/anime', animeRoutes);
app.use('/api/history', historyRoutes);
app.use('/api/watchlist', watchlistRoutes);
app.use('/api/video', videoProxyLimiter, videoRoutes);
app.use('/api/config', configRoutes);

app.use(notFound);

app.use(errorHandler);

module.exports = app;