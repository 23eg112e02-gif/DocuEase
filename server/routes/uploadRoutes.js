import { Router } from 'express';
import { handleUpload, listUploads } from '../controllers/uploadController.js';
import { protect } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/uploadMiddleware.js';

const router = Router();

router.use(protect);
router.get('/', listUploads);
router.post('/', upload.single('file'), handleUpload);

export default router;
