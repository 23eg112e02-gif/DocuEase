import User from '../models/User.js';
import { issueTokenPair, setAuthCookies, verifyAccessToken, verifyRefreshToken } from '../services/tokenService.js';

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
  return User.findById(payload.id).select('-password');
};

export const protect = async (req, res, next) => {
  try {
    const accessToken = req.cookies?.accessToken || extractBearerToken(req);
    if (accessToken) {
      const payload = verifyAccessToken(accessToken);
      const user = await loadUserFromPayload(payload);
      if (user) {
        req.user = user;
        return next();
      }
    }

    const refreshToken = req.cookies?.refreshToken;
    if (refreshToken) {
      const payload = verifyRefreshToken(refreshToken);
      const user = await loadUserFromPayload(payload);
      if (user) {
        const tokens = issueTokenPair(user);
        setAuthCookies(res, tokens.accessToken, tokens.refreshToken);
        req.user = user;
        return next();
      }
    }

    return res.status(401).json({ success: false, message: 'Not authorized' });
  } catch (_error) {
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
