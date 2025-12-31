import { NextRequest, NextResponse } from 'next/server';
import { adminAuth } from '@/lib/auth-admin';

/**
 * Proxy utility for admin API routes
 * Ensures only authenticated admin/manager/cashier users can access admin endpoints
 */
export async function adminProxy(
  request: NextRequest,
  handler: (req: NextRequest, session: any) => Promise<NextResponse>
) {
  try {
    const session = await adminAuth();

    // Check if user is authenticated
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized. Please login to continue.' },
        { status: 401 }
      );
    }

    // Check if user has admin role
    const adminRoles = ['admin', 'manager', 'cashier'];
    const userRole = session.user.role;

    if (!userRole || !adminRoles.includes(userRole)) {
      return NextResponse.json(
        { error: 'Access denied. Admin credentials required.' },
        { status: 403 }
      );
    }

    // Execute the handler with the authenticated session
    return await handler(request, session);
  } catch (error: any) {
    console.error('Proxy error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * Role-based access control helper
 */
export function hasRole(userRole: string | undefined, allowedRoles: string[]): boolean {
  if (!userRole) return false;
  return allowedRoles.includes(userRole);
}

/**
 * Check if user is admin (highest privilege)
 */
export function isAdmin(userRole: string | undefined): boolean {
  return userRole === 'admin';
}

/**
 * Check if user is manager or admin
 */
export function isManagerOrAdmin(userRole: string | undefined): boolean {
  return userRole === 'admin' || userRole === 'manager';
}

/**
 * Check if user can access admin panel
 */
export function canAccessAdmin(userRole: string | undefined): boolean {
  return hasRole(userRole, ['admin', 'manager', 'cashier']);
}

