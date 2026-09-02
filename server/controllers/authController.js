import User from '../models/User.js';
import asyncHandler from '../utils/asyncHandler.js';
import ApiResponse from '../utils/ApiResponse.js';
import { registerSchema, loginSchema, profileSchema, passwordSchema } from '../utils/validators.js';
import { comparePassword, hashPassword } from '../services/authService.js';
import { clearAuthCookies, issueTokenPair, setAuthCookies, verifyRefreshToken } from '../services/tokenService.js';

const serializeUser = (user) => ({
  id: user._id.toString(),
  name: user.name,
  email: user.email,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt
});

export const register = asyncHandler(async (req, res) => {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ success: false, message: 'Validation failed', errors: parsed.error.flatten() });
  }

  const { name, email, password } = parsed.data;
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(409).json({ success: false, message: 'Email is already in use' });
  }

  const user = await User.create({ name, email, password: await hashPassword(password) });
  const tokens = issueTokenPair(user);
  setAuthCookies(res, tokens.accessToken, tokens.refreshToken);

  res.status(201).json(new ApiResponse(201, { user: serializeUser(user), accessToken: tokens.accessToken }, 'Account created'));
});

export const login = asyncHandler(async (req, res) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ success: false, message: 'Validation failed', errors: parsed.error.flatten() });
  }

  const { email, password } = parsed.data;
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(401).json({ success: false, message: 'Invalid credentials' });
  }

  const isMatch = await comparePassword(password, user.password);
  if (!isMatch) {
    return res.status(401).json({ success: false, message: 'Invalid credentials' });
  }

  const tokens = issueTokenPair(user);
  setAuthCookies(res, tokens.accessToken, tokens.refreshToken);
  res.json(new ApiResponse(200, { user: serializeUser(user), accessToken: tokens.accessToken }, 'Logged in'));
});

export const refresh = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies?.refreshToken || req.body?.refreshToken;
  if (!refreshToken) {
    return res.status(401).json({ success: false, message: 'No refresh token provided' });
  }

  try {
    const payload = verifyRefreshToken(refreshToken);
    const user = await User.findById(payload.id);
    if (!user) {
      return res.status(401).json({ success: false, message: 'User not found' });
    }

    const tokens = issueTokenPair(user);
    setAuthCookies(res, tokens.accessToken, tokens.refreshToken);
    res.json(new ApiResponse(200, { user: serializeUser(user), accessToken: tokens.accessToken }, 'Token refreshed'));
  } catch (_error) {
    clearAuthCookies(res);
    return res.status(401).json({ success: false, message: 'Invalid or expired refresh token' });
  }
});

export const logout = asyncHandler(async (_req, res) => {
  clearAuthCookies(res);
  res.json(new ApiResponse(200, null, 'Logged out'));
});

export const me = asyncHandler(async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ success: false, message: 'Not authorized' });
  }

  res.json(new ApiResponse(200, { user: serializeUser(req.user) }, 'Current user'));
});

export const updateProfile = asyncHandler(async (req, res) => {
  const parsed = profileSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ success: false, message: 'Validation failed', errors: parsed.error.flatten() });
  }

  const updates = {};
  if (parsed.data.name) updates.name = parsed.data.name;
  if (parsed.data.email && parsed.data.email !== req.user.email) {
    const existing = await User.findOne({ email: parsed.data.email });
    if (existing) {
      return res.status(409).json({ success: false, message: 'Email already taken' });
    }
    updates.email = parsed.data.email;
  }

  const user = await User.findByIdAndUpdate(req.user._id, { $set: updates }, { new: true });
  res.json(new ApiResponse(200, { user: serializeUser(user) }, 'Profile updated'));
});

export const changePassword = asyncHandler(async (req, res) => {
  const parsed = passwordSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ success: false, message: 'Validation failed', errors: parsed.error.flatten() });
  }

  const user = await User.findById(req.user._id);
  const isMatch = await comparePassword(parsed.data.currentPassword, user.password);
  if (!isMatch) {
    return res.status(400).json({ success: false, message: 'Current password is incorrect' });
  }

  user.password = await hashPassword(parsed.data.newPassword);
  await user.save();

  res.json(new ApiResponse(200, null, 'Password updated successfully'));
});
