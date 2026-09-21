const express = require('express');
const { asyncHandler } = require('../utils/asyncHandler');
const videoController = require('../controllers/videoController');
const { optionalAuth } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(optionalAuth);

router.options('/proxy', (req, res) => {
  const allowedOrigins = (process.env.CLIENT_URL || '')
    .split(',')
    .map((u) => u.trim())
    .filter(Boolean)

  const requestOrigin = req.headers.origin || '*'
  const corsOrigin = allowedOrigins.includes(requestOrigin)
    ? requestOrigin
    : allowedOrigins[0] || '*'

  res.setHeader('Access-Control-Allow-Origin', corsOrigin)
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Origin, Referer, User-Agent, Accept, Range')
  res.setHeader('Access-Control-Max-Age', '86400')
  res.status(204).send()
})

router.get('/proxy', asyncHandler(videoController.proxyVideo));

module.exports = router;
