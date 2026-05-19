import User from '../models/User.js';
import asyncHandler from '../utils/asyncHandler.js';
import AppError from '../utils/AppError.js';

export const getAllUsers = asyncHandler(async (req, res) => {
  const page = Math.max(1, parseInt(req.query.page, 10) || 1);
  const limit = Math.min(50, Math.max(1, parseInt(req.query.limit, 10) || 10));
  const skip = (page - 1) * limit;

  const filter = {};
  if (req.query.role) filter.role = req.query.role;
  if (req.query.search) {
    filter.$or = [
      { name: { $regex: req.query.search, $options: 'i' } },
      { email: { $regex: req.query.search, $options: 'i' } },
    ];
  }

  const [users, total] = await Promise.all([
    User.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    User.countDocuments(filter),
  ]);

  res.json({
    success: true,
    count: users.length,
    total,
    page,
    pages: Math.ceil(total / limit),
    data: users,
  });
});

export const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    throw new AppError('User not found.', 404);
  }
  res.json({ success: true, data: user });
});

export const updateUserRole = asyncHandler(async (req, res) => {
  const { role } = req.body;

  if (!['user', 'admin'].includes(role)) {
    throw new AppError('Invalid role. Must be user or admin.', 400);
  }

  const user = await User.findById(req.params.id);
  if (!user) {
    throw new AppError('User not found.', 404);
  }

  if (user._id.toString() === req.user._id.toString()) {
    throw new AppError('You cannot change your own role.', 400);
  }

  user.role = role;
  await user.save();

  res.json({
    success: true,
    message: 'User role updated',
    data: user,
  });
});

export const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    throw new AppError('User not found.', 404);
  }

  if (user._id.toString() === req.user._id.toString()) {
    throw new AppError('You cannot delete your own account.', 400);
  }

  await user.deleteOne();

  res.json({
    success: true,
    message: 'User deleted successfully',
  });
});
