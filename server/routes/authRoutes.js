import { Router } from 'express';
import { changePassword, deleteAccount, exportMyData, forgotPassword, login, logout, logoutAll, me, refresh, register, resetPassword, updateProfile } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';
import { validate } from '../middleware/validateMiddleware.js';
import { loginSchema, registerSchema, profileSchema, passwordSchema } from '../utils/validators.js';
import { authLimiter, passwordResetLimiter, sensitiveLimiter } from '../middleware/rateLimiter.js';

const router = Router();

router.post('/register', authLimiter, validate(registerSchema), register);
router.post('/login', authLimiter, validate(loginSchema), login);
router.post('/refresh', refresh);
router.post('/forgot-password', passwordResetLimiter, forgotPassword);
router.post('/reset-password', passwordResetLimiter, resetPassword);
router.post('/logout', protect, sensitiveLimiter, logout);
router.get('/me', protect, me);
router.put('/profile', protect, validate(profileSchema), updateProfile);
router.put('/password', protect, validate(passwordSchema), changePassword);
router.post('/logout-all', protect, sensitiveLimiter, logoutAll);
router.get('/export-data', protect, sensitiveLimiter, exportMyData);
router.delete('/delete-account', protect, sensitiveLimiter, deleteAccount);

export default router;
