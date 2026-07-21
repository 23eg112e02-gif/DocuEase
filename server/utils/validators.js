import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().trim().min(2, 'Name is required'),
  email: z.string().trim().email('Valid email is required'),
  password: z.string().min(8, 'Password must be at least 8 characters')
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
