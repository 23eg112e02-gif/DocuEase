const parseAllowedOrigins = () => {
  const envOrigins = (process.env.CLIENT_URL || '')
    .split(',')
    .map((origin) => origin.trim().replace(/\/$/, ''))
    .filter(Boolean);

  const defaultOrigins = [
    'http://localhost:5173',
    'http://localhost:3000',
    'http://localhost:4173',
    'http://127.0.0.1:5173'
  ];

  return Array.from(new Set([...envOrigins, ...defaultOrigins]));
};

const allowedOrigins = parseAllowedOrigins();

export const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) {
      return callback(null, true);
    }

    const cleanOrigin = origin.replace(/\/$/, '');

    if (allowedOrigins.includes(cleanOrigin)) {
      return callback(null, true);
    }

    if (/^https:\/\/[a-z0-9-_.]+\.vercel\.app$/i.test(cleanOrigin)) {
      return callback(null, true);
    }

    if (/^http:\/\/localhost:\d+$/i.test(cleanOrigin) || /^http:\/\/127\.0\.0\.1:\d+$/i.test(cleanOrigin)) {
      return callback(null, true);
    }

    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
  exposedHeaders: ['Content-Disposition', 'Content-Type']
};
