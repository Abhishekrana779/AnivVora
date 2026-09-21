const { asyncHandler } = require('../utils/asyncHandler');
const apiResponse = require('../utils/apiResponse');
const User = require('../models/User');

const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

exports.getAllUsers = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const search = req.query.search || '';

  const skip = (page - 1) * limit;

  const query = search
    ? {
        $or: [
          { username: { $regex: escapeRegex(search), $options: 'i' } },
          { email: { $regex: escapeRegex(search), $options: 'i' } }
        ]
      }
    : {};

  const [users, total] = await Promise.all([
    User.find(query)
      .select('-password')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 }),
    User.countDocuments(query)
  ]);

  return apiResponse.success(res, 200, 'Users fetched successfully', {
    data: users,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit)
  });
});

exports.getUserById = asyncHandler(async (req, res) => {
  const isAdmin = req.user?.role === 'admin';
  const isSelf = String(req.params.id) === String(req.user?._id);
  if (!isAdmin && !isSelf) {
    return apiResponse.error(res, 403, 'You are not authorized to access this resource');
  }

  const user = await User.findById(req.params.id).select('username email avatar role createdAt');
  if (!user) {
    return apiResponse.error(res, 404, 'User not found');
  }

  return apiResponse.success(res, 200, 'User fetched successfully', user);
});

exports.updateUser = asyncHandler(async (req, res) => {
  const isAdmin = req.user?.role === 'admin';
  const isSelf = String(req.params.id) === String(req.user?._id);
  if (!isAdmin && !isSelf) {
    return apiResponse.error(res, 403, 'You are not authorized to update this user');
  }

  const user = await User.findById(req.params.id);
  if (!user) {
    return apiResponse.error(res, 404, 'User not found');
  }

  const allowedFields = ['username', 'email', 'avatar', 'role'];
  const updates = {};

  if (req.body.avatar !== undefined) {
    const avatarVal = String(req.body.avatar)
    if (avatarVal.length > 2048) {
      return apiResponse.error(res, 400, 'Invalid avatar URL')
    }
  }

  allowedFields.forEach((field) => {
    if (req.body[field] !== undefined) {
      updates[field] = req.body[field];
    }
  });

  if (updates.email) {
    const existing = await User.findOne({ email: updates.email, _id: { $ne: req.params.id } });
    if (existing) {
      return apiResponse.error(res, 400, 'Email is already in use');
    }
  }

  if (updates.username) {
    const existing = await User.findOne({ username: updates.username, _id: { $ne: req.params.id } });
    if (existing) {
      return apiResponse.error(res, 400, 'Username is already taken');
    }
  }

  const updatedUser = await User.findByIdAndUpdate(req.params.id, updates, {
    new: true,
    runValidators: true
  }).select('-password');

  return apiResponse.success(res, 200, 'User updated successfully', updatedUser);
});

exports.deleteUser = asyncHandler(async (req, res) => {
  const isAdmin = req.user?.role === 'admin';
  const isSelf = String(req.params.id) === String(req.user?._id);
  if (!isAdmin && !isSelf) {
    return apiResponse.error(res, 403, 'You are not authorized to delete this user');
  }

  const user = await User.findById(req.params.id);
  if (!user) {
    return apiResponse.error(res, 404, 'User not found');
  }

  await User.findByIdAndDelete(req.params.id);

  return apiResponse.success(res, 200, 'User deleted successfully');
});
