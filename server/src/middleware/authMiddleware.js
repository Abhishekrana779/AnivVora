const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { config } = require('../config/env');

const extractToken = (req) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.split(' ')[1];
  }
  const token = req.cookies.token;
  console.log('[AuthMiddleware] Cookies:', req.cookies, 'AuthHeader:', authHeader, 'ExtractedToken:', token ? 'present' : 'missing')
  return token;
};

const verifyToken = (token) => {
  return jwt.verify(token, config.jwtSecret);
};

exports.protect = async (req, res, next) => {
  try {
    let token = extractToken(req);
    console.log('[AuthMiddleware] protect - token found:', !!token, 'url:', req.url)
    if (!token) {
      return res.status(401).json({ success: false, message: 'Not authorized to access this route' });
    }
    const decoded = verifyToken(token);
    const user = await User.findById(decoded.id);
    console.log('[AuthMiddleware] protect - user found:', !!user, 'userId:', decoded.id)
    if (!user) {
      return res.status(401).json({ success: false, message: 'User not found' });
    }
    req.user = user;
    next();
  } catch (error) {
    console.error('[AuthMiddleware] protect - error:', error.message)
    return res.status(401).json({ success: false, message: 'Not authorized to access this route' });
  }
};

exports.optionalAuth = async (req, res, next) => {
  try {
    const token = extractToken(req);
    if (!token) {
      return next();
    }
    const decoded = verifyToken(token);
    const user = await User.findById(decoded.id).select('-password');
    if (user) {
      req.user = user;
    }
    next();
  } catch (error) {
    next();
  }
};

exports.admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    return next();
  }
  return res.status(403).json({ success: false, message: 'Not authorized as admin' });
};