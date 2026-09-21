const { asyncHandler } = require('../utils/asyncHandler');
const apiResponse = require('../utils/apiResponse');
const Watchlist = require('../models/Watchlist');

const VALID_STATUSES = ['watching', 'completed', 'on_hold', 'dropped', 'plan_to_watch'];

exports.addToWatchlist = asyncHandler(async (req, res) => {
  const { animeId, title, image, synopsis, episodes, genres, status } = req.body;

  if (!animeId || !title || !image) {
    return apiResponse.error(res, 400, 'Please provide animeId, title and image');
  }

  if (status !== undefined && !VALID_STATUSES.includes(status)) {
    return apiResponse.error(res, 400, 'Invalid status value');
  }

  const existingEntry = await Watchlist.findOne({
    user: req.user._id,
    animeId
  });

  if (existingEntry) {
    return apiResponse.success(res, 200, 'Anime already in watchlist', existingEntry)
  }

  const watchlistItem = await Watchlist.create({
    user: req.user._id,
    animeId,
    title,
    image,
    synopsis: synopsis || '',
    episodes: episodes || 0,
    genres: genres || [],
    status: status || 'plan_to_watch'
  });

  return apiResponse.success(res, 201, 'Added to watchlist successfully', watchlistItem);
});

exports.getWatchlist = asyncHandler(async (req, res) => {
  const watchlist = await Watchlist.find({ user: req.user._id })
    .populate('user', 'username email')
    .sort({ addedAt: -1 });

  return apiResponse.success(res, 200, 'Watchlist fetched successfully', watchlist);
});

exports.getWatchlistByStatus = asyncHandler(async (req, res) => {
  const status = req.params.status;

  const watchlist = await Watchlist.find({
    user: req.user._id,
    status
  })
    .populate('user', 'username email')
    .sort({ addedAt: -1 });

  return apiResponse.success(res, 200, 'Watchlist fetched successfully', watchlist);
});

exports.updateWatchlistStatus = asyncHandler(async (req, res) => {
  const { status, rating } = req.body;

  const watchlistItem = await Watchlist.findOne({
    _id: req.params.id,
    user: req.user._id
  });

  if (!watchlistItem) {
    return apiResponse.error(res, 404, 'Watchlist item not found');
  }

  if (status !== undefined && !VALID_STATUSES.includes(status)) {
    return apiResponse.error(res, 400, 'Invalid status value');
  }

  if (status !== undefined) watchlistItem.status = status;
  if (rating !== undefined) {
    const numRating = Number(rating)
    if (Number.isNaN(numRating) || numRating < 0 || numRating > 10) {
      return apiResponse.error(res, 400, 'Rating must be a number between 0 and 10')
    }
    watchlistItem.rating = numRating
  }

  await watchlistItem.save();

  return apiResponse.success(res, 200, 'Watchlist updated successfully', watchlistItem);
});

exports.removeFromWatchlist = asyncHandler(async (req, res) => {
  const watchlistItem = await Watchlist.findOne({
    _id: req.params.id,
    user: req.user._id
  });

  if (!watchlistItem) {
    return apiResponse.error(res, 404, 'Watchlist item not found');
  }

  await Watchlist.findByIdAndDelete(req.params.id);

  return apiResponse.success(res, 200, 'Removed from watchlist successfully');
});

exports.clearWatchlist = asyncHandler(async (req, res) => {
  await Watchlist.deleteMany({ user: req.user._id });

  return apiResponse.success(res, 200, 'Watchlist cleared successfully');
});
