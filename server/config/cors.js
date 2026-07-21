const clientOrigin = process.env.CLIENT_URL || 'http://localhost:5173';

export const corsOptions = {
  origin: clientOrigin,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS']
};
