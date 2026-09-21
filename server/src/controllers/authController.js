const { asyncHandler } = require('../utils/asyncHandler');
const apiResponse = require('../utils/apiResponse');
const User = require('../models/User');
const { generateToken } = require('../utils/generateToken');

exports.register = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return apiResponse.error(res, 400, 'Please provide username, email and password');
  }

  const normalizedEmail = email.toLowerCase().trim();
  const normalizedUsername = username.trim();
  const existingUser = await User.findOne({
    $or: [{ email: { $eq: normalizedEmail } }, { username: { $eq: normalizedUsername } }]
  });
  if (existingUser) {
    const field = existingUser.email === normalizedEmail ? 'email' : 'username';
    return apiResponse.error(res, 400, `User already exists with this ${field}`);
  }

  const user = await User.create({ username: normalizedUsername, email: normalizedEmail, password });

  const token = generateToken(user._id);


  return apiResponse.success(res, 201, 'User registered successfully', {
    token,
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
      avatar: user.avatar,
      role: user.role
    }
  });
});

exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return apiResponse.error(res, 400, 'Please provide email and password');
  }

  const normalizedEmail = email.toLowerCase();
  const user = await User.findOne({ email: normalizedEmail }).select('+password');

  if (!user) {
    return apiResponse.error(res, 401, 'Invalid credentials');
  }

  if (user.lockUntil && user.lockUntil > Date.now()) {
    return apiResponse.error(res, 423, 'Account temporarily locked due to too many failed attempts. Please try again later.');
  }

  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    user.failedLoginAttempts = (user.failedLoginAttempts || 0) + 1;
    if (user.failedLoginAttempts >= 5) {
      user.lockUntil = Date.now() + 15 * 60 * 1000;
    }
    await user.save();
    return apiResponse.error(res, 401, 'Invalid credentials');
  }

  user.failedLoginAttempts = 0;
  user.lockUntil = undefined;
  await user.save();

  const token = generateToken(user._id);


  return apiResponse.success(res, 200, 'Login successful', {
    token,
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
      avatar: user.avatar,
      role: user.role
    }
  });
});

exports.logout = asyncHandler(async (req, res) => {
  return apiResponse.success(res, 200, 'Logged out successfully');
});


exports.getMe = asyncHandler(async (req, res) => {
  return apiResponse.success(res, 200, 'User fetched successfully', {
    id: req.user._id,
    username: req.user.username,
    email: req.user.email,
    avatar: req.user.avatar,
    role: req.user.role
  });
});

exports.updateProfile = asyncHandler(async (req, res) => {
  const { username, avatar } = req.body;

  const allowedFields = {};
  if (username !== undefined) allowedFields.username = username.trim();
  if (avatar !== undefined) {
    if (typeof avatar !== 'string' || avatar.length > 2048) {
      return apiResponse.error(res, 400, 'Invalid avatar URL');
    }
    allowedFields.avatar = avatar;
  }

  if (username !== undefined) {
    const existing = await User.findOne({ username: username.trim(), _id: { $ne: req.user._id } });
    if (existing) {
      return apiResponse.error(res, 400, 'Username is already taken');
    }
  }

  const user = await User.findByIdAndUpdate(req.user._id, allowedFields, {
    new: true,
    runValidators: true
  });

  return apiResponse.success(res, 200, 'Profile updated successfully', {
    id: user._id,
    username: user.username,
    email: user.email,
    avatar: user.avatar,
    role: user.role
  });
});

exports.changePassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword) {
    return apiResponse.error(res, 400, 'Please provide old and new password');
  }

  if (newPassword.length < 6) {
    return apiResponse.error(res, 400, 'New password must be at least 6 characters');
  }

  const user = await User.findById(req.user._id).select('+password');
  const isPasswordCorrect = await user.comparePassword(oldPassword);
  if (!isPasswordCorrect) {
    return apiResponse.error(res, 401, 'Old password is incorrect');
  }

  const isSamePassword = await user.comparePassword(newPassword);
  if (isSamePassword) {
    return apiResponse.error(res, 400, 'New password must be different from current password');
  }

  user.password = newPassword;
  await user.save();

  return apiResponse.success(res, 200, 'Password changed successfully');
});
