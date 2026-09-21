const express = require('express');
const { asyncHandler } = require('../utils/asyncHandler');
const watchlistController = require('../controllers/watchlistController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);

router.post('/', asyncHandler(watchlistController.addToWatchlist));
router.get('/', asyncHandler(watchlistController.getWatchlist));
router.get('/status/:status', asyncHandler(watchlistController.getWatchlistByStatus));
router.put('/:id/status', asyncHandler(watchlistController.updateWatchlistStatus));
router.delete('/:id', asyncHandler(watchlistController.removeFromWatchlist));
router.delete('/', asyncHandler(watchlistController.clearWatchlist));

module.exports = router;
