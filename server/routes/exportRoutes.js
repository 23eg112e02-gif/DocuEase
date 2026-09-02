import { Router } from 'express';
import { exportDocx, exportMd, exportPdf, exportTxt } from '../controllers/exportController.js';
import { optionalAuth } from '../middleware/authMiddleware.js';

const router = Router();

router.use(optionalAuth);
router.post('/pdf', exportPdf);
router.post('/docx', exportDocx);
router.post('/txt', exportTxt);
router.post('/md', exportMd);

export default router;
