import { NextRequest, NextResponse } from 'next/server';
import { adminHandlers, adminAuth } from '@/lib/auth-admin';
import { db } from '@/lib/db';
import { adminUsers } from '@/lib/db/admin-schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import { SignJWT } from 'jose';
import { cookies } from 'next/headers';

// Custom signin route that manually authenticates and creates session
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required', ok: false },
        { status: 400 }
      );
    }

    console.log('Attempting admin signin for:', email);

    // Query database for user
    const [user] = await db
      .select()
      .from(adminUsers)
      .where(eq(adminUsers.email, email))
      .limit(1);

    if (!user || !user.password) {
      return NextResponse.json(
        { error: 'Invalid email or password', ok: false },
        { status: 401 }
      );
    }

    // Check role
    const adminRoles = ['admin', 'manager', 'cashier'];
    if (!adminRoles.includes(user.role || '')) {
      return NextResponse.json(
        { error: 'Access denied. Admin credentials required.', ok: false },
        { status: 403 }
      );
    }

    // Verify password
    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid email or password', ok: false },
        { status: 401 }
      );
    }

    // Update last login
    await db
      .update(adminUsers)
      .set({ lastLogin: new Date(), emailVerified: user.emailVerified || new Date() })
      .where(eq(adminUsers.id, user.id));

    // Create JWT token using jose library (what NextAuth uses internally)
    // We'll verify it manually in the proxy since NextAuth isn't reading it correctly
    const secret = new TextEncoder().encode(process.env.NEXTAUTH_SECRET!);
    const now = Math.floor(Date.now() / 1000);
    const maxAge = 30 * 24 * 60 * 60; // 30 days in seconds

    const token = await new SignJWT({
      sub: user.id,
      email: user.email,
      name: user.name,
      picture: user.image || null,
      role: user.role,
      id: user.id,
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt(now)
      .setExpirationTime(now + maxAge)
      .sign(secret);

    // Set session cookie using Next.js cookies() helper
    const cookieStore = await cookies();
    const isProduction = process.env.NODE_ENV === 'production';
    const cookieName = isProduction 
      ? '__Secure-admin-auth.session-token' 
      : 'admin-auth.session-token';
    
    cookieStore.set(cookieName, token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax',
      path: '/',
      maxAge: 30 * 24 * 60 * 60, // 30 days
    });

    return NextResponse.json({ ok: true });
  } catch (error: any) {
    console.error('Admin signin error:', error);
    return NextResponse.json(
      { error: error.message || 'Authentication failed', ok: false },
      { status: 500 }
    );
  }
}

