import { Router } from 'express';
import { createDocument, deleteDocument, duplicateDocument, getDocument, listDocuments, updateDocument } from '../controllers/documentController.js';
import { protect } from '../middleware/authMiddleware.js';
import { validateObjectIdParam } from '../middleware/objectIdMiddleware.js';

const router = Router();

router.use(protect);
router.get('/', listDocuments);
router.post('/', createDocument);
router.get('/:id', validateObjectIdParam('id'), getDocument);
router.post('/:id/duplicate', validateObjectIdParam('id'), duplicateDocument);
router.put('/:id', validateObjectIdParam('id'), updateDocument);
router.delete('/:id', validateObjectIdParam('id'), deleteDocument);

export default router;
