import User from '../models/User.js';
import Document from '../models/Document.js';
import Upload from '../models/Upload.js';
import asyncHandler from '../utils/asyncHandler.js';
import ApiResponse from '../utils/ApiResponse.js';
import { registerSchema, loginSchema, profileSchema, passwordSchema, forgotPasswordSchema, resetPasswordSchema, deleteAccountSchema } from '../utils/validators.js';
import { comparePassword, hashPassword } from '../services/authService.js';
import { clearAuthCookies, issueTokenPair, revokeAllRefreshTokens, revokeRefreshToken, rotateRefreshToken, setAuthCookies } from '../services/tokenService.js';
import { AUDIT_ACTIONS, recordAudit } from '../services/auditService.js';
import { sendMail } from '../services/mailService.js';
import crypto from 'crypto';

const serializeUser = (user) => ({
  id: user._id.toString(),
  name: user.name,
  email: user.email,
  role: user.role,
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
  const tokens = await issueTokenPair(user, { ip: req.ip, userAgent: req.get('user-agent') });
  setAuthCookies(res, tokens.accessToken, tokens.refreshToken);
  await recordAudit({ req, userId: user._id, action: AUDIT_ACTIONS.REGISTER, success: true });

  res.status(201).json(new ApiResponse(201, { user: serializeUser(user), accessToken: tokens.accessToken }, 'Account created'));
});

export const login = asyncHandler(async (req, res) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ success: false, message: 'Validation failed', errors: parsed.error.flatten() });
  }

  const { email, password } = parsed.data;
  const user = await User.findOne({ email, deletedAt: null }).select('+password +failedLoginAttempts +lockUntil');
  if (!user) {
    await recordAudit({ req, action: AUDIT_ACTIONS.LOGIN_FAIL, success: false, metadata: { email } });
    return res.status(401).json({ success: false, message: 'Invalid credentials' });
  }

  if (user.isLocked) {
    await recordAudit({ req, userId: user._id, action: AUDIT_ACTIONS.LOGIN_LOCK, success: false });
    return res.status(423).json({ success: false, message: 'Account temporarily locked. Try again later.' });
  }

  const isMatch = await comparePassword(password, user.password);
  if (!isMatch) {
    await user.incLoginAttempts();
    await recordAudit({ req, userId: user._id, action: user.isLocked ? AUDIT_ACTIONS.LOGIN_LOCK : AUDIT_ACTIONS.LOGIN_FAIL, success: false });
    return res.status(401).json({ success: false, message: 'Invalid credentials' });
  }

  await user.resetLoginAttempts();
  const tokens = await issueTokenPair(user, { ip: req.ip, userAgent: req.get('user-agent') });
  setAuthCookies(res, tokens.accessToken, tokens.refreshToken);
  await recordAudit({ req, userId: user._id, action: AUDIT_ACTIONS.LOGIN_SUCCESS, success: true });
  res.json(new ApiResponse(200, { user: serializeUser(user), accessToken: tokens.accessToken }, 'Logged in'));
});

export const refresh = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies?.refreshToken || req.body?.refreshToken;
  if (!refreshToken) {
    return res.status(401).json({ success: false, message: 'No refresh token provided' });
  }

  try {
    const { user, tokens } = await rotateRefreshToken(refreshToken, { ip: req.ip, userAgent: req.get('user-agent') });
    setAuthCookies(res, tokens.accessToken, tokens.refreshToken);
    await recordAudit({ req, userId: user._id, action: AUDIT_ACTIONS.REFRESH, success: true });
    res.json(new ApiResponse(200, { user: serializeUser(user), accessToken: tokens.accessToken }, 'Token refreshed'));
  } catch (_error) {
    clearAuthCookies(res);
    return res.status(401).json({ success: false, message: 'Invalid or expired refresh token' });
  }
});

export const logout = asyncHandler(async (req, res) => {
  const refreshToken = req.refreshToken || req.cookies?.refreshToken;
  if (refreshToken) await revokeRefreshToken(req.user, refreshToken);
  await recordAudit({ req, userId: req.user._id, action: AUDIT_ACTIONS.LOGOUT, success: true });
  clearAuthCookies(res);
  res.json(new ApiResponse(200, null, 'Logged out'));
});

export const logoutAll = asyncHandler(async (req, res) => {
  await revokeAllRefreshTokens(req.user);
  await recordAudit({ req, userId: req.user._id, action: AUDIT_ACTIONS.LOGOUT_ALL, success: true });
  clearAuthCookies(res);
  res.json(new ApiResponse(200, null, 'Logged out of all sessions'));
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
  await recordAudit({ req, userId: user._id, action: AUDIT_ACTIONS.PROFILE_UPDATE, oldValues: { name: req.user.name, email: req.user.email }, newValues: updates, success: true });
  res.json(new ApiResponse(200, { user: serializeUser(user) }, 'Profile updated'));
});

export const changePassword = asyncHandler(async (req, res) => {
  const parsed = passwordSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ success: false, message: 'Validation failed', errors: parsed.error.flatten() });
  }

  const user = await User.findById(req.user._id).select('+password');
  const isMatch = await comparePassword(parsed.data.currentPassword, user.password);
  if (!isMatch) {
    return res.status(400).json({ success: false, message: 'Current password is incorrect' });
  }

  user.password = await hashPassword(parsed.data.newPassword);
  await user.save();
  await revokeAllRefreshTokens(user);
  await recordAudit({ req, userId: user._id, action: AUDIT_ACTIONS.PASSWORD_CHANGE, success: true });
  clearAuthCookies(res);

  res.json(new ApiResponse(200, null, 'Password updated successfully'));
});

export const forgotPassword = asyncHandler(async (req, res) => {
  const parsed = forgotPasswordSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ success: false, message: 'Validation failed', errors: parsed.error.flatten() });

  const user = await User.findOne({ email: parsed.data.email, deletedAt: null });
  if (user) {
    const token = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });
    const resetUrl = `${process.env.CLIENT_URL?.split(',')[0] || 'http://localhost:5173'}/reset-password?token=${token}`;
    try {
      await sendMail({ to: user.email, subject: 'Reset your DocuEase password', text: `Reset your password: ${resetUrl}` });
    } catch (_error) {
    }
  }
  res.json(new ApiResponse(200, null, 'If an account exists, password reset instructions have been sent'));
});

export const resetPassword = asyncHandler(async (req, res) => {
  const parsed = resetPasswordSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ success: false, message: 'Validation failed', errors: parsed.error.flatten() });

  const tokenHash = crypto.createHash('sha256').update(parsed.data.token).digest('hex');
  const user = await User.findOne({ passwordResetTokenHash: tokenHash, passwordResetExpires: { $gt: new Date() }, deletedAt: null }).select('+password');
  if (!user) return res.status(400).json({ success: false, message: 'Invalid or expired reset token' });

  user.password = await hashPassword(parsed.data.password);
  user.clearPasswordReset();
  await user.save();
  await revokeAllRefreshTokens(user);
  await recordAudit({ req, userId: user._id, action: AUDIT_ACTIONS.PASSWORD_RESET, success: true });
  clearAuthCookies(res);
  res.json(new ApiResponse(200, null, 'Password reset successfully'));
});

export const exportMyData = asyncHandler(async (req, res) => {
  const [user, documents, uploads] = await Promise.all([
    User.findById(req.user._id).select('-password -refreshTokens -passwordResetTokenHash -passwordResetExpires'),
    Document.find({ owner: req.user._id }),
    Upload.find({ owner: req.user._id })
  ]);
  await recordAudit({ req, userId: req.user._id, action: AUDIT_ACTIONS.DATA_EXPORT, success: true });
  res.json(new ApiResponse(200, { user, documents, uploads }, 'Personal data exported'));
});

export const deleteAccount = asyncHandler(async (req, res) => {
  const parsed = deleteAccountSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ success: false, message: 'Validation failed', errors: parsed.error.flatten() });

  const user = await User.findById(req.user._id).select('+password');
  if (!user || !(await comparePassword(parsed.data.password, user.password))) {
    return res.status(401).json({ success: false, message: 'Password is incorrect' });
  }
  await Promise.all([Document.deleteMany({ owner: user._id }), Upload.deleteMany({ owner: user._id })]);
  user.deletedAt = new Date();
  user.email = `deleted-${user._id}@deleted.local`;
  user.name = 'Deleted User';
  user.password = await hashPassword(crypto.randomBytes(32).toString('hex'));
  user.refreshTokens = [];
  user.clearPasswordReset();
  await user.save({ validateBeforeSave: false });
  await recordAudit({ req, userId: user._id, action: AUDIT_ACTIONS.ACCOUNT_DELETE, success: true });
  clearAuthCookies(res);
  res.json(new ApiResponse(200, null, 'Account deleted'));
});
