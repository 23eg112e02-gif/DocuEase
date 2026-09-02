import jwt from 'jsonwebtoken';

const resolveSameSite = () => {
  const configured = (process.env.COOKIE_SAME_SITE || '').toLowerCase();
  if (configured === 'none' || configured === 'strict' || configured === 'lax') {
    return configured;
  }
  // Cross-origin (Vercel frontend + Render API) requires SameSite=None in production
  return process.env.NODE_ENV === 'production' ? 'none' : 'lax';
};

const isCookieSecure = () => {
  if (process.env.COOKIE_SECURE === 'true') return true;
  if (process.env.COOKIE_SECURE === 'false') return false;
  // SameSite=None requires Secure=true
  return process.env.NODE_ENV === 'production';
};

const getCookieOptions = () => {
  const sameSite = resolveSameSite();
  let secure = isCookieSecure();

  // Browser requirement: SameSite=None must be Secure
  if (sameSite === 'none') {
    secure = true;
  }

  return {
    httpOnly: true,
    secure,
    sameSite,
    path: '/',
    domain: process.env.COOKIE_DOMAIN || undefined
  };
};

const signToken = (payload, secret, expiresIn) => {
  if (!secret) {
    throw new Error('JWT secret is not configured');
  }
  return jwt.sign(payload, secret, { expiresIn });
};

export const issueTokenPair = (user) => {
  const payload = {
    id: user._id.toString(),
    email: user.email,
    name: user.name
  };

  return {
    accessToken: signToken(payload, process.env.JWT_ACCESS_SECRET, process.env.ACCESS_TOKEN_EXPIRES_IN || '15m'),
    refreshToken: signToken(payload, process.env.JWT_REFRESH_SECRET, process.env.REFRESH_TOKEN_EXPIRES_IN || '7d')
  };
};

export const verifyAccessToken = (token) => jwt.verify(token, process.env.JWT_ACCESS_SECRET);
export const verifyRefreshToken = (token) => jwt.verify(token, process.env.JWT_REFRESH_SECRET);

export const setAuthCookies = (res, accessToken, refreshToken) => {
  const common = getCookieOptions();
  res.cookie('accessToken', accessToken, {
    ...common,
    maxAge: 15 * 60 * 1000
  });
  res.cookie('refreshToken', refreshToken, {
    ...common,
    maxAge: 7 * 24 * 60 * 60 * 1000
  });
};

export const clearAuthCookies = (res) => {
  const common = getCookieOptions();
  // clearCookie must use the same path/domain/sameSite/secure as set
  res.clearCookie('accessToken', common);
  res.clearCookie('refreshToken', common);
};
