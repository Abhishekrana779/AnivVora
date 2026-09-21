const { asyncHandler } = require('../utils/asyncHandler');
const apiResponse = require('../utils/apiResponse');
const WatchHistory = require('../models/WatchHistory');

exports.addToHistory = asyncHandler(async (req, res) => {
  const { anime, episode, title, thumbnail, episodeTitle, progress, duration } = req.body;

  if (!anime || episode === undefined) {
    return apiResponse.error(res, 400, 'Please provide anime and episode');
  }

  const animeData = typeof anime === 'string' ? { id: anime, title: title || '', thumbnail: thumbnail || '' } : anime;
  const normalizedAnimeId = animeData.id;

  const existingEntry = await WatchHistory.findOne({
    user: req.user._id,
    anime: normalizedAnimeId,
    episode
  });

  if (existingEntry) {
    existingEntry.progress = progress ?? existingEntry.progress
    existingEntry.duration = duration ?? existingEntry.duration
    existingEntry.watchedAt = new Date()
    await existingEntry.save()
    return apiResponse.success(res, 200, 'History updated successfully', existingEntry)
  }

  const historyItem = await WatchHistory.create({
    user: req.user._id,
    anime: normalizedAnimeId,
    episode,
    title: title || animeData.title || '',
    thumbnail: thumbnail || animeData.thumbnail || '',
    episodeTitle: episodeTitle || '',
    progress: progress || 0,
    duration: duration || 0,
    watchedAt: new Date()
  });

  return apiResponse.success(res, 201, 'Added to history successfully', historyItem);
});

exports.getHistory = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const skip = (page - 1) * limit;

  const [history, total] = await Promise.all([
    WatchHistory.find({ user: req.user._id })
      .populate('user', 'username email')
      .skip(skip)
      .limit(limit)
      .sort({ watchedAt: -1 }),
    WatchHistory.countDocuments({ user: req.user._id })
  ]);

  return apiResponse.success(res, 200, 'History fetched successfully', {
    data: history,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit)
  });
});

exports.getHistoryByAnime = asyncHandler(async (req, res) => {
  const history = await WatchHistory.find({
    user: req.user._id,
    $or: [
      { anime: req.params.animeId },
      { 'anime.id': req.params.animeId }
    ]
  })
    .populate('user', 'username email')
    .sort({ watchedAt: -1 });

  return apiResponse.success(res, 200, 'History fetched successfully', history);
});

exports.updateHistoryProgress = asyncHandler(async (req, res) => {
  const { progress, duration } = req.body;

  const historyItem = await WatchHistory.findOne({
    _id: req.params.id,
    user: req.user._id
  });

  if (!historyItem) {
    return apiResponse.error(res, 404, 'History item not found');
  }

  if (progress !== undefined) historyItem.progress = progress;
  if (duration !== undefined) historyItem.duration = duration;
  historyItem.watchedAt = new Date();

  await historyItem.save();

  return apiResponse.success(res, 200, 'Progress updated successfully', historyItem);
});

exports.deleteHistoryItem = asyncHandler(async (req, res) => {
  const historyItem = await WatchHistory.findOne({
    _id: req.params.id,
    user: req.user._id
  });

  if (!historyItem) {
    return apiResponse.error(res, 404, 'History item not found');
  }

  await WatchHistory.findByIdAndDelete(req.params.id);

  return apiResponse.success(res, 200, 'History item deleted successfully');
});

exports.clearHistory = asyncHandler(async (req, res) => {
  await WatchHistory.deleteMany({ user: req.user._id });

  return apiResponse.success(res, 200, 'History cleared successfully');
});
