import User from '../models/User.js';
import { clearAuthCookies, rotateRefreshToken, setAuthCookies, verifyAccessToken } from '../services/tokenService.js';

const extractBearerToken = (req) => {
  const authorization = req.headers.authorization;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    return null;
  }
  return authorization.slice(7);
};

const loadUserFromPayload = async (payload) => {
  if (!payload?.id) {
    return null;
  }
  return User.findOne({ _id: payload.id, deletedAt: null }).select('-password');
};

export const protect = async (req, res, next) => {
  try {
    const accessToken = req.cookies?.accessToken || extractBearerToken(req);
    if (accessToken) {
      const payload = verifyAccessToken(accessToken);
      const user = await loadUserFromPayload(payload);
      if (user) {
        req.user = user;
        req.refreshToken = req.cookies?.refreshToken;
        return next();
      }
    }

    const refreshToken = req.cookies?.refreshToken;
    if (refreshToken) {
      const { user, tokens } = await rotateRefreshToken(refreshToken, {
        ip: req.ip,
        userAgent: req.get('user-agent')
      });
      setAuthCookies(res, tokens.accessToken, tokens.refreshToken);
      req.user = user;
      req.refreshToken = tokens.refreshToken;
      return next();
    }

    return res.status(401).json({ success: false, message: 'Not authorized' });
  } catch (_error) {
    clearAuthCookies(res);
    return res.status(401).json({ success: false, message: 'Not authorized' });
  }
};

export const optionalAuth = async (req, _res, next) => {
  try {
    const accessToken = req.cookies?.accessToken || extractBearerToken(req);
    if (accessToken) {
      const payload = verifyAccessToken(accessToken);
      const user = await loadUserFromPayload(payload);
      if (user) {
        req.user = user;
      }
    }
  } finally {
    next();
  }
};

export const requireAdmin = (req, res, next) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Admin access required' });
  }
  return next();
};
