const { asyncHandler } = require('../utils/asyncHandler');
const apiResponse = require('../utils/apiResponse');
const configService = require('../services/configService');

exports.getAnimeTypes = asyncHandler(async (req, res) => {
  const data = await configService.getAnimeTypes();
  return apiResponse.success(res, 200, 'Anime types fetched successfully', data);
});

exports.getAnimeStatuses = asyncHandler(async (req, res) => {
  const data = await configService.getAnimeStatuses();
  return apiResponse.success(res, 200, 'Anime statuses fetched successfully', data);
});

exports.getServers = asyncHandler(async (req, res) => {
  const data = await configService.getServers();
  return apiResponse.success(res, 200, 'Servers fetched successfully', data);
});

exports.getSubtitleLangs = asyncHandler(async (req, res) => {
  const data = await configService.getSubtitleLangs();
  return apiResponse.success(res, 200, 'Subtitle languages fetched successfully', data);
});

exports.getVideoQualities = asyncHandler(async (req, res) => {
  const data = await configService.getVideoQualities();
  return apiResponse.success(res, 200, 'Video qualities fetched successfully', data);
});

exports.getWatchlistStatuses = asyncHandler(async (req, res) => {
  const data = await configService.getWatchlistStatuses();
  return apiResponse.success(res, 200, 'Watchlist statuses fetched successfully', data);
});

exports.getScheduleDays = asyncHandler(async (req, res) => {
  const data = await configService.getScheduleDays();
  return apiResponse.success(res, 200, 'Schedule days fetched successfully', data);
});

exports.getAbout = asyncHandler(async (req, res) => {
  const data = await configService.getAbout();
  return apiResponse.success(res, 200, 'About data fetched successfully', data);
});
