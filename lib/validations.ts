import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['customer', 'admin']).optional(),
});

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  phone: z.string().optional(),
});

export const productSchema = z.object({
  sku: z.string().min(1, 'SKU is required'),
  name: z.string().min(1, 'Product name is required'),
  slug: z.string().min(1, 'Slug is required'),
  description: z.string().optional(),
  price: z.string().or(z.number()),
  comparePrice: z.string().or(z.number()).optional(),
  costPrice: z.string().or(z.number()).optional(),
  images: z.array(z.string()).default([]),
  category: z.string().optional(),
  tags: z.array(z.string()).default([]),
  sizes: z.array(z.string()).default(['S', 'M', 'L', 'XL']),
  colors: z.array(z.string()).default([]),
  stockQuantity: z.number().int().default(0),
  lowStockThreshold: z.number().int().default(10),
  isActive: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type ProductInput = z.infer<typeof productSchema>;

