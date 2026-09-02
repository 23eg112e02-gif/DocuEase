import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { corsOptions } from './config/cors.js';
import authRoutes from './routes/authRoutes.js';
import documentRoutes from './routes/documentRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import exportRoutes from './routes/exportRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import { apiLimiter } from './middleware/rateLimiter.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadDir = path.join(__dirname, process.env.UPLOAD_DIR || 'uploads');
const clientDistDir = path.join(__dirname, '..', 'client', 'dist');
const clientIndexFile = path.join(clientDistDir, 'index.html');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}
const trustProxyHops = Number(process.env.TRUST_PROXY_HOPS || 0);

if (trustProxyHops > 0) {
  app.set('trust proxy', trustProxyHops);
}

app.use(helmet());
app.use(cors(corsOptions));
app.use(compression());
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
app.use('/uploads', express.static(uploadDir));
app.use('/api', apiLimiter);

app.get('/api/health', (_req, res) => {
  res.json({ success: true, message: 'DocuEase API is healthy' });
});

app.get('/api/ready', (_req, res) => {
  res.json({
    success: true,
    message: 'DocuEase API is ready',
    uptimeSeconds: process.uptime()
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/uploads', uploadRoutes);
app.use('/api/export', exportRoutes);
app.use('/api/dashboard', dashboardRoutes);

if (fs.existsSync(clientDistDir)) {
  app.use(express.static(clientDistDir));
}

app.use((req, res, next) => {
  if (req.method !== 'GET' || req.path.startsWith('/api')) {
    return next();
  }

  if (fs.existsSync(clientIndexFile)) {
    return res.sendFile(clientIndexFile);
  }

  const clientUrl = (process.env.CLIENT_URL || 'http://localhost:5173').replace(/\/$/, '');
  return res.redirect(302, `${clientUrl}${req.originalUrl}`);
});

app.use(notFound);
app.use(errorHandler);

export default app;
