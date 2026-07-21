import path from 'path';
import multer from 'multer';
import { ensureDirectory } from '../utils/helpers.js';

const uploadDir = path.join(process.cwd(), process.env.UPLOAD_DIR || 'uploads');
ensureDirectory(uploadDir);

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const safeName = file.originalname.replace(/[^a-z0-9.]+/gi, '-').toLowerCase();
    cb(null, `${Date.now()}-${safeName}`);
  }
});

const allowedExtensions = new Set(['.pdf', '.docx', '.txt']);
const allowedMimeTypes = new Set([
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'text/plain'
]);

const fileFilter = (_req, file, cb) => {
  const extension = path.extname(file.originalname).toLowerCase();
  if (allowedExtensions.has(extension) || allowedMimeTypes.has(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only PDF, DOCX, and TXT files are allowed'));
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: Number(process.env.MAX_UPLOAD_SIZE || 10 * 1024 * 1024)
  }
});
