import { Router } from 'express';
import { deleteUpload, handleUpload, listUploads } from '../controllers/uploadController.js';
import { protect } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/uploadMiddleware.js';
import { validateObjectIdParam } from '../middleware/objectIdMiddleware.js';

const router = Router();

router.use(protect);
router.get('/', listUploads);
router.post('/', upload.single('file'), handleUpload);
router.delete('/:id', validateObjectIdParam('id'), deleteUpload);

export default router;
