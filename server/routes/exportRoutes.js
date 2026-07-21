import { Router } from 'express';
import { exportDocx, exportPdf } from '../controllers/exportController.js';
import { optionalAuth } from '../middleware/authMiddleware.js';

const router = Router();

router.use(optionalAuth);
router.post('/pdf', exportPdf);
router.post('/docx', exportDocx);

export default router;
