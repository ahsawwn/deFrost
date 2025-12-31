import { NextResponse, NextRequest } from 'next/server';
import { adminAuth } from '@/lib/auth-admin';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';

// API route to get admin session for client-side use
export async function GET(request: NextRequest) {
  try {
    // Try NextAuth's session first
    const session = await adminAuth();
    
    if (session) {
      return NextResponse.json({ session });
    }

    // If NextAuth doesn't recognize the session, try to verify the JWT manually
    const cookieStore = await cookies();
    const isProduction = process.env.NODE_ENV === 'production';
    const cookieName = isProduction 
      ? '__Secure-admin-auth.session-token' 
      : 'admin-auth.session-token';
    
    const adminSessionCookie = cookieStore.get(cookieName);
    
    if (adminSessionCookie) {
      try {
        const secret = new TextEncoder().encode(process.env.NEXTAUTH_SECRET!);
        const { payload } = await jwtVerify(adminSessionCookie.value, secret);
        
        // Create a session-like object from the verified JWT
        if (payload.sub && payload.email) {
          const manualSession = {
            user: {
              id: payload.sub as string,
              email: payload.email as string,
              name: payload.name as string | null,
              image: payload.picture as string | null,
              role: payload.role as string,
            },
            expires: new Date((payload.exp as number) * 1000).toISOString(),
          };
          
          return NextResponse.json({ session: manualSession });
        }
      } catch (verifyError) {
        // JWT verification failed, return null session
        console.error('JWT verification failed:', verifyError);
      }
    }
    
    return NextResponse.json({ session: null }, { status: 200 });
  } catch (error: any) {
    console.error('Error fetching admin session:', error);
    return NextResponse.json(
      { error: 'Failed to fetch session', session: null },
      { status: 500 }
    );
  }
}

