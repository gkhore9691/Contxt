import { z } from 'zod'

export const packFormSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(80),
  description: z.string().max(300).optional().default(''),
  isPublic: z.boolean().default(false),
  frameworkTag: z.string().max(50).optional().default(''),
  languageTag: z.string().max(50).optional().default(''),
  uiLib: z.string().max(50).optional().default(''),
  db: z.string().max(50).optional().default(''),
  hosting: z.string().max(50).optional().default(''),
  architecture: z.string().max(3000).optional().default(''),
  conventions: z.string().max(3000).optional().default(''),
  aiRules: z.string().max(3000).optional().default(''),
  gotchas: z.string().max(2000).optional().default(''),
})

export type PackFormValues = z.infer<typeof packFormSchema>

export const registerSchema = z.object({
  email: z.string().email('Invalid email'),
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(30)
    .regex(/^[a-zA-Z0-9_-]+$/, 'Username can only contain letters, numbers, hyphens and underscores'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

export const loginSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(1, 'Password is required'),
})
