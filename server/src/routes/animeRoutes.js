const express = require('express');
const { asyncHandler } = require('../utils/asyncHandler');
const animeController = require('../controllers/animeController');
const { optionalAuth } = require('../middleware/authMiddleware');
const cache = require('../services/cacheService');

const router = express.Router();

router.use(optionalAuth);

router.get('/trending', cache.middleware, asyncHandler(animeController.fetchTrending));
router.get('/recent', cache.middleware, asyncHandler(animeController.fetchRecent));
router.get('/popular', cache.middleware, asyncHandler(animeController.fetchPopular));
router.get('/search', asyncHandler(animeController.searchAnime));
router.get('/schedule', cache.middleware, asyncHandler(animeController.fetchSchedule));
router.get('/genres', cache.middleware, asyncHandler(animeController.fetchGenres));
router.get('/genre/:genre', cache.middleware, asyncHandler(animeController.fetchByGenre));
router.get('/:id/episodes', cache.middleware, asyncHandler(animeController.fetchEpisodes));
router.post('/:id/episodes/sources', asyncHandler(animeController.fetchEpisodeSources));
router.get('/:id', cache.middleware, asyncHandler(animeController.fetchAnimeById));
router.get('/', cache.middleware, asyncHandler(animeController.fetchAll));

module.exports = router;
