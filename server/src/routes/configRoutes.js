const express = require('express');
const { asyncHandler } = require('../utils/asyncHandler');
const configController = require('../controllers/configController');

const router = express.Router();

router.get('/anime-types', asyncHandler(configController.getAnimeTypes));
router.get('/anime-statuses', asyncHandler(configController.getAnimeStatuses));
router.get('/servers', asyncHandler(configController.getServers));
router.get('/subtitle-langs', asyncHandler(configController.getSubtitleLangs));
router.get('/video-qualities', asyncHandler(configController.getVideoQualities));
router.get('/watchlist-statuses', asyncHandler(configController.getWatchlistStatuses));
router.get('/schedule-days', asyncHandler(configController.getScheduleDays));
router.get('/about', asyncHandler(configController.getAbout));

module.exports = router;
