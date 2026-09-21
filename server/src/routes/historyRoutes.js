const express = require('express');
const { asyncHandler } = require('../utils/asyncHandler');
const historyController = require('../controllers/historyController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);

router.post('/', asyncHandler(historyController.addToHistory));
router.get('/', asyncHandler(historyController.getHistory));
router.get('/anime/:animeId', asyncHandler(historyController.getHistoryByAnime));
router.put('/:id', asyncHandler(historyController.updateHistoryProgress));
router.delete('/:id', asyncHandler(historyController.deleteHistoryItem));
router.delete('/', asyncHandler(historyController.clearHistory));

module.exports = router;
