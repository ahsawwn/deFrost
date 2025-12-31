// Admin-specific auth handlers - uses admin_users table
import { adminHandlers } from '@/lib/auth-admin';

export const { GET, POST } = adminHandlers;

