import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { auth } from '@/lib/auth';
import { adminAuth } from '@/lib/auth-admin';

/**
 * Proxy to handle authentication and route protection
 * Separates admin routes from shop routes
 * 
 * Note: Full role checking happens in layout components
 * This proxy just ensures a session exists
 */
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Admin routes - protected (except login and auth endpoints)
  if (pathname.startsWith('/admin') && 
      !pathname.startsWith('/admin/login') && 
      !pathname.startsWith('/admin/auth')) {
    
    // Check for admin session using adminAuth function
    // In NextAuth v5, auth() automatically reads from request in middleware
    // Try to verify the JWT manually to see if it's valid
    const cookies = request.cookies.getAll();
    const adminSessionCookie = cookies.find(c => c.name === 'admin-auth.session-token' || c.name === '__Secure-admin-auth.session-token');
    
    let decodedToken = null;
    if (adminSessionCookie) {
      try {
        const { jwtVerify } = await import('jose');
        const secret = new TextEncoder().encode(process.env.NEXTAUTH_SECRET!);
        const { payload } = await jwtVerify(adminSessionCookie.value, secret);
        decodedToken = payload;
      } catch (verifyError) {
        // JWT verification failed, continue to check NextAuth session
      }
    }
    
    // NextAuth v5's auth() automatically reads from request context in middleware
    const session = await adminAuth();
    
    // If NextAuth doesn't recognize the session but we can verify the JWT manually,
    // allow access (the JWT is valid, NextAuth just isn't reading it correctly)
    // This is a workaround for NextAuth v5 cookie reading issues in middleware
    if (!session && decodedToken && decodedToken.sub && decodedToken.email) {
      // Allow access - JWT is valid, NextAuth just isn't recognizing it
      return NextResponse.next();
    }
    
    // If no session and no valid JWT, redirect to admin login
    // Role checking will happen in the admin layout
    if (!session) {
      const url = request.nextUrl.clone();
      url.pathname = '/admin/login';
      return NextResponse.redirect(url);
    }
  }

  // Shop user routes - separate from admin (profile, orders, etc.)
  if (pathname.startsWith('/profile') && !pathname.startsWith('/admin')) {
    // Check for user session using auth function
    const session = await auth();
    
    // If no session, redirect to shop login
    // Role checking will happen in the protected layout
    if (!session) {
      const url = request.nextUrl.clone();
      url.pathname = '/login';
      return NextResponse.redirect(url);
    }
    
    // Ensure only customer users can access user routes (not admin users)
    const adminRoles = ['admin', 'manager', 'cashier'];
    if (session.user?.role && adminRoles.includes(session.user.role)) {
      // Admin users should use admin panel, redirect them
      const url = request.nextUrl.clone();
      url.pathname = '/admin/dashboard';
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/profile/:path*',
  ],
};

