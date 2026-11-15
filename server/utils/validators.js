import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().trim().min(2, 'Name is required'),
  email: z.string().trim().email('Valid email is required'),
  password: z.string().min(8).regex(/[A-Z]/, 'Password must include an uppercase letter').regex(/[a-z]/, 'Password must include a lowercase letter').regex(/\d/, 'Password must include a digit')
});

export const loginSchema = z.object({
  email: z.string().trim().email('Valid email is required'),
  password: z.string().min(1, 'Password is required')
});

export const documentSchema = z.object({
  title: z.string().trim().min(1).max(200),
  content: z.string().optional().default(''),
  status: z.enum(['draft', 'published', 'archived']).optional().default('draft'),
  source: z.enum(['manual', 'upload']).optional().default('manual')
});

export const profileSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters').optional(),
  email: z.string().trim().email('Valid email is required').optional()
});

export const passwordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(8).regex(/[A-Z]/).regex(/[a-z]/).regex(/\d/)
});

export const forgotPasswordSchema = z.object({ email: z.string().trim().email('Valid email is required') });
export const resetPasswordSchema = z.object({
  token: z.string().min(1),
  password: z.string().min(8).regex(/[A-Z]/).regex(/[a-z]/).regex(/\d/)
});
export const deleteAccountSchema = z.object({ password: z.string().min(1, 'Password is required') });

