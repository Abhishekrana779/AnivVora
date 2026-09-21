const axios = require('axios');
const { asyncHandler } = require('../utils/asyncHandler');
const { error } = require('../utils/apiResponse');

const isManifest = (contentType, url) => {
  const lower = (contentType || '').toLowerCase()
  const ext = (url || '').split('?')[0].split('.').pop()?.toLowerCase()
  return lower.includes('application/vnd.apple.mpegurl') ||
    lower.includes('application/x-mpegurl') ||
    ext === 'm3u8' ||
    ext === 'm3u'
}

const isPrivateIp = (hostname) => {
  if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '::1' || hostname === '[::1]') {
    return true
  }
  if (hostname.startsWith('192.168.') || hostname.startsWith('10.')) {
    return true
  }
  const m172 = hostname.match(/^172\.(\d+)\./)
  if (m172) {
    const octet = parseInt(m172[1], 10)
    if (octet >= 16 && octet <= 31) return true
  }
  if (hostname.startsWith('169.254.')) {
    return true
  }
  return false
}

const validateProxyUrl = (urlString) => {
  try {
    const url = new URL(urlString)
    if (url.protocol !== 'https:' && url.protocol !== 'http:') {
      return false
    }
    if (isPrivateIp(url.hostname)) {
      return false
    }
    return true
  } catch {
    return false
  }
}

const rewriteManifest = (body, baseUrl, referer) => {
  const lines = body.split(/\r?\n/)

  return lines.map((line) => {
    const trimmed = line.trim()

    if (!trimmed || trimmed.startsWith("#")) {
      return line
    }

    const resolvedUrl = /^https?:\/\//i.test(trimmed)
      ? trimmed
      : new URL(trimmed, baseUrl).href

    const params = new URLSearchParams()
    params.set("url", resolvedUrl)

    if (referer) {
      params.set("referer", referer)
    }

    return `/api/video/proxy?${params.toString()}`
  }).join("\n")
}

const BASE_HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
  'Accept': '*/*',
  'Accept-Language': 'en-US,en;q=0.9',
  'Accept-Encoding': 'identity',
  'Connection': 'keep-alive',
  'Sec-Fetch-Dest': 'empty',
  'Sec-Fetch-Mode': 'cors',
  'Sec-Fetch-Site': 'cross-site',
  'Pragma': 'no-cache',
}

const STREAMING_CDN_HOSTS = new Set([
  'commondatastorage.googleapis.com',
  'storage.googleapis.com',
  'storage.cloud.google.com',
])

const buildHeaders = (targetUrl, incomingReq, referer) => {
  const headers = { ...BASE_HEADERS }

  if (referer) {
    headers.Referer = referer

    try {
      const refererUrl = new URL(referer)
      headers.Origin = refererUrl.origin
    } catch {
      // Do NOT fall back to the browser's Origin.
      // Forwarding http://localhost:5173 to a CDN causes 403.
    }
  }

  if (incomingReq?.headers?.range) {
    headers.Range = incomingReq.headers.range
  }

  return headers
}

const proxyRequest = async (videoUrl, incomingReq, referer) => {
  const targetUrl = new URL(videoUrl)

  const headers = buildHeaders(
    targetUrl,
    incomingReq,
    referer
  )

  return axios({
    method: "get",
    url: videoUrl,
    responseType: "stream",
    validateStatus: (status) => status >= 200 && status < 300,
    headers,
    timeout: 30000,
    maxRedirects: 5,
    decompress: false,
  })
}

exports.proxyVideo = asyncHandler(async (req, res) => {
  const videoUrl = req.query.url

  const referer =
    typeof req.query.referer === 'string'
      ? req.query.referer
      : ''

  if (!videoUrl || typeof videoUrl !== 'string') {
    return error(res, 400, 'Video URL is required')
  }

  if (!validateProxyUrl(videoUrl)) {
    return error(res, 400, 'Invalid video URL')
  }

  try {
    const response = await proxyRequest(
      videoUrl,
      req,
      referer
    )

    const contentType =
      response.headers['content-type'] || 'video/mp4'

    const contentLength =
      response.headers['content-length']

    if (response.status === 206) {
      const contentRange =
        response.headers['content-range']

      if (contentRange) {
        res.setHeader('Content-Range', contentRange)
      }

      res.status(206)
    }

    if (isManifest(contentType, videoUrl)) {
      const chunks = []

      response.data.on('data', (chunk) => {
        chunks.push(chunk)
      })

      response.data.on('end', () => {
        const body =
          Buffer.concat(chunks).toString('utf-8')

        const rewritten = rewriteManifest(
          body,
          videoUrl,
          referer
        )

        if (!res.headersSent) {
          res.setHeader(
            'Content-Type',
            'application/vnd.apple.mpegurl'
          )

          res.setHeader(
            'Cache-Control',
            'no-cache'
          )

          res.send(rewritten)
        }
      })

      response.data.on('error', () => {
        if (!res.headersSent) {
          return error(
            res,
            502,
            'Failed to read video manifest'
          )
        }
      })

      req.on('close', () => {
        response.data.destroy()
      })

      return
    }

    if (contentLength) {
      res.setHeader(
        'Content-Length',
        contentLength
      )
    }

    res.setHeader(
      'Content-Type',
      contentType
    )

    res.setHeader(
      'Accept-Ranges',
      'bytes'
    )

    res.setHeader(
      'Cache-Control',
      'public, max-age=3600'
    )

    res.setHeader(
      'Vary',
      'Origin'
    )

    const requestOrigin =
      req.headers.origin ||
      req.headers.referer ||
      '*'

    const allowedOrigins = (process.env.CLIENT_URL || '')
      .split(',')
      .map((u) => u.trim())
      .filter(Boolean)

    const corsOrigin = allowedOrigins.includes(requestOrigin)
      ? requestOrigin
      : allowedOrigins[0] || requestOrigin

    res.setHeader(
      'Access-Control-Allow-Origin',
      corsOrigin
    )

    res.setHeader(
      'Access-Control-Allow-Methods',
      'GET, OPTIONS'
    )

    res.setHeader(
      'Access-Control-Allow-Headers',
      'Origin, Referer, User-Agent, Accept, Range'
    )

    response.data.on('error', () => {
      if (!res.headersSent) {
        return error(
          res,
          502,
          'Failed to stream video'
        )
      }
    })

    req.on('close', () => {
      response.data.destroy()
    })

    response.data.pipe(res)

  } catch (err) {
    if (
      err.code === 'ECONNABORTED' ||
      err.code === 'ETIMEDOUT'
    ) {
      return error(
        res,
        504,
        'Video source timed out. Try again or select another server.'
      )
    }

    const statusCode =
      err.response?.status || 502

    const friendlyMessage =
      statusCode === 403
        ? 'Access to this video source was blocked by the provider. Try another server or source.'
        : statusCode === 404
          ? 'Video not found on this server.'
          : 'Failed to fetch video from the source.'

    return error(
      res,
      statusCode,
      friendlyMessage
    )
  }
})
