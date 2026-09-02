import 'dotenv/config';
import { createServer } from 'http';
import app from './app.js';
import connectDB from './config/db.js';
import { setupCollaborationServer } from './services/collaborationService.js';
import { logInfo, logError } from './utils/logger.js';

const port = process.env.PORT || 5000;
let httpServer;

const start = async () => {
  try {
    await connectDB();
    httpServer = createServer(app);
    setupCollaborationServer(httpServer);
    httpServer.listen(port, () => {
      logInfo(`DocuEase API listening on port ${port}`);
    });
  } catch (error) {
    logError(error);
    process.exit(1);
  }
};

const shutdown = (signal) => {
  logInfo(`Received ${signal}. Shutting down gracefully...`);
  if (!httpServer) {
    process.exit(0);
    return;
  }

  httpServer.close((error) => {
    if (error) {
      logError(error);
      process.exit(1);
      return;
    }
    process.exit(0);
  });
};

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));

start();
