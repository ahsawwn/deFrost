import { NextResponse } from 'next/server';
import { adminSignOut } from '@/lib/auth-admin';

export async function POST() {
  try {
    await adminSignOut({ redirect: false });
    return NextResponse.json({ ok: true });
  } catch (error: any) {
    console.error('Admin signout error:', error);
    return NextResponse.json(
      { error: error.message || 'Sign out failed' },
      { status: 500 }
    );
  }
}

