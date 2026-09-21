const { asyncHandler } = require('../utils/asyncHandler');
const apiResponse = require('../utils/apiResponse');
const animeService = require('../services/animeService');

exports.fetchTrending = asyncHandler(async (req, res) => {
  const data = await animeService.getTrendingAnime();
  return apiResponse.success(res, 200, 'Trending anime fetched successfully', data);
});

exports.fetchRecent = asyncHandler(async (req, res) => {
  const data = await animeService.getRecentAnime();
  return apiResponse.success(res, 200, 'Recent anime fetched successfully', data);
});

exports.fetchPopular = asyncHandler(async (req, res) => {
  const data = await animeService.getPopularAnime();
  return apiResponse.success(res, 200, 'Popular anime fetched successfully', data);
});

exports.fetchAnimeById = asyncHandler(async (req, res) => {
  const data = await animeService.getAnimeDetails(req.params.id);
  return apiResponse.success(res, 200, 'Anime details fetched successfully', data);
});

exports.searchAnime = asyncHandler(async (req, res) => {
  const query = req.query.q;
  const page = parseInt(req.query.page, 10) || 1;

  if (!query) {
    return apiResponse.error(res, 400, 'Please provide a search query');
  }

  if (query.length > 100) {
    return apiResponse.error(res, 400, 'Search query must be 100 characters or less');
  }

  const data = await animeService.searchAnime(query, page);
  return apiResponse.success(res, 200, 'Search results fetched successfully', data);
});

exports.fetchByGenre = asyncHandler(async (req, res) => {
  const genre = req.params.genre;
  const page = parseInt(req.query.page, 10) || 1;

  const data = await animeService.getAnimeByGenre(genre, page);
  return apiResponse.success(res, 200, 'Anime by genre fetched successfully', data);
});

exports.fetchSchedule = asyncHandler(async (req, res) => {
  const data = await animeService.getAnimeSchedule();
  return apiResponse.success(res, 200, 'Schedule fetched successfully', data);
});

exports.fetchGenres = asyncHandler(async (req, res) => {
  const data = await animeService.getAnimeGenres();
  return apiResponse.success(res, 200, 'Genres fetched successfully', data);
});

exports.fetchEpisodes = asyncHandler(async (req, res) => {
  const data = await animeService.getAnimeEpisodes(req.params.id);
  return apiResponse.success(res, 200, 'Episodes fetched successfully', data);
});

exports.fetchEpisodeSources = asyncHandler(async (req, res) => {
  const { episodeId, episode } = req.body
  if (!episodeId) {
    return apiResponse.error(res, 400, 'Episode ID is required')
  }

  const data = await animeService.getEpisodeSources(req.params.id, episodeId)

  if (data?.skipped) {
    return apiResponse.success(res, 200, data.reason || 'No external sources needed', data)
  }

  if (data?.error) {
    return apiResponse.error(res, 502, data.error)
  }

  return apiResponse.success(res, 200, 'Episode sources fetched successfully', data)
})

exports.fetchAll = asyncHandler(async (req, res) => {
  const data = await animeService.getAllAnime();
  return apiResponse.success(res, 200, 'All anime fetched successfully', data);
});
