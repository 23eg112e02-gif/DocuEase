import { Router } from 'express';
import { changePassword, login, logout, me, refresh, register, updateProfile } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';
import { validate } from '../middleware/validateMiddleware.js';
import { loginSchema, registerSchema, profileSchema, passwordSchema } from '../utils/validators.js';
import { authLimiter } from '../middleware/rateLimiter.js';

const router = Router();

router.post('/register', authLimiter, validate(registerSchema), register);
router.post('/login', authLimiter, validate(loginSchema), login);
router.post('/refresh', refresh);
router.post('/logout', logout);
router.get('/me', protect, me);
router.put('/profile', protect, validate(profileSchema), updateProfile);
router.put('/password', protect, validate(passwordSchema), changePassword);

export default router;
