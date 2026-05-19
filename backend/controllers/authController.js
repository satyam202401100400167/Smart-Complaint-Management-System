import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';
import asyncHandler from '../utils/asyncHandler.js';
import AppError from '../utils/AppError.js';

export const signup = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  const existing = await User.findOne({ email });
  if (existing) {
    throw new AppError('Email already registered.', 400);
  }

  const userRole = role === 'admin' && process.env.ALLOW_ADMIN_SIGNUP === 'true' ? 'admin' : 'user';

  const user = await User.create({
    name,
    email,
    password,
    role: userRole,
  });

  const token = generateToken(user._id);

  res.status(201).json({
    success: true,
    message: 'Account created successfully',
    token,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
    },
  });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.comparePassword(password))) {
    throw new AppError('Invalid email or password.', 401);
  }

  const token = generateToken(user._id);

  res.json({
    success: true,
    message: 'Login successful',
    token,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
    },
  });
});

export const getMe = asyncHandler(async (req, res) => {
  res.json({
    success: true,
    user: req.user,
  });
});
