import mongoose from 'mongoose';
import { logInfo, logError } from '../utils/logger.js';

const connectDB = async () => {
  if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI is required');
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI);
    logInfo('MongoDB connected');
  } catch (error) {
    logError(error);
    throw error;
  }
};

export default connectDB;
