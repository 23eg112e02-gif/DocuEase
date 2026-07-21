import User from '../models/User.js';
import asyncHandler from '../utils/asyncHandler.js';
import ApiResponse from '../utils/ApiResponse.js';
import { registerSchema, loginSchema } from '../utils/validators.js';
import { comparePassword, hashPassword } from '../services/authService.js';
import { clearAuthCookies, issueTokenPair, setAuthCookies } from '../services/tokenService.js';

const serializeUser = (user) => ({
  id: user._id,
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

  res.status(201).json(new ApiResponse(201, { user: serializeUser(user) }, 'Account created'));
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
  res.json(new ApiResponse(200, { user: serializeUser(user) }, 'Logged in'));
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
