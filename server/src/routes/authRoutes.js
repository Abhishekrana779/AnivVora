const express = require('express');
const { asyncHandler } = require('../utils/asyncHandler');
const authController = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const { authLimiter } = require('../middleware/rateLimitMiddleware');

const router = express.Router();

router.post('/register', authLimiter, asyncHandler(authController.register));
router.post('/login', authLimiter, asyncHandler(authController.login));
router.post('/logout', asyncHandler(authController.logout));
router.get('/me', protect, asyncHandler(authController.getMe));
router.put('/profile', protect, asyncHandler(authController.updateProfile));
router.put('/change-password', protect, asyncHandler(authController.changePassword));

module.exports = router;
